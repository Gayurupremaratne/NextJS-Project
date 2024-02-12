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
import { Button, Heading, Item, MultiSelect, Text } from '@/components/atomic';
import { createTagValidation } from './tag-form-validation';
import { useGetLocales } from '@/hooks/locale/locale';
import { Locale } from '@/types/locale/locale.type';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { FormActions } from '@/constants/form-actions';
import { ITag, ITagTranslation } from '@/types/tags/tags';
import { TagTranslationForm } from './TagTranslationForm';
import {
  useCreateTag,
  useCreateTagAssociation,
  useCreateTagTranslation,
  useDeleteTag,
} from '@/hooks/tag/tag';
import { AlertDialog } from '../atomic/Modal';
import { StageLite } from '@/types/stage/stage.type';
import TranslationFormTabs from './TranslationFormTabs';

export interface Props {
  action: FormActions;
  initialData?: ITag;
  setSlideOver?: (value: boolean) => void;
}

export const TagForm = ({ action, initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const { data: stagesData } = useGetLiteStages();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const createTagTranslation = useCreateTagTranslation();
  const createTagAssociation = useCreateTagAssociation();
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [stages, setStages] = useState<StageLite[]>([]);
  const [key, setKey] = useState<number>(0);
  const [showModal, setshowModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [selectedStages, setSelectedStages] = useState<Item[]>([]);

  useEffect(() => {
    if (action === FormActions.EDIT && initialData?.stageTagAssociation) {
      setSelectedStages(
        initialData.stageTagAssociation.map(stage => ({
          id: stage.stageId,
          name: `Stage ${stage.stage.number.toString()}`,
        })),
      );
    } else {
      setSelectedStages([]);
    }
  }, [action, initialData?.stageTagAssociation]);

  const getStage = () => {
    return stages.map((data: StageLite) => {
      return {
        id: data.id,
        name: `Stage ${data.number.toString()}`,
      };
    });
  };

  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
    if (stagesData && stagesData.length > 0) {
      setStages(stagesData);
    }
  }, [localesData, stagesData]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));

  const handleStageChange = (
    selectedItems: Item[],
    formikData: FormikProps<ITag>,
  ) => {
    setSelectedStages(selectedItems);
    const newStageTagAssociation = selectedItems.map(selectedItem => ({
      id: selectedItem.id,
      name: selectedItem.name,
    }));

    formikData.setFieldValue('stageTagAssociation', newStageTagAssociation);
  };

  const handleSubmit = async (values: ITag) => {
    setIsFormSubmitting(true);
    const tagTranslations = values.stageTagTranslation.filter(value => {
      return !(_.isEmpty(value?.name) && value?.localeId !== 'en');
    });
    values.stageTagTranslation = tagTranslations;

    const stageTagAssociations = values?.stageTagAssociation;

    const StageTagAssociationsIds: string[] = (stageTagAssociations ?? [])
      .filter(item => item.id)
      .map(item => item.id);

    if (tagTranslations) {
      if (action === FormActions.ADD) {
        const createdTag = await createTag.mutateAsync();
        if (createdTag?.status === 201) {
          const translationPromises = tagTranslations.map(tagTranslation =>
            createTagTranslation.mutateAsync({
              ...tagTranslation,
              stageTagId: createdTag.data.data.id,
            }),
          );
          await Promise.all(translationPromises);

          if (StageTagAssociationsIds.length > 0) {
            const finalTagAssociationPayload = {
              stageIds: StageTagAssociationsIds,
              stageTagId: createdTag.data.data.id,
            };

            await createTagAssociation.mutateAsync(finalTagAssociationPayload);
          }

          setSlideOver!(false);
        }
      }
      if (action === FormActions.EDIT) {
        delete values?.id;
        const enTagTranslation = tagTranslations.find(
          tagTranslation => tagTranslation.localeId === 'en',
        );
        const translationPromises = tagTranslations.map(tagTranslation =>
          createTagTranslation.mutateAsync({
            localeId: tagTranslation.localeId,
            name: tagTranslation.name,
            stageTagId: enTagTranslation?.stageTagId,
          }),
        );
        await Promise.all(translationPromises);

        if (StageTagAssociationsIds.length > 0) {
          const finalTagAssociationPayload = {
            stageIds: StageTagAssociationsIds,
            stageTagId: initialData?.id,
          };

          await createTagAssociation.mutateAsync(finalTagAssociationPayload);
        }
        setSlideOver!(false);
      }
    }
    setIsFormSubmitting(false);
  };

  const handleDelete = async () => {
    const response = await deleteTag.mutateAsync(initialData?.id as string);
    if (response?.status === 200) {
      setSlideOver!(false);
    }
  };

  const getInitialData = () => {
    const initialValues: ITag = {
      id: initialData?.id ?? '',
      stageTagAssociation: initialData?.stageTagAssociation ?? [],
      stageTagTranslation:
        initialData?.stageTagTranslation ?? ([] as ITagTranslation[]),
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: ITagTranslation[] = [];
      locales.forEach(locale => {
        const translationData = initialData?.stageTagTranslation?.find(
          translation => translation.localeId === locale.code,
        );
        if (translationData) {
          mapTranslation.push(translationData);
        } else {
          mapTranslation.push({
            localeId: locale.code,
            name: '',
          } as ITagTranslation);
        }
      });

      return {
        stageTagAssociation: initialData?.stageTagAssociation ?? [],
        stageTagTranslation: mapTranslation,
      };
    }
    return initialValues;
  };

  const handleReset = (formikData: FormikProps<ITag>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  return (
    <>
      {!_.isEmpty(stagesData) && !_.isEmpty(localesData) && (
        <div key={key}>
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              handleSubmit(values);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={createTagValidation}
          >
            {formikProps => (
              <Form
                onChange={() => {}}
                onSubmit={e => {
                  e.preventDefault();

                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="stageTagTranslation">
                  {({ replace }: FieldArrayRenderProps) => (
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col lg:flex-row lg:gap-5 pb-7 gap-0 mr-4">
                        <div className="flex-col gap-2 flex w-64">
                          <Text size={'md'}>Stage</Text>
                          {action === FormActions.ADD && (
                            <MultiSelect
                              items={getStage()}
                              onSelectedItemsChange={selectedItems => {
                                setSelectedStages(selectedItems);
                                handleStageChange(
                                  selectedItems,
                                  formikProps as unknown as FormikProps<ITag>,
                                );
                              }}
                            />
                          )}
                          {action === FormActions.EDIT &&
                            !_.isEmpty(initialData) && (
                              <MultiSelect
                                initialSelected={selectedStages}
                                items={getStage()}
                                onSelectedItemsChange={selectedItems => {
                                  setSelectedStages(selectedItems);
                                  handleStageChange(selectedItems, formikProps);
                                }}
                              />
                            )}
                        </div>
                      </div>
                      <hr className="border-t border-tints-battleship-grey-tint-5 border-dashed mr-4" />
                      <div className="flex flex-col  mr-4">
                        <div className="flex flex-col gap-3 w-full mt-7">
                          <div className="w-full flex-col">
                            <div className="flex-col gap-6">
                              <div className="flex gap-3 mb-5">
                                <Heading intent={'h6'} weight={'normal'}>
                                  Translations
                                </Heading>
                                <Text
                                  className="text-tints-battleship-grey-tint-2 gap-3"
                                  size={'sm'}
                                  weight={'medium'}
                                >
                                  (Changes will be saved automatically)
                                </Text>
                              </div>
                            </div>
                            <div className="">
                              <div className="w-full">
                                <TranslationFormTabs
                                  formikProps={
                                    formikProps.errors.stageTagTranslation as []
                                  }
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
                          <TagTranslationForm
                            action={action}
                            formikProps={formikProps}
                            replace={replace}
                            selectedLanguage={language}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className={'pt-10 pb-4 flex justify-end gap-5'}>
                            <Button
                              intent="secondary"
                              onClick={() => {
                                handleReset(formikProps);
                              }}
                              type="reset"
                            >
                              Reset
                            </Button>
                            <Button
                              disabled={isFormSubmitting}
                              loading={isFormSubmitting}
                              type="submit"
                            >
                              Create tag
                            </Button>
                          </div>
                        )}
                        {action === FormActions.EDIT && (
                          <div className="pt-10 flex justify-end gap-5">
                            <Button
                              intent="danger"
                              loading={deleteTag.isLoading}
                              onClick={() => {
                                setshowModal(true);
                              }}
                              type="button"
                            >
                              Delete tag
                            </Button>
                            <Button
                              disabled={isFormSubmitting}
                              loading={isFormSubmitting}
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </div>
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
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete Tag"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.stageTagTranslation.find(
            t => t.localeId === 'en',
          )?.name}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All text and information associated with this tag will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
