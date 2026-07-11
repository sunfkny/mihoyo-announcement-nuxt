// @ts-check
import antfu from "@antfu/eslint-config";

export default antfu({
  lessOpinionated: true,
  react: true,
  stylistic: {
    semi: true,
    quotes: "double",
  },
  typescript: true,
  ignores: ["src/routeTree.gen.ts"],
  rules: {
    "style/brace-style": ["error", "1tbs"],
    "ts/consistent-type-definitions": "off",
    "e18e/prefer-static-regex": "off",
    "e18e/prefer-spread-syntax": "off",
    "no-console": "off",
    "react/no-danger": "off",
    "react/dom-no-dangerously-set-innerhtml": "off",
    "react-refresh/only-export-components": "off",
  },
});
