'use client';

import React, { useEffect, useState } from 'react';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';
import { Button, Heading, Tabs, Text } from '@/components/atomic';
import { schema } from './group-policy-form-validation';
import { useGetLocales } from '@/hooks/locale/locale';
import { Locale } from '@/types/locale/locale.type';
import { FormActions } from '@/constants/form-actions';
import { AlertDialog } from '../atomic/Modal';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { IPolicy, IPolicyTranslation } from '@/types/policy/policy.type';
import {
  useCreatePolicy,
  useDeletePolicy,
  useEditPolicy,
  useUpsertPolicyTranslation,
} from '@/hooks/policy/policy';
import { ChildForm } from '@/components/policy-form/ChildForm';
import { AxiosError, AxiosResponse } from 'axios';
import { OutputData } from '@editorjs/editorjs';
import { useQueryClient } from '@tanstack/react-query';

export interface Props {
  action: FormActions;
  initialData?: IPolicy;
  setSlideOver?: (value: boolean) => void;
}

export const GroupForm = ({ action, initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const [showModal, setShowModal] = useState(false);
  const deletePolicy = useDeletePolicy();
  const createPolicy = useCreatePolicy();
  const upsertPolicy = useUpsertPolicyTranslation();
  const editPolicy = useEditPolicy();
  const queryClient = useQueryClient();
  let errorOccurred = false;
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [show, setShow] = useState<boolean>();
  const [errorText, setErrorText] = useState('');
  const [key, setKey] = useState<number>(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Set api data to state
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
  }, [localesData]);

  const tabData = locales?.map((obj, _index) => ({
    title: obj.name,
    content: <></>,
  }));

  const deleteParentPolicy = async (id: string) => {
    try {
      await deletePolicy.mutateAsync(id);
      queryClient.invalidateQueries(['allPolicies']);
      return;
    } catch (error) {
      setErrorText('Something went wrong, Please try again');
      setShow(true);
    }
  };
  const setSlideOverByResponse = (
    results: (AxiosResponse | AxiosError | undefined)[],
    id: string,
  ) => {
    if (results?.every(result => result?.status == 200)) {
      queryClient.invalidateQueries(['allPolicies']);
      setSlideOver!(false);
    } else {
      deleteParentPolicy(id);
    }
  };

  const hasDuplicateSlugs = (translations: IPolicyTranslation[]) => {
    const slugMap: { [key: string]: boolean } = {};

    for (const translation of translations) {
      if (translation.slug) {
        if (slugMap[translation.slug]) {
          return true;
        }
        slugMap[translation.slug] = true;
      }
    }

    return false;
  };

  const setDuplicateSlugError = () => {
    setErrorText('A policy with the same tag already exists');
    setShow(true);
    setIsFormSubmitting(false);
    errorOccurred = true;
  };

  const setError = () => {
    setErrorText('Something went wrong, Please try again');
    setShow(true);
    setIsFormSubmitting(false);
  };

  const handleSubmit = async (values: IPolicyTranslation) => {
    setIsFormSubmitting(true);
    const filteredPolicies = values.childPolicies?.filter(value => {
      return !_.isEmpty(value?.title);
    });

    const orderDict: { [key: number]: IPolicyTranslation[] } = {};

    // Iterate through the childPolicies array.
    filteredPolicies?.forEach(item => {
      const order = item.order;

      if (order !== undefined) {
        if (order in orderDict) {
          orderDict[order].push(item);
        } else {
          orderDict[order] = [item];
        }
      }
    });

    const orderDictEntries = Object.entries(orderDict);

    for (const entries of orderDictEntries) {
      const [order, objects] = entries;
      const enTranslation = objects.find(obj => obj.localeId === 'en');

      if (!enTranslation) {
        setErrorText(
          `English translation is required for "child policy ${order}"`,
        );
        setShow(true);
        setIsFormSubmitting(false);
        return;
      }
    }

    const filteredPoliciesForSlug = values.childPolicies?.filter(
      (policy: IPolicyTranslation) => policy.localeId === 'en',
    );
    const hasDuplicates = hasDuplicateSlugs(
      filteredPoliciesForSlug as IPolicyTranslation[],
    );
    // If child policies have same slugs, show error
    if (hasDuplicates) {
      setErrorText('Child policies cannot have the same tags');
      setShow(true);
      setIsFormSubmitting(false);
      return;
    }

    if (action === FormActions.ADD) {
      const createPolicyPayload: IPolicy = {
        isGroupParent: true,
        icon: values.icon,
        acceptanceRequired: false,
      };

      const response = await createPolicy.mutateAsync(createPolicyPayload);

      if (response?.status === 201) {
        const translationPromises = values.policyTranslations!.map(
          async (translation, _index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { policyId, localeId, title, ...rest } = translation;

            return upsertPolicy.mutateAsync({
              ...rest,
              policyId: response.data.data.id,
              localeId: translation.localeId,
              title: title,
            });
          },
        );

        for (const translationPromise of translationPromises) {
          const result = await translationPromise;
          if (result?.status !== 200) {
            setError();
            if (!_.isEmpty(response.data.data.id)) {
              deleteParentPolicy(response.data.data.id);
            }
            return;
          }
        }

        // Create an array to store AxiosResponse objects
        const childPolicyUpsertPromises:
          | (AxiosResponse | undefined)[]
          | undefined = [];
        try {
          await Promise.all(
            Object.entries(orderDict).map(async ([_order, objects]) => {
              const enTranslation = objects.find(obj => obj.localeId === 'en');
              const createChildPolicyPayload: IPolicy = {
                isGroupParent: false,
                parentPolicyId: response.data.data.id,
                acceptanceRequired: enTranslation?.acceptanceRequired,
                order: enTranslation?.order,
              };
              if (enTranslation && enTranslation.slug !== '') {
                createChildPolicyPayload.slug = enTranslation.slug;
              }

              const childResponse = await createPolicy.mutateAsync(
                createChildPolicyPayload,
              );

              if (
                childResponse?.status === 201 &&
                !_.isEmpty(childResponse.data.data.id)
              ) {
                // Map objects to promises and store them in childPolicyUpsertPromises
                const promises = objects.map(async obj => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { localeId, title, content, description, ...rest } =
                    obj;
                  const upsertChildPolicyTranslations = {
                    policyId: childResponse.data.data.id,
                    localeId: localeId,
                    title: title,
                    content: content,
                    description: description,
                  };
                  return upsertPolicy.mutateAsync(
                    upsertChildPolicyTranslations,
                  );
                });

                // Wait for all promises to resolve and store the AxiosResponse objects
                const resolvedResponses = await Promise.all(promises);
                childPolicyUpsertPromises.push(...resolvedResponses);
              }
            }),
          );
          setSlideOverByResponse(
            childPolicyUpsertPromises,
            response.data.data.id,
          );
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status) {
            deleteParentPolicy(response.data.data.id);
            setDuplicateSlugError();
            return;
          }
          deleteParentPolicy(response.data.data.id);
          setError();
          return;
        }
      }
    }
    // Edit group policy
    if (action === FormActions.EDIT) {
      const updatePolicyPayload: IPolicy = {
        id: initialData?.id,
        icon: values.icon,
      };
      // Create an array to store AxiosResponse objects
      const childPolicyUpsertPromises: (AxiosResponse | undefined)[] = [];
      const childPolicyCreatePromises: (AxiosResponse | undefined)[] = [];

      try {
        const response = await editPolicy.mutateAsync(updatePolicyPayload);
        if (response?.status === 200) {
          const translations = values.policyTranslations;

          if (translations) {
            for (const translation of translations) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { policyId, localeId, title, ...rest } = translation;
                delete rest.createdAt;
                await upsertPolicy.mutateAsync({
                  policyId: response?.data.data.id,
                  localeId: translation.localeId,
                  title: title,
                });
              } catch (translationError) {
                setError();
                errorOccurred = true;
                break;
              }
            }
          }
          const enPoliciesIds =
            (values.childPolicies ?? [])
              .filter(obj => obj.localeId === 'en')
              .map(obj => obj.id) || [];
          const initialENPoliciesIds =
            (initialData?.childPolicies ?? [])
              .filter(obj => !_.isEmpty(obj.id))
              .map(obj => obj.id) || [];

          const policiesToDelete = initialENPoliciesIds.filter(
            id => !enPoliciesIds.includes(id),
          );

          if (policiesToDelete) {
            for (const id of policiesToDelete) {
              try {
                await deletePolicy.mutateAsync(id as string);
              } catch (deleteError) {
                setError();
                errorOccurred = true;
                break;
              }
            }
          }
          // }

          await Promise.all(
            Object.entries(orderDict).map(async ([_order, objects]) => {
              const enTranslation = objects.find(
                obj => !_.isEmpty(obj.title) && obj.localeId === 'en',
              );

              if (enTranslation && enTranslation.id !== '') {
                setShow(false);
                try {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { id, slug, acceptanceRequired, ...restEnTranslation } =
                    enTranslation;
                  const updateChildPolicyPayload: IPolicy = {
                    id: id,
                    acceptanceRequired: acceptanceRequired,
                    slug: null,
                  };
                  const initialPolicyBySlug = initialData?.childPolicies?.find(
                    childPolicy => childPolicy.slug === slug,
                  );
                  if (initialPolicyBySlug && initialPolicyBySlug.id !== id) {
                    const editResponse = await editPolicy.mutateAsync({
                      id: id,
                      slug: null,
                    });
                    if (editResponse?.status !== 200) {
                      setError();
                      errorOccurred = true;
                      return;
                    }
                  }
                  if (enTranslation && enTranslation.slug !== '') {
                    updateChildPolicyPayload.slug = slug;
                  }
                  updateChildPolicyPayload.order = enTranslation.order;
                  const childPolicyResponse = await editPolicy.mutateAsync(
                    updateChildPolicyPayload,
                  );
                  if (
                    childPolicyResponse?.status === 200 &&
                    !_.isEmpty(childPolicyResponse.data.data.id)
                  ) {
                    // Map objects to promises and store them in childPolicyUpsertPromises
                    const promises = objects.map(async obj => {
                      const {
                        localeId,
                        title,
                        content,
                        description,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ...restObj
                      } = obj;
                      const upsertChildPolicyTranslations = {
                        policyId: childPolicyResponse.data.data.id,
                        localeId: localeId,
                        title: title,
                        content: content,
                        description: description,
                      };
                      return upsertPolicy.mutateAsync(
                        upsertChildPolicyTranslations,
                      );
                    });

                    // Wait for all promises to resolve and store the AxiosResponse objects
                    const resolvedResponses = await Promise.all(promises);
                    childPolicyUpsertPromises.push(...resolvedResponses);
                  }
                } catch (error) {
                  setDuplicateSlugError();
                  return;
                }
              }
              if (enTranslation?.id === '') {
                try {
                  const createChildPolicyPayload: IPolicy = {
                    isGroupParent: false,
                    parentPolicyId: response.data.data.id,
                    acceptanceRequired: enTranslation?.acceptanceRequired,
                    order: enTranslation?.order,
                  };

                  const policyWithSlug = initialData?.childPolicies?.find(
                    childPolicy =>
                      !_.isEmpty(childPolicy.slug) &&
                      childPolicy.slug === enTranslation.slug,
                  );

                  if (policyWithSlug) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...rest } = policyWithSlug;

                    const editPolicyPayload: IPolicy = {
                      id: id,
                      slug: null,
                    };

                    await editPolicy.mutateAsync(editPolicyPayload);
                  }
                  if (enTranslation && enTranslation.slug !== '') {
                    createChildPolicyPayload.slug = enTranslation.slug;
                  }
                  const childResponse = await createPolicy.mutateAsync(
                    createChildPolicyPayload,
                  );
                  if (
                    childResponse?.status === 201 &&
                    !_.isEmpty(childResponse.data.data.id)
                  ) {
                    // Map objects to promises and store them in childPolicyUpsertPromises
                    const promises = objects.map(async obj => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { localeId, title, content, description, ...rest } =
                        obj;
                      const upsertChildPolicyTranslations = {
                        policyId: childResponse.data.data.id,
                        localeId: localeId,
                        title: title,
                        content: content,
                        description: description,
                      };
                      return upsertPolicy.mutateAsync(
                        upsertChildPolicyTranslations,
                      );
                    });

                    // Wait for all promises to resolve and store the AxiosResponse objects
                    const resolvedResponses = await Promise.all(promises);
                    childPolicyCreatePromises.push(...resolvedResponses);
                  }
                } catch (error) {
                  setDuplicateSlugError();
                  return;
                }
              }
            }),
          );
        }
      } catch (error) {
        setError();
        return;
      }

      if (!errorOccurred) {
        queryClient.invalidateQueries(['allPolicies']);
        setSlideOver!(false);
      }
    }
    setIsFormSubmitting(false);
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
      } catch (error) {
        setErrorText('Something went wrong, Please try again');
        setShow(true);
      }
    }
  };

  const orderChildPolicies = (array: IPolicyTranslation[]) => {
    return array.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
  };

  const fillPolicyTranslationArray = (array: IPolicyTranslation[]) => {
    // Check if the incoming array has less than 3 objects
    while (array.length < locales.length) {
      // Find a missing locale
      const missingLocale = locales.find(
        locale => !array.some(obj => obj.localeId === locale.code),
      );

      // Create an object with the missing locale and add it to the array
      if (missingLocale) {
        array.push({
          localeId: missingLocale.code,
          title: '',
        });
      } else {
        break;
      }
    }

    const translationDict: Record<string, IPolicyTranslation> = array.reduce(
      (acc, translation) => {
        if (translation.localeId) {
          acc[translation.localeId] = translation;
        }
        return acc;
      },
      {} as Record<string, IPolicyTranslation>,
    );

    // Order the array based on the order of code in locales
    const orderedArray = locales.map(locale => translationDict[locale.code]);

    return orderedArray;
  };

  const fillChildPoliciesArray = (array: IPolicyTranslation[]) => {
    //Check if the incoming array has less than 3 objects
    while (array.length < locales.length) {
      // Find a missing locale
      const missingLocale = locales.find(
        locale => !array.some(obj => obj.localeId === locale.code),
      );

      // Create an object with the missing locale and add it to the array
      if (missingLocale) {
        array.push({
          id: '',
          localeId: missingLocale.code,
          content: '',
          description: '',
          title: '',
          slug: '',
          acceptanceRequired: false,
          order: 1,
          blocks: [],
        });
      } else {
        // All locales are already in the array, break the loop.
        break;
      }
    }

    if (action === FormActions.EDIT) {
      const enObjects = array.filter(item => item.localeId === 'en');

      // Get unique order values from enObjects
      const enOrderValues = enObjects.map(item => item.order);

      enOrderValues.forEach(order => {
        // Check if there is no object with the same order for the current locale
        array.forEach(item => {
          const missingLocales = locales.filter(
            missingLocale =>
              !array.some(obj => obj.localeId === missingLocale.code),
          );

          if (
            !array.find(
              obj => obj.localeId === item.localeId && obj.order === order,
            )
          ) {
            // Push a new object with the respective localeId and missing order
            array.push({
              id: '',
              localeId: item.localeId,
              content: '',
              description: '',
              title: '',
              slug: '',
              acceptanceRequired: false,
              order: order,
              blocks: [],
            });
          } else if (missingLocales) {
            missingLocales.map(missingLocale => {
              array.push({
                id: '',
                localeId: missingLocale.code,
                content: '',
                description: '',
                title: '',
                slug: '',
                acceptanceRequired: false,
                order: order,
                blocks: [],
              });
            });
          }
        });
      });
    }
    const sortedData = orderChildPolicies(array);

    return sortedData;
  };

  const getInitialData = () => {
    let initialValues = {
      policyTranslations: fillPolicyTranslationArray(
        initialData?.policyTranslations || [],
      ),
      childPolicies: fillChildPoliciesArray(initialData?.childPolicies || []),
      icon: '',
    };
    const editChildPolicyTranslations: IPolicyTranslation[] = [];

    if (action === FormActions.ADD) {
      initialValues = {
        policyTranslations: fillPolicyTranslationArray([]),
        childPolicies: fillChildPoliciesArray([]),
        icon: '',
      };
    }

    if (action === FormActions.EDIT) {
      if (initialData?.childPolicies) {
        initialData?.childPolicies?.map(async childPolicy => {
          childPolicy.policyTranslations?.map(async childTranslations => {
            const initialBlocks: OutputData = JSON.parse(
              childTranslations.content as string,
            );
            editChildPolicyTranslations.push({
              id: childPolicy.id,
              localeId: childTranslations.localeId,
              title: childTranslations.title,
              description: childTranslations.description,
              content: childTranslations.content,
              acceptanceRequired: childPolicy.acceptanceRequired,
              slug: childTranslations.localeId === 'en' ? childPolicy.slug : '',
              order: childPolicy.order,
              blocks: initialBlocks.blocks,
            });
          });
        });
      }

      initialValues = {
        policyTranslations: fillPolicyTranslationArray(
          initialData?.policyTranslations || [],
        ),
        childPolicies: fillChildPoliciesArray(editChildPolicyTranslations),
        icon: initialData?.icon as string,
      };
    }
    return initialValues;
  };

  return (
    <>
      {!_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={show as boolean}
            snackContent={errorText}
          />
          <AlertDialog
            buttonFunction={() => handleDelete()}
            buttontText="Delete"
            modalTitle="Delete policy"
            setShow={value => setShowModal(value)}
            show={showModal}
          >
            <Heading
              intent={'h6'}
            >{`Are you sure you want to delete "${initialData?.policyTranslations?.find(
              t => t.localeId === 'en',
            )?.title}"?`}</Heading>
            <Text
              className="text-tints-battleship-grey-tint-3 mt-4"
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
              handleSubmit(values);
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
                  {({ remove }) => (
                    <div>
                      <div>
                        <div className="flex flex-col gap-3 w-full mt-4">
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
                                    formikProps.errors.childPolicies as []
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
                          <ChildForm
                            formikProps={
                              formikProps as FormikProps<IPolicyTranslation>
                            }
                            key={language.language}
                            locales={locales}
                            remove={remove}
                            selectedLanguage={language}
                            setErrorText={setErrorText}
                            setShow={setShow}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className="flex justify-end">
                            <Button
                              className="h-12 w-50 mb-16 mr-4"
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
                              className="h-12 w-50 mb-16"
                              disabled={isFormSubmitting}
                              loading={isFormSubmitting}
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
                                  setShowModal(true);
                                }}
                                size={'md'}
                                type="button"
                              >
                                Delete policy
                              </Button>

                              <Button
                                disabled={isFormSubmitting}
                                loading={isFormSubmitting}
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
