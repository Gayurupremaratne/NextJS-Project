'use client';

import { FormActions } from '@/constants/form-actions';
import { useGetLocales } from '@/hooks/locale/locale';
import {
  useCreatePointOfInterest,
  useDeletePointOfInterest,
  useEditPointOfInterest,
} from '@/hooks/pointOfInterest/pointOfInterest';
import {
  PointOfInterest,
  PointOfInterestRequest,
  PointOfInterestTranslation,
} from '@/types/pointOfInterests/pointOfInterest.type';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Locale } from '@/types/locale/locale.type';
import { StaticContent } from '@/types/static-content/static-content.type';
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
  MultiSelect,
  Tabs,
  Text,
} from '@/components/atomic';
import { useGetLiteStages } from '@/hooks/stage/stage';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { TranslationForm } from './TranslationForms';
import { FileUpload } from '@/components/atomic/FileUpload';
import { schema } from './PointOfInterestFormValidation';
import { AlertDialog } from '@/components/atomic/Modal';
import { StageLite } from '@/types/stage/stage.type';

export interface PointOfInterestFormProps {
  action: FormActions;
  initialData?: PointOfInterest;
  setSlideOver?: (value: boolean) => void;
}

export const PointOfInterestForm = ({
  action,
  initialData,
  setSlideOver,
}: PointOfInterestFormProps) => {
  const { data: stagesData } = useGetLiteStages();
  const { data: localesData } = useGetLocales();
  const createPointOfInterest = useCreatePointOfInterest();
  const updatePointOfInterest = useEditPointOfInterest(
    initialData?.id as string,
  );

  const deletePointOfInterest = useDeletePointOfInterest();

  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);

  const [locales, setLocales] = useState<Locale[]>([]);
  const [stages, setStages] = useState<StageLite[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const [selectedStages, setSelectedStages] = useState<Item[]>([]);
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

  useEffect(() => {
    if (action === FormActions.EDIT && initialData?.pointOfInterestStage) {
      setSelectedStages(
        initialData?.pointOfInterestStage.map(stage => ({
          id: stage.id!,
          name: `Stage ${stage.number!.toString()}`,
        })),
      );
    } else {
      setSelectedStages([]);
    }
  }, [action, initialData?.pointOfInterestStage]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));

  const getStage = () => {
    const mappedStages = stages.map((data: StageLite) => {
      return {
        id: data.id,
        name: `Stage ${data.number!.toString()}`,
      };
    });

    return mappedStages;
  };

  const handleSubmit = async (values: PointOfInterestRequest) => {
    setIsFormSubmitting(true);
    const translations = values.pointOfInterestTranslations.filter(value => {
      return !_.isEmpty(value?.title);
    });

    values.pointOfInterestTranslations = translations;

    if (translations) {
      for (const translation of translations) {
        if (
          _.isEmpty(translation?.title) &&
          _.isEmpty(translation?.description) &&
          values.pointOfInterestTranslations.length > 0 &&
          values.pointOfInterestTranslations[language!.tabIndex]
        ) {
          delete values.pointOfInterestTranslations[language!.tabIndex];
        }
      }
    }

    //upload image s3
    if (_.isEmpty(values.assetKey)) {
      const payload: StaticContent = {
        fileName: values.image?.name,
        contentType: values.image?.type,
        module: 'poi-media',
        fileSize: values.image?.size,
      };
      try {
        // Call signed url api
        const response = await getSignedUrl(payload);
        // Upload file to s3
        if (response.status === 201) {
          const fileUploadResponse = await uploadFile(
            values.image as File,
            response.data.s3Url,
          );
          if (fileUploadResponse.status === 200) {
            values.assetKey = `poi-media/${response.data.uniqueFileName}`;
            delete values.image;
          } else {
            setShowError(true);
          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        setShowError(true);
        return;
      }
    }

    delete values?.id;
    delete values?.createdAt;
    delete values?.updatedAt;

    // Create POI
    if (action === FormActions.ADD) {
      const response = await createPointOfInterest.mutateAsync(values!);
      if (response?.status === 201) {
        setSlideOver!(false);
      } else {
        setShowError(true);
      }
    }
    if (action === FormActions.EDIT) {
      delete values?.createdAt;
      delete values?.updatedAt;
      delete values?.id;

      values?.pointOfInterestTranslations.map(translation => {
        delete translation.createdAt;
        delete translation.updatedAt;
        delete translation.pointOfInterestId;
      });

      const response = await updatePointOfInterest.mutateAsync(values!);

      if (response?.status === 200) {
        setSlideOver!(false);
      } else {
        setShowError(true);
      }
    }
    setIsFormSubmitting(false);
  };

  const handleReset = (formikData: FormikProps<PointOfInterestRequest>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  const handleDelete = async () => {
    const response = await deletePointOfInterest.mutateAsync(
      initialData?.id as string,
    );
    if (response?.status === 200) {
      setSlideOver!(false);
    } else {
      setShowError(true);
    }
  };

  const handleStageChange = (
    selectedItems: Item[],
    formikData: FormikProps<PointOfInterestRequest>,
  ) => {
    setSelectedStages(selectedItems);
    const newStages = selectedItems.map(selectedItem => selectedItem.id);
    formikData.setFieldValue('stageIds', newStages);
  };

  const handleFileChange = (
    formikProps: FormikProps<PointOfInterestRequest>,
    newFile: File | undefined,
  ) => {
    if (newFile === undefined) {
      formikProps.values.assetKey = undefined;
      formikProps.values.image = undefined;
      return;
    }
    formikProps.values.image = newFile;
  };
  const getInitialData = () => {
    const initialValues = {
      stageIds: [] as string[],
      longitude: '',
      latitude: '',
      image: undefined,
      assetKey: undefined,
      pointOfInterestTranslations: [] as PointOfInterestTranslation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: PointOfInterestTranslation[] = [];

      locales.map(locale => {
        const translationData = initialData?.pointOfInterestTranslation.find(
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
          } as PointOfInterestTranslation);
        }
      });

      return {
        stageIds: initialData?.pointOfInterestStage.map(stage => {
          return stage.id;
        }),
        longitude: initialData?.longitude,
        latitude: initialData?.latitude,
        image: initialData?.image,
        assetKey:
          initialData?.mediaKey === null ? undefined : initialData?.mediaKey,
        pointOfInterestTranslations: mapTranslation,
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
            show={showError as boolean}
            snackContent={'Something went wrong, please try again'}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as PointOfInterestRequest);
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
                <FieldArray name="pointOfInterestTranslations">
                  {({ replace }: FieldArrayRenderProps) => (
                    <div>
                      <div className="flex flex-col gap-5	mb-6">
                        <Text
                          className="tracking-wide"
                          intent={'forestGreenTintTwo'}
                          size={'xs'}
                          weight={'bold'}
                        >
                          COORDINATES AND ASSETS
                        </Text>
                        <div className="flex flex-col w-full">
                          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-x-5 md:gap-x-3 lg:mr-32 md:gap-y-0 gap-y-3">
                            <div className="flex flex-col gap-2">
                              <Text
                                className="after:content-['*'] after:ml-0.5 after:text-red"
                                size={'md'}
                                weight={'normal'}
                              >
                                Stage
                              </Text>
                              <div className="w-full mt-2">
                                {action === FormActions.ADD && (
                                  <MultiSelect
                                    items={getStage()}
                                    onSelectedItemsChange={selectedItems => {
                                      setSelectedStages(selectedItems);
                                      handleStageChange(
                                        selectedItems,
                                        formikProps as FormikProps<PointOfInterestRequest>,
                                      );
                                    }}
                                  />
                                )}
                                {action === FormActions.EDIT &&
                                  !_.isEmpty(initialData?.id) && (
                                    <MultiSelect
                                      initialSelected={selectedStages}
                                      items={getStage()}
                                      onSelectedItemsChange={selectedItems => {
                                        setSelectedStages(selectedItems);
                                        handleStageChange(
                                          selectedItems,
                                          formikProps as FormikProps<PointOfInterestRequest>,
                                        );
                                      }}
                                    />
                                  )}
                              </div>
                              <Text className="mt-1" intent={'red'} size="xs">
                                {formikProps.errors.stageIds &&
                                  formikProps.touched.stageIds &&
                                  formikProps.errors.stageIds}
                              </Text>
                            </div>
                            <div className="flex flex-col gap-2">
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
                            <div className="flex flex-col gap-2">
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
                          <div className="flex-row w-full mt-2">
                            {/* image upload */}
                            <Text
                              className="after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                              weight={'normal'}
                            >
                              Upload photo
                            </Text>
                            <InputContainer
                              className="mt-2"
                              error={
                                formikProps.errors.image &&
                                formikProps.touched.image
                                  ? [formikProps.errors.image]
                                  : undefined
                              }
                            >
                              <div className="w-full">
                                <FileUpload
                                  fileUrl={formikProps.values.assetKey}
                                  initialFile={formikProps.values.image}
                                  onChange={image => {
                                    handleFileChange(
                                      formikProps as FormikProps<PointOfInterestRequest>,
                                      image,
                                    );
                                  }}
                                  width="100px"
                                />
                              </div>
                            </InputContainer>
                          </div>
                          <hr className="flex border-dashed border-tints-battleship-grey-tint-5 divide-dashed mt-8" />
                          <div className="flex flex-col gap-3 w-full mt-10">
                            <div className="w-full flex-col">
                              <div className="flex-col gap-6">
                                <div className="flex gap-3 mb-5">
                                  <Heading intent={'h4'}>Translations</Heading>
                                  <Text
                                    className="flex items-center justify-center text-tints-battleship-grey-tint-2 gap-3"
                                    size={'md'}
                                    weight={'medium'}
                                  >
                                    (Changes will be saved automatically)
                                  </Text>
                                </div>
                              </div>
                              <div className="">
                                <div className="w-full">
                                  <Tabs
                                    formikProps={
                                      formikProps.errors
                                        .pointOfInterestTranslations as []
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
                            className="tracking-wide pt-4 pb-6"
                            intent={'forestGreenTintTwo'}
                            size={'xs'}
                            weight={'bold'}
                          >
                            POINT OF INTEREST INFORMATION
                          </Text>
                          {language?.language && (
                            <TranslationForm
                              action={action}
                              formikProps={
                                formikProps as FormikProps<PointOfInterestRequest>
                              }
                              replace={replace}
                              selectedLanguage={language}
                            />
                          )}
                          {action === FormActions.ADD && (
                            <div className="flex justify-end mt-10 mb-10 gap-6">
                              <Button
                                intent={'secondary'}
                                onClick={() =>
                                  handleReset(
                                    formikProps as FormikProps<PointOfInterestRequest>,
                                  )
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
                                Create POI
                              </Button>
                            </div>
                          )}
                          {action === FormActions.EDIT && (
                            <div className="flex justify-end mt-10 mb-10 gap-6">
                              <Button
                                intent="danger"
                                loading={deletePointOfInterest.isLoading}
                                onClick={() => {
                                  setshowModal(true);
                                }}
                                type="button"
                              >
                                Delete POI
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
          modalTitle="Delete point of interest"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.pointOfInterestTranslation.find(
            t => t.localeId === 'en',
          )?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All images, text and information associated with this point of interest will be permanently deleted. '
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
