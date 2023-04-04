export interface ValidationErrorOptions {
  maximum?: number;
  minimum?: number;
  format?: string;
  error?: string;
  field?: string;
  message?: string;
}

/**
 * Instance of validation error generated when a validator is triggered with a failing state.
 */
export class ValidationError<DataAdditionalOptions = {}> {
  constructor(
    public type: string,
    public data?: ValidationErrorOptions & DataAdditionalOptions,
  ) {}
}
