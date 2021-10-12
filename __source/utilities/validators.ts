import {ValidationError, Validator, SchemaNode} from '../types';

export function presenceValidator(
  val: any,
  _options: Validator,
  node: SchemaNode,
): ValidationError | null {
  return (Array.isArray(val) ? val.length : val)
    ? null
    : new ValidationError('Presence', {field: node.translate('label')});
}

function validateRegex(val: any, format: string): ValidationError | null {
  let exp;
  try {
    exp = new RegExp(convertRubyRegexToJavascriptRegex(format));
  } catch {
    try {
      exp = new RegExp(format);
    } catch {
      // if we receive garbage or unsupported regex from the server,
      // let's ignore it. The server can always validate on submition.
      return null;
    }
  }
  return exp.test(val) ? null : new ValidationError('Format', {format});
}

/**
 * @deprecated
 * Do not use as core will be fixed to send corrected js regexes
 */
function convertRubyRegexToJavascriptRegex(str: string) {
  // Example of regex we can receive
  // (?i-mx:\A([^@\s\p{Cf}]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z)
  // becomes
  // (([^@\s\p{Cf}]+)@((?:[-a-z0-9]+\.)+[a-z]{2,}))
  return (
    str
      // Removing flags that aren't used in js
      .replace('\\A', '^')
      .replace('\\Z', '$')
      .replace('\\z', '$')
      // remove initial / in js
      .replace(/^\//, '')
      // remove trailing flags in js
      .replace(/\/[a-z]*$/, '')
      // ?# means nothing in js
      .replace(/\(\?#.+\)/, '')
      // syntax ?- means nothing in js
      .replace(/\(\?-\w+:/, '(')
      // \s aren't supported in js
      .replace(/\s/, '')
      // case insensitive regex flag removal
      .replace(/(\?i-\w*:)/, '')
  );
}

// Format is disabled until core fixes the js regexes
// we had issues in prod with ruby patterns such as
// \p{Katakana} and \p{Hiragana}
const DISABLE_REGEX_VALIDATOR = true;

export function formatValidator(
  val: any,
  options: Validator,
): ValidationError | null {
  if (DISABLE_REGEX_VALIDATOR) return null;

  if (!options.format || !val) {
    return null;
  }

  if (typeof options.format === 'string') {
    return validateRegex(val, options.format);
  }
  return null;
}

export function lengthValidator(
  val: string,
  {maximum, minimum}: Validator,
): ValidationError | null {
  const len = val?.length;

  // the lengthValidator should not be a replacement for presenceValidator
  // if no value is passed, let's skip the check in case the value is optional
  if (!len) return null;

  // handle the maximum length
  if (maximum && len > maximum)
    return new ValidationError(`MaximumLength`, {maximum});

  // handle the minimum length
  if (minimum && len < minimum)
    return new ValidationError(`MinimumLength`, {minimum});

  return null;
}
