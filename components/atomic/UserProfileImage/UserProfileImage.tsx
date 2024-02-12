import React from 'react';
import { Avatar } from '../Avatar';
import camera from '../../../public/images/camera.svg';
import { SupportedImageTypesText, Text } from '@/components/atomic';
import Attachment from '../FileUpload/Attachment';
import { FormikProps } from 'formik';
import { UserImageData, UserPayload } from '@/types/user/user.type';
import { StaticContent } from '@/types/static-content/static-content.type';
import {
  getSignedUrl,
  uploadFile,
} from '@/api/static-content-upload/static-content-upload';

export interface Props {
  profileImageKey?: string;
  formik: FormikProps<UserPayload>;
  formikAttachment: FormikProps<UserImageData>;
  setProfileImageKey: (value: string | undefined) => void;
  setShowError: (value: boolean) => void;
}

export const UserProfileImage = ({
  profileImageKey,
  formik,
  formikAttachment,
  setProfileImageKey,
  setShowError,
}: Props) => {
  return (
    <>
      <div className="rounded-full border-2 border-tints-forest-green-tint-4 bg-white w-28 h-28 flex items-center justify-center">
        <div
          className="rounded-full w-full h-full border border-white bg-tints-forest-green-tint-6 flex items-center justify-center"
          style={{
            backgroundImage: `url('${
              profileImageKey
                ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${profileImageKey}`
                : ''
            }')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {profileImageKey ? (
            ''
          ) : (
            <div className="flex items-center justify-center w-28 h-28">
              <Avatar
                alt={'sample'}
                imageUrl={camera}
                initials={'sample'}
                size={profileImageKey ? 'xl' : 'md'}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <Attachment
          attachRemoveText="Remove profile picture"
          attachText="Add a profile picture"
          fileUrl={formik.values.profileImageKey}
          initialFile={formikAttachment.values.image}
          onChange={async image => {
            formik.setFieldValue('image', image);
            if (image !== undefined) {
              const payload: StaticContent = {
                fileName: image?.name,
                contentType: image?.type,
                module: 'profile-media',
                fileSize: image?.size,
              };
              try {
                // Call signed url api
                const response = await getSignedUrl(payload);
                // Upload file to s3
                if (response.status === 201) {
                  const fileUploadResponse = await uploadFile(
                    image,
                    response.data.s3Url,
                  );
                  if (fileUploadResponse.status === 200) {
                    formik.values.profileImageKey = `profile-media/${response.data.uniqueFileName}`;
                    setProfileImageKey(
                      `profile-media/${response.data.uniqueFileName}`,
                    );
                    delete formikAttachment.values.image;
                  } else {
                    setProfileImageKey(undefined);
                    setShowError(true);
                  }
                } else {
                  setProfileImageKey(undefined);
                  setShowError(true);
                }
              } catch (error) {
                setProfileImageKey(undefined);
                return;
              }
            } else {
              setProfileImageKey(undefined);
            }
          }}
          setProfileImageKey={setProfileImageKey}
        />
        <Text intent="red" size="xs" type="p">
          {formikAttachment.errors.image && formikAttachment.touched.image
            ? [formikAttachment.errors.image]
            : undefined}
        </Text>
        <SupportedImageTypesText text="Supported image types are jpg, jpeg, png and heic" />
      </div>
    </>
  );
};
