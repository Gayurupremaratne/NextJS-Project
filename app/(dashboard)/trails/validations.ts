import { STAGE_DESCRIPTION_CHARACTER_LENGTH } from '@/constants/form-description-character-length';
import {
  FAMILY_FRIENDLY_STATUS,
  LiteStageType,
  PEOPLE_INTERACTIONS,
  STAGE_DIFFICULTY_TYPES,
} from '@/types/stage/stage.type';
import _ from 'lodash';
import moment from 'moment';
import * as yup from 'yup';
const FILE_SIZE = 25 * 1024 * 1024; // 25mb
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];
const TIME_STRING_FORMAT = 'HH:mm';

export const trailsValidationSchema = yup.object({
  search: yup.string(),
});

const translationSchema = yup.object().shape({
  localeId: yup.string().optional(),
  stageHead: yup.string().when(['localeId'], ([localeId], schema) => {
    return localeId === 'en'
      ? schema.required('Stage head is required')
      : schema.optional();
  }),
  stageTail: yup.string().when(['stageHead'], ([stageHead], schema) => {
    return stageHead && stageHead.trim() !== ''
      ? schema.required('Stage tail is required')
      : schema;
  }),

  description: yup
    .string()
    .when(['stageHead'], ([stageHead], schema) => {
      return stageHead && stageHead.trim() !== ''
        ? schema.required('Stage description is required')
        : schema;
    })
    .max(
      STAGE_DESCRIPTION_CHARACTER_LENGTH,
      `Description must not exceed ${STAGE_DESCRIPTION_CHARACTER_LENGTH} characters`,
    ),
});

export const trailsFormValidationSchema = (
  stageId: string | undefined,
  liteStages: LiteStageType[],
  openTime: string,
  closeTime: string,
) => {
  return yup.object({
    number: yup
      .string()
      .trim()
      .matches(/^\d+$/, 'Stage number should be a valid whole number')
      .required('Number is required')
      .test(
        'greater-than-or-equal-to-one',
        'Stage number should be greater than 0',
        value => {
          const numericValue = parseInt(value, 10);
          return !isNaN(numericValue) && numericValue >= 1;
        },
      )
      .test(
        'unique number test',
        'This stage number was already used',
        value => {
          const alreadyExist = liteStages.find(
            lStage => lStage.number === parseInt(value),
          );
          if (!stageId && alreadyExist) {
            return false;
          }
          if (stageId) {
            if (alreadyExist && alreadyExist.id !== stageId) {
              return false;
            }
            return true;
          }
          return true;
        },
      ),
    difficultyType: yup
      .string()
      .oneOf(STAGE_DIFFICULTY_TYPES, 'Valid difficulty type is required')
      .required('Difficulty type is required'),
    regionIds: yup.array().min(1, 'At least one region is required').required(),
    distance: yup
      .number()
      .typeError('Distance should be a number')
      .required('Distance is required'),
    elevationGain: yup
      .number()
      .typeError('Elevation gain should be a number')
      .required('Elevation gain is required'),
    open: yup.boolean().required('Open status is required'),
    peopleInteraction: yup
      .string()
      .oneOf(PEOPLE_INTERACTIONS, 'Valid people interaction type is required')
      .required('People interaction is required'),
    familyFriendly: yup
      .string()
      .oneOf(FAMILY_FRIENDLY_STATUS, 'Valid family friendly type is required')
      .required('Family friendly type is required'),
    openTime: yup
      .string()
      .required('Open time is required')
      .test(
        'open time validation',
        'Open time should be less than close time',
        value => {
          const start = moment(value, TIME_STRING_FORMAT);
          const end = moment(closeTime, TIME_STRING_FORMAT);
          return moment(start).isBefore(end);
        },
      ),
    closeTime: yup
      .string()
      .required('Close time is required')
      .test(
        'close time validation',
        'Close time should be greater than open time',
        value => {
          const open = moment(openTime, TIME_STRING_FORMAT);
          const end = moment(value, TIME_STRING_FORMAT);
          return moment(end).isAfter(open);
        },
      ),
    estimatedDuration: yup.string().required('Duration time is required'),
    stageTranslation: yup
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
};

const imageSchema = yup.object().shape({
  mediaKey: yup.string(),
  image: yup
    .mixed()
    .test('fileValidation', 'File validation failed', function (value) {
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
      }
      return true;
    }),
});

export const StageAssetFormValidationSchema = yup.object().shape({
  primaryImage: imageSchema,
  supplementaryImages: yup.array().of(imageSchema).min(6),
  elevationImage: imageSchema,
});
