import { isValidEmail } from '@/utils/validation';
import * as yup from 'yup';

//login form validation
export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .trim()
    .test('valid-email', 'Invalid email address', async function (value) {
      if (value) {
        const isValid = isValidEmail(value);
        return isValid;
      }
      return true;
    })
    .required('Please enter email'),
  password: yup.string().trim().required('Please enter password'),
});
