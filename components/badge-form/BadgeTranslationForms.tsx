'use client';
import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import { IBadgeForm } from '@/types/badge/badge.type';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<IBadgeForm>;
  replace: (index: number, value: Translation) => void;
}
export interface Translation {
  localeId: string;
  name: string;
  description: string;
}
export const BadgeTranslationForm = ({
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
        formikProps.values.badgeTranslation,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          name: '',
          description: '',
        });
      }
    }
  }, [selectedLanguage?.language]);

  // Set title to formik values on change
  const handleNameChange = (
    formikData: FormikProps<IBadgeForm>,
    index: number,
    newName: string,
  ) => {
    formikData.setFieldValue(`badgeTranslation.${index}.name`, newName);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `badgeTranslation.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<IBadgeForm>,
    index: number,
    newDescription: string,
  ) => {
    formikData.setFieldValue(
      `badgeTranslation.${index}.description`,
      newDescription,
    );
  };
  return (
    <>
      {selectedLanguage?.language && (
        <div key={selectedLanguage.tabIndex}>
          <div>
            <Text className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red">
              Badge name
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`badgeTranslation.${selectedLanguage}.name`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleNameChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder={'Enter badge name'}
                value={
                  formikProps.values.badgeTranslation[selectedLanguage.tabIndex]
                    ?.name
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            {formikProps.touched.badgeTranslation &&
              formikProps.errors.badgeTranslation && (
                <Text intent={'red'} size={'sm'}>
                  {formikProps.errors.badgeTranslation &&
                    typeof formikProps.errors.badgeTranslation[
                      selectedLanguage.tabIndex
                    ] === 'object' &&
                    (
                      formikProps.errors.badgeTranslation[
                        selectedLanguage.tabIndex
                      ] as FormikErrors<Translation>
                    )?.name}
                </Text>
              )}
          </div>
          <div className="mt-4">
            <Text className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red">
              Description
            </Text>
            <InputContainer className="mt-2">
              <TextArea
                className="rounded"
                containerClassName="w-full h-28"
                name={`badgeTranslation.${selectedLanguage}.description`}
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
                  formikProps.values.badgeTranslation[selectedLanguage.tabIndex]
                    ?.description
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            {formikProps.touched.badgeTranslation &&
              formikProps.errors.badgeTranslation && (
                <Text intent={'red'} size={'sm'}>
                  {formikProps.errors.badgeTranslation &&
                    typeof formikProps.errors.badgeTranslation[
                      selectedLanguage.tabIndex
                    ] === 'object' &&
                    (
                      formikProps.errors.badgeTranslation[
                        selectedLanguage.tabIndex
                      ] as FormikErrors<Translation>
                    )?.description}
                </Text>
              )}
          </div>
        </div>
      )}
    </>
  );
};
