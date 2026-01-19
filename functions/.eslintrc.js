// functions/.eslintrc.js
module.exports = {
  root: true, // Ensures ESLint stops looking in parent folders for configs
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "max-len": ["error", {
      code: 80,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": [
      "error",
      "double",
      { "allowTemplateLiterals": true },
    ],
    // It's good practice to explicitly turn off JSDoc requirements
    // for Cloud Functions if you don't plan on writing them,
    // as the "google" config can enforce them.
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 2],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
