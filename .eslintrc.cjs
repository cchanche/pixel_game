module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  root: true,
  rules: {
    "prettier/prettier": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-debugger": "warn",
    "@typescript-eslint/ban-types": [
      "warn",
      {
        types: {
          Function: false,
        },
      },
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
        "ts-nocheck": "allow-with-description",
        "ts-check": "allow-with-description",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_+$",
        varsIgnorePattern: "^_+$",
      },
    ],
    "no-empty": "off",
  },
  ignorePatterns: [
    "**/build/**/*",
    "**/dist*/**/*",
    "**/cdk.out/**/*",
    "**/public/**/*",
    "**/coverage/**/*",
    "**/node_modules/**/*",
    "**/vite.config.js",
  ],
};
