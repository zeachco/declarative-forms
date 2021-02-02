export function getFunctionName(fn?: Function, fallback = 'unknown'): string {
  return fn?.toString().split('(')[0].replace('function ', '') || fallback;
}
