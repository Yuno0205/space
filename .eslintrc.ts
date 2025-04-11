/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next", "next/core-web-vitals", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
};
