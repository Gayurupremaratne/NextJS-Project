'use client';

import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text } from '@/components/atomic';

import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import { IPolicy, IPolicyTranslation } from '@/types/policy/policy.type';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';
const Editor = dynamic(() => import('../../components/editor/Editor'), {
  ssr: false,
});

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<IPolicy>;
  replace: (index: number, value: IPolicyTranslation) => void;
  remove: (index: number) => void;
}

export const SinglePolicyTranslation = ({
  action,
  selectedLanguage,
  replace,
  formikProps,
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
        formikProps.values.policyTranslations,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          title: '',
          content: '',
          blocks: [],
        });
      }
    }
  }, [selectedLanguage?.language]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<IPolicy>,
    index: number,
    newTitle: string,
  ) => {
    formikData.setFieldValue(`policyTranslations.${index}.title`, newTitle);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `policyTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<IPolicy>,
    index: number,
    newContent: string,
  ) => {
    formikData.setFieldValue(`policyTranslations.${index}.content`, newContent);
    const convertedContent: OutputData = JSON.parse(newContent);

    formikData.setFieldValue(
      `policyTranslations.${index}.blocks`,
      convertedContent.blocks,
    );
  };

  return (
    <>
      {selectedLanguage?.language && (
        <div key={selectedLanguage.tabIndex}>
          <Text
            className={'text-tints-forest-green-tint-2 mt-3 tracking-wider'}
            size={'xs'}
            weight={'bold'}
          >
            SINGLE POLICY
          </Text>
          <div className="mt-4">
            <Text size={'md'} weight={'normal'}>
              Policy title<span className="text-red">*</span>
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`policyTranslations.${selectedLanguage}.title`}
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
                  formikProps.values.policyTranslations![
                    selectedLanguage.tabIndex
                  ]?.title
                    ? formikProps.values.policyTranslations![
                        selectedLanguage.tabIndex
                      ]?.title
                    : ''
                }
              />
            </InputContainer>
          </div>

          <div>
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.policyTranslations &&
                typeof formikProps.errors.policyTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.policyTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<IPolicyTranslation>
                )?.title}
            </Text>
          </div>

          <div className="mt-6">
            <Text size={'md'} weight={'normal'}>
              Policy content<span className="text-red">*</span>
            </Text>
            <div className="flex justify-center w-full mt-2">
              <div className="w-full">
                {action === FormActions.ADD && (
                  <Editor
                    data={JSON.parse(
                      formikProps.values.policyTranslations?.[
                        selectedLanguage.tabIndex
                      ]?.content || '{}',
                    )}
                    holder="editorjs-container"
                    onChange={e =>
                      handleDescriptionChange(
                        formikProps,
                        selectedLanguage.tabIndex,
                        JSON.stringify(e),
                      )
                    }
                    placeholder="Policy content here"
                  />
                )}
                {action === FormActions.EDIT &&
                  formikProps.values.policyTranslations?.[
                    selectedLanguage.tabIndex
                  ]?.content && (
                    <Editor
                      data={JSON.parse(
                        formikProps.values.policyTranslations[
                          selectedLanguage.tabIndex
                        ]?.content ?? '{}',
                      )}
                      holder="editorjs-container"
                      onChange={e =>
                        handleDescriptionChange(
                          formikProps,
                          selectedLanguage.tabIndex,
                          JSON.stringify(e),
                        )
                      }
                      placeholder="Policy content here"
                    />
                  )}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Text intent="red" size="sm">
              {formikProps.errors.policyTranslations &&
                typeof formikProps.errors.policyTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.policyTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<IPolicyTranslation>
                )?.content}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
