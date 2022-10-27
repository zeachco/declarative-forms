import {ValidationError} from '../../classes/ValidationError';
import {SchemaNode, ValidatorFn, SchemaValidator} from '../../types';

interface RangeValidatorOptions {
  minimum: number;
  maximum: number;
}

/**
 * Similar to the {@link lengthValidator} but tests the value against an integer.
 */
export const rangeValidator: ValidatorFn = (
  value: SchemaNode['value'],
  {message, minimum = 0, maximum = 100}: SchemaValidator<RangeValidatorOptions>,
  _node: SchemaNode<string | undefined>,
): ValidationError | null => {
  const validationError = new ValidationError('Range', {
    message,
    minimum,
    maximum,
  });
  if (isNaN(value)) {
    return validationError;
  }

  const newValue = parseFloat(value);
  if (newValue > maximum || newValue < minimum) {
    return validationError;
  }
  return null;
};
