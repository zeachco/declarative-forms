import {SchemaNode, ValidationError} from '../../src';

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

interface ErrorOptions {
  error: ValidationError;
}

export function translateError(_: SchemaNode, {error}: ErrorOptions) {
  // HACK poorman translator mock
  return `${error.type}`;
}
