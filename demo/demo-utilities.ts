import {get} from 'lodash';
import {SchemaNode, ValidationError} from '../source';
import {V2} from './v2';

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
  error: ValidationError<{
    format?: string;
    maximum?: number;
    minimum?: number;
    error?: string;
  }>;
}

export function translateError(_: SchemaNode, {error}: ErrorOptions) {
  // HACK poorman translator mock
  switch (error.type) {
    case 'server':
      return `Server Error "${error.data.error}"`;
    case 'Presence':
      return 'This field is required';
    case 'Format':
      return `The value should match ${error.data.format}`;
    case 'MaximumLength':
      return `The value cannot be longer than ${error.data.maximum} characters`;
    case 'MinimumLength':
      return `The value must be of at least ${error.data.minimum} characters`;
    default:
      return `Translation for <${error.type}]> validator`;
  }
}

const labelsForV2 = JSON.parse(V2.labels);
export function translateLabelsForV2(key: string) {
  return (node: SchemaNode) =>
    get<string>(labelsForV2, [node.path, key].join('.'), '');
}
