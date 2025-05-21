import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "no-multi-spaces": "error",
      "no-var": "error",
      "space-in-parens": "error",
      "no-multiple-empty-lines": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "react/no-unescaped-entities": 0,
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error",
    },
  }),
];

export default eslintConfig;
