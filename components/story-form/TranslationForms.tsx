'use client';

import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import Attachment from '@/components/atomic/FileUpload/Attachment';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import { Story, Translation } from '@/types/stories/story.type';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<Story>;
  replace: (index: number, value: Translation) => void;
  remove: (index: number) => void;
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
        formikProps.values.stageStoryTranslations,
        o => o?.localeId === selectedLanguage.language,
      )
    ) {
      if (action === FormActions.ADD) {
        replace(selectedLanguage.tabIndex, {
          localeId: selectedLanguage.language,
          title: '',
          description: '',
          audioFile: undefined,
          audioKey: undefined,
        });
      }
    }
  }, [selectedLanguage?.language]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<Story>,
    index: number,
    newTitle: string,
  ) => {
    formikData.setFieldValue(`stageStoryTranslations.${index}.title`, newTitle);
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `stageStoryTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  const handleFileChange = (
    formikData: FormikProps<Story>,
    index: number,
    newFile: File | undefined,
  ) => {
    if (newFile === undefined) {
      formikData.setFieldValue(`stageStoryTranslations.${index}.audioKey`, '');
      formikData.setFieldValue(
        `stageStoryTranslations.${index}.audioFile`,
        undefined,
      );
      return;
    }
    formikData.setFieldValue(
      `stageStoryTranslations.${index}.audioFile`,
      newFile,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<Story>,
    index: number,
    newDescription: string,
  ) => {
    formikData.setFieldValue(
      `stageStoryTranslations.${index}.description`,
      newDescription,
    );
  };

  const getInitialFile = () => {
    if (
      !_.isEmpty(
        formikProps.values.stageStoryTranslations[selectedLanguage.tabIndex]
          ?.audioKey,
      )
    ) {
      const fileContent = '';
      const blob = new Blob([fileContent], { type: 'audio/mpeg' });

      const fileName = `${formikProps.values.stageStoryTranslations[
        selectedLanguage.tabIndex
      ]?.audioKey}.mp3`;
      const newFile = new File([blob], fileName, { type: 'audio/mpeg' });
      return newFile;
    }
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
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`stageStoryTranslations.${selectedLanguage}.title`}
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
                  formikProps.values.stageStoryTranslations[
                    selectedLanguage.tabIndex
                  ]?.title
                    ? formikProps.values.stageStoryTranslations[
                        selectedLanguage.tabIndex
                      ]?.title
                    : ''
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.stageStoryTranslations &&
                typeof formikProps.errors.stageStoryTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.stageStoryTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<Translation>
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
                name={`stageStoryTranslations.${selectedLanguage}.description`}
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
                  formikProps.values.stageStoryTranslations[
                    selectedLanguage.tabIndex
                  ]?.description
                    ? formikProps.values.stageStoryTranslations[
                        selectedLanguage.tabIndex
                      ]?.description
                    : ''
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2">
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.stageStoryTranslations &&
                typeof formikProps.errors.stageStoryTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.stageStoryTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<Translation>
                )?.description}
            </Text>
          </div>

          {action === FormActions.ADD && (
            <>
              <Text className="mt-5" size={'md'} weight={'normal'}>
                Upload audio story
              </Text>
              <div className="mt-4">
                <Attachment
                  initialFile={
                    formikProps.values.stageStoryTranslations[
                      selectedLanguage?.tabIndex
                    ]?.audioFile
                  }
                  onChange={audiofile => {
                    handleFileChange(
                      formikProps,
                      selectedLanguage?.tabIndex,
                      audiofile,
                    );
                  }}
                  setProfileImageKey={() => {}}
                />
              </div>
              <div className="mt-2">
                <Text intent={'red'} size={'sm'}>
                  {formikProps.errors.stageStoryTranslations &&
                    typeof formikProps.errors.stageStoryTranslations[
                      selectedLanguage.tabIndex
                    ] === 'object' &&
                    (
                      formikProps.errors.stageStoryTranslations[
                        selectedLanguage.tabIndex
                      ] as FormikErrors<Translation>
                    )?.audioFile}
                </Text>
              </div>
            </>
          )}
          {action === FormActions.EDIT && (
            <>
              <Text className="mt-5">Upload audio story</Text>
              <div className="mt-4">
                <Attachment
                  fileUrl={
                    formikProps.values.stageStoryTranslations[
                      selectedLanguage.tabIndex
                    ]?.audioKey
                  }
                  initialFile={
                    getInitialFile() ||
                    formikProps.values.stageStoryTranslations[
                      selectedLanguage?.tabIndex
                    ]?.audioFile
                  }
                  onChange={audiofile => {
                    handleFileChange(
                      formikProps,
                      selectedLanguage?.tabIndex,
                      audiofile,
                    );
                  }}
                  setProfileImageKey={() => {}}
                />
              </div>
              <div className="mt-2">
                <Text intent={'red'} size={'sm'}>
                  {formikProps.errors.stageStoryTranslations &&
                    typeof formikProps.errors.stageStoryTranslations[
                      selectedLanguage.tabIndex
                    ] === 'object' &&
                    (
                      formikProps.errors.stageStoryTranslations[
                        selectedLanguage.tabIndex
                      ] as FormikErrors<Translation>
                    )?.audioFile}
                </Text>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
