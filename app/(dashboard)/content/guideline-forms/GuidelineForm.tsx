'use client';

import { Button, Tabs } from '@/components/atomic';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import {
  useGetGuidelines,
  useUpsertGuidelineTranslation,
  useUpdateMetaGuidelines as useUpsertMetaGuidelines,
} from '@/hooks/guideline/guideline';
import { useGetLocales } from '@/hooks/locale/locale';
import useGuidelineStore from '@/store/guideline/useGuidelineStore';
import {
  Guideline,
  GuidelineMeta,
  GuidelineTranslation,
} from '@/types/guidelines/guideline.type';
import { Locale } from '@/types/locale/locale.type';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TranslationFormHeader from '../TranslationFormHeader';
import { schema } from './GuidelineFormValidation';
import { TranslationForm } from './TranslationForms';

export interface Props {
  initialData?: Guideline;
  setSlideOver?: (value: boolean) => void;
}

export const GuidelineForm = ({ initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const upsertGuidelineTranslation = useUpsertGuidelineTranslation();
  const upsertMetaGuideline = useUpsertMetaGuidelines();
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [showError, setShowError] = useState<boolean>();
  const [key] = useState<number>(0);

  const { data } = useGetGuidelines();
  const setGuidelineData = useGuidelineStore(state => state.setData);

  //set data to guideline store
  useEffect(() => {
    if (
      (data?.metaTranslations && data?.metaTranslations.length > 0) ||
      (data?.onboardingGuidelines && data?.onboardingGuidelines.length > 0)
    ) {
      setGuidelineData(data);
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

  const handleSubmit = async (values: Guideline) => {
    try {
      //Upsert Meta Guideline
      const translationPromises = values.metaTranslations?.map(
        metaTranslation =>
          upsertMetaGuideline.mutateAsync({
            ...metaTranslation,
          }),
      );
      const results = await Promise.all(translationPromises);

      //Upsert Guideline Translation
      if (results.every(result => result.status == 200)) {
        const translationResponse =
          await upsertGuidelineTranslation.mutateAsync(
            values.onboardingGuidelines,
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

  const fillMetaGuidelineArray = (array: GuidelineMeta[]) => {
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

  const fillGuidelineTranslationArray = (array: GuidelineTranslation[]) => {
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
    const guidelineInitialData: Guideline = {
      metaTranslations: fillMetaGuidelineArray(
        initialData?.metaTranslations || [],
      ),
      onboardingGuidelines: fillGuidelineTranslationArray(
        initialData?.onboardingGuidelines || [],
      ),
    };
    return guidelineInitialData;
  };

  return (
    <>
      {!_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={showError as boolean}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as Guideline);
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
                  const filteredOnboardingGuidelines =
                    formikProps.values.onboardingGuidelines.filter(value => {
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

                  formikProps.values.onboardingGuidelines =
                    filteredOnboardingGuidelines;

                  formikProps.values.metaTranslations =
                    filteredMetaTranslations;

                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="guidelineTranslations">
                  {() => (
                    <div>
                      <div className="flex flex-col gap-4	mb-6">
                        <div className="flex flex-col gap-3 w-full">
                          <div className="w-full flex-col">
                            <TranslationFormHeader />
                            <div className="">
                              <div className="w-full">
                                <Tabs
                                  formikProps={
                                    formikProps.errors
                                      .onboardingGuidelines as []
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
                            formikProps={formikProps as FormikProps<Guideline>}
                            selectedLanguage={language}
                          />
                        )}
                        <div className="flex justify-end">
                          <Button
                            loading={upsertGuidelineTranslation.isLoading}
                            type="submit"
                          >
                            Save
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
