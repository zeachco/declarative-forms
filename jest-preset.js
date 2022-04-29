/* eslint-env node */
exports.jestPreset = function (jestPreset) {
  const jsxKey = '\\.jsx?$';
  let transform = {};
  // temporary export until sewing-kit is fixed
  if (
    !('\\.(jsx|esnext)?$' in jestPreset.transform) &&
    !('\\.esnext?$' in jestPreset.transform)
  ) {
    transform = {
      '\\.esnext?$': jestPreset.transform[jsxKey],
    };
  }
  return Object.assign(jestPreset, {
    transform: {
      ...jestPreset.transform,
      ...transform,
    },
  });
};
