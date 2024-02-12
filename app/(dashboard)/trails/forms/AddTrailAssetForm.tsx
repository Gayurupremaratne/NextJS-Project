import { Button, InputContainer, Text } from '@/components/atomic';
import { FileUpload } from '@/components/atomic/FileUpload';
import { FormActions } from '@/constants/form-actions';
import { StageAssetEditForm, StageAssetType } from '@/types/stage/stage.type';
import { Form, Formik, FormikErrors, FormikProps } from 'formik';
import React, { useState } from 'react';
import { StageAssetFormValidationSchema } from '../validations';
import {
  useAddStageMedia,
  useDeleteStageMedia,
  useGetEditStageMedia,
} from '@/hooks/stage/stage';
import {
  STAGE_MEDIA_KEY_TYPES,
  STAGE_MEDIA_TYPES,
} from '@/constants/stage-media-types';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { StaticContent } from '@/types/static-content/static-content.type';
import _ from 'lodash';
import {
  getSignedUrl,
  uploadFile,
} from '@/api/static-content-upload/static-content-upload';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { InfoCircle } from 'iconsax-react';

export interface StageAssetFormProps {
  action: FormActions;
  setSlideOver?: (value: boolean) => void;
  stageId: string;
}

const AddTrailAssetForm = ({
  action,
  setSlideOver,
  stageId,
}: StageAssetFormProps) => {
  const { data: initialData } = useGetEditStageMedia(stageId);
  const [showError, setShowError] = useState<boolean>(false);
  const [isStageMediaAdding, setIsStageMediaAdding] = useState<boolean>(false);
  const { mutateAsync: addStageMedia } = useAddStageMedia();
  const { mutateAsync: deleteStageMedia } = useDeleteStageMedia();
  let mediaIdsToDelete: string[] = [];

  const handleSubmit = async (values: StageAssetEditForm) => {
    setIsStageMediaAdding(true);

    // deleting stage media before saving new stage media
    if (mediaIdsToDelete.length > 0) {
      const deleteStageMediaPromise = mediaIdsToDelete.map(async (id: string) =>
        deleteStageMedia(id),
      );
      await Promise.all(deleteStageMediaPromise);
      mediaIdsToDelete = [];
    }

    // uploading primary image
    if (_.isEmpty(values.primaryImage.mediaKey)) {
      const payload: StaticContent = {
        fileName: values.primaryImage.image?.name,
        contentType: values.primaryImage.image?.type,
        module: 'trail-media',
        fileSize: values.primaryImage.image?.size,
      };
      const response = await getSignedUrl(payload);
      if (response.status === 201) {
        const fileUploadResponse = await uploadFile(
          values.primaryImage.image as File,
          response.data.s3Url,
        );
        if (fileUploadResponse.status === 200) {
          values.primaryImage.mediaKey = `trail-media/${response.data.uniqueFileName}`;
          delete values.primaryImage.image;
          await addStageMedia({
            id: stageId,
            mediaKeys: [values.primaryImage],
          });
        } else {
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    }
    // uploading elevation image
    if (_.isEmpty(values.elevationImage.mediaKey)) {
      const payload: StaticContent = {
        fileName: values.elevationImage.image?.name,
        contentType: values.elevationImage.image?.type,
        module: 'trail-media',
        fileSize: values.elevationImage.image?.size,
      };
      const response = await getSignedUrl(payload);
      if (response.status === 201) {
        const fileUploadResponse = await uploadFile(
          values.elevationImage.image as File,
          response.data.s3Url,
        );
        if (fileUploadResponse.status === 200) {
          values.elevationImage.mediaKey = `trail-media/${response.data.uniqueFileName}`;
          delete values.elevationImage.image;
          await addStageMedia({
            id: stageId,
            mediaKeys: [values.elevationImage],
          });
        } else {
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    }
    // uploading supplementary images
    const supplementaryImagePromise = values.supplementaryImages.map(
      async (supplementaryImage, index) => {
        if (_.isEmpty(supplementaryImage.mediaKey)) {
          const payload: StaticContent = {
            fileName: supplementaryImage.image?.name,
            contentType: supplementaryImage.image?.type,
            module: 'trail-media',
            fileSize: supplementaryImage.image?.size,
          };
          const response = await getSignedUrl(payload);
          if (response.status === 201) {
            const fileUploadResponse = await uploadFile(
              supplementaryImage.image as File,
              response.data.s3Url,
            );
            if (fileUploadResponse.status === 200) {
              values.supplementaryImages[
                index
              ].mediaKey = `trail-media/${response.data.uniqueFileName}`;
              delete values.supplementaryImages[index].image;
              await addStageMedia({
                id: stageId,
                mediaKeys: [values.supplementaryImages[index]],
              });
            } else {
              setShowError(true);
            }
          } else {
            setShowError(true);
          }
        }
      },
    );
    await Promise.all(supplementaryImagePromise);
    setIsStageMediaAdding(false);
    if (!showError) {
      setSlideOver!(false);
    }
  };

  const handleImageChange = (
    formikProps: FormikProps<StageAssetEditForm>,
    newFile: File | undefined,
    type: string,
    index?: number,
  ) => {
    const previousImages = initialData?.data ?? [];
    if (type === STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE) {
      if (!newFile && previousImages.length > 0) {
        const previousPrimaryImage: StageAssetType = previousImages.find(
          (p: StageAssetType) =>
            p.mediaType === STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
        ) as StageAssetType;
        mediaIdsToDelete.push(previousPrimaryImage.id!);
      }
      formikProps.values.primaryImage = {
        ...formikProps.values.primaryImage,
        mediaType: STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
        mediaKey: undefined,
        image: newFile ?? undefined,
      };
      delete formikProps.values.primaryImage.id;
    } else if (type === STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE) {
      if (!newFile && previousImages.length > 0) {
        const previousElevationImage: StageAssetType = previousImages.find(
          (p: StageAssetType) =>
            p.mediaType === STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE,
        ) as StageAssetType;
        mediaIdsToDelete.push(previousElevationImage.id!);
      }
      formikProps.values.elevationImage = {
        ...formikProps.values.elevationImage,
        mediaType: STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE,
        mediaKey: undefined,
        image: newFile ?? undefined,
      };
      delete formikProps.values.elevationImage.id;
    } else if (type === STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE) {
      if (!newFile && previousImages.length > 0) {
        const previousSupplementaryImages = previousImages.filter(
          (p: StageAssetType) =>
            p.mediaType === STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
        );
        const previousSupplementaryImageIds = previousSupplementaryImages.map(
          (p: StageAssetType) => p.id,
        );
        mediaIdsToDelete.push(previousSupplementaryImageIds[index!] as string);
      }
      formikProps.values.supplementaryImages[index!] = {
        type: STAGE_MEDIA_TYPES.PHOTO,
        mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
        mediaKey: undefined,
        image: newFile ?? undefined,
      };
      delete formikProps.values.supplementaryImages[index!].id;
    }
  };

  const getInitialData = () => {
    const data: StageAssetEditForm = {
      primaryImage: {
        mediaKey: '',
        type: STAGE_MEDIA_TYPES.PHOTO,
        stageId,
        mediaType: STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
        image: undefined,
      },
      supplementaryImages: [
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
      ],
      elevationImage: {
        mediaKey: '',
        type: STAGE_MEDIA_TYPES.PHOTO,
        stageId,
        mediaType: STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE,
        image: undefined,
      },
    };
    if (initialData && initialData?.data?.length > 0) {
      let supplementaryImageIndex = 0;
      initialData?.data?.map((p: StageAssetType) => {
        if (p.mediaType === STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE) {
          data.primaryImage.mediaKey = p.mediaKey;
          data.primaryImage.mediaType = p.mediaType;
          data.primaryImage.stageId = p.stageId;
          data.primaryImage.type = p.type;
          data.primaryImage.id = p.id;
        } else if (p.mediaType === STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE) {
          data.supplementaryImages[supplementaryImageIndex].mediaKey =
            p.mediaKey;
          data.supplementaryImages[supplementaryImageIndex].type = p.type;
          data.supplementaryImages[supplementaryImageIndex].mediaType =
            p.mediaType;
          data.supplementaryImages[supplementaryImageIndex].stageId = p.stageId;
          data.supplementaryImages[supplementaryImageIndex].id = p.id;
          supplementaryImageIndex++;
        } else if (
          p.mediaType === STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE
        ) {
          data.elevationImage.mediaKey = p.mediaKey;
          data.elevationImage.mediaType = p.mediaType;
          data.elevationImage.stageId = p.stageId;
          data.elevationImage.type = p.type;
          data.elevationImage.id = p.id;
        }
      });
    }
    return data as StageAssetEditForm;
  };

  const handleReset = (formikData: FormikProps<StageAssetEditForm>) => {
    const data: StageAssetEditForm = {
      primaryImage: {
        mediaKey: '',
        type: STAGE_MEDIA_TYPES.PHOTO,
        stageId,
        mediaType: STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
        image: undefined,
      },
      supplementaryImages: [
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
        {
          mediaKey: '',
          type: STAGE_MEDIA_TYPES.PHOTO,
          stageId,
          mediaType: STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
          image: undefined,
        },
      ],
      elevationImage: {
        mediaKey: '',
        type: STAGE_MEDIA_TYPES.PHOTO,
        stageId,
        mediaType: STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE,
        image: undefined,
      },
    };
    formikData.resetForm({
      values: data,
    });
  };

  return (
    <div>
      <Snackbar
        intent="error"
        show={showError}
        snackContent={'Something went wrong, please try again'}
      />
      <Formik
        enableReinitialize
        initialValues={getInitialData()}
        onSubmit={values => {
          handleSubmit(values as StageAssetEditForm);
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={StageAssetFormValidationSchema}
      >
        {formikProps => {
          return (
            <Form
              onChange={() => {}}
              onSubmit={e => {
                e.preventDefault();
                formikProps.handleSubmit(e);
              }}
            >
              <div>
                <Text
                  className="text-tints-forest-green-tint-2 mb-6"
                  size="xs"
                  weight="bold"
                >
                  TRAIL ASSETS
                </Text>
                <div>
                  <div className="flex flex-col md:flex-row gap-x-[52px] mb-10">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row gap-x-1 items-center relative">
                        <Text size="md">
                          Primary image{/* */}
                          <span className="text-red">*</span>
                        </Text>
                        <div className="group">
                          <InfoCircle
                            color="#949a92"
                            size="16"
                            variant="Bold"
                          />
                          <div className="w-full absolute left-1/2 transform -translate-x-1/2 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-black text-white py-2 px-4 rounded text-center">
                              This is the primary image
                            </span>
                          </div>
                        </div>
                      </div>
                      <InputContainer
                        className="mt-2 h-64"
                        error={
                          formikProps.errors.primaryImage?.image &&
                          formikProps.touched.primaryImage?.image
                            ? [formikProps.errors.primaryImage.image]
                            : undefined
                        }
                      >
                        <FileUpload
                          fileUploadHeight="64"
                          fileUrl={formikProps.values.primaryImage.mediaKey}
                          imageClassName="h-60 object-fill"
                          initialFile={formikProps.values.primaryImage.image}
                          inputId={STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE}
                          onChange={image => {
                            handleImageChange(
                              formikProps as FormikProps<StageAssetEditForm>,
                              image,
                              STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
                            );
                          }}
                          title="Drop files here or click to upload"
                          width="334px"
                        />
                      </InputContainer>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row gap-x-1 items-center relative">
                        <Text size="md">
                          Other images{/* */}
                          <span className="text-red">*</span>
                        </Text>
                        <div className="group">
                          <InfoCircle
                            color="#949a92"
                            size="16"
                            variant="Bold"
                          />
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-black text-white py-2 px-4 rounded text-center">
                              These are supplementary images
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full ml-13 gap-x-6 justify-center md:justify-start">
                        {formikProps.values.supplementaryImages.map(
                          (_sImage, index) => {
                            return (
                              <div key={index}>
                                <InputContainer className="mt-2 w-fit">
                                  <FileUpload
                                    fileUrl={
                                      formikProps.values.supplementaryImages[
                                        index
                                      ].mediaKey
                                    }
                                    imageClassName="h-28"
                                    initialFile={
                                      formikProps.values.supplementaryImages[
                                        index
                                      ].image
                                    }
                                    inputId={`${STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE}${index}`}
                                    onChange={image => {
                                      handleImageChange(
                                        formikProps as FormikProps<StageAssetEditForm>,
                                        image,
                                        STAGE_MEDIA_KEY_TYPES.SUPPLEMENTARY_IMAGE,
                                        index,
                                      );
                                    }}
                                    subTitle="click to upload"
                                    title="Drop files here or"
                                    width="100px"
                                  />
                                </InputContainer>
                                <Text intent={'red'} size={'sm'}>
                                  {formikProps.errors.supplementaryImages &&
                                    typeof formikProps.errors
                                      .supplementaryImages[index] ===
                                      'object' &&
                                    (
                                      formikProps.errors.supplementaryImages[
                                        index
                                      ] as FormikErrors<StageAssetType>
                                    )?.image}
                                </Text>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Text size="md">
                      Elevation graph{/* */}
                      <span className="text-red">*</span>
                    </Text>
                    <InputContainer
                      className="mt-2 md:w-96 w-full"
                      error={
                        formikProps?.errors?.elevationImage?.image &&
                        formikProps?.touched?.elevationImage?.image
                          ? [formikProps.errors.elevationImage.image]
                          : undefined
                      }
                    >
                      <FileUpload
                        fileUrl={formikProps.values.elevationImage.mediaKey}
                        imageClassName="h-44 object-fill"
                        initialFile={formikProps.values.elevationImage.image}
                        inputId={STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE}
                        onChange={image => {
                          handleImageChange(
                            formikProps as FormikProps<StageAssetEditForm>,
                            image,
                            STAGE_MEDIA_KEY_TYPES.ELEVATION_GRAPH_IMAGE,
                          );
                        }}
                        title="Drop files here or click to upload"
                        width="334px"
                      />
                    </InputContainer>
                  </div>
                </div>
                {action === FormActions.EDIT && (
                  <CustomCan a={Subject.Trail} I={UserActions.Update}>
                    <div className="flex justify-end mt-10 mb-16 gap-6">
                      {!initialData?.data?.length && (
                        <Button
                          intent={'secondary'}
                          onClick={() =>
                            handleReset(
                              formikProps as FormikProps<StageAssetEditForm>,
                            )
                          }
                          size={'md'}
                          type="reset"
                        >
                          <span className="m-auto">Reset</span>
                        </Button>
                      )}
                      <Button
                        loading={isStageMediaAdding}
                        size={'md'}
                        type="submit"
                      >
                        <span className="m-auto">Save changes</span>
                      </Button>
                    </div>
                  </CustomCan>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddTrailAssetForm;
