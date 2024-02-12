import * as yup from 'yup';

export const createTagTranslationValidation = yup.object().shape({
  localeId: yup.string().optional(),
  name: yup.string().when(['localeId'], ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Name is required')
      : schema.optional();
  }),
});
export const createTagValidation = yup.object().shape({
  stageId: yup.string(),
  stageTagTranslation: yup
    .array()
    .of(createTagTranslationValidation)
    .test(
      'containsEnLocale',
      'At least one translation with localeId "en" is required',
      value => {
        return value?.some(translation => translation.localeId === 'en');
      },
    )
    .min(1, 'At least one translation is required'),
});
