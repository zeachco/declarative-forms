import { Validator } from '../framework';

export function PresenceValidator(val: any, _options: Validator) {
  return Boolean(val) ? '' : 'PresenceError :: Field must be defined';
}

export function FormatValidator(val: any, options: Validator) {
  if (!options.format) {
    return '';
  }
  const exp = new RegExp(options.format);
  return exp.test(val)
    ? ''
    : `FormatError :: Field does not match expression ${options.format}`;
}
