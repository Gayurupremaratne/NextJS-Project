import { IMAGE_HEIGHT_IN_PX, IMAGE_WIDTH_IN_PX } from '@/constants/promotion';
import { imageWidthAndHeight } from '@/utils/validation';
import * as yup from 'yup';

const FILE_SIZE = 25 * 1024 * 1024; // 25mb
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];
const PROMOTION_DESCRIPTION_CHARACTER_LENGTH = 150;

const translationSchema = yup.object().shape({
  localeId: yup.string().optional(),
  title: yup.string().when('localeId', ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Title is required')
      : schema.optional();
  }),
  description: yup
    .string()
    .optional()
    .max(
      PROMOTION_DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${PROMOTION_DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),

  ctaText: yup.string().when(['title'], ([title], schema) => {
    return title && title.trim() !== ''
      ? schema.required('CTA Text is required')
      : schema;
  }),
});

export const schema = yup.object().shape({
  id: yup.string().trim().optional(),
  mediaKey: yup.string().optional(), // Assuming you have an mediaKey field
  image: yup
    .mixed()
    .test('fileValidation', 'File validation failed', async function (value) {
      const { mediaKey } = this.parent;

      // Only perform the validation if mediaKey is not available
      if (!mediaKey) {
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

        const imgDimensions = await imageWidthAndHeight(value);
        if (
          imgDimensions.width !== IMAGE_WIDTH_IN_PX ||
          imgDimensions.height !== IMAGE_HEIGHT_IN_PX
        ) {
          return this.createError({
            message: `The file should be ${IMAGE_WIDTH_IN_PX}px * ${IMAGE_HEIGHT_IN_PX}px`,
          });
        }
      }

      return true;
    }),
  promotionTranslations: yup
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
  url: yup.string().url('Enter correct url!').required('URL is required'),
});
