import { getBh3Info } from "~~/server/service/bh3";

export default defineCachedEventHandler(
  async (event) => {
    event.node.res.setHeader(
      "CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=600"
    );
    return await getBh3Info();
  },
  {
    maxAge: import.meta.dev ? 1 : 60,
    name: "api-announcement-bh3",
    staleMaxAge: 600,
  }
);
