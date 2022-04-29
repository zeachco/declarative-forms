// this is used for storybook only
/* eslint-env node */

module.exports = {
  presets: [
    [
      '@shopify/babel-preset',
      {typescript: true, react: true, transformRuntime: true},
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
