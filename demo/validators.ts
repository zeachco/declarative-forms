import { Validator } from '../framework';

export function PresenceValidator(val: any, _options: Validator) {
  return Boolean(val) ? '' : 'PresenceError :: Field must be defined';
}

function validateRegex(val: any, format: string) {
  const exp = new RegExp(format);
  return exp.test(val)
    ? ''
    : `FormatError :: Field does not match expression ${format}`;
}

export function FormatValidator(val: any, options: Validator) {
  if (!options.format) {
    return '';
  }

  if (typeof options.format === 'string') {
    return validateRegex(val, options.format);
  }

  console.warn('unsupported options in FormatValidator');
  return '';
}
