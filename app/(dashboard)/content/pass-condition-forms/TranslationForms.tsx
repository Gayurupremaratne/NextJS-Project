'use client';

import {
  Button,
  Input,
  InputContainer,
  Text,
  TextArea,
} from '@/components/atomic';
import { useDeletePassConditionTranslation } from '@/hooks/passConditions/passConditions';
import {
  PassCondition,
  PassConditionMeta,
  PassConditionTranslation,
} from '@/types/pass-conditions/pass-condition.type';
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
  formikProps: FormikProps<PassCondition>;
}

export const TranslationForm = ({ selectedLanguage, formikProps }: Props) => {
  const deletePassCondition = useDeletePassConditionTranslation();

  useEffect(() => {
    if (!formikProps.isValid) {
      formikProps.validateForm();
    }
  }, [formikProps.values]);

  // Set title to formik values on change
  const handleTitleChange = (
    formikData: FormikProps<PassCondition>,
    newTitle: string,
  ) => {
    const index = formikData.values.metaTranslations.findIndex(
      metaTranslation => metaTranslation.localeId == selectedLanguage.language,
    );
    formikData.setFieldValue(`metaTranslations.${index}.title`, newTitle);
  };

  // Set description to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<PassCondition>,
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

  // Set title to formik values on change
  const handleSubTitleChange = (
    formikData: FormikProps<PassCondition>,
    subTitle: string,
  ) => {
    const index = formikData.values.metaTranslations.findIndex(
      metaTranslation => metaTranslation.localeId == selectedLanguage.language,
    );
    formikData.setFieldValue(`metaTranslations.${index}.subTitle`, subTitle);
  };

  const handlePassConditionChange = (
    formikData: FormikProps<PassCondition>,
    passcondition: PassConditionTranslation,
    newPassCondition: string,
    passconditionArrayIndex: number,
  ) => {
    formikData.setFieldValue(`passConditions[${passconditionArrayIndex}]`, {
      ...passcondition,
      content: newPassCondition,
    });
  };

  const getPassConditionError = (
    formikData: FormikProps<PassCondition>,
    passcondition: PassConditionTranslation,
    index: number,
  ) => {
    const errors = formikData.errors.passConditions;
    return (
      errors &&
      Array.isArray(errors) &&
      (errors[index] as FormikErrors<PassConditionTranslation>)?.content
    );
  };

  return (
    <>
      {selectedLanguage.language && (
        <div key={selectedLanguage.tabIndex}>
          <div>
            <Text size={'md'} weight={'normal'}>
              Terms title<span className="text-red">*</span>
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`metaTranslations.${selectedLanguage.tabIndex}.title`}
                onBlur={formikProps.handleBlur}
                onChange={e => handleTitleChange(formikProps, e.target.value)}
                placeholder={'Indemnity of risk'}
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
                  ] as FormikErrors<PassConditionMeta>
                )?.title}
            </Text>
          </div>

          <div className="mt-5">
            <Text size={'md'} weight={'normal'}>
              Terms description
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
                  'Understanding these risks is essential for a safe and enjoyable hiking experience.'
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
                  ] as FormikErrors<PassConditionMeta>
                )?.description}
            </Text>
          </div>
          <div className="mt-5">
            <Text size={'md'} weight={'normal'}>
              Terms subtitle
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`metaTranslations.${selectedLanguage.tabIndex}.subTitle`}
                onBlur={formikProps.handleBlur}
                onChange={e =>
                  handleSubTitleChange(formikProps, e.target.value)
                }
                placeholder={'Please read instructions carefully:'}
                value={
                  formikProps.values.metaTranslations.find(
                    x => x.localeId == selectedLanguage.language,
                  )?.subTitle
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
                  ] as FormikErrors<PassConditionMeta>
                )?.subTitle}
            </Text>
          </div>

          <div className="my-4 py-4">
            <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed mt-4" />
          </div>
          <FieldArray name="passConditions">
            {({ push, form, remove: removeGuide }: FieldArrayRenderProps) => {
              const { values } = form;
              const { passConditions } = values;
              const passConditionsByLanguage = passConditions.filter(
                (passcondition: PassConditionTranslation) =>
                  passcondition.localeId == selectedLanguage.language,
              );

              return (
                <div className="">
                  <div className="flex flex-col gap-5">
                    {passConditionsByLanguage.map(
                      (
                        passcondition: PassConditionTranslation,
                        passconditionIndex: number,
                      ) => {
                        const passconditionArrayIndex =
                          formikProps.values.passConditions.findIndex(
                            onboardingPassCondition =>
                              onboardingPassCondition.order ==
                                passcondition.order &&
                              onboardingPassCondition.localeId ==
                                passcondition.localeId,
                          );
                        return (
                          <div
                            className="flex flex-col gap-1"
                            key={passconditionArrayIndex}
                          >
                            <Text>
                              Bullet point{' '}
                              {(passconditionIndex + 1)
                                .toString()
                                .padStart(2, '0')}
                            </Text>
                            <div className="relative">
                              <InputContainer>
                                <Input
                                  className="rounded"
                                  containerClassName="w-50"
                                  name={`passConditions[${passconditionArrayIndex}]`}
                                  onChange={e =>
                                    handlePassConditionChange(
                                      formikProps,
                                      passcondition,
                                      e.target.value,
                                      passconditionArrayIndex,
                                    )
                                  }
                                  placeholder="Pack out all trash and dispose of it properly."
                                  value={passcondition.content}
                                />
                                {passconditionIndex > 0 && (
                                  <>
                                    <Button
                                      className="inset-y-0 right-0 flex items-center pr-2 pl-0"
                                      intent={'dangerGhost'}
                                      loading={deletePassCondition.isLoading}
                                      onClick={() => {
                                        deletePassCondition.mutateAsync({
                                          localeId: passcondition.localeId,
                                          order: passcondition.order,
                                        });
                                        removeGuide(passconditionArrayIndex);
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
                                  {getPassConditionError(
                                    formikProps,
                                    passcondition,
                                    passconditionArrayIndex,
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
                          className="pl-0 inset-y-0 left-0"
                          intent={'ghost'}
                          loading={deletePassCondition.isLoading}
                          onClick={() => {
                            const newPassCondition = {
                              content: '',
                              order: passConditionsByLanguage.length + 1,
                              localeId: selectedLanguage.language,
                            };
                            return push(newPassCondition);
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
