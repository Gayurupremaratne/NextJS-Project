import * as yup from 'yup';
import {
  isValidEmail,
  isValidNicNumber,
  isValidNumber,
  isValidPassport,
} from '@/utils/validation';
import { PROFILE_IMAGE_SUPPORTED_FORMATS } from '@/constants/image-supported-formats';
import { ALPHABETANDSPACESREGEX } from '@/constants/global';

export const commonValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .matches(ALPHABETANDSPACESREGEX, 'Please enter a valid first name')
    .required('Please enter first name'),
  lastName: yup
    .string()
    .trim()
    .matches(ALPHABETANDSPACESREGEX, 'Please enter a valid last name')
    .required('Please enter last name'),
  email: yup
    .string()
    .trim()
    .test('valid-email', 'Invalid email address', async function (value) {
      if (value) {
        const isValid = await isValidEmail(value);
        return isValid;
      }
      return true;
    })
    .required('Please enter email'),
  nationalityCode: yup.string().trim().required('Please select nationality'),
  countryCode: yup.string().trim(),
  contactNumber: yup
    .string()
    .test(
      'valid-phone-number',
      'Invalid phone number for the provided country code',
      async function (value) {
        if (value) {
          const isValid = await isValidNumber(value);
          return isValid;
        }
        return true;
      },
    ),
  nicNumber: yup
    .string()
    .test('valid NIC number', 'Invalid NIC number', async function (value) {
      const { nationalityCode } = this.parent;
      if (value && nationalityCode === 'LK') {
        if (!isValidNicNumber(value)) {
          return this.createError({
            message: 'Invalid NIC number format',
          });
        }
      }
      return true;
    }),
  passportNumber: yup
    .string()
    .trim()
    .test(
      'valid-passport-number',
      'Invalid passport number',
      async function (value) {
        const { nationalityCode } = this.parent;
        if (value && nationalityCode !== 'LK') {
          const isValid = await isValidPassport(value);
          return isValid;
        }
        return true;
      },
    ),
  dateOfBirth: yup.string(),
  image: yup
    .mixed()
    .test('fileValidation', 'File validation failed', function (value) {
      if (
        value instanceof File &&
        !PROFILE_IMAGE_SUPPORTED_FORMATS.includes(value.type)
      ) {
        return this.createError({
          message: 'Unsupported format. Should be jpg, jpeg, png or heic',
        });
      }

      return true;
    }),
});
