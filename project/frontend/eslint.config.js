import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from 'eslint-plugin-import';
import pluginReact from "eslint-plugin-react";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import preferFunctionComponent from "eslint-plugin-react-prefer-function-component/config";
import globals from "globals";


export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  reactRecommended,
  preferFunctionComponent.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal"],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "external",
              "position": "before"
            }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ],
    },
  },
];