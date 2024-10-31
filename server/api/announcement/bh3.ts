import { getBh3Info } from "~/service/bh3";

export default defineCachedEventHandler(
  async () => {
    return await getBh3Info();
  },
  {
    maxAge: import.meta.dev ? 5 : 60,
    name: "api-announcement-bh3",
  }
);
