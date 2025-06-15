import { defineConfig } from "eslint/config";

export default defineConfig([{
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 2020
    },
    "env": {
      "node": true,
      "browser": true,
      "es2020": true
    },
    "globals": {
      "describe": false,
      "it": false,
      "require": false,
      "before": false,
      "after": false,
      "global": false,
      "process": false
    },
    "rules": {
      "brace-style": [
        "error",
        "1tbs",
        {
          "allowSingleLine": true
        }
      ],
      "quotes": [
        "error",
        "double",
        "avoid-escape"
      ],
      "no-debugger": "error",
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_"
        }
      ],
      "no-tabs": "error",
      "semi": [
        "error",
        "always"
      ],
      "no-extra-semi": "error",
      "no-irregular-whitespace": "error",
      "space-before-blocks": [
        "error",
        "always"
      ]
    }
}]);