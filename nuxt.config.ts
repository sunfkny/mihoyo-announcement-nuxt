import { games } from "./shared/constants/game";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      title: "Mihoyo Announcement",
      charset: "utf-8",
      meta: [
        { name: "description", content: games.map(i => `${i.name}卡池`).join(",") },
      ],
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/ui"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: [
        "@vueuse/core",
        "clsx",
        "tailwind-merge",
      ],
    },
  },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: false,
    externalVue: true,
  },
  compatibilityDate: "latest",
  eslint: {
    config: {
      standalone: false,
    },
  },
  ui: {
    fonts: false,
  },
  icon: {
    serverBundle: false,
    clientBundle: {
      scan: true,
    },
  },
});
