import { Validator } from '../../framework';

function validateRegex(val: any, format: string) {
  let exp = new RegExp('.*');
  try {
    exp = new RegExp(rubyRegexFromStackOverflow(format));
  } catch {
    exp = new RegExp(format);
  }
  return exp.test(val)
    ? ''
    : `FormatError :: Field does not match expression ${format}`;
}

function rubyRegexFromStackOverflow(str: string) {
  return str
    .replace('\\A', '^')
    .replace('\\Z', '$')
    .replace('\\z', '$')
    .replace(/^\//, '')
    .replace(/\/[a-z]*$/, '')
    .replace(/\(\?#.+\)/, '')
    .replace(/\(\?-\w+:/, '(')
    .replace(/\s/, '');
}

export function formatValidator(val: any, options: Validator) {
  if (!options.format) {
    return '';
  }

  if (typeof options.format === 'string') {
    return validateRegex(val, options.format);
  }

  console.warn('unsupported options in FormatValidator');
  return '';
}

export function lengthValidator(val: string, { maximum, minimum }: Validator) {
  if (maximum && val.length > maximum) {
    return 'LengthValidator :: value is too long, must be at most ${maximum} character';
  }
  if (minimum && val.length < minimum) {
    return 'LengthValidator :: value is too short, must be at least ${minimum} character';
  }
  return '';
}
