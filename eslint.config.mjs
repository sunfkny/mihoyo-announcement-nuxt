// @ts-check
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    rules: {
      "vue/no-v-html": "off",
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
);
