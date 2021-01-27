import { Validator } from '../framework';

export function presenceValidator(val: any, _options: Validator) {
  return Boolean(val) ? '' : 'PresenceError :: Field must be defined';
}

function validateRegex(val: any, format: string) {
  const exp = new RegExp(format);
  return exp.test(val)
    ? ''
    : `FormatError :: Field does not match expression ${format}`;
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
