import {ValidationError} from '../../classes/ValidationError';
import {SchemaValidator} from '../../types';

interface LengthValidatorOptions {
  maximum?: number;
  minimum?: number;
}
/**
 * Function representing the schema validator with `{name: "Length", ...}`
 * If a value is defined, it tests the content's length based on an optional minimum and/or optional maximum.
 *
 * `lengthValidator` only returns a {@link ValidationError} if the value is defined and the length
 * is not within the range.
 */
export function lengthValidator(
  val: string,
  {maximum, minimum, message}: SchemaValidator<LengthValidatorOptions>,
): ValidationError | null {
  const len = val?.length;

  // the lengthValidator should not be a replacement for presenceValidator
  // if no value is passed, let's skip the check in case the value is optional
  if (!len) return null;

  // handle the maximum length
  if (maximum && len > maximum)
    return new ValidationError(`MaximumLength`, {maximum, message});

  // handle the minimum length
  if (minimum && len < minimum)
    return new ValidationError(`MinimumLength`, {minimum, message});

  return null;
}
