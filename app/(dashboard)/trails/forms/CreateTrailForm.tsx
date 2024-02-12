'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Heading,
  Input,
  InputContainer,
  Item,
  MultiSelect,
  SingleSelect,
  Tabs,
  Text,
} from '../../../../components/atomic';
import { Locale } from '@/types/locale/locale.type';
import { useGetLocales } from '@/hooks/locale/locale';
import { CreateTrailTranslationForm } from './CreateTrailTranslationForm';
import { FormActions } from '@/constants/form-actions';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
} from 'formik';
import {
  FAMILY_FRIENDLY_STATUS,
  PEOPLE_INTERACTIONS,
  Stage,
  STAGE_DIFFICULTY_TYPES,
  StageForm,
  StageRequest,
  Translation,
} from '@/types/stage/stage.type';
import { trailsFormValidationSchema } from '../validations';
import { capitalizeFirstLetter } from '@/utils/utils';
import { useGetRegions } from '@/hooks/region/region';
import { RegionTranslation } from '@/types/region/region.type';
import TimePicker from '@/components/time-picker/TimePicker';
import _ from 'lodash';
import {
  useCreateStage,
  useEditStage,
  useEditStageTranslation,
  useGetLiteStages,
  useStageRegion,
} from '@/hooks/stage/stage';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { AxiosResponse } from '@/types/common.type';

export interface Props {
  action: FormActions;
  setSlideOver?: (value: boolean) => void;
  initialData?: Stage;
  setFormDirty?: (value: boolean) => void;
}

const CreateTrailForm = ({
  action,
  setSlideOver,
  initialData,
  setFormDirty,
}: Props) => {
  const { data: localesData } = useGetLocales();
  const { data: regions } = useGetRegions();
  const { mutateAsync } = useCreateStage();
  const { mutateAsync: editStageTranslation } = useEditStageTranslation();
  const { mutateAsync: addStageRegion } = useStageRegion();
  const { mutateAsync: editStage } = useEditStage();
  const { data: liteStages } = useGetLiteStages();
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [openTime, setOpenTime] = useState('00:00');
  const [closeTime, setCloseTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [showError, setShowError] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const [selectedRegion, setSelectedRegion] = useState<Item[]>([]);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // ': api' ;data to state
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
  }, [localesData]);

  useEffect(() => {
    if (action === FormActions.EDIT && initialData?.regions) {
      const items: Item[] = [];
      initialData.regions.forEach(region => {
        if (region.localeId === 'en') {
          items.push({
            id: region.regionId,
            name: region.name,
          });
        }
      });
      setSelectedRegion(items);
    } else {
      setSelectedRegion([]);
    }
  }, [action, initialData?.regions]);

  const timeWithHoursAndMinutes = (time: string): string => {
    const splitTime = time.split(':');
    return `${splitTime[0]}:${splitTime[1]}`;
  };

  let durationHours = '00';
  let durationMinutes = '00';
  if (initialData?.estimatedDuration) {
    if (parseInt(initialData.estimatedDuration.hours) < 10) {
      durationHours = `0${initialData.estimatedDuration.hours}`;
    } else if (parseInt(initialData.estimatedDuration.hours) >= 10) {
      durationHours = initialData.estimatedDuration.hours;
    }
    if (parseInt(initialData.estimatedDuration.minutes) < 10) {
      durationMinutes = `0${initialData.estimatedDuration.minutes}`;
    } else if (parseInt(initialData.estimatedDuration.minutes) >= 10) {
      durationMinutes = initialData.estimatedDuration.minutes;
    }
  }

  useEffect(() => {
    if (action === FormActions.EDIT) {
      setOpenTime(timeWithHoursAndMinutes(initialData?.openTime ?? '00:00:00'));
      setCloseTime(
        timeWithHoursAndMinutes(initialData?.closeTime ?? '00:00:00'),
      );
      setDuration(`${durationHours}:${durationMinutes}`);
    }
  }, []);

  // Map locale array to tabs
  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));

  const setSlideOverByResponse = (
    results: (AxiosResponse<Translation> | undefined)[],
  ) => {
    if (results?.every(result => result?.status == 200)) {
      setSlideOver!(false);
    } else {
      setShowError(true);
    }
  };

  const handleSubmit = async (values: StageForm) => {
    setIsFormSubmitting(true);
    const filteredTranslations = values.stageTranslation.filter(value => {
      return !_.isEmpty(value?.stageHead);
    });

    values.stageTranslation = filteredTranslations;
    const hours = parseInt(values.estimatedDuration.split(':')[0]);
    const minutes = parseInt(values.estimatedDuration.split(':')[1]);

    const stageToCreate: StageRequest = {
      distance: parseFloat(values.distance),
      open: values.open as boolean,
      number: parseInt(values.number),
      estimatedDuration: {
        hours,
        minutes,
      },
      openTime: `${values.openTime}:00`,
      closeTime: `${values.closeTime}:00`,
      elevationGain: parseFloat(values.elevationGain),
      difficultyType:
        values.difficultyType as (typeof STAGE_DIFFICULTY_TYPES)[number],
      peopleInteraction:
        values.peopleInteraction as (typeof PEOPLE_INTERACTIONS)[number],
      familyFriendly:
        values.familyFriendly as (typeof FAMILY_FRIENDLY_STATUS)[number],
    };

    const translations = values?.stageTranslation;
    if (translations) {
      for (const translation of translations) {
        if (
          _.isEmpty(translation?.stageHead) &&
          _.isEmpty(translation?.stageTail) &&
          _.isEmpty(translation?.description) &&
          values.stageTranslation.length > 0 &&
          values.stageTranslation[language!.tabIndex]
        ) {
          delete values.stageTranslation[language!.tabIndex];
        }
      }
    }

    if (action === FormActions.ADD) {
      const response = await mutateAsync(stageToCreate);
      if (response?.status === 201) {
        // add translations
        const translationPromises = translations.map(translation =>
          editStageTranslation({
            ...translation,
            stageId: response.data.data.id,
          }),
        );

        //add regions
        await addStageRegion({
          id: response.data.data.id as string,
          regionIds: values.regionIds,
        });
        const results = await Promise.all(translationPromises);
        setSlideOverByResponse(results);
      } else {
        setShowError(true);
      }
    }
    if (action === FormActions.EDIT) {
      const response = await editStage({
        id: initialData?.id as string,
        payload: {
          ...stageToCreate,
          cumulativeReviews: initialData?.cumulativeReviews,
          reviewsCount: initialData?.reviewsCount,
        },
      });

      if (response?.status === 200) {
        const translationPromises = translations.map(translation =>
          editStageTranslation({
            ...translation,
            stageId: response.data.data.id,
          }),
        );

        //add regions
        await addStageRegion({
          id: initialData?.id as string,
          regionIds: values.regionIds,
        });
        const results = await Promise.all(translationPromises);
        setSlideOverByResponse(results);
      } else {
        setShowError(true);
      }
    }
    setIsFormSubmitting(false);
  };

  const getInitialData = () => {
    const stage: StageForm = {
      distance: '',
      open: null,
      number: '',
      estimatedDuration: '',
      openTime: '',
      closeTime: '',
      elevationGain: '',
      difficultyType: '',
      peopleInteraction: '',
      familyFriendly: '',
      regionIds: [],
      stageTranslation: [] as Translation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: Translation[] = [];

      locales.map(locale => {
        const translationData = initialData?.translations?.find(translation => {
          if (translation.localeId === locale.code) {
            return translation;
          }
        });

        if (translationData) {
          mapTranslation.push(translationData);
        } else {
          mapTranslation.push({
            localeId: locale.code,
            description: '',
            stageHead: '',
            stageTail: '',
          } as Translation);
        }
      });

      const stageToEdit: StageForm = {
        distance: initialData!.distance.toString(),
        open: initialData?.open ?? null,
        number: initialData!.number.toString(),
        estimatedDuration: `${durationHours}:${durationMinutes}`,
        openTime: timeWithHoursAndMinutes(initialData?.openTime ?? '00:00:00'),
        closeTime: timeWithHoursAndMinutes(
          initialData?.closeTime ?? '00:00:00',
        ),
        elevationGain: initialData!.elevationGain.toString(),
        difficultyType: initialData?.difficultyType ?? '',
        peopleInteraction: initialData?.peopleInteraction ?? '',
        familyFriendly: initialData?.familyFriendly ?? '',
        regionIds: selectedRegion?.map(obj => Number(obj.id)),
        stageTranslation: mapTranslation,
      };

      return stageToEdit;
    }
    return stage;
  };

  const handleRegionChange = (
    selectedItems: Item[],
    formikData: FormikProps<StageForm>,
  ) => {
    const newStages = selectedItems.map(selectedItem => selectedItem.id);
    formikData.setFieldValue('regionIds', newStages);
  };

  const getPeopleInteractions = () => {
    const data: Item[] = [];
    PEOPLE_INTERACTIONS.forEach((peopleInteraction, index) => {
      data.push({
        id: index,
        name: capitalizeFirstLetter(peopleInteraction),
      });
    });
    return data;
  };

  const getFamilyFriendly = () => {
    const data: Item[] = [];
    FAMILY_FRIENDLY_STATUS.forEach((familyFriendly, index) => {
      data.push({
        id: index,
        name: capitalizeFirstLetter(familyFriendly),
      });
    });
    return data;
  };

  const getStageDifficulty = () => {
    const data: Item[] = [];
    STAGE_DIFFICULTY_TYPES.forEach((stageDifficulty, index) => {
      data.push({
        id: index,
        name: capitalizeFirstLetter(stageDifficulty),
      });
    });
    return data;
  };

  const getRegions = () => {
    const data: Item[] = [];

    const getRegionName = (regionTranslation: RegionTranslation[]): string => {
      const englishRegionTranslation = regionTranslation.find(
        rt => rt.localeId === 'en',
      );

      return englishRegionTranslation?.name ?? '';
    };

    regions?.forEach(region => {
      data.push({
        id: region?.id,
        name: getRegionName(region?.regionTranslation),
      });
    });
    return data;
  };

  const getInitialStatus = () => {
    if (action === FormActions.EDIT) {
      return {
        id: initialData?.open ? 1 : 2,
        name: initialData?.open ? 'Open' : 'Close',
      } as Item;
    }
    return undefined;
  };

  const getInitialStageDifficulty = () => {
    if (action === FormActions.EDIT) {
      return {
        id: STAGE_DIFFICULTY_TYPES.indexOf(
          initialData?.difficultyType ?? 'BEGINNER',
        ),
        name: capitalizeFirstLetter(
          STAGE_DIFFICULTY_TYPES[
            STAGE_DIFFICULTY_TYPES.indexOf(
              initialData?.difficultyType ?? 'BEGINNER',
            )
          ],
        ),
      } as Item;
    }
    return undefined;
  };

  const getInitialPeopleInteraction = () => {
    if (action === FormActions.EDIT) {
      return {
        id: PEOPLE_INTERACTIONS.indexOf(
          initialData?.peopleInteraction ?? 'LOW',
        ),
        name: capitalizeFirstLetter(
          PEOPLE_INTERACTIONS[
            PEOPLE_INTERACTIONS.indexOf(initialData?.peopleInteraction ?? 'LOW')
          ],
        ),
      } as Item;
    }
    return undefined;
  };

  const getInitialFamilyFriendly = () => {
    if (action === FormActions.EDIT) {
      return {
        id: FAMILY_FRIENDLY_STATUS.indexOf(
          initialData?.familyFriendly ?? 'YES',
        ),
        name: capitalizeFirstLetter(
          FAMILY_FRIENDLY_STATUS[
            FAMILY_FRIENDLY_STATUS.indexOf(initialData?.familyFriendly ?? 'YES')
          ],
        ),
      } as Item;
    }
    return undefined;
  };

  const handleReset = (formikData: FormikProps<StageForm>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  const getHourValue = (time: string): Item => {
    const hoursDropdown = Array.from({ length: 24 }, (j, i) => ({
      id: i,
      name: i.toString().padStart(2, '0'),
    }));
    const hour = time.split(':')[0];

    if (action === FormActions.ADD) {
      return {
        id: 0,
        name: '00',
      };
    }
    return {
      id: hoursDropdown.findIndex(item => item.name === hour),
      name: hour,
    };
  };

  const getMinuteValue = (time: string): Item => {
    const minutesDropdown = Array.from({ length: 60 }, (j, i) => ({
      id: i,
      name: i.toString().padStart(2, '0'),
    }));
    const hour = time.split(':')[1];
    if (action === FormActions.ADD) {
      return {
        id: 0,
        name: '00',
      };
    }
    return {
      id: minutesDropdown.findIndex(item => item.name === hour),
      name: hour,
    };
  };

  const scrollToTop = (errors: FormikErrors<StageForm>) => {
    if (Object.keys(errors).length > 0 && formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const setFormDirtyValue = (dirty: boolean) => {
    if (setFormDirty) {
      setFormDirty(dirty);
    }
  };

  return (
    <>
      {!_.isEmpty(localesData) && !_.isEmpty(regions) && (
        <div key={key} ref={formTopRef}>
          <Snackbar
            intent="error"
            show={showError}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              handleSubmit(values as StageForm);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={trailsFormValidationSchema(
              initialData?.id,
              liteStages ?? [],
              openTime,
              closeTime,
            )}
          >
            {formikProps => {
              setFormDirtyValue(formikProps.dirty);
              scrollToTop(formikProps.errors);
              return (
                <Form
                  onSubmit={e => {
                    e.preventDefault();

                    formikProps.handleSubmit(e);
                  }}
                >
                  <FieldArray name="stageTranslation">
                    {({ replace, remove }: FieldArrayRenderProps) => (
                      <div>
                        {formikProps.dirty && action === FormActions.EDIT && (
                          <Text className="my-2" intent={'red'} size="xs">
                            You have unsaved changes. Please save them to
                            continue.
                          </Text>
                        )}
                        <div className="mb-10">
                          <Text
                            className="mb-6 tracking-wide"
                            intent={'forestGreenTintTwo'}
                            size="xs"
                            weight="bold"
                          >
                            TRAIL INFORMATION
                          </Text>
                          <div className="grid md:grid-cols-3 gap-x-5 gap-y-[22px] mr-32 lg:w-5/6 w-full">
                            <div>
                              <Text className="mb-2" size="md">
                                Stage number{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <InputContainer
                                error={
                                  formikProps.errors.number &&
                                  formikProps.touched.number
                                    ? [formikProps.errors.number]
                                    : undefined
                                }
                              >
                                <Input
                                  name="number"
                                  onBlur={formikProps.handleBlur}
                                  onChange={formikProps.handleChange}
                                  placeholder="Enter stage number"
                                  value={formikProps.values.number}
                                />
                              </InputContainer>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Stage difficulty{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <SingleSelect
                                initialSelected={getInitialStageDifficulty()}
                                items={getStageDifficulty()}
                                placeholderText="Easy"
                                tabIndex={e => {
                                  formikProps.setFieldValue(
                                    'difficultyType',
                                    STAGE_DIFFICULTY_TYPES[e as number],
                                  );
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.difficultyType &&
                                  formikProps.touched.difficultyType &&
                                  formikProps.errors.difficultyType}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Region{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <MultiSelect
                                initialSelected={selectedRegion}
                                items={getRegions() ?? []}
                                onSelectedItemsChange={selectedItems => {
                                  handleRegionChange(
                                    selectedItems,
                                    formikProps as FormikProps<StageForm>,
                                  );
                                }}
                                placeholder="Select region"
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.regionIds &&
                                  formikProps.touched.regionIds &&
                                  formikProps.errors.regionIds}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Distance{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <InputContainer
                                error={
                                  formikProps.errors.distance &&
                                  formikProps.touched.distance
                                    ? [formikProps.errors.distance]
                                    : undefined
                                }
                              >
                                <div className="flex items-center justify-start">
                                  <Input
                                    className="w-20"
                                    name="distance"
                                    onBlur={formikProps.handleBlur}
                                    onChange={formikProps.handleChange}
                                    placeholder="00"
                                    value={formikProps.values.distance}
                                  />
                                  <span className="w-full">km</span>
                                </div>
                              </InputContainer>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Elevation gain{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <InputContainer
                                error={
                                  formikProps.errors.elevationGain &&
                                  formikProps.touched.elevationGain
                                    ? [formikProps.errors.elevationGain]
                                    : undefined
                                }
                              >
                                <div className="flex items-center justify-start">
                                  <Input
                                    className="w-20"
                                    name="elevationGain"
                                    onBlur={formikProps.handleBlur}
                                    onChange={formikProps.handleChange}
                                    placeholder="00"
                                    value={formikProps.values.elevationGain}
                                  />
                                  <span>m</span>
                                </div>
                              </InputContainer>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Stage status{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <SingleSelect
                                initialSelected={getInitialStatus()}
                                items={[
                                  { name: 'Open', id: 1 },
                                  { name: 'Close', id: 2 },
                                ]}
                                placeholderText="Select status"
                                tabIndex={e => {
                                  formikProps.setFieldValue('open', e === 1);
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.open &&
                                  formikProps.touched.open &&
                                  formikProps.errors.open}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Trail opens at{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <TimePicker
                                initialHourValue={getHourValue(
                                  formikProps?.values?.openTime,
                                )}
                                initialMinuteValue={getMinuteValue(
                                  formikProps?.values?.openTime,
                                )}
                                onHoursSelect={h => {
                                  const minutes = openTime.split(':')[1];
                                  const oTime = `${h.name}:${minutes}`;
                                  formikProps.setFieldValue('openTime', oTime);

                                  setOpenTime(oTime);
                                }}
                                onMinutesSelect={m => {
                                  const hours = openTime.split(':')[0];
                                  const oTime = `${hours}:${m.name}`;
                                  formikProps.setFieldValue('openTime', oTime);
                                  setOpenTime(oTime);
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.openTime &&
                                  formikProps.touched.openTime &&
                                  formikProps.errors.openTime}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Trail closes at{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <TimePicker
                                initialHourValue={getHourValue(
                                  formikProps?.values?.closeTime,
                                )}
                                initialMinuteValue={getMinuteValue(
                                  formikProps?.values?.closeTime,
                                )}
                                onHoursSelect={h => {
                                  const minutes = closeTime.split(':')[1];
                                  const cTime = `${h.name}:${minutes}`;
                                  formikProps.setFieldValue('closeTime', cTime);
                                  setCloseTime(cTime);
                                }}
                                onMinutesSelect={m => {
                                  const hours = closeTime.split(':')[0];
                                  const cTime = `${hours}:${m.name}`;
                                  formikProps.setFieldValue(
                                    'closeTime',
                                    `${hours}:${m.name}`,
                                  );
                                  setCloseTime(cTime);
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.closeTime &&
                                  formikProps.touched.closeTime &&
                                  formikProps.errors.closeTime}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Estimated time{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <TimePicker
                                initialHourValue={getHourValue(
                                  `${formikProps?.values?.estimatedDuration.split(
                                    ':',
                                  )[0]}:${formikProps?.values?.estimatedDuration.split(
                                    ':',
                                  )[1]}`,
                                )}
                                initialMinuteValue={getMinuteValue(
                                  `${formikProps?.values?.estimatedDuration.split(
                                    ':',
                                  )[0]}:${formikProps?.values?.estimatedDuration.split(
                                    ':',
                                  )[1]}`,
                                )}
                                onHoursSelect={h => {
                                  const minutes = duration.split(':')[1];
                                  const d = `${h.name}:${minutes}`;
                                  formikProps.setFieldValue(
                                    'estimatedDuration',
                                    d === '00:00' ? '' : d,
                                  );
                                  setDuration(d);
                                }}
                                onMinutesSelect={m => {
                                  const hours = duration.split(':')[0];
                                  const d = `${hours}:${m.name}`;
                                  formikProps.setFieldValue(
                                    'estimatedDuration',
                                    d === '00:00' ? '' : d,
                                  );
                                  setDuration(d);
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.estimatedDuration &&
                                  formikProps.touched.estimatedDuration &&
                                  formikProps.errors.estimatedDuration}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                People interaction{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <SingleSelect
                                initialSelected={getInitialPeopleInteraction()}
                                items={getPeopleInteractions()}
                                placeholderText="High"
                                tabIndex={e => {
                                  formikProps.setFieldValue(
                                    'peopleInteraction',
                                    PEOPLE_INTERACTIONS[e as number],
                                  );
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.peopleInteraction &&
                                  formikProps.touched.peopleInteraction &&
                                  formikProps.errors.peopleInteraction}
                              </Text>
                            </div>
                            <div>
                              <Text className="mb-2" size="md">
                                Family friendly{/* */}
                                <span className="text-red">*</span>
                              </Text>
                              <SingleSelect
                                initialSelected={getInitialFamilyFriendly()}
                                items={getFamilyFriendly()}
                                placeholderText="Yes"
                                tabIndex={e => {
                                  formikProps.setFieldValue(
                                    'familyFriendly',
                                    FAMILY_FRIENDLY_STATUS[e as number],
                                  );
                                }}
                              />
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.familyFriendly &&
                                  formikProps.touched.familyFriendly &&
                                  formikProps.errors.familyFriendly}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed my-8" />
                        {localesData && (
                          <div className="flex flex-col">
                            <div className="flex gap-3 mb-5">
                              <Heading intent={'h4'}>Translations</Heading>
                              <Text
                                className="flex items-center justify-center text-tints-battleship-grey-tint-2 gap-3"
                                size={'md'}
                                weight={'medium'}
                              >
                                (Changes will be saved automatically)
                              </Text>
                            </div>
                            <Tabs
                              formikProps={
                                formikProps.errors.stageTranslation as []
                              }
                              intent="Secondary"
                              tabData={tabData}
                              tabIndex={e => {
                                setLanguage({
                                  language: localesData[e].code,
                                  tabIndex: e,
                                });
                              }}
                            />
                            {language?.language && (
                              <CreateTrailTranslationForm
                                action={action}
                                formikProps={
                                  formikProps as FormikProps<StageForm>
                                }
                                remove={remove}
                                replace={replace}
                                selectedLanguage={language}
                              />
                            )}
                          </div>
                        )}
                        <div className="flex justify-end mt-8">
                          <div className="flex justify-end gap-6 mb-10">
                            {action === FormActions.ADD && (
                              <CustomCan
                                a={Subject.Trail}
                                I={UserActions.Create}
                              >
                                <Button
                                  intent={'secondary'}
                                  onClick={() =>
                                    handleReset(
                                      formikProps as FormikProps<StageForm>,
                                    )
                                  }
                                  size={'md'}
                                  type="reset"
                                >
                                  <span className="m-auto">Reset</span>
                                </Button>
                                <Button
                                  disabled={isFormSubmitting}
                                  loading={isFormSubmitting}
                                  size={'md'}
                                  type="submit"
                                >
                                  <span className="m-auto">Save changes</span>
                                </Button>
                              </CustomCan>
                            )}
                            {action === FormActions.EDIT && (
                              <CustomCan
                                a={Subject.Trail}
                                I={UserActions.Update}
                              >
                                <Button
                                  disabled={isFormSubmitting}
                                  loading={isFormSubmitting}
                                  size={'md'}
                                  type="submit"
                                >
                                  <span className="m-auto">Save changes</span>
                                </Button>
                              </CustomCan>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
    </>
  );
};

export default CreateTrailForm;
