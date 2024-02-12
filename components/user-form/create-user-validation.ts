import * as yup from 'yup';
import { isValidNumber } from '@/utils/validation';
import { commonValidationSchema } from './common-validation-user';

// create user form validation
export const createUserValidation = () => {
  const schema = commonValidationSchema.concat(
    yup.object().shape({
      role_id: yup.number().required('Please select role'),
      emergencyContactNumber: yup
        .string()
        .trim()
        .test(
          'valid-phone-number',
          'Invalid phone number for the provided country code',
          async function (value) {
            const { emergencyContactFullName } = this.parent;
            if (!value && emergencyContactFullName) {
              return this.createError({
                message: 'Please enter contact number',
              });
            }
            if (value) {
              const isValid = await isValidNumber(value);
              return isValid;
            }
            return true;
          },
        ),
      emergencyContactFullName: yup
        .string()
        .trim()
        .test('valid name', 'Full name is required', async function (value) {
          const { emergencyContactNumber } = this.parent;
          if (!value && emergencyContactNumber) {
            return this.createError({
              message: 'Please enter full name',
            });
          }
          return true;
        })
        .optional(),
      emergencyContactCountryCode: yup.string().trim(),
      emergencyContactRelationship: yup.string().trim(),
    }),
  );
  return schema;
};
