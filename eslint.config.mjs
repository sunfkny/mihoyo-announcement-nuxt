// @ts-check
import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    lessOpinionated: true,
    stylistic: {
      semi: true,
      quotes: "double",
    },
    vue: true,
    typescript: true,
    rules: {
      "vue/no-v-html": "off",
      "ts/consistent-type-definitions": "off",
      "style/brace-style": ["error", "1tbs"],
      "e18e/prefer-static-regex": "off",
      "e18e/prefer-spread-syntax": "off",
      "no-console": "off",
    },
  }),
);
