// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: false,
  },
});
