import { AppError } from '../types/app-error.enum.js';
import { ValidationErrorField } from '../types/validation-error-field.js';

export const createErrorObject = ( errorType: AppError, message: string, details: ValidationErrorField[] = [] ) => ({
  errorType,
  message,
  details: [...details],
});
