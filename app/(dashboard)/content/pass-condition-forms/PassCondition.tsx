'use client';

import { Button, Tabs, Text } from '@/components/atomic';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { useGetLocales } from '@/hooks/locale/locale';
import {
  useGetPassConditions,
  useUpdateMetaPassConditions as useUpsertMetaPassConditions,
  useUpsertPassConditionTranslation,
} from '@/hooks/passConditions/passConditions';
import usePassConditionStore from '@/store/passConditions/usePassConditionStore';
import { Locale } from '@/types/locale/locale.type';
import {
  PassCondition,
  PassConditionMeta,
  PassConditionTranslation,
} from '@/types/pass-conditions/pass-condition.type';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { schema } from './PassConditionFormValidation';
import { TranslationForm } from './TranslationForms';

export interface Props {
  initialData?: PassCondition;
  setSlideOver?: (value: boolean) => void;
}

export const PassConditionForm = ({ initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const upsertPassConditionTranslation = useUpsertPassConditionTranslation();
  const upsertMetaPassCondition = useUpsertMetaPassConditions();
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [showError, setShowError] = useState<boolean>();

  const { data } = useGetPassConditions();
  const setPassConditionData = usePassConditionStore(state => state.setData);

  //set data to passcondition store
  useEffect(() => {
    if (
      (data?.metaTranslations && data?.metaTranslations.length > 0) ||
      (data?.passConditions && data?.passConditions.length > 0)
    ) {
      setPassConditionData(data);
    }
  }, [data]);

  // Set locale api data to state
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
  }, [localesData]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
    hasError: true,
  }));

  const handleSubmit = async (values: PassCondition) => {
    try {
      //Upsert Meta PassCondition
      const translationPromises = values.metaTranslations?.map(
        metaTranslation =>
          upsertMetaPassCondition.mutateAsync({
            ...metaTranslation,
          }),
      );
      const results = await Promise.all(translationPromises);

      //Upsert PassCondition Translation
      if (results.every(result => result.status == 200)) {
        const translationResponse =
          await upsertPassConditionTranslation.mutateAsync(
            values.passConditions,
          );

        if (translationResponse?.status == 201) {
          setSlideOver!(false);
        } else {
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  const fillMetaPassConditionArray = (array: PassConditionMeta[]) => {
    // Check if the incoming array has less than 3 objects
    while (array.length < 3) {
      // Find a missing locale
      const missingLocale = locales.find(
        locale => !array.some(obj => obj.localeId === locale.code),
      );

      // Create an object with the missing locale and add it to the array
      if (missingLocale) {
        array.push({
          description: '',
          subTitle: '',
          localeId: missingLocale.code,
          title: '',
        });
      } else {
        // All locales are already in the array, break the loop
        break;
      }
    }

    return array;
  };

  const fillPassConditionTranslationArray = (
    array: PassConditionTranslation[],
  ) => {
    // Check if the incoming array has less than 3 objects
    while (array.length < 3) {
      // Find a missing locale
      const missingLocale = locales.find(
        locale => !array.some(obj => obj.localeId === locale.code),
      );

      // Create an object with the missing locale and add it to the array
      if (missingLocale) {
        array.push({ content: '', localeId: missingLocale.code, order: 1 });
      } else {
        // All locales are already in the array, break the loop
        break;
      }
    }

    return array;
  };

  const getInitialData = () => {
    const passconditionInitialData: PassCondition = {
      metaTranslations: fillMetaPassConditionArray(
        initialData?.metaTranslations ?? [],
      ),
      passConditions: fillPassConditionTranslationArray(
        initialData?.passConditions ?? [],
      ),
    };
    return passconditionInitialData;
  };

  return (
    <>
      {!_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6">
          <Snackbar
            intent="error"
            show={showError as boolean}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as PassCondition);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={schema}
          >
            {formikProps => (
              <Form
                onChange={() => {}}
                onSubmit={e => {
                  e.preventDefault();
                  const filteredPassConditions =
                    formikProps.values.passConditions.filter(value => {
                      return !(
                        _.isEmpty(value?.content) &&
                        _.isEmpty(value?.order) &&
                        value?.localeId !== 'en'
                      );
                    });

                  const filteredMetaTranslations =
                    formikProps.values.metaTranslations.filter(value => {
                      return !(
                        _.isEmpty(value?.description) &&
                        _.isEmpty(value?.title) &&
                        value?.localeId !== 'en'
                      );
                    });

                  formikProps.values.passConditions = filteredPassConditions;

                  formikProps.values.metaTranslations =
                    filteredMetaTranslations;

                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="passconditionTranslations">
                  {() => (
                    <div>
                      <div className="flex flex-col gap-4	mb-6">
                        <div className="flex flex-col gap-3 w-full">
                          <div className="w-full flex-col">
                            <div className="flex-col gap-6">
                              <div className="flex gap-3 mb-5">
                                <Text size={'md'} weight={'normal'}>
                                  Translations
                                </Text>
                                <Text
                                  className="flex items-center justify-center text-tints-battleship-grey-tint-2 gap-3"
                                  size={'sm'}
                                  weight={'normal'}
                                >
                                  (Changes will be saved automatically)
                                </Text>
                              </div>
                            </div>
                            <div className="">
                              <div className="w-full">
                                <Tabs
                                  formikProps={
                                    formikProps.errors.passConditions as []
                                  }
                                  intent="Secondary"
                                  tabData={tabData}
                                  tabIndex={e => {
                                    setLanguage({
                                      language: localesData
                                        ? localesData[e].code
                                        : '',
                                      tabIndex: e,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {language?.language && (
                          <TranslationForm
                            formikProps={
                              formikProps as FormikProps<PassCondition>
                            }
                            selectedLanguage={language}
                          />
                        )}
                        <div className="flex justify-end pb-10">
                          <Button
                            loading={upsertPassConditionTranslation.isLoading}
                            type="submit"
                          >
                            <span className="m-auto">Save</span>
                          </Button>
                        </div>
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
