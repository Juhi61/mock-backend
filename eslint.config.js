import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**", ".next/**", ".vercel/**"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      prettier: prettier.plugins.prettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          trailingComma: "all",
          bracketSpacing: true,
          endOfLine: "lf",
          arrowParens: "always",
        },
      ],
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
