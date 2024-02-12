'use client';
import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text } from '@/components/atomic';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import { ITag } from '@/types/tags/tags';
export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<ITag>;
  replace: (index: number, value: Translation) => void;
}
export interface Translation {
  localeId: string;
  name: string;
}

export const TagTranslationForm = ({
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
        formikProps.values.stageTagTranslation,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          name: '',
        });
      }
    }
  }, [selectedLanguage?.language]);
  // Set title to formik values on change
  const handleNameChange = (
    formikData: FormikProps<ITag>,
    index: number,
    newName: string,
  ) => {
    formikData.setFieldValue(`stageTagTranslation.${index}.name`, newName);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `stageTagTranslation.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  return (
    <>
      {selectedLanguage?.language && (
        <div key={selectedLanguage.tabIndex}>
          <div>
            <Text className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red">
              Title
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`stageTagTranslation.${selectedLanguage}.name`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleNameChange(
                    formikProps,
                    selectedLanguage.tabIndex,
                    e.target.value,
                  )
                }
                placeholder={'Enter title'}
                value={
                  formikProps.values.stageTagTranslation[
                    selectedLanguage.tabIndex
                  ]?.name
                    ? formikProps.values.stageTagTranslation[
                        selectedLanguage.tabIndex
                      ]?.name
                    : ''
                }
              />
            </InputContainer>
          </div>
          <div>
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.stageTagTranslation &&
                typeof formikProps.errors.stageTagTranslation[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.stageTagTranslation[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<Translation>
                )?.name}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
