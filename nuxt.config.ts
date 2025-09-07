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
  compatibilityDate: "2025-03-01",
  eslint: {
    checker: {
      configType: "flat",
    },
    config: {
      standalone: false,
    },
  },
  icon: {
    provider: "none",
    clientBundle: {
      scan: true,
      icons: ["lucide:x"], // Modal close icon
    },
  },
  shadcn: {
    prefix: "",
  },
});
