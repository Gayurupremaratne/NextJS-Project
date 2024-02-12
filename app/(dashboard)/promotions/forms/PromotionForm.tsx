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
import { FileUpload } from '@/components/atomic/FileUpload';
import { AlertDialog } from '@/components/atomic/Modal';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetLocales } from '@/hooks/locale/locale';
import {
  useCreatePromotion,
  useDeletePromotion,
  useEditPromotion,
  useEditPromotionTranslation,
} from '@/hooks/promotion/promotion';
import { Locale } from '@/types/locale/locale.type';
import {
  Promotion,
  PromotionTranslation,
} from '@/types/promotions/promotion.type';
import { StaticContent } from '@/types/static-content/static-content.type';
import { isAxiosError } from 'axios';
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TranslationFormHeader from '../../content/TranslationFormHeader';
import { schema } from './PromotionFormValidation';
import { TranslationForm } from './TranslationForms';
import { AxiosResponse } from '@/types/common.type';

export interface Props {
  action: FormActions;
  initialData?: Promotion;
  setSlideOver?: (value: boolean) => void;
}

export const PromotionForm = ({ action, initialData, setSlideOver }: Props) => {
  const { data: localesData } = useGetLocales();
  const deletePromotion = useDeletePromotion();
  const createPromotion = useCreatePromotion();
  const editPromotion = useEditPromotion(initialData?.id as string);
  const editPromotionTranslation = useEditPromotionTranslation();
  const [language, setLanguage] = useState<{
    language: string;
    tabIndex: number;
  } | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [key, setKey] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>();
  const [snackContent, setSnackContent] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Set api data to state
  useEffect(() => {
    if (localesData && localesData.length > 0) {
      setLocales(localesData);
    }
  }, [localesData]);

  const tabData = locales?.map(locale => ({
    title: locale.name,
    content: <></>,
  }));

  const promotionStatus = [
    {
      id: 1,
      name: 'Active',
    },
    {
      id: 2,
      name: 'Inactive',
    },
  ];

  const getInitialStatus = () => {
    return {
      id: initialData!.isActive ? 1 : 2,
      name: initialData!.isActive ? 'Active' : 'Inactive',
    } as Item;
  };

  const setSlideOverByResponse = (
    results: (AxiosResponse<PromotionTranslation> | undefined)[],
  ) => {
    if (results?.every(result => result?.status == 200)) {
      setSlideOver!(false);
    } else {
      setShowError(true);
      setSnackContent('Something went wrong, please try again');
    }
  };

  const handleSubmit = async (values: Promotion) => {
    setIsFormSubmitting(true);
    const translations = values.promotionTranslations.filter(value => {
      return !_.isEmpty(value?.title);
    });

    values.promotionTranslations = translations;

    if (translations) {
      for (const translation of translations) {
        if (
          _.isEmpty(translation?.title) &&
          _.isEmpty(translation?.description) &&
          values.promotionTranslations.length > 0 &&
          values.promotionTranslations[language!.tabIndex]
        ) {
          delete values.promotionTranslations[language!.tabIndex];
        }
      }
    }

    //upload image s3
    if (_.isEmpty(values.mediaKey)) {
      const payload: StaticContent = {
        fileName: values.image?.name,
        contentType: values.image?.type,
        module: 'promotion-media',
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
            values.mediaKey = `promotion-media/${response.data.uniqueFileName}`;
            delete values.image;
          } else {
            setShowError(true);
            setSnackContent('Something went wrong, please try again');
          }
        } else {
          setShowError(true);
          setSnackContent('Something went wrong, please try again');
        }
      } catch (error) {
        setShowError(true);
        setSnackContent('Something went wrong, please try again');
        return;
      }
    }

    delete values?.id;
    delete values?.createdAt;
    delete values?.updatedAt;

    //Create Promotion
    if (action === FormActions.ADD) {
      try {
        const { promotionTranslations, ...createData } = values;
        const response = await createPromotion.mutateAsync(createData!);

        //translations
        if (response?.status === 201) {
          const translationPromises = promotionTranslations.map(
            promotionTranslation =>
              editPromotionTranslation.mutateAsync({
                ...promotionTranslation,
                promotionId: response.data.data.id,
              }),
          );
          const results = await Promise.all(translationPromises);
          setSlideOverByResponse(results);
        } else {
          setShowError(true);
          setSnackContent('Something went wrong, please try again');
        }
      } catch (error) {
        setShowError(true);
        setSnackContent('Something went wrong, please try again');
      }
    }

    //Edit Promotion
    if (action === FormActions.EDIT) {
      const { promotionTranslations, ...editData } = values;
      try {
        const response = await editPromotion.mutateAsync(editData!);

        //translations
        if (response?.status === 200) {
          const translationPromises = promotionTranslations.map(
            promotionTranslation => {
              delete promotionTranslation?.createdAt;
              delete promotionTranslation?.updatedAt;

              return editPromotionTranslation.mutateAsync(promotionTranslation);
            },
          );
          const results = await Promise.all(translationPromises);
          setSlideOverByResponse(results);
        } else {
          setShowError(true);
          setSnackContent('Something went wrong, please try again');
        }
      } catch (error) {
        setShowError(true);
        const errorMessage = isAxiosError(error)
          ? error.response?.data.message
          : 'Something went wrong, please try again';
        setSnackContent(errorMessage);
      }
    }
    setIsFormSubmitting(false);
  };

  const handleReset = (formikData: FormikProps<Promotion>) => {
    formikData.resetForm();
    setKey(key + 1);
  };

  const handleDelete = async () => {
    const response = await deletePromotion.mutateAsync(
      initialData?.id as string,
    );
    if (response?.status === 200) {
      setSlideOver!(false);
    } else {
      setShowError(true);
      setSnackContent('Something went wrong, please try again');
    }
  };

  const handleFileChange = (
    formikProps: FormikProps<Promotion>,
    newFile: File | undefined,
  ) => {
    if (newFile === undefined) {
      formikProps.values.mediaKey = undefined;
      formikProps.values.image = undefined;
      return;
    }
    formikProps.values.image = newFile;
  };

  const getInitialData = () => {
    const initialValues = {
      url: '',
      mediaKey: undefined,
      image: undefined,
      isActive: false,
      promotionTranslations: [] as PromotionTranslation[],
    };

    if (action === FormActions.EDIT) {
      const mapTranslation: PromotionTranslation[] = [];

      locales.map(locale => {
        const translationData = initialData?.promotionTranslations?.find(
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
            promotionId: '',
            title: '',
            description: '',
            ctaText: '',
          } as PromotionTranslation);
        }
      });

      return {
        id: initialData?.id,
        url: initialData?.url,
        image: initialData?.image,
        isActive: initialData?.isActive,
        mediaKey: initialData?.mediaKey,
        promotionTranslations: mapTranslation,
      } as Promotion;
    }

    return initialValues;
  };

  return (
    <>
      {!_.isEmpty(localesData) && (
        <div className="flex flex-col gap-6" key={key}>
          <Snackbar
            intent="error"
            show={showError as boolean}
            snackContent={snackContent}
          />
          <Formik
            enableReinitialize
            initialValues={getInitialData()}
            onSubmit={values => {
              handleSubmit(values as Promotion);
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
                <FieldArray name="promotionTranslations">
                  {({ replace }: FieldArrayRenderProps) => (
                    <div>
                      <div className="flex flex-col gap-4	mb-6">
                        <div className="flex gap-5">
                          <div className="w-full">
                            <Text
                              className="after:content-['*'] after:ml-0.5 after:text-red"
                              size={'md'}
                              weight={'normal'}
                            >
                              Web URL
                            </Text>
                            <InputContainer
                              className="mt-2"
                              error={
                                formikProps.errors.url &&
                                formikProps.touched.url
                                  ? [formikProps.errors.url]
                                  : undefined
                              }
                            >
                              <Input
                                className="rounded"
                                containerClassName="w-full"
                                name="url"
                                onBlur={formikProps.handleBlur}
                                onChange={formikProps.handleChange}
                                placeholder={'URL here'}
                                value={formikProps.values.url}
                              />
                            </InputContainer>
                          </div>

                          {action === FormActions.EDIT &&
                            !_.isEmpty(initialData?.id) && (
                              <div className="w-full">
                                <Text
                                  className="after:content-['*'] after:ml-0.5 after:text-red mb-2"
                                  size={'md'}
                                  weight={'normal'}
                                >
                                  Status
                                </Text>
                                <SingleSelect
                                  initialSelected={getInitialStatus()}
                                  items={promotionStatus}
                                  tabIndex={id => {
                                    formikProps.setFieldValue(
                                      'isActive',
                                      id ===
                                        promotionStatus?.find(
                                          x => x?.name == 'Active',
                                        )?.id,
                                    );
                                  }}
                                />
                              </div>
                            )}
                        </div>

                        <div className="flex-row w-full">
                          {/* image upload */}
                          <Text
                            className="after:content-['*'] after:ml-0.5 after:text-red"
                            size={'md'}
                            weight={'normal'}
                          >
                            Upload image
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
                                fileUrl={formikProps.values.mediaKey}
                                initialFile={formikProps.values.image}
                                onChange={image => {
                                  handleFileChange(formikProps, image);
                                }}
                                subTitle={
                                  'Supported file formats: jpg, png and img with a resolution of 356 * 179 up to 25MB'
                                }
                                width="100px"
                              />
                            </div>
                          </InputContainer>
                        </div>
                        <div className="flex flex-col gap-3 w-full mt-10">
                          <div className="w-full flex-col">
                            <TranslationFormHeader />
                            <div className="">
                              <div className="w-full">
                                <Tabs
                                  formikProps={
                                    formikProps.errors
                                      .promotionTranslations as []
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
                          <TranslationForm
                            action={action}
                            formikProps={formikProps as FormikProps<Promotion>}
                            replace={replace}
                            selectedLanguage={language}
                          />
                        )}
                        {action === FormActions.ADD && (
                          <div className="flex justify-end gap-6 pb-8">
                            <Button
                              intent={'secondary'}
                              onClick={() =>
                                handleReset(
                                  formikProps as FormikProps<Promotion>,
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
                              Create Promotion
                            </Button>
                          </div>
                        )}
                        {action === FormActions.EDIT && (
                          <CustomCan
                            a={Subject.Promotions}
                            I={UserActions.Delete}
                          >
                            <div className="flex justify-end gap-6 pb-8">
                              <Button
                                intent={'danger'}
                                loading={deletePromotion.isLoading}
                                onClick={() => {
                                  setshowModal(true);
                                }}
                                type="button"
                              >
                                Delete promotion
                              </Button>

                              <Button
                                disabled={isFormSubmitting}
                                loading={isFormSubmitting}
                                type="submit"
                              >
                                Save changes
                              </Button>
                            </div>
                          </CustomCan>
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
          modalTitle="Delete promotion"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.promotionTranslations.find(
            t => t.localeId === 'en',
          )?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All images, text and information associated with this promotion will be permanently deleted. '
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
