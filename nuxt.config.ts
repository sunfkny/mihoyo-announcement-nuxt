// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { games } from "./shared/constants/game";

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
  modules: ["@nuxt/eslint", "shadcn-nuxt"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: false,
  },
  compatibilityDate: "latest",
  eslint: {
    config: {
      standalone: false,
    },
  },
  shadcn: {
    prefix: "",
  },
});
