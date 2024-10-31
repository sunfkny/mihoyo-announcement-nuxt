import { getHk4eInfo } from "~/service/hk4e";

export default defineCachedEventHandler(
  async () => {
    return await getHk4eInfo();
  },
  {
    maxAge: import.meta.dev ? 5 : 60,
    name: "api-announcement-hk4e",
  }
);
