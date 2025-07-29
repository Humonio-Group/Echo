// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@clerk/nuxt",
  ],
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  css: ["./base.css"],
  colorMode: {
    classPrefix: "",
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  runtimeConfig: {
    clerk: {
      secretKey: "",
    },
    gpt: {
      secretKey: "",
    },
    public: {
      environment: "",
      clerk: {
        publishableKey: "",
      },
    },
  },
  compatibilityDate: "2025-05-15",
  nitro: {
    experimental: {
      wasm: true,
      websocket: true,
    },
    websocket: {
      maxPayload: 1048576,
      compression: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      hmr: {
        port: 24678,
      },
    },
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
  },
  googleFonts: {
    families: {
      Montserrat: {
        ital: "100..900",
        wght: "100..900",
      },
    },
  },
  i18n: {
    strategy: "prefix_except_default",
    locales: [
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        file: "fr.json",
      },
    ],
    defaultLocale: "fr",
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
