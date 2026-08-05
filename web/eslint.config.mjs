import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // Ignore patterns - MUST be in a separate object with ONLY ignores property
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/.cache/**",
      "**/*.log",
      "**/next-env.d.ts",
    ],
  },
  // Extend Next.js config
  ...compat.extends("next/core-web-vitals"),
  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-string-refs": "off",
      "react/display-name": "off",
      "react/no-deprecated": "off",
      "react/no-direct-mutation-state": "off",
      "react/require-render-return": "off",
      "react/prop-types": "off",
    },
  },
];

export default config;
