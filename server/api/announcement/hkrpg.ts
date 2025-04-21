import { getHkrpgInfo } from "~/service/hkrpg";

export default defineCachedEventHandler(
  async (event) => {
    event.node.res.setHeader(
      "CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=600"
    );
    return await getHkrpgInfo();
  },
  {
    maxAge: 60,
    name: "api-announcement-hkrpg",
    staleMaxAge: 600,
  }
);
