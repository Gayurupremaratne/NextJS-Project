'use client';

import React, { useEffect } from 'react';
import { FormikErrors, FormikProps } from 'formik';
import { Input, InputContainer, Text, TextArea } from '@/components/atomic';
import _ from 'lodash';
import { FormActions } from '@/constants/form-actions';
import {
  Notification,
  NotificationTranslation,
} from '@/types/notifications/notification.type';

export interface Props {
  action: FormActions;
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<Notification>;
  replace: (index: number, value: NotificationTranslation) => void;
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
        formikProps.values.notificationTranslations,
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
    formikData: FormikProps<Notification>,
    index: number,
    newTitle: string,
  ) => {
    formikData.setFieldValue(
      `notificationTranslations.${index}.title`,
      newTitle,
    );
    // Set selected localeId to formik values
    formikData.setFieldValue(
      `notificationTranslations.${index}.localeId`,
      selectedLanguage.language,
    );
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<Notification>,
    index: number,
    newDescription: string,
  ) => {
    formikData.setFieldValue(
      `notificationTranslations.${index}.description`,
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
              Notification title
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`notificationTranslations.${selectedLanguage}.title`}
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
                  formikProps.values.notificationTranslations[
                    selectedLanguage.tabIndex
                  ]?.title
                }
              />
            </InputContainer>
          </div>
          <div>
            <Text className="mt-3" intent={'red'} size={'xs'}>
              {formikProps.errors.notificationTranslations &&
                typeof formikProps.errors.notificationTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.notificationTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<NotificationTranslation>
                )?.title}
            </Text>
          </div>

          <div className="mt-4">
            <Text
              className="after:content-['*'] after:ml-0.5 after:text-red"
              size={'md'}
              weight={'normal'}
            >
              Notification description
            </Text>
            <InputContainer className="mt-2">
              <TextArea
                className="rounded"
                containerClassName="w-full h-28	"
                name={`notificationTranslations.${selectedLanguage}.description`}
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
                  formikProps.values.notificationTranslations[
                    selectedLanguage.tabIndex
                  ]?.description
                }
              />
            </InputContainer>
          </div>
          <div>
            <Text className="mt-4" intent={'red'} size={'xs'}>
              {formikProps.errors.notificationTranslations &&
                typeof formikProps.errors.notificationTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.notificationTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<NotificationTranslation>
                )?.description}
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
