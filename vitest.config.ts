import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/server": path.resolve(__dirname, "./server"),
      "~/prisma": path.resolve(__dirname, "./prisma"),
    },
  },
});
