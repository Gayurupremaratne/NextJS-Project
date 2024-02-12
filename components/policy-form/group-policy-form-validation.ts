import * as yup from 'yup';
import { contentValidation } from './content-field-validation';
import { POLICY_DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import { POLICY_TITLE_CHARACTER_LENGTH } from '@/constants/form-title-character-length';

// Define the child schema
const childSchema = yup.object().shape({
  localeId: yup.string().required('Locale ID is required'),
  title: yup
    .string()
    .test('title-in-locale', 'Title required', function (value) {
      const { blocks } = this.parent;

      if (blocks && blocks.length > 0 && !value) {
        return this.createError({
          message: 'Title required',
        });
      }

      if (value?.length && value?.length > POLICY_TITLE_CHARACTER_LENGTH) {
        return this.createError({
          message: `Title must not exceed ${POLICY_TITLE_CHARACTER_LENGTH} characters`,
        });
      }

      return true; // No validation for 'title' otherwise
    }),

  description: yup
    .string()
    .optional()
    .max(
      POLICY_DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${POLICY_DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
  content: contentValidation(),
});

const titleValidation = yup.object().shape({
  localeId: yup.string().required(),
  title: yup
    .string()
    .test(
      'maxCharacters',
      'Title must be less than 60 characters',
      function (value) {
        const { localeId } = this.parent;
        if (localeId === 'en' && !value) {
          return this.createError({
            message: 'Title required',
          });
        }
        if (value && value?.length > POLICY_TITLE_CHARACTER_LENGTH) {
          return this.createError({
            message: `Title must not exceed ${POLICY_TITLE_CHARACTER_LENGTH} characters`,
          });
        }
        return true;
      },
    ),
});

// Define the final schema with conditional validation for 'title'
export const schema = yup.object().shape({
  icon: yup.string().trim().required('Icon is required'),
  policyTranslations: yup.array().of(titleValidation),
  childPolicies: yup.array().of(childSchema),
});
