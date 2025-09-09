// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "shadcn-nuxt"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
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
