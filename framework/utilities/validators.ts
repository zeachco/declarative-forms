import {Validator} from '..';

export function presenceValidator(val: any, _options: Validator) {
  return (Array.isArray(val) ? val.length : val)
    ? ''
    : 'PresenceError :: Field must be defined';
}
