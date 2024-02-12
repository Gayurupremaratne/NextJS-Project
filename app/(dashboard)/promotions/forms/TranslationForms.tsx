'use client';

import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import { FormActions } from '@/constants/form-actions';
import { Promotion } from '@/types/promotions/promotion.type';
import { FormikErrors, FormikProps } from 'formik';
import _ from 'lodash';
import { useEffect } from 'react';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<Promotion>;
  replace: (index: number, value: PromotionTranslation) => void;
}

export interface PromotionTranslation {
  localeId: string;
  title: string;
  description: string;
  ctaText: string | undefined;
}

export const TranslationForm = ({
  action,
  selectedLanguage,
  formikProps,
  replace,
}: Props) => {
  const handleFormActions = () => {
    if (
      !_.some(
        formikProps.values.promotionTranslations,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          title: '',
          description: '',
          ctaText: '',
        });
      }
    }
  };

  useEffect(() => {
    if (!formikProps.isValid) {
      handleFormActions();
      formikProps.validateForm();
    }
  }, [formikProps.values]);

  useEffect(() => {
    if (_.isEmpty(selectedLanguage?.language)) {
      return;
    }

    handleFormActions();
  }, [selectedLanguage?.language]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<Promotion>,
    index: number,
    newTitle: string,
  ) => {
    formikData.setFieldValue(`promotionTranslations.${index}.title`, newTitle);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `promotionTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  const handleCtaTextChange = (
    formikData: FormikProps<Promotion>,
    index: number,
    ctaText: string,
  ) => {
    formikData.setFieldValue(`promotionTranslations.${index}.ctaText`, ctaText);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `promotionTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<Promotion>,
    index: number,
    newDescription: string,
  ) => {
    formikData.setFieldValue(
      `promotionTranslations.${index}.description`,
      newDescription,
    );
  };

  return (
    <>
      {selectedLanguage.language && (
        <div key={selectedLanguage.tabIndex}>
          <div className="flex flex-col">
            <div className="flex gap-5">
              <div className="w-full">
                <Text
                  className="after:content-['*'] after:ml-0.5 after:text-red"
                  size={'md'}
                  weight={'normal'}
                >
                  Title
                </Text>
                <InputContainer className="mt-2">
                  <Input
                    className="rounded"
                    containerClassName="w-full"
                    name={`promotionTranslations.${selectedLanguage}.title`}
                    onBlur={formikProps.handleBlur}
                    onChange={e =>
                      handleTitleChange(
                        formikProps,
                        selectedLanguage.tabIndex,
                        e.target.value,
                      )
                    }
                    placeholder={'Promotion title here'}
                    value={
                      formikProps.values.promotionTranslations[
                        selectedLanguage.tabIndex
                      ]?.title
                    }
                  />
                </InputContainer>
                <div>
                  <Text intent={'red'} size={'sm'}>
                    {formikProps.errors.promotionTranslations &&
                      typeof formikProps.errors.promotionTranslations[
                        selectedLanguage.tabIndex
                      ] === 'object' &&
                      (
                        formikProps.errors.promotionTranslations[
                          selectedLanguage.tabIndex
                        ] as FormikErrors<PromotionTranslation>
                      )?.title}
                  </Text>
                </div>
              </div>
              <div className="w-full">
                <Text
                  className="after:content-['*'] after:ml-0.5 after:text-red"
                  size={'md'}
                  weight={'normal'}
                >
                  CTA Text
                </Text>
                <InputContainer className="mt-2">
                  <Input
                    className="rounded"
                    containerClassName="w-full"
                    name={`promotionTranslations.${selectedLanguage}.ctaText`}
                    onBlur={formikProps.handleBlur}
                    onChange={e =>
                      handleCtaTextChange(
                        formikProps,
                        selectedLanguage.tabIndex,
                        e.target.value,
                      )
                    }
                    placeholder={'Enter CTA Text'}
                    value={
                      formikProps.values.promotionTranslations[
                        selectedLanguage.tabIndex
                      ]?.ctaText
                    }
                  />
                </InputContainer>
                <div>
                  <Text intent={'red'} size={'sm'}>
                    {formikProps.errors.promotionTranslations &&
                      typeof formikProps.errors.promotionTranslations[
                        selectedLanguage.tabIndex
                      ] === 'object' &&
                      (
                        formikProps.errors.promotionTranslations[
                          selectedLanguage.tabIndex
                        ] as FormikErrors<PromotionTranslation>
                      )?.ctaText}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Text size={'md'} weight={'normal'}>
              Description
            </Text>
            <InputContainer className="mt-3">
              <TextArea
                className="rounded"
                containerClassName="w-full h-28	"
                name={`promotionTranslations.${selectedLanguage}.description`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleDescriptionChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder={'Description here'}
                value={
                  formikProps.values.promotionTranslations[
                    selectedLanguage.tabIndex
                  ]?.description
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.promotionTranslations &&
                typeof formikProps.errors.promotionTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.promotionTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<PromotionTranslation>
                )?.description}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
