import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import functional from "eslint-plugin-functional";
import jsxA11y from "eslint-plugin-jsx-a11y";
import n from "eslint-plugin-n";
import noOnlyTests from "eslint-plugin-no-only-tests";
import noSecrets from "eslint-plugin-no-secrets";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import ts from "typescript-eslint";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.agents/**",
      "**/.opencode/**",
      "**/.claude/**",
      "**/.vscode/**",
      "**/.husky/**",
      "**/public/**",
      "**/__tests__/**",
      "**/*.log",
      "**/*.mjs",
      "**/*.mts",
      "commitlint.config.js",
      "scripts/design-qa/**",
    ],
  },

  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  unicorn.configs["recommended"],
  sonarjs.configs.recommended,
  perfectionist.configs["recommended-alphabetical"],

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": fixupPluginRules(reactHooks),
      "react-compiler": reactCompiler,
      "jsx-a11y": jsxA11y,
      "@next/next": fixupPluginRules(nextPlugin),
      security: fixupPluginRules(security),
      promise: fixupPluginRules(promise),
      n: fixupPluginRules(n),
      functional: fixupPluginRules(functional),
      "no-secrets": fixupPluginRules(noSecrets),
      "no-only-tests": noOnlyTests,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021, ...globals.node },
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...security.configs.recommended.rules,
      ...promise.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      "no-secrets/no-secrets": "error",
      "no-only-tests/no-only-tests": "error",
      "functional/prefer-readonly-type": "warn",
      "functional/immutable-data": "warn",
      curly: ["error", "all"],
      "no-console": "warn",
      "max-lines": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
      complexity: ["warn", 15],

      "react-compiler/react-compiler": "error",

      "max-depth": ["error", { max: 3 }],
      "max-params": ["error", { max: 3 }],
      "max-lines-per-function": ["warn", { max: 40 }],
      "no-nested-ternary": "error",
      "no-duplicate-imports": "error",

      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/no-unreadable-array-destructuring": "error",
      "unicorn/prefer-modern-dom-apis": "error",

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1, 2, 100, 31_536_000, 16, 32, 48, 64, 96, 128, 256],
          ignoreArrayIndexes: true,
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
        },
      ],

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/no-array-index-key": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },

  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    plugins: { vitest },
    rules: { ...vitest.configs.recommended.rules },
  },
  {
    files: ["**/e2e/**/*.spec.ts"],
    plugins: { playwright: fixupPluginRules(playwright) },
  },
];
