import {ValidationError, Validator} from '../types';

export function presenceValidator(
  val: any,
  _options: Validator,
): ValidationError | null {
  return (Array.isArray(val) ? val.length : val)
    ? null
    : new ValidationError('Presence');
}

function validateRegex(
  val: any,
  {format, message}: Validator,
): ValidationError | null {
  let exp = new RegExp('.*');
  if (typeof format !== 'string') return null;
  try {
    exp = new RegExp(rubyRegexFromStackOverflow(format));
  } catch {
    exp = new RegExp(format);
  }
  return exp.test(val)
    ? null
    : new ValidationError('Format', {format, message});
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

export function formatValidator(
  val: any,
  options: Validator,
): ValidationError | null {
  if (!options.format) {
    return null;
  }

  if (typeof options.format === 'string') {
    return validateRegex(val, options);
  }

  // eslint-disable-next-line no-console
  console.warn('unsupported options in FormatValidator');
  return null;
}

export function lengthValidator(
  val: string,
  {maximum, minimum}: Validator,
): ValidationError | null {
  if (maximum && val?.length > maximum) {
    return new ValidationError(`MaximumLength`, {maximum});
  }
  if (minimum && val?.length < minimum) {
    return new ValidationError(`MinimumLength`, {minimum});
  }
  return null;
}
