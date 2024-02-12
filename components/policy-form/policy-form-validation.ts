import * as yup from 'yup';
import { contentValidation } from './content-field-validation';
import { POLICY_TITLE_CHARACTER_LENGTH } from '@/constants/form-title-character-length';

const translationSchema = yup.object().shape({
  localeId: yup.string().optional(),
  title: yup
    .string()
    .max(
      POLICY_TITLE_CHARACTER_LENGTH,
      `Title must not exceed ${POLICY_TITLE_CHARACTER_LENGTH} characters`,
    )
    .when(['localeId'], ([localeId], schemaForTitle) => {
      return localeId === 'en'
        ? schemaForTitle.required('Policy title is required')
        : schemaForTitle.optional();
    }),

  content: contentValidation(),
});

export const schema = yup.object().shape({
  icon: yup.string().trim().required('Icon is required'),
  acceptanceRequired: yup.string().trim().required('Tag is required'),
  policyTranslations: yup
    .array()
    .of(translationSchema)
    .test(
      'containsEnLocale',
      'At least one translation with localeId "en" is required',
      value => {
        return value?.some(translation => translation.localeId === 'en');
      },
    )
    .min(1, 'At least one translation is required'),
});
