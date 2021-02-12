export const toNumber = (val: any) => Number(val) || 0;
export const toString = (val: any) => `${val ? val : ''}`;
export const toBoolean = (val: any) => Boolean(val);

const mapByKind = {
  number: toNumber,
  integer: toNumber,
  string: toString,
  boolean: toBoolean,
};

export function localFormatter(val: any, type: string) {
  const transform = mapByKind[type as keyof typeof mapByKind];
  if (!transform) return val;
  return transform(val);
}

export function remoteFormatter(val: any, type: string) {
  const transform = mapByKind[type as keyof typeof mapByKind];
  if (!transform) return val;
  return transform(val);
}
