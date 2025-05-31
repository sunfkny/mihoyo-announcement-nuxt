// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: false,
  },
  ui: {
    fonts: false,
  },
  icon: {
    clientBundle: {
      icons: ["lucide:x"],
    },
  },
});
