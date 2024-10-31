import { getHkrpgInfo } from "~/service/hkrpg";

export default defineCachedEventHandler(
  async () => {
    return await getHkrpgInfo();
  },
  {
    maxAge: import.meta.dev ? 5 : 60,
    name: "api-announcement-hkrpg",
  }
);
