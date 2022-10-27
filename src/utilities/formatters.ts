import {SchemaNode} from '../types';

export const toNumber = (val: any) => Number(val) || 0;
export const toString = (val: any) => `${val ? val : ''}`;
export const toBoolean = (val: any) => Boolean(val);

const mapByKind = {
  number: toNumber,
  integer: toNumber,
  string: toString,
  boolean: toBoolean,
};

/**
 * When value is null or undefined, it has different behavior:
 * The backend could intentionnaly send `null` values.
 * These are not to be formatted as it allows differencing between `undefined` and `nil`
 */
export function defaultTypeFormater(
  value: any,
  type: string,
  _node: SchemaNode,
) {
  if (value === null) return value;
  const transform = mapByKind[type as keyof typeof mapByKind];
  return transform ? transform(value) : value;
}
