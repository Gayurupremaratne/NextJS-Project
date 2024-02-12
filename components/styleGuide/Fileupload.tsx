'use client';

import { Text } from '../atomic';
import { FileUpload } from '../atomic/FileUpload';
import Attachment from '../atomic/FileUpload/Attachment';

export const UploadFile = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          FILES
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Upload and view
      </Text>
      <div>
        <Text size={'md'} weight={'semiBold'}>
          Dropzone
        </Text>
        <FileUpload onChange={() => {}} />
      </div>
      <div className="flex flex-col gap-4">
        <Text size={'md'} weight={'semiBold'}>
          Attachments
        </Text>
        <Attachment
          initialFile={undefined}
          onChange={() => {
            return {};
          }}
          setProfileImageKey={() => {}}
        />
      </div>
    </div>
  );
};
