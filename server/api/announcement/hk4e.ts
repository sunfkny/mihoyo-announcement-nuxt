import { getHk4eInfo } from "~/service/hk4e";

export default defineCachedEventHandler(
  async (event) => {
    event.node.res.setHeader(
      "CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=600"
    );
    return await getHk4eInfo();
  },
  {
    maxAge: import.meta.dev ? 1 : 60,
    name: "api-announcement-hk4e",
    staleMaxAge: 600,
  }
);
