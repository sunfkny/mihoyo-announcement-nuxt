import { withQuery } from "ufo";

export type ImageProcess = {
  action: "resize";
  params: {
    p?: number;
    w?: number;
    h?: number;
    m?: number;
    l?: number;
    s?: number;
    limit?: number;
    color?: string;
  };
} | {
  action: "quality";
  params: { q: number };
} | {
  action: "format";
  params: "jpg" | "png" | "webp" | "bmp" | "gif" | "tiff" | "heic" | "avif";
} | {
  action: string;
  params: Record<string, string | number>;
};

export function ossProcess(src: string, process: ImageProcess[]) {
  return withQuery(src, {
    "x-oss-process": process.map((item) => {
      const paramsValue = typeof item.params === "object"
        ? Object.entries(item.params)
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => `${key}_${value}`)
            .join(",")
        : item.params;
      return `image/${item.action},${paramsValue}`;
    }).join(","),
  });
}

export function ossProcessWebp(src: string) {
  return ossProcess(src, [{ action: "format", params: "webp" }]);
}

export function gameIconProcess(src: string) {
  return ossProcess(src, [
    { action: "resize", params: { w: 256, h: 256 } },
    { action: "format", params: "webp" },
  ]);
}
