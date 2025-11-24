module.exports = {
  root: true,
  env: { node: true },
  extends: ['@expo/eslint-config'],
  parserOptions: { ecmaVersion: 2020 },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};