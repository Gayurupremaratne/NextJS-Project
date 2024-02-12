import { DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import * as yup from 'yup';

const FILE_SIZE = 25 * 1024 * 1024; // 25mb
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];
const latitudeRegex = /^-?([0-8]?[0-9]\.{1}\d+|90\.{1}0+)$/;
const longitudeRegex = /^-?((1[0-7][0-9]|[0-9]?[0-9])\.{1}\d+|180\.{1}0+)$/;

const translationSchema = yup.object().shape({
  localeId: yup.string().optional(),
  title: yup.string().when('localeId', ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Title is required')
      : schema.optional();
  }),
  description: yup
    .string()
    .max(
      DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
});

export const schema = yup.object().shape({
  stageIds: yup.array().min(1, 'At least one stage is required'),
  latitude: yup
    .string()
    .required('Please enter latitude')
    .matches(latitudeRegex, 'Invalid latitude format'),
  longitude: yup
    .string()
    .required('Please enter longitude')
    .matches(longitudeRegex, 'Invalid longitude format'),
  image: yup
    .mixed()
    .test('fileValidation', 'File validation failed', function (value) {
      const { assetKey } = this.parent;

      // Only perform the validation if mediaKey is not available
      if (!assetKey) {
        if (!value) {
          return this.createError({ message: 'File is required' });
        }

        if (!(value instanceof File)) {
          return this.createError({ message: 'Invalid file' });
        }

        if (value.size > FILE_SIZE) {
          return this.createError({ message: 'File too large' });
        }

        if (!SUPPORTED_FORMATS.includes(value.type)) {
          return this.createError({ message: 'Unsupported format' });
        }
      }

      return true;
    }),
  assetKey: yup.string(),
  pointOfInterestTranslations: yup
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
