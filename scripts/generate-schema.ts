import type { MihoyoSubdomain } from "#shared/constants/url";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { ofetch } from "ofetch";
import * as bh3Service from "#server/service/bh3";
import * as hk4eService from "#server/service/hk4e";
import * as hkrpgService from "#server/service/hkrpg";
import * as napService from "#server/service/nap";
import { getMihoYoBaseUrl } from "#shared/constants/url";

type BaseResponse = {
  retcode: number;
  message: string;
  data: unknown;
};

interface ServiceConfig {
  name: string;
  subdomain: MihoyoSubdomain;
  query: Record<string, string>;
}

const services: ServiceConfig[] = [
  {
    name: "bh3",
    subdomain: bh3Service.subdomain,
    query: bh3Service.query,
  },
  {
    name: "hk4e",
    subdomain: hk4eService.subdomain,
    query: hk4eService.query,
  },
  {
    name: "hkrpg",
    subdomain: hkrpgService.subdomain,
    query: hkrpgService.query,
  },
  {
    name: "nap",
    subdomain: napService.subdomain,
    query: napService.query,
  },
];

interface Endpoints {
  getAnnList: string;
  getAnnContent: string;
}

function schemaToCode(schema: unknown, indent: number = 0): string {
  const s = schema as Record<string, unknown>;
  const spaces = "  ".repeat(indent);

  if (!s || typeof s !== "object" || !("type" in s)) {
    return `${spaces}v.unknown()`;
  }

  switch (s.type) {
    case "string":
      return `${spaces}v.string()`;
    case "number":
      return `${spaces}v.number()`;
    case "boolean":
      return `${spaces}v.boolean()`;
    case "null":
      return `${spaces}v.null()`;
    case "unknown":
      return `${spaces}v.unknown()`;
    case "array": {
      const item = schemaToCode(s.item, 0);
      if (item.includes("\n")) {
        return `${spaces}v.array(\n${schemaToCode(s.item, indent + 1)},\n${spaces})`;
      }
      return `${spaces}v.array(${item})`;
    }
    case "object": {
      const entries = s.entries as Record<string, unknown>;
      const keys = Object.keys(entries);
      if (keys.length === 0) {
        return `${spaces}v.object({})`;
      }
      const properties = keys.map((key) => {
        const valueSchema = schemaToCode(entries[key], indent + 1);
        return `${spaces}  ${key}: ${valueSchema.trim()},`;
      });
      return `${spaces}v.object({\n${properties.join("\n")}\n${spaces}})`;
    }
    default:
      return `${spaces}v.unknown()`;
  }
}

function generateValibotSchema(
  obj: unknown,
  indent: number = 0,
  fallback?: unknown,
): string {
  const spaces = "  ".repeat(indent);

  if (obj === null || obj === undefined) {
    if (fallback) {
      return schemaToCode(fallback, indent);
    }
    return `${spaces}v.null()`;
  }

  if (typeof obj === "boolean") {
    return `${spaces}v.boolean()`;
  }

  if (typeof obj === "number") {
    return `${spaces}v.number()`;
  }

  if (typeof obj === "string") {
    return `${spaces}v.string()`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      if (fallback) {
        const fb = fallback as Record<string, unknown>;
        if (fb.type === "array" && fb.item) {
          const itemCode = schemaToCode(fb.item, 0);
          if (itemCode.includes("\n")) {
            return `${spaces}v.array(\n${schemaToCode(fb.item, indent + 1)},\n${spaces})`;
          }
          return `${spaces}v.array(${itemCode})`;
        }
      }
      return `${spaces}v.array(v.unknown())`;
    }

    const firstItem = obj[0];
    const fbItem = fallback
      ? (fallback as Record<string, unknown>).item
      : undefined;
    if (typeof firstItem === "object" && firstItem !== null) {
      const schema = generateValibotSchema(firstItem, indent + 1, fbItem);
      return `${spaces}v.array(\n${schema},\n${spaces})`;
    }

    return `${spaces}v.array(${generateValibotSchema(firstItem, 0, fbItem)})`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) {
      return `${spaces}v.object({})`;
    }

    const fbEntries = fallback
      ? (fallback as Record<string, unknown>).entries as Record<string, unknown> | undefined
      : undefined;

    const properties = entries.map(([key, value]) => {
      const valueSchema = generateValibotSchema(
        value,
        indent + 1,
        fbEntries?.[key],
      );
      return `${spaces}  ${key}: ${valueSchema.trim()},`;
    });

    return `${spaces}v.object({\n${properties.join("\n")}\n${spaces}})`;
  }

  return `${spaces}v.unknown()`;
}

function formatSchemaCode(schema: string, exportName: string): string {
  return `import * as v from "valibot";\n\nexport const ${exportName} = ${schema};\n`;
}

async function fetchAndGenerateSchema(
  service: ServiceConfig,
  endpoint: keyof Endpoints,
  exportName: string,
  outputPath: string,
  fallback: boolean,
): Promise<void> {
  const fetch = ofetch.create({
    query: service.query,
    baseURL: getMihoYoBaseUrl(service.subdomain),
    responseType: "json",
  });

  const endpoints: Endpoints = {
    getAnnList: `/common/${service.query.game_biz}/announcement/api/getAnnList`,
    getAnnContent: `/common/${service.query.game_biz}/announcement/api/getAnnContent`,
  };

  try {
    console.log(`Fetching ${service.name}/${endpoint}...`);
    const resp = await fetch<BaseResponse>(endpoints[endpoint]);

    if (resp.retcode !== 0) {
      console.error(`Error fetching ${service.name}/${endpoint}: ${resp.retcode} ${resp.message}`);
      return;
    }

    let existingSchema: unknown;
    if (fallback && fs.existsSync(outputPath)) {
      try {
        const mod = await import(pathToFileURL(outputPath).href);
        existingSchema = Object.values(mod)[0];
      } catch {
        // ignore import errors
      }
    }

    const schema = generateValibotSchema(resp, 0, existingSchema);
    const formattedSchema = formatSchemaCode(schema, exportName);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, formattedSchema, "utf-8");
    console.log(`Generated schema for ${service.name}/${endpoint} at ${outputPath}`);
  } catch (error) {
    console.error(`Failed to fetch ${service.name}/${endpoint}:`, error);
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      "no-fallback": {
        type: "boolean",
        default: false,
      },
    },
  });
  const useFallback = !values["no-fallback"];

  console.log("Starting schema generation...\n");

  for (const service of services) {
    const baseDir = path.join(process.cwd(), "server", "service", service.name, "schema");

    await fetchAndGenerateSchema(
      service,
      "getAnnList",
      "AnnListSchema",
      path.join(baseDir, "getAnnList.ts"),
      useFallback,
    );

    await fetchAndGenerateSchema(
      service,
      "getAnnContent",
      "AnnContentSchema",
      path.join(baseDir, "getAnnContent.ts"),
      useFallback,
    );

    console.log("");
  }

  console.log("Schema generation complete!");
}

main().catch(console.error);
