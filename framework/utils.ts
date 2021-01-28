export function getFunctionName(
  fn?: Function,
  fallback: string = 'unknown'
): string {
  return fn?.toString().split('(')[0].replace('function ', '') || fallback;
}
