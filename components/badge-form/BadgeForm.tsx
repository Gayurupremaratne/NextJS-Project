'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import _ from 'lodash';
import {
  Avatar,
  Button,
  Heading,
  Item,
  SingleSelect,
  Text,
} from '@/components/atomic';
import attachIcon from '../../public/images/icons/attach.svg';
import { createBadgeValidation } from './badge-form-validation';
import { useGetLocales } from '@/hooks/locale/locale';
import { Locale } from '@/types/locale/locale.type';
import { FormActions } from '@/constants/form-actions';
import Image from 'next/image';
import {
  getSignedUrl,
  uploadFile,
} from '@/api/static-content-upload/static-content-upload';
import { StaticContent } from '@/types/static-content/static-content.type';
import {
  useCreateBadge,
  useDeleteBadge,
  useUpdateBadge,
} from '@/hooks/badge/badge';
import {
  IBadgeForm,
  IBadgeTranslation,
  ICreateBadge,
} from '@/types/badge/badge.type';
import { BadgeTranslationForm } from './BadgeTranslationForms';
import { MinusCirlce } from 'iconsax-react';
import { theme } from '@/tailwind.config';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import camera from '../../public/images/camera.svg';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { AlertDialog } from '../atomic/Modal';
import { StageLite } from '@/types/stage/stage.type';
import TranslationFormTabs from '../tag-form/TranslationFormTabs';
import { isAxiosError } from 'axios';

export interface Props {
  action: FormActions;
  initialData?: IBadgeForm | null;
  setSlideOver?: (value: boolean) => void;
}
export const BadgeForm = ({ action, initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const { data: stagesData } = useGetLiteStages();
  const deleteBadge = useDeleteBadge();
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge(initialData?.id as string);
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);

  const [locales, setLocales] = useState<Locale[]>([]);
  const [stages, setStages] = useState<StageLite[]>([]);
  const [viewStages, setViewStages] = useState<boolean>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [show, setShow] = useState<boolean>();
  const [snackContent, setSnackContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const badgeTypes = [
    {
      id: 0,
      name: 'Special',
    },
    {
      id: 1,
      name: 'Stage',
    },
  ];

  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }

    if (stagesData && stagesData.length > 0) {
      setStages(stagesData);
    }

    if (initialData?.badgeKey) {
      setSelectedImage(
        `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${initialData.badgeKey}`,
      );
    }
  }, [localesData, stagesData, initialData]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));
  const getStage = () => {
    return stages.map((data: StageLite) => {
      return {
        id: data.id,
        name: `Stage ${data.number.toString()}`,
      };
    });
  };
  const getInitialStage = () => {
    if (!_.isNil(initialData?.stageId)) {
      return {
        id: initialData?.stageId,
        name: `Stage ${initialData?.stage?.number}`,
      } as Item;
    }
    return undefined;
  };

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    formikData: FormikProps<IBadgeForm>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      formikData.setFieldValue('badgeImage', file);
    }
  };

  const handleAddBadgeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveBadgeClick = (formikProps: FormikProps<IBadgeForm>) => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      formikProps.setFieldValue('badgeImage', null);
    }
  };

  const handleStageChange = (
    e: string,
    formikData: FormikProps<IBadgeForm>,
  ) => {
    formikData.setFieldValue('stageId', e);
  };

  const handleBadgeTypeChange = (
    e: number,
    formikData: FormikProps<IBadgeForm>,
  ) => {
    formikData.setFieldValue('type', e);
    if (e === 1) {
      setViewStages(true);
    } else {
      setViewStages(false);
      formikData.setFieldValue('stageId', '');
    }
  };

  const handleSubmit = async (values: IBadgeForm) => {
    setIsFormSubmitting(true);
    const translations = values?.badgeTranslation.filter(translation => {
      return !_.isEmpty(translation?.name);
    });
    values.badgeTranslation = translations;
    let finalBadgePayload: ICreateBadge = {
      type: '',
      stageId: '',
      badgeKey: '',
      badgeTranslation: [],
    };

    const badgeTranslation = values?.badgeTranslation;
    if (badgeTranslation) {
      for (const translation of badgeTranslation) {
        if (
          _.isEmpty(translation?.name) &&
          _.isEmpty(translation?.description) &&
          values.badgeTranslation.length > 0 &&
          values.badgeTranslation[language!.tabIndex]
        ) {
          delete values.badgeTranslation[language!.tabIndex];
          translation.badgeId = values.id;
        }
      }

      if (_.isEmpty(values.badgeImage)) {
        const payload: StaticContent = {
          fileName: selectedFile?.name,
          contentType: selectedFile?.type,
          module: 'badge-media',
          fileSize: selectedFile?.size,
        };
        try {
          const signedUrlResponse = await getSignedUrl(payload);
          if (signedUrlResponse.status === 201) {
            const fileUploadResponse = await uploadFile(
              selectedFile as File,
              signedUrlResponse.data.s3Url,
            );

            if (fileUploadResponse.status === 200) {
              finalBadgePayload = {
                badgeKey: `badge-media/${signedUrlResponse.data.uniqueFileName}`,
                badgeTranslation: badgeTranslation,
                stageId: values?.stageId !== '' ? values?.stageId : null,
                type: values?.type == '0' ? 'MANUAL' : 'STAGE_COMPLETION',
              };
            }
          }
        } catch (error) {
          setShow(true);
          setSnackContent('Something went wrong, please try again');
        }
      } else {
        finalBadgePayload = {
          badgeKey: values?.badgeImage as string,
          badgeTranslation: badgeTranslation,
          stageId: values?.stageId !== '' ? values?.stageId : null,
          type: values?.type == '0' ? 'MANUAL' : 'STAGE_COMPLETION',
        };
      }

      if (
        (finalBadgePayload.type == 'STAGE_COMPLETION' &&
          finalBadgePayload.stageId !== null) ||
        finalBadgePayload.type == 'MANUAL'
      ) {
        if (action === FormActions.ADD) {
          try {
            const response = await createBadge.mutateAsync(finalBadgePayload);

            if (response?.status === 201) {
              setSlideOver!(false);
            } else {
              setShow(true);
              setSnackContent('Something went wrong, please try again');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            if (e.response.status === 422) {
              setShow(true);
              setSnackContent('The stage already has a badge');
            } else {
              setShow(true);
              setSnackContent('Something went wrong, please try again');
            }
          }
        }
        if (action === FormActions.EDIT) {
          try {
            delete values.id;
            const response = await updateBadge.mutateAsync(finalBadgePayload);

            if (response?.status === 200) {
              setSlideOver!(false);
            } else {
              setShow(true);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            if (e.response.status === 409) {
              setShow(true);
              setSnackContent('The stage already has a badge');
            } else {
              setShow(true);
              setSnackContent('Something went wrong, please try again');
            }
          }
        }
      } else {
        setShow(true);
        setSnackContent('Uploaded image type is invalid.');
      }
    }
    setIsFormSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      await deleteBadge.mutateAsync(initialData?.id as string);
      setSlideOver!(false);
    } catch (error: unknown) {
      setShow(true);
      setSnackContent(
        isAxiosError(error)
          ? error.response?.data.message
          : 'Something went wrong, please try again',
      );
    }
  };

  const getInitialData = () => {
    const initialValues: IBadgeForm = {
      id: initialData?.id ?? '',
      stageId: initialData?.stageId ?? '',
      type: initialData?.type ? (initialData?.type === 'MANUAL' ? 0 : 1) : 0,
      badgeImage: (initialData?.badgeKey && selectedImage) || null,
      badgeTranslation:
        initialData?.badgeTranslation ?? ([] as IBadgeTranslation[]),
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: IBadgeTranslation[] = [];

      locales.forEach(locale => {
        const translationData = initialData?.badgeTranslation.find(
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
            name: '',
            description: '',
            badgeId: initialData?.id,
          } as IBadgeTranslation);
        }
      });

      return {
        stageId: initialValues?.stageId,
        type: initialValues?.type,
        badgeImage: initialData?.badgeKey,
        badgeTranslation: mapTranslation,
      };
    }

    return initialValues;
  };

  const hasUserAwardedBadges = !!(
    initialData?.userAwardedBadge?.length &&
    initialData.userAwardedBadge.length > 0
  );

  return (
    <>
      {!_.isEmpty(stagesData) && !_.isEmpty(localesData) && (
        <div>
          <div className="pb-2">
            <Snackbar
              intent="error"
              show={show as boolean}
              snackContent={snackContent}
            />
          </div>
          <Text
            className="tracking-wider"
            intent={'forestGreenTintTwo'}
            size={'xs'}
            weight={'bold'}
          >
            BADGE INFORMATION
          </Text>
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              handleSubmit(values);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={createBadgeValidation}
          >
            {formikProps => (
              <Form
                onChange={() => {}}
                onSubmit={e => {
                  e.preventDefault();

                  formikProps.handleSubmit(e);
                }}
              >
                <FieldArray name="badgeTranslation">
                  {({ replace }: FieldArrayRenderProps) => (
                    <>
                      <div className="flex flex-row flex-wrap gap-x-8 mt-8">
                        <div
                          className={`${
                            selectedImage === null &&
                            'rounded-full border-2 border-tints-forest-green-tint-4 bg-tints-forest-green-tint-6 w-28 h-28'
                          }`}
                        >
                          <div
                            className={`${
                              selectedImage === null &&
                              'flex items-center justify-center w-28 h-28'
                            }`}
                          >
                            <label htmlFor="avatar-input">
                              <input
                                accept="image/*"
                                id="avatar-input"
                                name="badgeImage"
                                onChange={e =>
                                  handleFileInputChange(e, formikProps)
                                }
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                type="file"
                              />
                              <Avatar
                                alt={'sample'}
                                imageUrl={selectedImage ?? camera}
                                initials={'sample'}
                                size={selectedImage ? '3xl' : 'md'}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="mt-10">
                          {selectedImage ? (
                            <Button
                              intent={'dangerGhost'}
                              onClick={e => {
                                e.preventDefault();
                                handleRemoveBadgeClick(formikProps);
                              }}
                              preIcon={
                                <MinusCirlce
                                  color={theme.colors.snacks.borders.error}
                                  variant="Bold"
                                />
                              }
                              size={'ghost'}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              intent={'ghost'}
                              onClick={e => {
                                e.preventDefault();
                                handleAddBadgeClick();
                              }}
                              preIcon={
                                <Image
                                  alt="attach"
                                  height={16}
                                  src={attachIcon}
                                  width={16}
                                />
                              }
                              size={'ghost'}
                            >
                              Add a badge image
                            </Button>
                          )}
                        </div>
                      </div>
                      {formikProps.touched.badgeImage &&
                        formikProps.errors.badgeImage && (
                          <div className="pt-2">
                            <Text intent={'red'} size={'sm'}>
                              {formikProps.errors.badgeImage}
                            </Text>
                          </div>
                        )}
                      <div className="flex flex-col w-full">
                        <div className="flex flex-col lg:flex-row lg:gap-5 pb-7 gap-0 mr-4">
                          <div className="flex flex-col gap-2 pt-7 mr-4 w-64">
                            <Text
                              className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                            >
                              Badge type
                            </Text>
                            {action === FormActions.ADD && (
                              <SingleSelect
                                items={badgeTypes}
                                placeholderText="Select type"
                                tabIndex={e => {
                                  handleBadgeTypeChange(
                                    e as number,
                                    formikProps,
                                  );
                                }}
                              />
                            )}
                            {action === FormActions.EDIT &&
                              !_.isEmpty(initialData?.id) && (
                                <SingleSelect
                                  disabled={hasUserAwardedBadges}
                                  initialSelected={badgeTypes.find(type =>
                                    initialData?.type == 'MANUAL'
                                      ? type.id == 0
                                      : type.id == 1,
                                  )}
                                  items={badgeTypes}
                                  tabIndex={e => {
                                    handleBadgeTypeChange(
                                      e as number,
                                      formikProps,
                                    );
                                  }}
                                />
                              )}
                            {formikProps.touched.type &&
                              formikProps.errors.type && (
                                <Text intent={'red'} size={'sm'}>
                                  {formikProps.errors.type &&
                                    formikProps.touched.type &&
                                    formikProps.errors.type}
                                </Text>
                              )}
                          </div>
                          {viewStages && (
                            <div className="flex-col gap-2 pt-7 flex w-64">
                              <Text
                                className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
                                size={'md'}
                              >
                                Stage
                              </Text>
                              {(action === FormActions.ADD ||
                                (action === FormActions.EDIT &&
                                  _.isEmpty(initialData?.stage))) && (
                                <SingleSelect
                                  items={getStage()}
                                  placeholderText="Select stage"
                                  tabIndex={e => {
                                    handleStageChange(e as string, formikProps);
                                  }}
                                />
                              )}
                              {formikProps.touched.stageId &&
                                formikProps.errors.stageId && (
                                  <Text intent={'red'} size="sm">
                                    {formikProps.errors.stageId &&
                                      formikProps.touched.stageId &&
                                      formikProps.errors.stageId}
                                  </Text>
                                )}
                              {action === FormActions.EDIT &&
                                !_.isEmpty(initialData?.stageId) && (
                                  <SingleSelect
                                    disabled={hasUserAwardedBadges}
                                    initialSelected={getInitialStage()}
                                    items={getStage()}
                                    tabIndex={e => {
                                      handleStageChange(
                                        e as string,
                                        formikProps,
                                      );
                                    }}
                                  />
                                )}
                            </div>
                          )}
                        </div>
                        <hr className="border-t border-tints-battleship-grey-tint-5 border-dashed mr-4" />
                        <div className="flex flex-col  mr-4">
                          <div className="flex flex-col gap-3 w-full mt-7">
                            <div className="w-full flex-col">
                              <div className="flex-col gap-6">
                                <div className="flex gap-3 mb-5 items-end">
                                  <Heading
                                    className="md:self-center self-start"
                                    intent={'h6'}
                                    weight={'normal'}
                                  >
                                    Translations
                                  </Heading>
                                  <Text
                                    className="text-tints-battleship-grey-tint-2 gap-3"
                                    size={'sm'}
                                    weight={'normal'}
                                  >
                                    (Changes will be saved automatically)
                                  </Text>
                                </div>
                              </div>
                              <div className="">
                                <div className="w-full">
                                  <TranslationFormTabs
                                    formikProps={
                                      formikProps.errors.badgeTranslation as []
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
                            <BadgeTranslationForm
                              action={action}
                              formikProps={formikProps}
                              replace={replace}
                              selectedLanguage={language}
                            />
                          )}
                          {action === FormActions.ADD && (
                            <div className={'pt-10 pb-4 flex justify-end'}>
                              <Button
                                disabled={isFormSubmitting}
                                loading={isFormSubmitting}
                                size={'md'}
                                type="submit"
                              >
                                <span className="m-auto">Create badge</span>
                              </Button>
                            </div>
                          )}
                          {action === FormActions.EDIT && (
                            <div className="pt-10 flex justify-end gap-5">
                              <Button
                                intent="danger"
                                loading={deleteBadge.isLoading}
                                onClick={() => {
                                  if (hasUserAwardedBadges) {
                                    setShow(true);
                                    setSnackContent(
                                      'You cannot delete this badge since its already assigned to a user.',
                                    );
                                  } else {
                                    setShowModal(true);
                                  }
                                }}
                                type="button"
                              >
                                Delete badge
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
                    </>
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
          modalTitle="Delete Badge"
          setShow={value => setShowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.badgeTranslation.find(
            t => t.localeId === 'en',
          )?.name}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All text and information associated with this badge will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
