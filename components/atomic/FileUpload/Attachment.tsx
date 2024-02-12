'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import attach from '../../../public/images/icons/attach.svg';
import { Button } from '../Button';
import { Text } from '../Text';
import { ProgressBar } from '../ProgressBar';
import { formatBytes } from '@/components/common/utils';
import _ from 'lodash';
import { MinusCirlce } from 'iconsax-react';

interface Props {
  initialFile?: File;
  fileUrl?: string;
  onChange: (story: File | undefined) => void;
  setProfileImageKey: (key: string | undefined) => void;
  attachText?: string;
  attachRemoveText?: string;
}

const Attachment: React.FC<Props> = ({
  initialFile,
  fileUrl,
  onChange,
  setProfileImageKey,
  attachText,
  attachRemoveText,
}: Props) => {
  const [initialAudioFile, setInitialAudioFile] = useState<File | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialFile || null,
  );

  const [fileUrlSelected, setFileUrlSelected] = useState<string | null>(
    fileUrl ?? null,
  );

  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    if (fileUrl) {
      setProfileImageKey(fileUrl);
      setFileUrlSelected(fileUrl);
    }
  }, [fileUrl]);

  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    if (initialFile != undefined) {
      setInitialAudioFile(initialFile);
    }
  }, [initialFile]);
  useEffect(() => {
    if (initialAudioFile) {
      setSelectedFile(initialAudioFile);
    }
  }, [initialAudioFile]);

  useEffect(() => {
    if (initialFile != undefined) {
      setSelectedFile(initialFile);
    }
  }, [initialFile]);

  const isValidFileType = (file: File): boolean => {
    return allowedFileTypes.includes(file.type);
  };

  const uploadFile = (_file: File) => {
    isUploadingRef.current = true;
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prevProgress => prevProgress + 10);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      isUploadingRef.current = false;
      setUploadProgress(0);
    }, 5000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      onChange(file);
      uploadFile(file);
    } else {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setProfileImageKey(undefined);
    setFileUrlSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      onChange(undefined);
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {selectedFile &&
      selectedFile.type === ('audio/mpeg' || 'audio/wav' || 'audio/ogg') &&
      !isUploadingRef.current ? (
        <div
          className={` ${
            selectedFile && 'flex flex-col gap-2'
          } w-[218px] rounded-[5px] ${
            selectedFile && isUploadingRef.current
              ? 'bg-white'
              : selectedFile
              ? 'bg-tints-forest-green-tint-6 p-3'
              : 'bg-white'
          }`}
        >
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row gap-3">
              <div className="self-center">
                <Image
                  alt="attach"
                  className="rounded-[5px]"
                  height={16}
                  src={attach}
                  width={16}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Text
                  intent={'green'}
                  onClick={() => {
                    if (!_.isEmpty(fileUrl)) {
                      const link = document.createElement('a');
                      link.href = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileUrl}`;
                      link.setAttribute(
                        'download',
                        `${initialFile?.name}.${initialFile?.type}`,
                      );
                      document.body.appendChild(link);
                      link.click();

                      // Clean up and remove the link
                      link?.parentNode?.removeChild(link);
                    }
                  }}
                  size={'md'}
                  weight={'semiBold'}
                >
                  {selectedFile.name.length > 13
                    ? selectedFile.name.substring(0, 13) + '...'
                    : selectedFile.name}
                </Text>
              </div>
            </div>
            <Button
              intent={'ghost'}
              onClick={handleRemoveFile}
              preIcon={
                <MinusCirlce className="mr-2" size="16" variant="Bold" />
              }
              size={'ghost'}
            ></Button>
          </div>
        </div>
      ) : fileUrlSelected !== null && typeof fileUrlSelected !== 'undefined' ? (
        <div className="flex flex-row gap-1">
          <Button
            intent={'dangerGhost'}
            onClick={handleRemoveFile}
            preIcon={<MinusCirlce className="mr-2" size="16" variant="Bold" />}
            size={'ghost'}
          >
            {attachRemoveText ?? 'Remove'}
          </Button>
        </div>
      ) : selectedFile && !isUploadingRef.current ? (
        <div className="flex flex-row gap-1">
          <Button
            intent={'dangerGhost'}
            onClick={handleRemoveFile}
            preIcon={<MinusCirlce className="mr-2" size="16" variant="Bold" />}
            size={'ghost'}
          >
            {attachRemoveText ?? 'Remove'}
          </Button>
        </div>
      ) : selectedFile && isUploadingRef.current ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <Text
              className={'text-shades-jungle-green-shade-1'}
              size={'md'}
              weight={'semiBold'}
            >
              Uploading...
            </Text>
            <Text
              className={'text-tints-battleship-grey-tint-1'}
              size={'sm'}
              weight={'normal'}
            >
              {formatBytes(selectedFile.size)}
            </Text>
            <Button
              intent={'ghost'}
              onClick={handleRemoveFile}
              preIcon={
                <MinusCirlce className="mr-2" size="16" variant="Bold" />
              }
              size={'ghost'}
            ></Button>
          </div>
          <ProgressBar progress={uploadProgress} />
        </div>
      ) : (
        <>
          <Button
            intent={'ghost'}
            onClick={handleAttachClick}
            preIcon={<Image alt="attach" height={16} src={attach} width={16} />}
            size={'ghost'}
            type="button"
          >
            {attachText ?? 'Attach files'}
          </Button>
        </>
      )}

      <input
        accept=".jpg,.jpeg,.png,audio/*"
        className="hidden"
        id="fileUpload"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
};

export default Attachment;
