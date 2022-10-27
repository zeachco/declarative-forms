import {ValidationError} from '../../classes/ValidationError';
import {SchemaValidator, SchemaNode} from '../../types';

/**
 * Function representing the schema validator with `{name: "Presence", ...}`.
 *
 * If a value is undefined it returns a {@link ValidationError} mentionning the field's translated label.
 *
 * Note: if we receive an invalid regex, we do not return a {@link ValidationError} since the server can
 * validate on submission.
 */
function validateRegex(
  val: any,
  format: string,
  message?: string,
  flags = 'i',
): ValidationError | null {
  let exp;
  try {
    exp = new RegExp(format, flags);
  } catch {
    // if we receive garbage or unsupported regex from the server,
    // let's ignore it. The server can always validate on submission.
    return null;
  }
  return exp.test(val)
    ? null
    : new ValidationError('Format', {format, message});
}

interface FormatValidatorOptions {
  format?: string;
  flags?: string;
}

/**
 * Function representing the schema validator with `{name: "Format", ...}`
 * options use that interface
 * ```tsx
 * interface FormatValidatorOptions {
 *   // Valid javascript regex pattern without the surounding slashes ie: "[a-z]"
 *   format?: string;
 *   // normal RegExp flag
 *   flags?: string;
 * }
 * ```
 * example of schema
 * ```json
 * {
 *  "name": "Format",
 *  "format": "0x[a-f]{8}",
 *  "flags": "gim"
 * }
 * ```
 */
export function formatValidator(
  val: any,
  options: SchemaValidator<FormatValidatorOptions>,
  node: SchemaNode,
): ValidationError | null {
  if (!node.context.features.enableFormatValidator) return null;
  if (!options.format || !val) return null;
  if (typeof options.format === 'string') {
    return validateRegex(val, options.format, options.message, options.flags);
  }
  return null;
}
