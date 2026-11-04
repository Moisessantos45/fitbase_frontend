import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [ "@pinia/nuxt", "@nuxtjs/leaflet"],
  compatibilityDate: "2025-07-15",
  ssr: false,
  devtools: { enabled: true },
    vite: {
    plugins: [tailwindcss()],
  },
  pinia: {
    storesDirs: ["stores", "store"],
  },
  imports: {
    dirs: [
      "entities",
      "entities/**",
      "services",
      "services/**",
      "helpers",
      "helpers/**",
    ],
  },
  css: ["leaflet/dist/leaflet.css", "@/assets/css/style.css"],
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4107/api/v1",
      apiBaseAuth:
        process.env.NUXT_PUBLIC_API_AUTH_BASE || "http://localhost:4107/api/v1",
    },
  },
});
