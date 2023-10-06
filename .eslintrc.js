const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createJestOverride,
} = require('eslint-config-galex/dist/overrides/jest');
const {
  createReactOverride,
} = require('eslint-config-galex/dist/overrides/react');
const {
  createTypeScriptOverride,
} = require('eslint-config-galex/dist/overrides/typescript');

const dependencies = getDependencies();

module.exports = createConfig({
  enableJavaScriptSpecificRulesInTypeScriptProject: true,
  rules: {
    'import/order': 'off',

    'dot-notation': 'off',
    'sort-keys-fix/sort-keys-fix': 'off', // keys should be sorted based on significance
    'import/no-default-export': 'off', // default exports are common in React

    // ternaries are sometimes more readable when `true` branch is most significant branch
    'no-negated-condition': 'off',
    'unicorn/no-negated-condition': 'off',

    // Prefer explicit, consistent return - e.g. `return undefined;`
    'unicorn/no-useless-undefined': 'off',
    'consistent-return': 'error',

    // Properties available after typeguard may be tedious to destructure (e.g. in JSX)
    'unicorn/consistent-destructuring': 'off',

    // To be re-enabled after refactoring
    'sonarjs/cognitive-complexity': 'off',

    // `import { type Foo }` requires TS 5.0's `verbatimModuleSyntax`, which causes issues with Jest
    // Sticking with `importsNotUsedAsValues` and `import type { Foo }` for now...
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
  overrides: [
    createReactOverride({
      ...dependencies,
      rules: {
        'react/jsx-no-constructed-context-values': 'off', // too strict
        'jsx-a11y/prefer-tag-over-role': 'off', // To be fixed
      },
    }),
    createTypeScriptOverride({
      ...dependencies,
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off', // too strict
        '@typescript-eslint/lines-between-class-members': 'off', // allow grouping single-line members
        '@typescript-eslint/prefer-nullish-coalescing': 'off', // `||` is often convenient and safe to use with TS
        '@typescript-eslint/explicit-module-boundary-types': 'off', // worsens readability sometimes (e.g. for React components)
        '@typescript-eslint/no-unnecessary-type-arguments': 'off', // lots of false positives

        '@typescript-eslint/no-floating-promises': 'off', // big crash sometimes better than silent fail

        // Unused vars should be removed but not prevent compilation
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { ignoreRestSiblings: true },
        ],

        // Allow writing void-returning arrow functions in shorthand to save space
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          { ignoreArrowShorthand: true },
        ],

        // Prefer `interface` over `type`
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],

        // Disallows calling function with value of type `any` (disabled due to false positives)
        // Re-enabling because has helped fix a good number of true positives
        '@typescript-eslint/no-unsafe-argument': 'warn',

        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow', // `never` is too strict
          },
        ],

        // Disallow shadowing variables for an outer scope, as this can cause bugs
        // when the inner-scope variable is removed, for instance
        '@typescript-eslint/no-shadow': 'error',

        // Catch unnecessary checks to ease readability
        '@typescript-eslint/no-unnecessary-condition': 'warn',

        // Chaining array operations after mutations is handy and do not hamper readability
        'etc/no-assign-mutated-array': 'off',
      },
    }),
    createJestOverride({
      ...dependencies,
      rules: {
        'jest/no-focused-tests': 'warn', // warning instead of error
        'jest/prefer-strict-equal': 'off', // `toEqual` is shorter and sufficient in most cases
        'jest-formatting/padding-around-all': 'off', // allow writing concise two-line tests
        'jest/require-top-level-describe': 'off', // filename should already be meaningful, extra nesting is unnecessary
        'jest/no-conditional-in-test': 'off', // false positives in E2E tests (snapshots), and too strict (disallows using `||` for convenience)
      },
    }),
    {
      files: ['**/*.spec.ts', '**/*.test.tsx'],
      rules: {
        'testing-library/await-async-query': 'off', // Cypress has its own way of dealing with asynchronicity
        'testing-library/await-async-utils': 'off', // Cypress has its own way of dealing with asynchronicity
        'testing-library/prefer-screen-queries': 'off', // Cypress provides `cy` object instead of `screen`
        'testing-library/no-await-sync-events': [
          // Since user-event v14, `userEvent` methods are async
          'error',
          {
            eventModules: ['fire-event'],
          },
        ],
      },
    },
  ],
});
