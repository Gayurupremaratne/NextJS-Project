import { DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import { APPLY_VALIDITY_PERIOD } from '@/types/notifications/notification.type';
import * as yup from 'yup';

const translationSchema = yup.object().shape({
  localeId: yup.string().optional(),
  title: yup.string().when('localeId', ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Title is required')
      : schema.optional();
  }),
  description: yup
    .string()
    .when(['title'], ([title], schema) => {
      return title && title.trim() !== ''
        ? schema.required('Description is required')
        : schema;
    })
    .max(
      DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
});

export const notificationValidation = yup.object().shape({
  category: yup.string().required('Please select a category'),
  deliveryGroup: yup
    .string()
    .test('Delivery group', 'Please select a delivery group', function (value) {
      const { category } = this.parent;
      if (category === 'Stage-wise') {
        if (!value) {
          return this.createError({
            message: 'Please select a delivery group',
          });
        }
      }
      return true;
    }),
  stageId: yup
    .string()
    .test('Stage', 'Please select a stage', function (value) {
      const { category } = this.parent;
      if (category === 'Stage-wise') {
        if (!value) {
          return this.createError({
            message: 'Please select a stage',
          });
        }
      }
      return true;
    }),
  type: yup.string().required('Please select a notification type'),
  isValidityPeriodDefined: yup
    .string()
    .test(
      'Validity period',
      'Please select a validity period',
      function (value) {
        const { category } = this.parent;
        if (category === 'General') {
          if (!value) {
            return this.createError({
              message: 'Please select a validity period',
            });
          }
        }
        return true;
      },
    ),
  startDate: yup
    .string()
    .test('Start date', 'Please select a date range', function (value) {
      const { isValidityPeriodDefined, category, endDate } = this.parent;
      if (
        (isValidityPeriodDefined === APPLY_VALIDITY_PERIOD[0] ||
          category === 'Stage-wise') &&
        (!value || !endDate)
      ) {
        return this.createError({
          message: 'Please select a date range',
        });
      }
      return true;
    }),
  endDate: yup
    .string()
    .test('End date', 'Please select a date range', function (value) {
      const { isValidityPeriodDefined, category, startDate } = this.parent;
      if (
        (isValidityPeriodDefined === APPLY_VALIDITY_PERIOD[0] ||
          category === 'Stage-wise') &&
        (!value || !startDate)
      ) {
        return this.createError({
          message: 'Please select a date range',
        });
      }
      return true;
    }),
  notificationTranslations: yup
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
