// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    files: ["**/*.vue", "**/*.ts"],
    rules: {},
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "import/first": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
