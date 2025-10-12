// @ts-check
import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    stylistic: {
      semi: true,
      quotes: "double",
    },
    vue: true,
    typescript: true,
    rules: {
      "vue/no-v-html": "off",
      "ts/consistent-type-definitions": "off",
      "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    },
  }),
);
