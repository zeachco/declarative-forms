export const toNumber = (val: any) => +val || 0;
export const toString = (val: any) => `${val ? val : ''}`;
export const toBoolean = (val: any) => !!val;

const mapByKind = {
  number: toNumber,
  integer: toNumber,
  string: toString,
  boolean: toBoolean,
};

export function localFormatter(val: any, kind: string) {
  const transform = mapByKind[kind as keyof typeof mapByKind];
  if (!transform) return val;
  return transform(val);
}

export function remoteFormatter(val: any, kind: string) {
  const transform = mapByKind[kind as keyof typeof mapByKind];
  if (!transform) return val;
  return transform(val);
}
