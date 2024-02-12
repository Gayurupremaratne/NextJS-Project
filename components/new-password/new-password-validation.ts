import { PASSWORD_REGEX } from '@/constants/global';
import * as yup from 'yup';

// NewPasswordValidation validation
export const NewPasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .required('Please enter a new password')
    .matches(
      PASSWORD_REGEX,
      'Password must have at least 8 characters, 1 capital letter, and 1 special character (@,$,!,%,*,?,&)',
    )
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('newPassword'), ''], 'Passwords must match')
    .nullable() // Allow null values
    .required('Please confirm the new password'),
});
