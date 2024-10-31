import { getNapInfo } from "~/service/nap";

export default defineCachedEventHandler(
  async () => {
    return await getNapInfo();
  },
  {
    maxAge: import.meta.dev ? 5 : 60,
    name: "api-announcement-nap",
  }
);
