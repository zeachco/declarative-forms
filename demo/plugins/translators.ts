import {SchemaNode} from '../../framework';

export function translateLabel(node: SchemaNode) {
  // HACK poorman translator mock
  const pathEnd = node.path.split('.').reverse()[0] || node.path;
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

export function translateError(_: SchemaNode, {error}: {error: string}) {
  // HACK poorman translator mock
  return error.split(/ ?:: ?/)[1] || error;
}
