export function translateLabel(path: string) {
  // HACK poorman translator mock
  const pathEnd = path.split('.').reverse()[0] || path;
  return (
    pathEnd
      // space camel cased chars
      .replace(/([A-Z][a-z])/g, (val) => ` ${val}`)
      // make first char uppercase
      .replace(/^([a-z])/i, (val) => val.toUpperCase())
      // remove spaces around
      .trim()
  );
}

export function translateError(error: string) {
  // HACK poorman translator mock
  return error.split(/ ?:: ?/)[1] || error;
}
