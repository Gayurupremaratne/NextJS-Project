import { DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import * as yup from 'yup';

const guidelineSchema = yup.object().shape({
  content: yup.string().required('Content is required'),
});

const metaSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .max(50, 'Title should should be less than 50 characters'),
  localeId: yup.string().required('Locale ID is required'),
  description: yup
    .string()
    .optional()
    .max(
      DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
});

export const schema = yup.object().shape({
  metaTranslations: yup.array().of(metaSchema),
  onboardingGuidelines: yup.array().of(guidelineSchema),
});
