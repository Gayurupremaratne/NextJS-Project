'use client';

import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import {
  PointOfInterestRequest,
  PointOfInterestTranslation,
} from '@/types/pointOfInterests/pointOfInterest.type';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<PointOfInterestRequest>;
  replace: (index: number, value: PointOfInterestTranslation) => void;
}

export const TranslationForm = ({
  action,
  selectedLanguage,
  formikProps,
  replace,
}: Props) => {
  useEffect(() => {
    if (!formikProps.isValid) {
      formikProps.validateForm();
    }
  }, [formikProps.values]);

  useEffect(() => {
    if (_.isEmpty(selectedLanguage?.language)) {
      return;
    }

    if (
      !_.some(
        formikProps.values.pointOfInterestTranslations,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          title: '',
          description: '',
        });
      }
    }
  }, [selectedLanguage?.language]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<PointOfInterestRequest>,
    index: number,
    newTitle: string,
  ) => {
    formikData.setFieldValue(
      `pointOfInterestTranslations.${index}.title`,
      newTitle,
    );
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `pointOfInterestTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<PointOfInterestRequest>,
    index: number,
    newDescription: string,
  ) => {
    formikData.setFieldValue(
      `pointOfInterestTranslations.${index}.description`,
      newDescription,
    );
  };

  return (
    <>
      {selectedLanguage?.language && (
        <div key={selectedLanguage.tabIndex}>
          <div>
            <Text
              className="after:content-['*'] after:ml-0.5 after:text-red"
              size={'md'}
              weight={'normal'}
            >
              Title
            </Text>
            <InputContainer className="mt-6">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`pointOfInterestTranslations.${selectedLanguage}.title`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleTitleChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder={'Enter title'}
                value={
                  formikProps.values.pointOfInterestTranslations[
                    selectedLanguage.tabIndex
                  ]?.title
                }
              />
            </InputContainer>
          </div>
          <div>
            <Text intent={'red'} size={'xs'}>
              {formikProps.errors.pointOfInterestTranslations &&
                typeof formikProps.errors.pointOfInterestTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.pointOfInterestTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<PointOfInterestTranslation>
                )?.title}
            </Text>
          </div>

          <div className="mt-4">
            <Text size={'md'} weight={'normal'}>
              Description
            </Text>
            <InputContainer className="mt-2">
              <TextArea
                className="rounded"
                containerClassName="w-full h-28	"
                name={`pointOfInterestTranslations.${selectedLanguage}.description`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleDescriptionChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder={'Enter description'}
                value={
                  formikProps.values.pointOfInterestTranslations[
                    selectedLanguage.tabIndex
                  ]?.description
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            <Text intent={'red'} size={'xs'}>
              {formikProps.errors.pointOfInterestTranslations &&
                typeof formikProps.errors.pointOfInterestTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.pointOfInterestTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<PointOfInterestTranslation>
                )?.description}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
