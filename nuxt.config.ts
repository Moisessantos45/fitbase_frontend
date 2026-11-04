import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [ "@pinia/nuxt", "@nuxtjs/leaflet"],
  compatibilityDate: "2025-07-15",
  ssr: false,
  devtools: { enabled: true },
    vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 2500,
      rolldownOptions: {
        output: {
          chunkFileNames: "_nuxt/[name].[hash].js",
          entryFileNames: "_nuxt/[name].[hash].js",
          codeSplitting: {
            groups: [
              {
                name: "apexcharts",
                test: /apexcharts|vue3-apexcharts|apex-commons/,
                priority: 40,
              },
              {
                name: "leaflet",
                test: /leaflet/,
                priority: 30,
              },
              {
                name: "lucide",
                test: /lucide-vue-next/,
                priority: 25,
              },
              {
                name: "vue-vendor",
                test: /[/\\]node_modules[/\\](@vue|vue|vue-router|pinia|@pinia)/,
                priority: 20,
              },
              {
                name: "vendor",
                test: /[/\\]node_modules[/\\]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
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
