'use client';

import {
  getSignedUrl,
  uploadFile,
} from '@/api/static-content-upload/static-content-upload';
import {
  Button,
  Heading,
  Input,
  InputContainer,
  Item,
  SingleSelect,
  Tabs,
  Text,
} from '@/components/atomic';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetLocales } from '@/hooks/locale/locale';
import { useGetLiteStages } from '@/hooks/stage/stage';
import {
  useCreateStory,
  useDeleteStory,
  useEditStory,
} from '@/hooks/story/story';
import { Locale } from '@/types/locale/locale.type';
import { StaticContent } from '@/types/static-content/static-content.type';
import { Story, Translation } from '@/types/stories/story.type';
import getQueryClient from '@/utils/getQueryClient';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import CustomCan from '../casl/CustomCan';
import { TranslationForm } from './TranslationForms';
import { schema } from './story-form-validation';
import { AlertDialog } from '../atomic/Modal';
import { StageLite } from '@/types/stage/stage.type';

export interface Props {
  action: FormActions;
  initialData?: Story;
  setSlideOver?: (value: boolean) => void;
}

export const StoryForm = ({ action, initialData, setSlideOver }: Props) => {
  const queryClient = getQueryClient();
  const { data: localesData } = useGetLocales();
  const { data: stagesData } = useGetLiteStages();
  const deleteStory = useDeleteStory();
  const createStory = useCreateStory();
  const editStory = useEditStory(initialData?.id as string);
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [stages, setStages] = useState<StageLite[]>([]);
  const [show, setShow] = useState<boolean>();
  const [key, setKey] = useState<number>(0);
  const [showModal, setshowModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Set api data to state
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

  const getStage = () => {
    const mappedStages = stages.map((data: StageLite) => {
      return {
        id: data.id,
        name: `Stage ${data.number.toString()}`,
      };
    });

    return mappedStages as Item[];
  };

  const getInitialStage = () => {
    if (!_.isNil(initialData?.stage?.number)) {
      return {
        id: initialData?.stageId,
        name: `Stage ${initialData?.stage?.number}`,
      } as Item;
    }
    return undefined;
  };

  const handleSubmit = async (values: Story) => {
    setIsFormSubmitting(true);
    const translations = values?.stageStoryTranslations.filter(translation => {
      return !_.isEmpty(translation?.title);
    });
    values.stageStoryTranslations = translations;
    if (translations) {
      for (const translation of translations) {
        if (!translation.audioKey && _.isEmpty(translation.audioKey)) {
          const payload: StaticContent = {
            fileName: translation?.audioFile?.name,
            contentType: translation?.audioFile?.type,
            module: 'story-media',
            fileSize: translation?.audioFile?.size,
          };
          try {
            // Call signed url api
            const response = await getSignedUrl(payload);
            // Upload file to s3
            if (response.status === 201) {
              const fileUploadResponse = await uploadFile(
                translation.audioFile as File,
                response.data.s3Url,
              );

              if (fileUploadResponse.status === 200) {
                translation.audioKey = `story-media/${response.data.uniqueFileName}`;
                delete translation.audioFile;
              } else {
                setShow(true);
              }
            } else {
              setShow(true);
            }
          } catch (error) {
            setShow(true);
            return;
          }
        }
      }
    }
    if (_.isEmpty(values?.stageId)) {
      delete values?.stageId;
    }

    if (action === FormActions.ADD) {
      const response = await createStory.mutateAsync(values!);
      if (response?.status === 201) {
        setSlideOver!(false);
      } else {
        setShow(true);
      }
    }
    if (action === FormActions.EDIT) {
      delete values?.createdAt;
      delete values?.updatedAt;
      delete values?.id;

      values?.stageStoryTranslations.map(translation => {
        delete translation.createdAt;
        delete translation.updatedAt;
        delete translation.stageStoryId;
      });

      const response = await editStory.mutateAsync(values!);

      if (response?.status === 200) {
        setSlideOver!(false);
      } else {
        setShow(true);
      }
    }
    setIsFormSubmitting(false);
  };

  const handleReset = (formikData: FormikProps<Story>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  const handleDelete = async () => {
    const response = await deleteStory.mutateAsync(initialData?.id as string);
    if (response?.status === 200) {
      queryClient.invalidateQueries(['stories']);
      setSlideOver!(false);
    } else {
      setShow(true);
    }
  };

  const getInitialData = () => {
    const initialValues = {
      stageId: '',
      longitude: '',
      latitude: '',
      stageStoryTranslations: [] as Translation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: Translation[] = [];

      locales.map(locale => {
        const translationData = initialData?.stageStoryTranslations.find(
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
            description: '',
            audioFile: undefined,
          } as Translation);
        }
      });

      return {
        stageId: initialData?.stageId,
        longitude: initialData?.longitude,
        latitude: initialData?.latitude,
        stageStoryTranslations: mapTranslation,
      };
    }

    return initialValues;
  };

  return (
    <>
      {!_.isEmpty(stagesData) && !_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={show as boolean}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as Story);
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
                <FieldArray name="stageStoryTranslations">
                  {({ replace, remove }: FieldArrayRenderProps) => (
                    <div>
                      <div className="flex flex-col gap-5	mb-6">
                        <Text
                          className="tracking-wide"
                          intent={'forestGreenTintTwo'}
                          size={'xs'}
                          weight={'bold'}
                        >
                          STAGES AND COORDINATES
                        </Text>
                        <div className="flex w-full lg:flex-row flex-col lg:gap-y-0 gap-y-2">
                          <div className="flex mr-6 w-[279px] flex-col">
                            <Text
                              className="pb-[10px]"
                              size={'md'}
                              weight={'normal'}
                            >
                              Stage
                            </Text>
                            <div className="w-full">
                              {action === FormActions.ADD && (
                                <SingleSelect
                                  items={getStage()}
                                  placeholderText="Select stage"
                                  tabIndex={e => {
                                    formikProps.setFieldValue('stageId', e);
                                  }}
                                />
                              )}
                            </div>
                            {action === FormActions.EDIT &&
                              !_.isEmpty(initialData?.id) && (
                                <SingleSelect
                                  initialSelected={getInitialStage()}
                                  items={getStage()}
                                  placeholderText="Select stage"
                                  tabIndex={e => {
                                    formikProps.setFieldValue('stageId', e);
                                  }}
                                />
                              )}

                            <Text className="mt-1" intent={'red'} size="xs">
                              {formikProps.errors.stageId &&
                                formikProps.touched.stageId &&
                                formikProps.errors.stageId}
                            </Text>
                          </div>

                          <div className="mr-4 w-[279px]">
                            <Text
                              className="after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                              weight={'normal'}
                            >
                              Latitude
                            </Text>
                            <InputContainer
                              className="mt-2"
                              error={
                                formikProps.errors.latitude &&
                                formikProps.touched.latitude
                                  ? [formikProps.errors.latitude]
                                  : undefined
                              }
                            >
                              <Input
                                className="rounded"
                                containerClassName="w-full"
                                name="latitude"
                                onBlur={formikProps.handleBlur}
                                onChange={formikProps.handleChange}
                                placeholder={'Enter latitude'}
                                value={formikProps.values.latitude}
                              />
                            </InputContainer>
                          </div>
                          <div className="w-[279px]">
                            <Text
                              className="after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                              weight={'normal'}
                            >
                              Longitude
                            </Text>
                            <InputContainer
                              className="mt-2"
                              error={
                                formikProps.errors.longitude &&
                                formikProps.touched.longitude
                                  ? [formikProps.errors.longitude]
                                  : undefined
                              }
                            >
                              <Input
                                className="rounded"
                                containerClassName="w-full"
                                name="longitude"
                                onBlur={formikProps.handleBlur}
                                onChange={formikProps.handleChange}
                                placeholder={'Enter longitude'}
                                value={formikProps.values.longitude}
                              />
                            </InputContainer>
                            <Text intent={'green'} size={'sm'}></Text>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full mt-10">
                          <div className="w-full flex-col">
                            <div className="flex-col gap-6">
                              <div className="flex gap-3 mb-5 items-center">
                                <Text size={'md'}>Translations</Text>
                                <Text intent={'battleshipShadeTwo'} size={'sm'}>
                                  (Changes will be saved automatically)
                                </Text>
                              </div>
                            </div>
                            <div className="">
                              <div className="w-full">
                                <Tabs
                                  formikProps={
                                    formikProps.errors
                                      .stageStoryTranslations as []
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
                        <Text
                          className="tracking-wide"
                          intent={'forestGreenTintTwo'}
                          size={'xs'}
                          weight={'bold'}
                        >
                          STORY POINT INFORMATION
                        </Text>
                        {language?.language && (
                          <TranslationForm
                            action={action}
                            formikProps={formikProps as FormikProps<Story>}
                            remove={remove}
                            replace={replace}
                            selectedLanguage={language}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className="flex justify-end gap-6 mb-10">
                            <Button
                              intent={'secondary'}
                              onClick={() =>
                                handleReset(formikProps as FormikProps<Story>)
                              }
                              type="reset"
                            >
                              Reset
                            </Button>

                            <Button
                              disabled={isFormSubmitting}
                              loading={isFormSubmitting}
                              type="submit"
                            >
                              Create story point
                            </Button>
                          </div>
                        )}
                        {action === FormActions.EDIT && (
                          <>
                            <div className="flex justify-end gap-6 mb-10">
                              <CustomCan
                                a={Subject.Trail}
                                I={UserActions.Delete}
                              >
                                <Button
                                  intent={'danger'}
                                  loading={deleteStory.isLoading}
                                  onClick={() => {
                                    setshowModal(true);
                                  }}
                                  type="button"
                                >
                                  Delete story point
                                </Button>
                              </CustomCan>
                              <Button
                                disabled={isFormSubmitting}
                                loading={isFormSubmitting}
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
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete audio story"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.stageStoryTranslations.find(
            t => t.localeId === 'en',
          )?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All text and information associated with this audio story will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
