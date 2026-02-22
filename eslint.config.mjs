import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // TypeScript-aware rule overrides
  ...tseslint.configs.recommended,

  // Custom rules
  {
    rules: {
      // ── Variables ─────────────────────────────────────────────────────
      // Use @typescript-eslint variant so TS type-only references aren't flagged
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          // Allow vars prefixed with _ to be intentionally unused
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // ── Code quality ──────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "no-duplicate-imports": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",

      // ── TypeScript ────────────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;

