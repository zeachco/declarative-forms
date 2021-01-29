import { Validator } from '..';

export function presenceValidator(val: any, _options: Validator) {
  return Boolean(val) ? '' : 'PresenceError :: Field must be defined';
}
