/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import { StageForm, Translation } from '@/types/stage/stage.type';
import { ArrowSwapHorizontal } from 'iconsax-react';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<StageForm>;
  replace: (index: number, value: Translation) => void;
  remove: (index: number) => void;
}

export const CreateTrailTranslationForm = ({
  action,
  selectedLanguage,
  formikProps,
  replace,
  remove,
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
        formikProps.values.stageTranslation,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          stageHead: '',
          stageTail: '',
          description: '',
        });
      }
    }
  }, [selectedLanguage?.language]);

  const handleHeadPointChange = (
    formikData: FormikProps<StageForm>,
    index: number,
    value: string,
  ) => {
    formikData.setFieldValue(`stageTranslation.${index}.stageHead`, value);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `stageTranslation.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  const handleTailPointChange = (
    formikData: FormikProps<StageForm>,
    index: number,
    value: string,
  ) => {
    formikData.setFieldValue(`stageTranslation.${index}.stageTail`, value);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `stageTranslation.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  const handleDescriptionChange = (
    formikData: FormikProps<StageForm>,
    index: number,
    value: string,
  ) => {
    formikData.setFieldValue(`stageTranslation.${index}.description`, value);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `stageTranslation.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  return (
    <>
      {selectedLanguage?.language && (
        <div
          className="flex flex-col gap-y-5 mt-8"
          key={selectedLanguage.tabIndex}
        >
          <div className="flex items-center gap-x-5">
            <div>
              <Text className="mb-2" size="md">
                Head point location{/* */}
                <span className="text-red">*</span>
              </Text>
              <InputContainer>
                <Input
                  name={`stageTranslation.${selectedLanguage}.stageHead`}
                  onBlur={formikProps.handleBlur}
                  onChange={e =>
                    handleHeadPointChange(
                      formikProps,
                      selectedLanguage.tabIndex,
                      e.target.value,
                    )
                  }
                  placeholder="Enter head point location"
                  type="text"
                  value={
                    formikProps.values.stageTranslation[
                      selectedLanguage.tabIndex
                    ]?.stageHead
                      ? formikProps.values.stageTranslation[
                          selectedLanguage.tabIndex
                        ]?.stageHead
                      : ''
                  }
                />
              </InputContainer>
              <Text intent={'red'} size={'sm'}>
                {formikProps.errors.stageTranslation &&
                  typeof formikProps.errors.stageTranslation[
                    selectedLanguage.tabIndex
                  ] === 'object' &&
                  (
                    formikProps.errors.stageTranslation[
                      selectedLanguage.tabIndex
                    ] as FormikErrors<Translation>
                  )?.stageHead}
              </Text>
            </div>
            <ArrowSwapHorizontal size="16" />
            <div>
              <Text className="mb-2" size="md">
                End point location{/* */}
                <span className="text-red">*</span>
              </Text>
              <InputContainer>
                <Input
                  name={`stageTranslation.${selectedLanguage}.stageTail`}
                  onBlur={formikProps.handleBlur}
                  onChange={e =>
                    handleTailPointChange(
                      formikProps,
                      selectedLanguage.tabIndex,
                      e.target.value,
                    )
                  }
                  placeholder="Enter end point location"
                  type="text"
                  value={
                    formikProps.values.stageTranslation[
                      selectedLanguage.tabIndex
                    ]?.stageTail
                      ? formikProps.values.stageTranslation[
                          selectedLanguage.tabIndex
                        ]?.stageTail
                      : ''
                  }
                />
              </InputContainer>
              <Text intent={'red'} size={'sm'}>
                {formikProps.errors.stageTranslation &&
                  typeof formikProps.errors.stageTranslation[
                    selectedLanguage.tabIndex
                  ] === 'object' &&
                  (
                    formikProps.errors.stageTranslation[
                      selectedLanguage.tabIndex
                    ] as FormikErrors<Translation>
                  )?.stageTail}
              </Text>
            </div>
          </div>
          <div>
            <Text className="mb-2" size="md">
              Trail description{/* */}
              <span className="text-red">*</span>
            </Text>
            <InputContainer>
              <TextArea
                containerClassName="w-full"
                name={`stageTranslation.${selectedLanguage}.description`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleDescriptionChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder="Description here"
                value={
                  formikProps.values.stageTranslation[selectedLanguage.tabIndex]
                    ?.description
                    ? formikProps.values.stageTranslation[
                        selectedLanguage.tabIndex
                      ]?.description
                    : ''
                }
              />
            </InputContainer>
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.stageTranslation &&
                typeof formikProps.errors.stageTranslation[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.stageTranslation[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<Translation>
                )?.description}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
