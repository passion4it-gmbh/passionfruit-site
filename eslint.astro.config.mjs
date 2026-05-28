// @ts-check
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      "astro/jsx-a11y/alt-text": "error",
      "astro/jsx-a11y/anchor-has-content": "warn",
      "astro/jsx-a11y/anchor-is-valid": "warn",
      "astro/jsx-a11y/aria-props": "warn",
      "astro/jsx-a11y/aria-role": "warn",
      "astro/jsx-a11y/click-events-have-key-events": "warn",
      "astro/jsx-a11y/heading-has-content": "warn",
      "astro/jsx-a11y/no-redundant-roles": "warn",
      "astro/jsx-a11y/label-has-associated-control": "warn",
      "astro/jsx-a11y/no-noninteractive-element-interactions": "warn",
      "astro/jsx-a11y/no-static-element-interactions": "warn",
    },
  },
];
