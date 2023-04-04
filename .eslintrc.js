module.exports = {
  extends: [
    'plugin:@shopify/esnext',
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'plugin:@shopify/jest',
    'plugin:@shopify/prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/external-module-folders': ['node_modules'],
  },
  globals: {
    module: true,
    require: true,
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'ImportDeclaration[source.value=react] > ImportNamespaceSpecifier',
        message: `React must be imported using "import React from 'react'" syntax`,
      },
      {
        selector:
          'ImportDeclaration[source.value=/.scss/] > ImportNamespaceSpecifier',
        message: 'Scss must be imported using "import styles from" syntax',
      },
    ],
    // These rules have too many false positives and will be remove
    // in future versions of the config
    'react/display-name': 'off',
    // These rules do not really make sense for TypeScript, we'll remove them
    // in the future
    'consistent-return': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'react/forbid-component-props': ['error', {forbid: ['testID']}],
    'react/forbid-dom-props': ['error', {forbid: ['testID']}],
    // Reasonable use case in tests, mocks and type files
    '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        allowEmpty: true,
      },
    ],

    // Rules currently disabled so eslint can be introduced without changes the library
    '@shopify/jsx-no-complex-expressions': 'off',
    '@shopify/jsx-no-hardcoded-content': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'id-length': 'off',
    'import/order': 'off',
    'import/no-extraneous-dependencies': 'off',
    'jest/require-top-level-describe': 'off',
    'jest/prefer-to-be': 'off',
    'jest/no-identical-title': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'line-comment-position': 'off',
    'no-console': 'off',
    'no-implicit-coercion': 'off',
    'no-param-reassign': 'off',
    'prefer-object-spread': 'off',
    'react/button-has-type': 'off',
    'react/self-closing-comp': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};
