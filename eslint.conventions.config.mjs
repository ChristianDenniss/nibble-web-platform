import tseslint from "typescript-eslint";
import noRawColorClasses from "./eslint-rules/no-raw-color-classes.js";

const COLOR_RULE_EXEMPT = [
  "src/components/brand/PageIcon.tsx",
  "src/components/brand/AppLogo.tsx",
];

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    linterOptions: { noInlineConfig: true },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: COLOR_RULE_EXEMPT,
    plugins: { local: { rules: { "no-raw-color-classes": noRawColorClasses } } },
    rules: { "local/no-raw-color-classes": "error" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/hooks/**", "src/main.tsx", "src/errors/**", "src/dev/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message: "API calls belong in src/hooks/<resource>/ only.",
            },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "API calls belong in src/hooks/<resource>/ only." },
      ],
    },
  },
];
