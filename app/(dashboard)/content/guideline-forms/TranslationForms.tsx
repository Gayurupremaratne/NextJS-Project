'use client';

import {
  Button,
  Input,
  InputContainer,
  Text,
  TextArea,
} from '@/components/atomic';
import { useDeleteGuidelineTranslation } from '@/hooks/guideline/guideline';
import {
  Guideline,
  GuidelineMeta,
  GuidelineTranslation,
} from '@/types/guidelines/guideline.type';
import {
  FieldArray,
  FieldArrayRenderProps,
  FormikErrors,
  FormikProps,
} from 'formik';
import { AddCircle, MinusCirlce } from 'iconsax-react';
import { useEffect } from 'react';

export interface Props {
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  formikProps: FormikProps<Guideline>;
}

export const TranslationForm = ({ selectedLanguage, formikProps }: Props) => {
  const deleteGuideline = useDeleteGuidelineTranslation();

  useEffect(() => {
    if (!formikProps.isValid) {
      formikProps.validateForm();
    }
  }, [formikProps.values]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<Guideline>,
    newTitle: string,
  ) => {
    const index = formikData.values.metaTranslations.findIndex(
      metaTranslation => metaTranslation.localeId == selectedLanguage.language,
    );
    formikData.setFieldValue(`metaTranslations.${index}.title`, newTitle);
  };

  // Set description to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<Guideline>,
    newDescription: string,
  ) => {
    const index = formikData.values.metaTranslations.findIndex(
      metaTranslation => metaTranslation.localeId == selectedLanguage.language,
    );
    formikData.setFieldValue(
      `metaTranslations.${index}.description`,
      newDescription,
    );
  };

  const handleGuidelineChange = (
    formikData: FormikProps<Guideline>,
    guideline: GuidelineTranslation,
    newGuideline: string,
    guidelineArrayIndex: number,
  ) => {
    formikData.setFieldValue(`onboardingGuidelines[${guidelineArrayIndex}]`, {
      ...guideline,
      content: newGuideline,
    });
  };

  const getGuidelineError = (
    formikData: FormikProps<Guideline>,
    guideline: GuidelineTranslation,
    index: number,
  ) => {
    const errors = formikData.errors.onboardingGuidelines;
    return (
      errors &&
      Array.isArray(errors) &&
      (errors[index] as FormikErrors<GuidelineTranslation>)?.content
    );
  };

  return (
    <>
      {selectedLanguage.language && (
        <div key={selectedLanguage.tabIndex}>
          <div>
            <Text size={'md'} weight={'normal'}>
              Guideline title<span className="text-red">*</span>
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`metaTranslations.${selectedLanguage.tabIndex}.title`}
                onBlur={formikProps.handleBlur}
                onChange={e => handleTitleChange(formikProps, e.target.value)}
                placeholder={'Before you begin'}
                value={
                  formikProps.values.metaTranslations.find(
                    x => x.localeId == selectedLanguage.language,
                  )?.title
                }
              />
            </InputContainer>
          </div>
          <div>
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.metaTranslations &&
                typeof formikProps.errors.metaTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.metaTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<GuidelineMeta>
                )?.title}
            </Text>
          </div>

          <div className="mt-5">
            <Text size={'md'} weight={'normal'}>
              Guideline description
            </Text>
            <InputContainer className="mt-3">
              <TextArea
                className="rounded"
                containerClassName="w-full h-28	"
                name={`metaTranslations.${selectedLanguage.tabIndex}.description`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleDescriptionChange(formikProps, e.target.value)
                }
                placeholder={
                  'This guide will provide you with valuable information to ensure a safe hiking experience.'
                }
                value={
                  formikProps.values.metaTranslations.find(
                    x => x.localeId == selectedLanguage.language,
                  )?.description
                }
              />
            </InputContainer>
          </div>
          <div className="mt-2 gap-4">
            <Text intent={'red'} size={'sm'}>
              {formikProps.errors.metaTranslations &&
                typeof formikProps.errors.metaTranslations[
                  selectedLanguage.tabIndex
                ] === 'object' &&
                (
                  formikProps.errors.metaTranslations[
                    selectedLanguage.tabIndex
                  ] as FormikErrors<GuidelineMeta>
                )?.description}
            </Text>
          </div>
          <div className="my-5 py-5">
            <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed mt-4" />
          </div>
          <FieldArray name="onboardingGuidelines">
            {({ push, form, remove: removeGuide }: FieldArrayRenderProps) => {
              const { values } = form;
              const { onboardingGuidelines } = values;
              const onboardingGuidelinesByLanguage =
                onboardingGuidelines.filter(
                  (guideline: GuidelineTranslation) =>
                    guideline.localeId == selectedLanguage.language,
                );
              return (
                <div className="">
                  <div className="flex flex-col gap-5">
                    {onboardingGuidelinesByLanguage.map(
                      (
                        guideline: GuidelineTranslation,
                        guidelineIndex: number,
                      ) => {
                        const guidelineArrayIndex =
                          formikProps.values.onboardingGuidelines.findIndex(
                            onboardingGuideline =>
                              onboardingGuideline.order == guideline.order &&
                              onboardingGuideline.localeId ==
                                guideline.localeId,
                          );
                        return (
                          <div
                            className="flex flex-col gap-1"
                            key={guidelineArrayIndex}
                          >
                            <Text>
                              Bullet point{' '}
                              {(guidelineIndex + 1).toString().padStart(2, '0')}
                            </Text>
                            <div className="relative">
                              <InputContainer>
                                <Input
                                  className="rounded"
                                  containerClassName="w-50"
                                  name={`onboardingGuidelines[${guidelineArrayIndex}]`}
                                  onChange={e =>
                                    handleGuidelineChange(
                                      formikProps,
                                      guideline,
                                      e.target.value,
                                      guidelineArrayIndex,
                                    )
                                  }
                                  placeholder="Pay attention to trail markers and signage along the way."
                                  value={guideline.content}
                                />
                                {guidelineIndex > 0 && (
                                  <>
                                    <Button
                                      className="inset-y-0 right-0 flex items-center pr-2 pl-0"
                                      intent={'dangerGhost'}
                                      loading={deleteGuideline.isLoading}
                                      onClick={() => {
                                        deleteGuideline.mutateAsync({
                                          localeId: guideline.localeId,
                                          order: guideline.order,
                                        });
                                        removeGuide(guidelineIndex);
                                      }}
                                      preIcon={
                                        <MinusCirlce
                                          className="mr-2"
                                          size={16}
                                          variant="Bold"
                                        />
                                      }
                                      type="button"
                                    >
                                      Remove
                                    </Button>
                                  </>
                                )}
                              </InputContainer>
                              <div className="mt-2 gap-4">
                                <Text intent={'red'} size={'sm'}>
                                  {getGuidelineError(
                                    formikProps,
                                    guideline,
                                    guidelineArrayIndex,
                                  )}
                                </Text>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                    <div className="flex flex-start">
                      {
                        <Button
                          intent={'ghost'}
                          loading={deleteGuideline.isLoading}
                          onClick={() => {
                            const newGuideline = {
                              content: '',
                              order: onboardingGuidelinesByLanguage.length + 1,
                              localeId: selectedLanguage.language,
                            };
                            return push(newGuideline);
                          }}
                          preIcon={
                            <AddCircle
                              className="mr-2"
                              size={16}
                              variant="Bold"
                            />
                          }
                          size={'ghost'}
                          type="button"
                        >
                          Add Point
                        </Button>
                      }
                    </div>
                  </div>
                </div>
              );
            }}
          </FieldArray>
        </div>
      )}
    </>
  );
};
