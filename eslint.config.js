import { createConfig, detectOpts } from '@esrf/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

const opts = detectOpts(import.meta.dirname);

const config = defineConfig([
  globalIgnores(['build/', 'pybuild/', 'pysrc/']),
  ...createConfig(opts),
  {
    rules: {
      'simple-import-sort/imports': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/no-duplicates': 'off',
      'import/no-unresolved': 'off',
      'array-callback-return': 'off',
      complexity: 'off',
      'func-style': 'off',
      'no-param-reassign': 'off',
      'regexp/sort-alternatives': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'regexp/no-super-linear-move': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/sort-character-class-elements': 'off',
      'unicorn/better-regex': 'off',
      'unicorn/prefer-blob-reading-methods': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/switch-case-braces': 'off',
      'react/destructuring-assignment': 'off',
      'react/display-name': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react/no-multi-comp': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-arguments': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/promise-function-async': 'off',
    },
  },
]);

export default config;
