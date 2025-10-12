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
    plugins: [
      // Hide tailwindcss warnings
      // https://github.com/tailwindlabs/tailwindcss/discussions/16119#discussioncomment-12758373
      {
        apply: "build",
        name: "vite-plugin-ignore-sourcemap-warnings",
        configResolved(config) {
          const originalOnWarn = config.build.rollupOptions.onwarn;
          config.build.rollupOptions.onwarn = (warning, warn) => {
            if (
              warning.code === "SOURCEMAP_BROKEN"
              && warning.plugin === "@tailwindcss/vite:generate:build"
            ) {
              return;
            }
            if (originalOnWarn) {
              originalOnWarn(
                warning,
                warn,
              );
            } else {
              warn(
                warning,
              );
            }
          };
        },
      },
    ],
  },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: false,
    externalVue: true,
    buildCache: true,
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
