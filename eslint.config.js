import eslintConfig from "@antfu/eslint-config";

export default eslintConfig({
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  solid: true,
  rules: {
    "curly": ["error", "all"],
    "antfu/top-level-function": ["off"],
    "style/brace-style": ["error", "1tbs"],
    "style/arrow-parens": ["error", "always"],
    "ts/consistent-type-definitions": ["error", "type"],
  },
}, {
  files: ["**/*.yml"],
  rules: {
    "yaml/indent": ["error", 2],
  },
});
