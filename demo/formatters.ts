export function remoteFormatter(value: any, kind: string) {
  switch (kind) {
    case 'number':
      return parseInt(value) || 0;
    case 'boolean':
      return Boolean(value);
    case 'string':
    default:
      return value;
  }
}
