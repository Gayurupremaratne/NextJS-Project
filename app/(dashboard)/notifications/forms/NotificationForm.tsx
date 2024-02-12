import {
  Button,
  Heading,
  Item,
  RadioButton,
  SingleSelect,
  Tabs,
  Text,
} from '@/components/atomic';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { FormActions } from '@/constants/form-actions';
import { useGetLocales } from '@/hooks/locale/locale';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { StageLite } from '@/types/stage/stage.type';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Locale } from '@/types/locale/locale.type';
import {
  APPLY_VALIDITY_PERIOD,
  DELIVERY_GROUP,
  NOTICE_TYPE,
  Notification,
  NotificationPayload,
  NotificationTranslation,
} from '@/types/notifications/notification.type';
import { DateValueType } from '@/components/atomic/DateRange/types';
import { DateRange } from '@/components/atomic/DateRange';
import { capitalizeFirstLetter } from '@/utils/utils';
import { TranslationForm } from './TranslationForm';
import { notificationValidation } from './NotificationFormValidation';
import { formatDate } from '@/components/atomic/DateRange/helpers/DateFormatter';
import { NOTIFICATION_VALIDITY_PERIOD } from '@/constants/notification-validity-period';
import {
  useCreateNotification,
  useEditNotification,
} from '@/hooks/notifications/notification';

export interface NotificationFormProps {
  action: FormActions;
  initialData?: NotificationPayload;
  setSlideOver?: (value: boolean) => void;
}

export const NotificationForm = ({
  action,
  initialData,
  setSlideOver,
}: NotificationFormProps) => {
  const { data: stagesData } = useGetLiteStages();
  const { data: localesData } = useGetLocales();
  const createNotification = useCreateNotification();
  const editNotification = useEditNotification(initialData?.id as string);

  const [locales, setLocales] = useState<Locale[]>([]);
  const [stages, setStages] = useState<StageLite[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [viewStageWise, setViewStageWise] = useState<boolean>();
  const [viewGeneral, setViewGeneral] = useState<boolean>();
  const [key, setKey] = useState<number>(0);

  const [pushNotification, setPushNotification] = useState<boolean>(false);
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [bothNotification, setBothNotification] = useState<boolean>(false);

  const [date, setDate] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });

  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);

  const categoryTypes = [
    {
      id: 0,
      name: 'General',
    },
    {
      id: 1,
      name: 'Stage-wise',
    },
  ];

  const userCategoryTypes = [
    {
      id: 0,
      name: 'Whole list',
    },
    {
      id: 1,
      name: 'Selected valid duration',
    },
  ];

  // Set api data to state locales and stages
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }

    if (stagesData && stagesData.length > 0) {
      setStages(stagesData);
    }
  }, [localesData, stagesData]);

  useEffect(() => {
    if (
      !_.isNil(initialData?.category) ||
      initialData?.isValidityPeriodDefined !== APPLY_VALIDITY_PERIOD[1]
    ) {
      setDate({
        startDate: initialData?.startDate.toString() ?? '',
        endDate: initialData?.endDate.toString() ?? '',
      });
    }
    if (initialData?.type === NOTICE_TYPE[0]) {
      setPushNotification(true);
    } else if (initialData?.type === NOTICE_TYPE[1]) {
      setEmailNotification(true);
    }
  }, [initialData]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));

  const currentDatePlusOneYear = () => {
    const currentDate = new Date();
    currentDate.setFullYear(
      currentDate.getFullYear() + NOTIFICATION_VALIDITY_PERIOD,
    );
    return formatDate(currentDate.toString());
  };

  const getInitialCategory = () => {
    if (action === FormActions.EDIT) {
      return !_.isNil(initialData?.category)
        ? categoryTypes[1]
        : categoryTypes[0];
    }
    return undefined;
  };

  const getStage = () => {
    const mappedStages = stages.map((data: StageLite) => {
      return {
        id: data.id,
        name: `Stage ${data.number.toString()}`,
      };
    });

    return mappedStages;
  };

  const getInitialStage = () => {
    if (action === FormActions.EDIT) {
      if (!_.isNil(initialData?.category)) {
        return {
          id: initialData?.category,
          name: `Stage ${initialData?.stage?.number}`,
        } as Item;
      }
    }
    return undefined;
  };

  const getInitialData = () => {
    const initialValues = {
      category: '',
      deliveryGroup: '',
      type: '',
      isValidityPeriodDefined: '',
      stageId: '',
      startDate: '',
      endDate: '',
      notificationTranslations: [] as NotificationTranslation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: NotificationTranslation[] = [];

      locales.forEach(locale => {
        const translationData = initialData?.noticeTranslation?.find(
          translation => {
            if (translation.localeId === locale.code) {
              return translation;
            }
          },
        );

        if (translationData) {
          mapTranslation.push(translationData);
        } else {
          mapTranslation.push({
            localeId: locale.code,
            title: '',
            description: '',
            noticeId: initialData?.id,
          } as NotificationTranslation);
        }
      });

      return {
        category: _.isNil(initialData?.category)
          ? categoryTypes[0].name
          : initialData?.category,
        deliveryGroup: initialData?.deliveryGroup,
        stageId: _.isNil(initialData?.category) ? '' : initialData?.category,
        type: initialData?.type,
        isValidityPeriodDefined: initialData?.isValidityPeriodDefined,
        startDate: initialData?.startDate,
        endDate: initialData?.endDate,
        notificationTranslations: mapTranslation,
      };
    }

    return initialValues;
  };

  const getApplyValidityPeriod = () => {
    const data: Item[] = [];
    APPLY_VALIDITY_PERIOD.forEach((applyValidityPeriod, index) => {
      data.push({
        id: index,
        name: capitalizeFirstLetter(applyValidityPeriod),
      });
    });
    return data;
  };

  const getInitialApplyValidityPeriod = () => {
    if (action === FormActions.EDIT) {
      return {
        id: APPLY_VALIDITY_PERIOD.indexOf(
          initialData?.isValidityPeriodDefined ?? 'YES',
        ),
        name: capitalizeFirstLetter(
          initialData?.isValidityPeriodDefined ?? 'YES',
        ),
      } as Item;
    }
    return undefined;
  };

  const getInitialUserCategory = () => {
    if (action === FormActions.EDIT) {
      return initialData?.deliveryGroup === DELIVERY_GROUP[0]
        ? userCategoryTypes[0]
        : userCategoryTypes[1];
    }
    return undefined;
  };

  const handleCatergoryChange = (
    e: number,
    formikData: FormikProps<Notification>,
  ) => {
    if (e === 0) {
      formikData.setFieldValue('category', categoryTypes[0].name);
      setViewStageWise(false);
      setViewGeneral(true);
    } else {
      formikData.setFieldValue('category', categoryTypes[1].name);
      setViewStageWise(true);
      setViewGeneral(false);
    }
    setDate(null);
    formikData.setFieldValue('startDate', '');
    formikData.setFieldValue('endDate', '');
  };

  const handleDateChange = (
    value: DateValueType,
    formikData: FormikProps<Notification>,
  ) => {
    formikData.setFieldValue(
      'startDate',
      value?.startDate === null ? '' : value?.startDate,
    );
    formikData.setFieldValue(
      'endDate',
      value?.endDate === null ? '' : value?.endDate,
    );
  };

  const handleReset = (formikData: FormikProps<Notification>) => {
    formikData.resetForm();
    setDate({
      startDate: '',
      endDate: '',
    });
    setPushNotification(false);
    setEmailNotification(false);
    setBothNotification(false);
    setKey(key + 1);
  };

  const handleCreateNotification = async (values: Notification) => {
    return createNotification.mutateAsync({
      category: values.stageId === '' ? null : values.stageId,
      type: values.type,
      deliveryGroup:
        values.stageId === '' ||
        values.deliveryGroup === userCategoryTypes[0].name
          ? DELIVERY_GROUP[0]
          : DELIVERY_GROUP[1],
      isValidityPeriodDefined:
        values.stageId === ''
          ? values.isValidityPeriodDefined
          : APPLY_VALIDITY_PERIOD[0],
      startDate: values.startDate,
      endDate: values.endDate,
      noticeTranslation: values.notificationTranslations,
    });
  };

  const handleEditNotification = async (values: Notification) => {
    const response = await editNotification.mutateAsync({
      category:
        values.category === categoryTypes[0].name ? null : values.stageId,
      deliveryGroup:
        values.category === categoryTypes[0].name ||
        values.deliveryGroup === userCategoryTypes[0].name
          ? DELIVERY_GROUP[0]
          : DELIVERY_GROUP[1],
      isValidityPeriodDefined:
        values.category === categoryTypes[0].name
          ? values.isValidityPeriodDefined
          : APPLY_VALIDITY_PERIOD[0],
      startDate: values.startDate,
      endDate: values.endDate,
      noticeTranslation: values.notificationTranslations,
    });

    if (response?.statusCode === 200) {
      setSlideOver!(false);
    } else {
      setShowError(true);
    }
  };

  const handleSubmit = async (values: Notification) => {
    const translations = values.notificationTranslations.filter(value => {
      return !_.isEmpty(value?.title);
    });

    values.notificationTranslations = translations;

    if (translations && language) {
      for (const translation of translations) {
        if (
          _.isEmpty(translation?.title) &&
          _.isEmpty(translation?.description) &&
          values.notificationTranslations.length > 0 &&
          values.notificationTranslations[language.tabIndex]
        ) {
          values.notificationTranslations.splice(language.tabIndex, 1);
        }
      }
    }

    if (action === FormActions.ADD) {
      const response = await handleCreateNotification(values);
      if (response?.status === 201) {
        setSlideOver!(false);
      } else {
        setShowError(true);
      }
    }

    if (action === FormActions.EDIT) {
      await handleEditNotification(values);
    }
  };

  return (
    <>
      {!_.isEmpty(stagesData) && !_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={showError}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as Notification);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={notificationValidation}
          >
            {formikProps => (
              <Form
                onChange={() => {}}
                onSubmit={e => {
                  e.preventDefault();
                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="notificationTranslations">
                  {({ replace }: FieldArrayRenderProps) => (
                    <div className="flex flex-col gap-5	mb-6">
                      <div className="flex flex-col w-full">
                        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-x-5 md:gap-x-3 lg:mr-32 md:gap-y-0 gap-y-3">
                          <div className="flex flex-col gap-2">
                            <Text
                              className="after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                              weight={'normal'}
                            >
                              Category
                            </Text>
                            <div className="w-full mt-2">
                              <SingleSelect
                                initialSelected={getInitialCategory()}
                                items={categoryTypes}
                                placeholderText="Select category"
                                tabIndex={e => {
                                  handleCatergoryChange(
                                    e as number,
                                    formikProps as FormikProps<Notification>,
                                  );
                                }}
                              />
                            </div>
                            <Text
                              className="mt-1 mb-1"
                              intent={'red'}
                              size="xs"
                            >
                              {formikProps.errors.category &&
                                formikProps.touched.category &&
                                formikProps.errors.category}
                            </Text>
                          </div>
                          {viewStageWise && (
                            <>
                              <div className="flex flex-col gap-2">
                                <Text
                                  className="after:content-['*'] after:ml-0.5 after:text-red"
                                  size={'md'}
                                  weight={'normal'}
                                >
                                  Stage
                                </Text>
                                <div className="w-full mt-2">
                                  <SingleSelect
                                    initialSelected={getInitialStage()}
                                    items={getStage()}
                                    placeholderText="Select stage"
                                    tabIndex={e => {
                                      formikProps.setFieldValue('stageId', e);
                                    }}
                                  />
                                </div>
                                <Text
                                  className="mt-1 mb-2"
                                  intent={'red'}
                                  size="xs"
                                >
                                  {formikProps.errors.stageId &&
                                    formikProps.touched.stageId &&
                                    formikProps.errors.stageId}
                                </Text>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Text
                                  className="after:content-['*'] after:ml-0.5 after:text-red"
                                  size={'md'}
                                  weight={'normal'}
                                >
                                  Valid until
                                </Text>
                                <div className="w-full mt-2">
                                  <DateRange
                                    displayFormat="DD-MM-YYYY"
                                    inputClassName={
                                      'py-2 pl-4 pr-14 border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none rounded-[5px] placeholder-text-shades-battleship-grey-shade-1 disabled:cursor-not-allowed w-full'
                                    }
                                    minDate={new Date()}
                                    onChange={value => {
                                      setDate(value);
                                      handleDateChange(
                                        value,
                                        formikProps as FormikProps<Notification>,
                                      );
                                    }}
                                    placeholder="Select date range"
                                    readOnly
                                    showFooter={false}
                                    showShortcuts={false}
                                    useRange={false}
                                    value={date}
                                  />
                                </div>
                                <Text
                                  className="mt-1 mb-2"
                                  intent={'red'}
                                  size="xs"
                                >
                                  {formikProps.errors.startDate &&
                                    formikProps.errors.endDate}
                                </Text>
                              </div>
                            </>
                          )}
                          {viewGeneral && (
                            <>
                              <div className="flex flex-col gap-2">
                                <Text
                                  className="after:content-['*'] after:ml-0.5 after:text-red"
                                  size={'md'}
                                  weight={'normal'}
                                >
                                  Apply validity period
                                </Text>
                                <div className="w-full mt-2">
                                  <SingleSelect
                                    initialSelected={getInitialApplyValidityPeriod()}
                                    items={getApplyValidityPeriod()}
                                    placeholderText="Yes"
                                    tabIndex={e => {
                                      formikProps.setFieldValue(
                                        'isValidityPeriodDefined',
                                        APPLY_VALIDITY_PERIOD[e as number],
                                      );
                                      if (
                                        APPLY_VALIDITY_PERIOD[
                                          e as number
                                        ].includes('NO')
                                      ) {
                                        setDate(null);
                                        formikProps.setFieldValue(
                                          'startDate',
                                          formatDate(new Date().toString()),
                                        );
                                        formikProps.setFieldValue(
                                          'endDate',
                                          currentDatePlusOneYear(),
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <Text
                                  className="mt-1 mb-1"
                                  intent={'red'}
                                  size="xs"
                                >
                                  {formikProps.errors.isValidityPeriodDefined &&
                                    formikProps.touched
                                      .isValidityPeriodDefined &&
                                    formikProps.errors.isValidityPeriodDefined}
                                </Text>
                              </div>
                              {formikProps.values.isValidityPeriodDefined ===
                                APPLY_VALIDITY_PERIOD[0] && (
                                <div className="flex flex-col gap-2">
                                  <Text
                                    className="after:content-['*'] after:ml-0.5 after:text-red"
                                    size={'md'}
                                    weight={'normal'}
                                  >
                                    Valid duration
                                  </Text>
                                  <div className="w-full mt-2">
                                    <DateRange
                                      displayFormat="DD-MM-YYYY"
                                      inputClassName={
                                        'py-2 pl-4 pr-14 border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none rounded-[5px] placeholder-text-shades-battleship-grey-shade-1 disabled:cursor-not-allowed w-full'
                                      }
                                      minDate={new Date()}
                                      onChange={value => {
                                        setDate(value);
                                        handleDateChange(
                                          value,
                                          formikProps as FormikProps<Notification>,
                                        );
                                      }}
                                      placeholder="Select date range"
                                      readOnly
                                      showFooter={false}
                                      showShortcuts={false}
                                      useRange={false}
                                      value={date}
                                    />
                                  </div>
                                  <Text
                                    className="mt-1 mb-1"
                                    intent={'red'}
                                    size="xs"
                                  >
                                    {formikProps.errors.startDate &&
                                      formikProps.errors.endDate}
                                  </Text>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-x-5 md:gap-x-3 lg:mr-32 md:gap-y-0 gap-y-3">
                          <div className="flex flex-col gap-2">
                            <div className="w-full mt-2">
                              <RadioButton
                                checked={pushNotification}
                                className={'font-medium'}
                                disabled={action === FormActions.EDIT}
                                label={'Push notification'}
                                onChange={() => {
                                  setPushNotification(true);
                                  setEmailNotification(false);
                                  setBothNotification(false);
                                  formikProps.setFieldValue(
                                    'type',
                                    NOTICE_TYPE[0],
                                  );
                                }}
                              />
                            </div>
                            <div className="w-full mt-2">
                              <RadioButton
                                checked={emailNotification}
                                className={'font-medium'}
                                disabled={action === FormActions.EDIT}
                                label={'Email notification'}
                                onChange={() => {
                                  setEmailNotification(true);
                                  setPushNotification(false);
                                  setBothNotification(false);
                                  formikProps.setFieldValue(
                                    'type',
                                    NOTICE_TYPE[1],
                                  );
                                }}
                              />
                            </div>
                            <div className="w-full mt-2">
                              <RadioButton
                                checked={bothNotification}
                                className={'font-medium'}
                                disabled={action === FormActions.EDIT}
                                label={'Both'}
                                onChange={() => {
                                  setBothNotification(true);
                                  setPushNotification(false);
                                  setEmailNotification(false);
                                  formikProps.setFieldValue(
                                    'type',
                                    NOTICE_TYPE[2],
                                  );
                                }}
                              />
                            </div>
                            <Text className="mt-1" intent={'red'} size="xs">
                              {formikProps.errors.type &&
                                formikProps.touched.type &&
                                formikProps.errors.type}
                            </Text>
                          </div>
                          {viewStageWise && (
                            <div className="flex flex-col gap-2">
                              <Text
                                className="after:content-['*'] after:ml-0.5 after:text-red"
                                size={'md'}
                                weight={'normal'}
                              >
                                User category
                              </Text>
                              <div className="w-full mt-2">
                                <SingleSelect
                                  initialSelected={getInitialUserCategory()}
                                  items={userCategoryTypes}
                                  placeholderText="Select category"
                                  tabIndex={e => {
                                    formikProps.setFieldValue(
                                      'deliveryGroup',
                                      userCategoryTypes[e as number].name,
                                    );
                                  }}
                                />
                              </div>
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.deliveryGroup &&
                                  formikProps.touched.deliveryGroup &&
                                  formikProps.errors.deliveryGroup}
                              </Text>
                            </div>
                          )}
                        </div>
                        <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed mt-8" />
                        {localesData && (
                          <div className="flex flex-col gap-3 w-full mt-10">
                            <div className="w-full flex-col">
                              <div className="flex-col gap-6">
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
                              </div>
                              <div className="">
                                <div className="w-full">
                                  <Tabs
                                    formikProps={
                                      formikProps.errors
                                        .notificationTranslations as []
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
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {language?.language && (
                          <TranslationForm
                            action={action}
                            formikProps={
                              formikProps as FormikProps<Notification>
                            }
                            replace={replace}
                            selectedLanguage={language}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className="flex justify-end mt-10 mb-10 gap-6">
                            <Button
                              intent={'secondary'}
                              onClick={() =>
                                handleReset(
                                  formikProps as FormikProps<Notification>,
                                )
                              }
                              type="reset"
                            >
                              Reset
                            </Button>

                            <Button
                              disabled={createNotification.isLoading}
                              loading={createNotification.isLoading}
                              type="submit"
                            >
                              Create notification
                            </Button>
                          </div>
                        )}
                        {action === FormActions.EDIT && (
                          <div className="flex justify-end mt-10 mb-10 gap-6">
                            <Button
                              disabled={createNotification.isLoading}
                              loading={createNotification.isLoading}
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
