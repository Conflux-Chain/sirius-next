module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [require.resolve('@cfxjs/sirius-next-eslint-config/library.js')],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  rules: {
    // TypeScript declarations are validated by the TypeScript compiler.
    'no-undef': 'off',
    'no-unused-vars': 'off',
  },
};
