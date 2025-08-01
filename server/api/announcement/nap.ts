import { getNapInfo } from "~~/server/service/nap";

export default defineCachedEventHandler(
  async (event) => {
    event.node.res.setHeader(
      "CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=600"
    );
    return await getNapInfo();
  },
  {
    maxAge: import.meta.dev ? 1 : 60,
    name: "api-announcement-nap",
    staleMaxAge: 600,
  }
);
