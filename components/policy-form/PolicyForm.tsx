'use client';

import React, { useEffect, useState } from 'react';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import _ from 'lodash';
import {
  Button,
  Checkbox,
  Heading,
  Item,
  SingleSelect,
  Tabs,
  Text,
} from '@/components/atomic';
import { schema } from './policy-form-validation';
import { useGetLocales } from '@/hooks/locale/locale';
import { Locale } from '@/types/locale/locale.type';
import { FormActions } from '@/constants/form-actions';
import {
  CardTick1,
  ClipboardText,
  EmojiHappy,
  Lock1,
  People,
  ShieldTick,
} from 'iconsax-react';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { IPolicy, IPolicyTranslation } from '@/types/policy/policy.type';
import {
  useCreatePolicy,
  useDeletePolicy,
  useEditPolicy,
  useUpsertPolicyTranslation,
} from '@/hooks/policy/policy';
import { SinglePolicyTranslation } from './SinglePolicyTranslation';
import { AxiosError, AxiosResponse } from 'axios';
import { AlertDialog } from '../atomic/Modal';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorState, initialErrorState } from '@/types/common.type';

export interface Props {
  action: FormActions;
  initialData?: IPolicy;
  setSlideOver?: (value: boolean) => void;
}

export const PolicyForm = ({ action, initialData, setSlideOver }: Props) => {
  const queryClient = useQueryClient();
  const { data: localesData } = useGetLocales();
  const deletePolicy = useDeletePolicy();
  const createPolicy = useCreatePolicy();
  const upsertPolicy = useUpsertPolicyTranslation();
  const editPolicy = useEditPolicy();
  const [showModal, setshowModal] = useState(false);
  const [error, setError] = useState<ErrorState>(initialErrorState);
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [key, setKey] = useState<number>(0);
  const [isPolicyFormSubmitting, setIsPolicyFormSubmitting] = useState(false);
  const options = [
    {
      id: 0,
      name: 'Select tag',
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

  // Set api data to state
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
  }, [localesData]);

  const tabData = locales?.map((locale, _index) => ({
    title: locale.name,
    content: <></>,
  }));
  const setSlideOverByResponse = (
    results: (AxiosResponse<IPolicyTranslation> | undefined)[],
  ) => {
    if (results?.every(result => result?.status == 200)) {
      setSlideOver!(false);
      queryClient.invalidateQueries(['allPolicies']);
      return;
    }
    setError({
      has: true,
      message: 'Something went wrong, please try again',
    });
  };

  const removeEmptyTranslationObjects = (
    policyTranslations: IPolicyTranslation[],
  ) => {
    const translations = policyTranslations?.filter(value => {
      return !_.isEmpty(value?.title);
    });

    return translations;
  };

  const handleSubmit = async (values: IPolicy) => {
    setError({
      has: false,
      message: '',
    });
    setIsPolicyFormSubmitting(true);

    if (action === FormActions.ADD) {
      const { policyTranslations, ...createData } = values;
      createData.isGroupParent = false;

      if (_.isEmpty(createData.slug)) {
        delete createData.slug;
      }

      try {
        const response = await createPolicy.mutateAsync(createData);

        // translations
        if (response?.status === 201) {
          values.policyTranslations = removeEmptyTranslationObjects(
            policyTranslations ?? [],
          );
          const translationPromises = values.policyTranslations.map(
            async (translation, _index) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { policyId, localeId, blocks, ...rest } = translation;

              return upsertPolicy.mutateAsync({
                ...rest,
                policyId: response.data.data.id,
                localeId: translation.localeId,
              });
            },
          );

          const results = await Promise.all(translationPromises);
          setSlideOverByResponse(results);
        }
      } catch (e) {
        setIsPolicyFormSubmitting(false);
        if (e instanceof AxiosError && e.response?.status) {
          setError({
            has: true,
            message: 'A policy with the same tag already exists',
          });
        }
      }
    }
    if (action === FormActions.EDIT) {
      const { policyTranslations, ...editData } = values;
      if (!_.isEmpty(initialData)) {
        editData.id = initialData?.id;
      }

      if (editData.slug === '') {
        delete editData.slug;
      }

      delete editData.isGroupParent;
      try {
        const response = await editPolicy.mutateAsync(editData);

        //translations
        if (response?.status === 200) {
          values.policyTranslations = removeEmptyTranslationObjects(
            policyTranslations ?? [],
          );
          const translationPromises = values.policyTranslations.map(
            async (translation, _index) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { policyId, localeId, ...rest } = translation;
              delete rest.createdAt;
              delete rest.updatedAt;
              delete rest.blocks;
              return upsertPolicy.mutateAsync({
                ...rest,
                policyId: response.data.data.id,
                localeId: translation.localeId,
              });
            },
          );

          const results = await Promise.all(translationPromises);
          setSlideOverByResponse(results);
        } else {
          setIsPolicyFormSubmitting(false);
          setError({
            has: true,
            message: 'Something went wrong, please try again',
          });
        }
      } catch (e: unknown) {
        setIsPolicyFormSubmitting(false);
        if (e instanceof AxiosError && e.response?.status) {
          setError({
            has: true,
            message: 'A policy with the same tag already exists',
          });
        }
      }
    }
    setIsPolicyFormSubmitting(false);
  };

  const handleReset = (formikData: FormikProps<IPolicy>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  const handleDelete = async () => {
    if (!_.isEmpty(initialData) && _.isString(initialData?.id)) {
      try {
        await deletePolicy.mutateAsync(initialData.id);
        setSlideOver!(false);
        queryClient.invalidateQueries(['allPolicies']);
        return;
      } catch (e: unknown) {
        setError({
          has: true,
          message: 'Something went wrong, please try again',
        });
      }
    }
  };

  const getInitialData = () => {
    const initialValues = {
      icon: '',
      slug: '',
      acceptanceRequired: false,
      policyTranslations: [] as IPolicyTranslation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: IPolicyTranslation[] = [];

      locales.map((locale, _index) => {
        const translationData = initialData?.policyTranslations?.find(
          translation => {
            if (translation.localeId === locale.code) {
              return translation;
            }
          },
        );

        if (translationData) {
          mapTranslation.push(translationData);
        } else {
          mapTranslation.push({
            localeId: locale.code,
            title: '',
            content: '{}',
            blocks: [],
          } as IPolicyTranslation);
        }
      });

      return {
        icon: initialData?.icon,
        slug: initialData?.slug,
        acceptanceRequired: initialData?.acceptanceRequired,
        policyTranslations: mapTranslation,
      };
    }

    return initialValues;
  };

  const handleTagChange = (e: number, formikData: FormikProps<IPolicy>) => {
    if (e === 0) {
      formikData.setFieldValue('slug', '');
      return;
    } else if (e === 1) {
      formikData.setFieldValue('slug', 'terms-and-conditions');
      return;
    } else if (e === 2) {
      formikData.setFieldValue('slug', 'privacy-policy');
      return;
    }
  };

  const getInitialTag = () => {
    if (initialData?.slug === 'terms-and-conditions') {
      return {
        id: 1,
        name: initialData?.slug,
      } as Item;
    } else if (initialData?.slug === 'privacy-policy') {
      return {
        id: 2,
        name: initialData?.slug,
      } as Item;
    }
    return {
      id: 0,
      name: 'Select tag',
    } as Item;
  };

  const anyErrors = error.has;

  return (
    <>
      {!_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={anyErrors}
            snackContent={
              error.message
                ? error.message
                : 'Something went wrong, please try again'
            }
          />
          <AlertDialog
            buttonFunction={() => handleDelete()}
            buttontText="Delete"
            modalTitle="Delete policy"
            setShow={value => setshowModal(value)}
            show={showModal}
          >
            <Heading
              intent={'h6'}
            >{`Are you sure you want to delete "${initialData?.policyTranslations?.find(
              t => t.localeId === 'en',
            )?.title}"?`}</Heading>
            <Text
              className="text-tints-battleship-grey-tint-3 mt-2"
              size={'sm'}
              weight={'normal'}
            >
              {
                'You cannot undo this action. All text and information associated with this policy will be permanently deleted.'
              }
            </Text>
          </AlertDialog>
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as IPolicy);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={schema}
          >
            {formikProps => (
              <Form
                onChange={() => {}}
                onSubmit={e => {
                  e.preventDefault();

                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="policyTranslations">
                  {({ replace, remove }: FieldArrayRenderProps) => (
                    <div>
                      <div>
                        <div className="flex flex-row gap-6 mb-6">
                          <div className="w-[279px] mt-4">
                            <Text size={'md'} weight={'normal'}>
                              Policy tag<span className="text-red">*</span>
                            </Text>
                            <div className="w-72 mt-2">
                              {action === FormActions.ADD && (
                                <SingleSelect
                                  initialSelected={getInitialTag()}
                                  items={options}
                                  tabIndex={e => {
                                    handleTagChange(
                                      e as number,
                                      formikProps as FormikProps<IPolicy>,
                                    );
                                  }}
                                />
                              )}
                              {action === FormActions.EDIT && (
                                <SingleSelect
                                  initialSelected={getInitialTag()}
                                  items={options}
                                  tabIndex={e => {
                                    handleTagChange(
                                      e as number,
                                      formikProps as FormikProps<IPolicy>,
                                    );
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="mt-14">
                            <Checkbox
                              checked={formikProps.values.acceptanceRequired}
                              label={'Acceptance required'}
                              onChange={() => {
                                if (
                                  formikProps.values.acceptanceRequired === true
                                ) {
                                  formikProps.setFieldValue(
                                    'acceptanceRequired',
                                    false,
                                  );
                                } else {
                                  formikProps.setFieldValue(
                                    'acceptanceRequired',
                                    true,
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Text
                            intent={'battleshipShadeTwo'}
                            size={'sm'}
                            weight={'normal'}
                          >
                            Choose an icon<span className="text-red">*</span>
                          </Text>
                          <div className="flex gap-5 mt-2">
                            <div
                              className={
                                formikProps.values.icon === 'clipboard'
                                  ? 'icon-div-selected'
                                  : 'icon-div'
                              }
                            >
                              <ClipboardText
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'clipboard')
                                }
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
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'shield')
                                }
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
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'people')
                                }
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
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'lock')
                                }
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
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'emoji')
                                }
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
                                onClick={() =>
                                  formikProps.setFieldValue('icon', 'cardtick')
                                }
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
                        <div className="flex flex-col gap-3 w-full mt-10">
                          <div className="w-full flex-col">
                            <div className="flex-col gap-6">
                              <div className="flex gap-3 mb-5">
                                <Text size={'md'}>Translations</Text>
                                <Text
                                  className="flex items-center justify-center text-tints-battleship-grey-tint-2 gap-3"
                                  size={'sm'}
                                >
                                  (Changes will be saved automatically)
                                </Text>
                              </div>
                            </div>
                            <div className="">
                              <div className="w-full">
                                <Tabs
                                  formikProps={
                                    formikProps.errors.policyTranslations as []
                                  }
                                  intent="Secondary"
                                  tabData={tabData}
                                  tabIndex={e => {
                                    setLanguage({
                                      language: localesData![e].code,
                                      tabIndex: e,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {language?.language && (
                          <SinglePolicyTranslation
                            action={action}
                            formikProps={formikProps as FormikProps<IPolicy>}
                            key={language.language}
                            remove={remove}
                            replace={replace}
                            selectedLanguage={language}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className="flex flex-row justify-end pt-8">
                            <Button
                              className="h-12 w-50 mr-4"
                              intent={'secondary'}
                              onClick={() =>
                                handleReset(formikProps as FormikProps<IPolicy>)
                              }
                              size={'md'}
                              type="reset"
                            >
                              <span className="m-auto">Reset</span>
                            </Button>

                            <Button
                              className="h-12 w-50"
                              disabled={isPolicyFormSubmitting}
                              loading={isPolicyFormSubmitting}
                              size={'md'}
                              type="submit"
                            >
                              <span className="m-auto">Create policy</span>
                            </Button>
                          </div>
                        )}
                        {action === FormActions.EDIT && (
                          <>
                            <div className="flex justify-end gap-5 pt-10">
                              <Button
                                intent={'danger'}
                                loading={deletePolicy.isLoading}
                                onClick={() => {
                                  setshowModal(true);
                                }}
                                size={'md'}
                                type="button"
                              >
                                Delete policy
                              </Button>

                              <Button
                                disabled={isPolicyFormSubmitting}
                                loading={isPolicyFormSubmitting}
                                size={'md'}
                                type="submit"
                              >
                                Save changes
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
