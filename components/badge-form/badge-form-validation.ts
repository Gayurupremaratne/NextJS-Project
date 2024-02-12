import { DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import * as yup from 'yup';

export const createBadgeTranslationValidation = yup.object().shape({
  localeId: yup.string().optional(),
  name: yup.string().when(['localeId'], ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Name is required')
      : schema.optional();
  }),
  description: yup
    .string()
    .when(['name'], ([name], schema) => {
      return name && name.trim() !== ''
        ? schema.required('Badge description is required')
        : schema;
    })
    .max(
      DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
});

export const createBadgeValidation = yup.object().shape({
  type: yup.number().required('Please select badge type'),
  badgeImage: yup.mixed().required('Badge image is required'),
  stageId: yup
    .string()
    .test('isStageIdRequired', 'Stage ID is required', function (value) {
      const badgeType = this.parent.type;
      if (badgeType === 1 && !value) {
        return false;
      }
      return true;
    }),
  badgeTranslation: yup
    .array()
    .of(createBadgeTranslationValidation)
    .test(
      'containsEnLocale',
      'At least one translation with localeId "en" is required',
      value => {
        return value?.some(translation => translation.localeId === 'en');
      },
    )
    .min(1, 'At least one translation is required'),
});
