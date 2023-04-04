import {ValidationError} from '../../classes/ValidationError';
import {SchemaValidator, SchemaNode} from '../../types';

/**
 * Function representing the schema validator with `{name: "Presence", ...}`
 * If a value is undefined it returns a {@link ValidationError} mentioning the field's translated label
 *
 * Cases that return a validation error:
 * - list node with value of []
 * - integer number node with value of 0
 * - string node with value of ''
 * - boolean node with value of false
 * - untyped node with value of undefined or null
 */
export function presenceValidator(
  val: any,
  options: SchemaValidator,
  node: SchemaNode,
): ValidationError | null {
  return (Array.isArray(val) ? val.length : val)
    ? null
    : new ValidationError('Presence', {
        field: node.translate('label'),
        message: options.message || undefined,
      });
}
