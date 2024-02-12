'use client';

import React, { useEffect } from 'react';
import { FieldArray, FormikErrors, FormikProps } from 'formik';
import {
  Button,
  Checkbox,
  Input,
  InputContainer,
  Item,
  SingleSelect,
  Text,
  TextArea,
} from '@/components/atomic';

import { IPolicy, IPolicyTranslation } from '@/types/policy/policy.type';
import { Locale } from '@/types/locale/locale.type';
import dynamic from 'next/dynamic';
import {
  AddCircle,
  CardTick1,
  ClipboardText,
  EmojiHappy,
  InfoCircle,
  Lock1,
  MinusCirlce,
  People,
  ShieldTick,
} from 'iconsax-react';
import { theme } from '@/tailwind.config';
import { OutputData } from '@editorjs/editorjs';
const Editor = dynamic(() => import('../editor/Editor'), {
  ssr: false,
});

export interface Props {
  selectedLanguage: {
    language: string;
    tabIndex: number;
  };
  locales: Locale[];
  formikProps: FormikProps<IPolicyTranslation>;
  remove: (index: number) => void;
  setShow: (values: boolean) => void;
  setErrorText: (values: string) => void;
}

const options = [
  {
    id: 0,
    name: 'Select category',
  },
  {
    id: 1,
    name: 'terms-and-conditions',
  },
  {
    id: 2,
    name: 'privacy-policy',
  },
];

export const ChildForm = ({
  selectedLanguage,
  formikProps,
  locales,
}: Props) => {
  useEffect(() => {
    if (!formikProps.isValid) {
      formikProps.validateForm();
    }
  }, [formikProps.values]);

  const handleParentTitleChange = (
    formikData: FormikProps<IPolicy>,
    newTitle: string,
  ) => {
    const index = formikData.values.policyTranslations!.findIndex(
      translation => translation.localeId == selectedLanguage.language,
    );
    formikData.setFieldValue(`policyTranslations.${index}.title`, newTitle);
  };

  // Set title to formik values on change.
  const handleTitleChange = (
    formikData: FormikProps<IPolicyTranslation>,
    newTitle: string,
    index: number,
  ) => {
    formikData.setFieldValue(`childPolicies.${index}.title`, newTitle);
  };

  // Set title to formik values on change
  const handleDescriptionChange = (
    formikData: FormikProps<IPolicy>,
    newDescription: string,
    index: number,
  ) => {
    formikData.setFieldValue(
      `childPolicies.${index}.description`,
      newDescription,
    );
  };

  const handleContentChange = (
    formikData: FormikProps<IPolicy>,
    newContent: string,
    index: number,
  ) => {
    formikData.setFieldValue(`childPolicies.${index}.content`, newContent);
    const convertedContent: OutputData = JSON.parse(newContent);

    formikData.setFieldValue(
      `childPolicies.${index}.blocks`,
      convertedContent.blocks,
    );
  };

  const handleAcceptanceChange = (
    formikData: FormikProps<IPolicy>,
    newAcceptanceRequired: boolean,
    order: number,
  ) => {
    formikProps.values.childPolicies?.map((childPolicy, index) => {
      if (childPolicy.order === order) {
        formikData.setFieldValue(
          `childPolicies.${index}.acceptanceRequired`,
          newAcceptanceRequired,
        );
        return;
      }
    });
  };

  const handleTagChange = (
    formikData: FormikProps<IPolicy>,
    e: number,
    order: number,
  ) => {
    formikProps.values.childPolicies?.map((childPolicy, index) => {
      if (childPolicy.order === order && e === 1) {
        formikData.setFieldValue(
          `childPolicies.${index}.slug`,
          'terms-and-conditions',
        );
        return;
      } else if (childPolicy.order === order && e === 2) {
        formikData.setFieldValue(
          `childPolicies.${index}.slug`,
          'privacy-policy',
        );

        return;
      } else if (childPolicy.order === order && e === 0) {
        formikData.setFieldValue(`childPolicies.${index}.slug`, '');

        return;
      }
    });
  };

  const getTitleError = (
    formikData: FormikProps<IPolicy>,
    _policy: IPolicyTranslation,
    index: number,
  ) => {
    const errors = formikData.errors.childPolicies;
    return (
      errors &&
      Array.isArray(errors) &&
      (errors[index] as FormikErrors<IPolicyTranslation>)?.title
    );
  };

  const getContentError = (formikData: FormikProps<IPolicy>, index: number) => {
    const errors = formikData.errors.childPolicies;
    return (
      errors &&
      Array.isArray(errors) &&
      (errors[index] as FormikErrors<IPolicyTranslation>)?.content
    );
  };

  const getDescriptionError = (
    formikData: FormikProps<IPolicy>,
    index: number,
  ) => {
    const errors = formikData.errors.childPolicies;
    return (
      errors &&
      Array.isArray(errors) &&
      (errors[index] as FormikErrors<IPolicyTranslation>)?.description
    );
  };

  const getInitialTag = (order: number) => {
    const englishPolicy = formikProps.values.childPolicies?.find(
      policy => policy.localeId === 'en' && policy.order === order,
    );
    if (englishPolicy && englishPolicy.slug === 'terms-and-conditions') {
      return {
        id: 1,
        name: 'terms-and-conditions',
      } as Item;
    } else if (englishPolicy && englishPolicy.slug === 'privacy-policy') {
      return {
        id: 2,
        name: 'privacy-policy',
      } as Item;
    }
    return {
      id: 0,
      name: 'Select category',
    } as Item;
  };

  const deleteChildPolicy = async (
    remove: (index: number) => void,
    policies: IPolicyTranslation[],
  ) => {
    const enTranslation = policies?.find(item => item.localeId === 'en');
    const filteredArray = formikProps.values.childPolicies?.filter(
      item =>
        item.order !== undefined &&
        enTranslation !== undefined &&
        enTranslation.order !== undefined &&
        item.order > enTranslation.order,
    );

    if (policies) {
      await Promise.all(
        policies.map(policy => {
          const policyArrayIndex = formikProps.values.childPolicies?.findIndex(
            childPolicy => childPolicy.order == policy.order,
          );

          remove(policyArrayIndex as number);
        }),
      );
    }

    if (filteredArray) {
      await Promise.all(
        filteredArray?.map(filteredPolicy => {
          filteredPolicy.order =
            filteredPolicy.order && filteredPolicy.order - 1;
        }),
      );
    }
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
            PARENT POLICY
          </Text>
          <div className="mt-4">
            <Text size={'md'} weight={'normal'}>
              Policy title<span className="text-red">*</span>
            </Text>
            <InputContainer className="mt-2">
              <Input
                className="rounded"
                containerClassName="w-full"
                name={`policyTranslations.${selectedLanguage.tabIndex}.title`}
                onBlur={formikProps.handleBlur}
                onChange={e => {
                  handleParentTitleChange(
                    formikProps as FormikProps<IPolicy>,
                    e.target.value,
                  );
                }}
                placeholder={'Policy title here'}
                value={
                  formikProps.values.policyTranslations?.find(
                    x => x?.localeId == selectedLanguage.language,
                  )?.title
                    ? formikProps.values.policyTranslations?.find(
                        x => x?.localeId == selectedLanguage.language,
                      )?.title
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
            <Text intent={'battleshipShadeTwo'} size={'sm'} weight={'normal'}>
              Choose or replace existing icon
              <span className="text-red">*</span>
            </Text>
            <div className="flex mt-2.5 gap-3">
              <div
                className={
                  formikProps.values.icon === 'clipboard'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <ClipboardText
                  onClick={() => formikProps.setFieldValue('icon', 'clipboard')}
                  size="20"
                />
              </div>
              <div
                className={
                  formikProps.values.icon === 'shield'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <ShieldTick
                  onClick={() => formikProps.setFieldValue('icon', 'shield')}
                  size="20"
                />
              </div>
              <div
                className={
                  formikProps.values.icon === 'people'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <People
                  onClick={() => formikProps.setFieldValue('icon', 'people')}
                  size="20"
                />
              </div>
              <div
                className={
                  formikProps.values.icon === 'lock'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <Lock1
                  onClick={() => formikProps.setFieldValue('icon', 'lock')}
                  size="20"
                />
              </div>
              <div
                className={
                  formikProps.values.icon === 'emoji'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <EmojiHappy
                  onClick={() => formikProps.setFieldValue('icon', 'emoji')}
                  size="20"
                />
              </div>
              <div
                className={
                  formikProps.values.icon === 'cardtick'
                    ? 'icon-div-selected'
                    : 'icon-div'
                }
              >
                <CardTick1
                  onClick={() => formikProps.setFieldValue('icon', 'cardtick')}
                  size="20"
                />
              </div>
            </div>
            <Text className="mt-1 ml-2" intent={'red'} size="sm">
              {formikProps.errors.icon &&
                formikProps.touched.icon &&
                formikProps.errors.icon}
            </Text>
          </div>
          <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed mt-10 mb-10" />
          <FieldArray name="childPolicies">
            {({ push, form, remove }) => {
              const { values } = form;
              const { childPolicies } = values;
              const policies = childPolicies?.filter(
                (policy: IPolicyTranslation) =>
                  policy.localeId == selectedLanguage.language,
              );

              return (
                <>
                  {policies?.map(
                    (policy: IPolicyTranslation, policyIndex: number) => {
                      const policyArrayIndex =
                        formikProps.values.childPolicies?.findIndex(
                          childPolicy =>
                            childPolicy?.order == policy?.order &&
                            childPolicy?.localeId == policy?.localeId,
                        );
                      return (
                        <div
                          className={`${policyIndex !== 0 ? 'pt-8' : 'pt-0'}`}
                          key={`policy-${policy.order}-${policy.localeId}`}
                        >
                          <div className="flex">
                            <div className="flex flex-row gap-1.5">
                              <Text
                                className={'flex tracking-wider'}
                                intent={'forestGreenTintTwo'}
                                size={'xs'}
                                weight={'bold'}
                              >
                                CHILD POLICY{'  '}
                                {(policyIndex + 1).toString().padStart(2, '0')}
                                {'          '}
                                (OPTIONAL)
                              </Text>
                              <div className="relative group">
                                <InfoCircle
                                  className="cursor-pointer"
                                  color={
                                    theme.colors.shades['battleship-grey'][
                                      'shade-1'
                                    ]
                                  }
                                  size={15}
                                  variant="Bold"
                                />
                                <div className="w-[738px] hidden group-hover:block mt-2 top-3 left-0 bg-custom-bg-color px-2 py-1 rounded absolute z-10">
                                  <Text className="text-white" size={'sm'}>
                                    Adding child policies will nest them under
                                    your parent policy on the user profile.
                                    Tapping on the parent policy will open a
                                    separate screen with a list of all child
                                    policies. Not creating any child policies
                                    will directly show the user the relevant
                                    information of the parent policy.
                                  </Text>
                                </div>
                              </div>
                            </div>
                            {policyIndex >= 0 && (
                              <div className="flex flex-grow justify-end mt-1">
                                <Button
                                  intent={'dangerGhost'}
                                  onClick={() => {
                                    const policiesbyOrder =
                                      formikProps.values.childPolicies?.filter(
                                        (p: IPolicyTranslation) =>
                                          p.order == policy.order,
                                      );
                                    deleteChildPolicy(
                                      remove,
                                      policiesbyOrder as IPolicyTranslation[],
                                    );
                                  }}
                                  preIcon={
                                    <MinusCirlce
                                      className="mr-2"
                                      size={16}
                                      variant="Bold"
                                    />
                                  }
                                  size={'ghost'}
                                  type="button"
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </div>

                          <div
                            className="flex xl:flex-row mt-6 flex-col gap-x-6 gap-y-4"
                            key={policyIndex}
                          >
                            <div className="flex flex-col">
                              <div className="xl:w-[400px]">
                                <Text size={'md'} weight={'normal'}>
                                  Policy title
                                  <span className="text-red">*</span>
                                </Text>
                                <InputContainer className="mt-2">
                                  <Input
                                    className="rounded"
                                    containerClassName="w-full"
                                    name={`childPolicies[${policyArrayIndex}]`}
                                    onBlur={formikProps.handleBlur}
                                    onChange={e =>
                                      handleTitleChange(
                                        formikProps,
                                        e.target.value,
                                        policyArrayIndex as number,
                                      )
                                    }
                                    placeholder={'Child policy title here'}
                                    value={policy.title}
                                  />
                                </InputContainer>
                              </div>
                              <div>
                                <Text intent={'red'} size={'sm'}>
                                  {getTitleError(
                                    formikProps as FormikProps<IPolicy>,
                                    policy,
                                    policyArrayIndex as number,
                                  )}
                                </Text>
                              </div>
                            </div>
                            <div className="w-[279px]">
                              <Text size={'md'} weight={'normal'}>
                                Policy tag
                              </Text>
                              <div className="w-72 mt-2">
                                <SingleSelect
                                  initialSelected={getInitialTag(
                                    policy.order as number,
                                  )}
                                  items={options}
                                  tabIndex={e => {
                                    handleTagChange(
                                      formikProps as FormikProps<IPolicy>,
                                      e as number,
                                      policy.order as number,
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className={'xl:mt-8'}>
                              <Checkbox
                                checked={
                                  formikProps.values.childPolicies![
                                    policyArrayIndex!
                                  ].acceptanceRequired
                                }
                                label={'Acceptance required'}
                                onChange={() => {
                                  if (
                                    formikProps.values.childPolicies![
                                      policyArrayIndex as number
                                    ].acceptanceRequired === true
                                  ) {
                                    handleAcceptanceChange(
                                      formikProps as FormikProps<IPolicy>,
                                      false,
                                      policy.order as number,
                                    );
                                  } else {
                                    handleAcceptanceChange(
                                      formikProps as FormikProps<IPolicy>,
                                      true,
                                      policy.order as number,
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <Text size={'md'} weight={'normal'}>
                              Description
                            </Text>
                            <InputContainer className="mt-2">
                              <TextArea
                                className="rounded"
                                containerClassName="w-full h-28"
                                name={`stageStoryTranslations.${selectedLanguage}.description`}
                                onBlur={formikProps.handleBlur}
                                onChange={e =>
                                  handleDescriptionChange(
                                    formikProps,
                                    e.target.value,
                                    policyArrayIndex as number,
                                  )
                                }
                                placeholder={'Child policy description here'}
                                value={
                                  formikProps.values.childPolicies![
                                    policyArrayIndex!
                                  ].description
                                    ? formikProps.values.childPolicies![
                                        policyArrayIndex!
                                      ].description
                                    : ''
                                }
                              />
                            </InputContainer>
                          </div>
                          <div className="mt-1">
                            <Text intent={'red'} size={'sm'}>
                              {getDescriptionError(
                                formikProps as FormikProps<IPolicy>,
                                policyArrayIndex as number,
                              )}
                            </Text>
                          </div>
                          <div className="mt-6">
                            <Text size={'md'} weight={'normal'}>
                              Policy content<span className="text-red">*</span>
                            </Text>
                            <div className="flex justify-center w-full mt-2">
                              <div className="w-full">
                                <Editor
                                  data={JSON.parse(
                                    (formikProps.values.childPolicies &&
                                      formikProps.values.childPolicies[
                                        policyArrayIndex!
                                      ]?.content) ||
                                      '{}',
                                  )}
                                  holder={`editorjs-container-${policyArrayIndex}`}
                                  onChange={e =>
                                    handleContentChange(
                                      formikProps,
                                      JSON.stringify(e),
                                      policyArrayIndex as number,
                                    )
                                  }
                                  placeholder="Description here"
                                />
                              </div>
                            </div>
                            <div>
                              <Text intent={'red'} size={'sm'}>
                                {getContentError(
                                  formikProps as FormikProps<IPolicy>,
                                  policyArrayIndex as number,
                                )}
                              </Text>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                  <div className="flex flex-start pt-4">
                    {
                      <Button
                        intent={'ghost'}
                        onClick={() => {
                          let newPolicy = {
                            id: '',
                            localeId: '',
                            content: '',
                            description: '',
                            title: '',
                            acceptanceRequired: false,
                            order: 0,
                            blocks: [],
                          };
                          locales.map((locale, _index) => {
                            newPolicy = {
                              ...newPolicy,
                              localeId: locale.code,
                              order: policies.length + 1,
                            };
                            return push(newPolicy);
                          });
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
                        Add child policy
                      </Button>
                    }
                  </div>
                </>
              );
            }}
          </FieldArray>
        </div>
      )}
    </>
  );
};
