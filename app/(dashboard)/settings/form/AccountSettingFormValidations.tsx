import * as yup from 'yup';
import { PASSWORD_REGEX } from '@/constants/global';
import { commonValidationSchema } from '@/components/user-form/common-validation-user';

export const isValidNewPassword = (newPassword: string) => {
  const regex = PASSWORD_REGEX;
  return regex.test(newPassword);
};

//account setting form validation
export const accountSettingFormValidation = () => {
  const schema = commonValidationSchema.concat(
    yup.object().shape({
      currentPassword: yup
        .string()
        .test(
          'current-password',
          'Please enter current password when changing password',
          function (value) {
            const { newPassword, confirmPassword } = this.parent;

            if ((newPassword || confirmPassword) && !value) {
              return false;
            }

            return true;
          },
        ),
      newPassword: yup
        .string()
        .test(
          'new-password-validation',
          'New password need to be entered',
          function (value) {
            const { currentPassword } = this.parent;

            if (currentPassword && !value) {
              return false;
            }
            if (value && !isValidNewPassword(value)) {
              return this.createError({
                message:
                  'Password must have at least 8 characters, 1 capital letter, and 1 special character (@,$,!,%,*,?,&)',
              });
            }
            if (value === undefined ? '' : value && value.length > 50) {
              return this.createError({
                message: 'Password must have less than 50 characters',
              });
            }

            return true;
          },
        ),
      confirmPassword: yup
        .string()
        .test(
          'confirm-password',
          'Please confirm new password when changing password',
          function (value) {
            const { newPassword } = this.parent;

            if (newPassword && !value) {
              return false;
            }

            if (newPassword && value !== newPassword) {
              return this.createError({
                message: 'Passwords do not match',
              });
            }

            return true;
          },
        ),
    }),
  );

  return schema;
};
