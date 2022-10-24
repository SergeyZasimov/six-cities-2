import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.js';

export const transformErrors = ( errors: ValidationError[] ): ValidationErrorField[] =>
  errors.map(( { property, value, constraints } ) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
