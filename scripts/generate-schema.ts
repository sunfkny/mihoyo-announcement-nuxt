import type { MihoyoSubdomain } from "#shared/constants/url";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";
import * as bh3Service from "#server/service/bh3";
import * as hk4eService from "#server/service/hk4e";
import * as hkrpgService from "#server/service/hkrpg";
import * as napService from "#server/service/nap";
import { getMihoYoBaseUrl } from "#shared/constants/url";
import { ofetch } from "ofetch";

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

function generateValibotSchema(obj: unknown, indent: number = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null || obj === undefined) {
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
      return `${spaces}v.array(v.unknown())`;
    }

    const firstItem = obj[0];
    if (typeof firstItem === "object" && firstItem !== null) {
      const schema = generateValibotSchema(firstItem, indent + 1);
      return `${spaces}v.array(\n${schema},\n${spaces})`;
    }

    return `${spaces}v.array(${generateValibotSchema(firstItem, 0)})`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) {
      return `${spaces}v.object({})`;
    }

    const properties = entries.map(([key, value]) => {
      const valueSchema = generateValibotSchema(value, indent + 1);
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

    const schema = generateValibotSchema(resp);
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
  console.log("Starting schema generation...\n");

  for (const service of services) {
    const baseDir = path.join(process.cwd(), "server", "service", service.name, "schema");

    await fetchAndGenerateSchema(
      service,
      "getAnnList",
      "AnnListSchema",
      path.join(baseDir, "getAnnList.ts"),
    );

    await fetchAndGenerateSchema(
      service,
      "getAnnContent",
      "AnnContentSchema",
      path.join(baseDir, "getAnnContent.ts"),
    );

    console.log("");
  }

  console.log("Schema generation complete!");
}

main().catch(console.error);
