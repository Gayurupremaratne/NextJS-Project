'use client';

import { formatBytes } from '@/components/common/utils';
import Image from 'next/image';
import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';
import close from '../../../public/images/icons/close-black.svg';
import { Button } from '../Button';
import { ProgressBar } from '../ProgressBar';
import { Text } from '../Text';

interface Props {
  initialFile?: File;
  fileUrl?: string;
  onChange: (promotion: File | undefined) => void;
  title?: string;
  subTitle?: string;
  inputId?: string;
  width?: string;
  imageClassName?: string;
  fileUploadHeight?: string;
}

export const FileUpload: React.FC<Props> = ({
  initialFile,
  fileUrl,
  onChange,
  subTitle = 'Supported file formats: jpg, png and img up to 25MB',
  title = 'Drop files here or click to upload',
  inputId = 'fileUpload',
  width,
  imageClassName,
  fileUploadHeight = '50',
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const allowedFileTypes = ['image/jpeg', 'image/png'];
  const isUploadingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialFile ?? null,
  );

  const isValidFileType = (file: File): boolean => {
    return allowedFileTypes.includes(file.type);
  };

  const uploadFile = (_file: File) => {
    isUploadingRef.current = true;
    setUploadProgress(0);

    intervalRef.current = setInterval(() => {
      setUploadProgress(prevProgress => prevProgress + 10);
    }, 500) as unknown as number;

    setTimeout(() => {
      clearInterval(intervalRef.current as unknown as number);
      isUploadingRef.current = false;
      setUploadProgress(0);
    }, 5000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidFileType(file)) {
      onChange(file);
      uploadFile(file);
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      onChange(undefined);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 border h-${fileUploadHeight} justify-center ${
        isDragging
          ? 'bg-tints-battleship-grey-tint-1'
          : selectedFile && !isUploadingRef.current
          ? 'bg-tints-forest-green-tint-6'
          : 'bg-white'
      } ${
        selectedFile && !isUploadingRef.current
          ? 'border-solid border-white p-4'
          : !isUploadingRef.current
          ? 'border-dashed border-tints-battleship-grey-tint-5 p-6'
          : 'border-dashed border-tints-battleship-grey-tint-5 p-4'
      }  rounded-[5px]`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={event => {
        setIsDragging(true);
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={handleDrop}
    >
      {selectedFile || fileUrl ? (
        <div className="font-albertSans flex flex-row gap-3 justify-between h-full items-center">
          {!isUploadingRef.current && (
            <>
              <div className="flex flex-col gap-3">
                <div className="">
                  <img
                    alt="profile image"
                    className={imageClassName}
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileUrl}`
                    }
                    width={width ?? width}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Text
                    className={'text-tints-battleship-grey-tint-1'}
                    size={'md'}
                    weight={'normal'}
                  ></Text>
                </div>
              </div>
              <Button
                intent={'ghost'}
                preIcon={
                  <Image
                    alt="close"
                    height={16}
                    onClick={handleRemoveFile}
                    src={close}
                    width={16}
                  />
                }
                size={'ghost'}
              ></Button>
            </>
          )}
          {selectedFile && isUploadingRef.current && (
            <div className="flex flex-col gap-3 items-left w-full">
              <Text intent={'green'} size={'md'} weight={'semiBold'}>
                Uploading...
              </Text>
              <div className="flex flex-row justify-between">
                <Text
                  className={'text-tints-battleship-grey-tint-1'}
                  size={'sm'}
                  weight={'normal'}
                >
                  {selectedFile.name?.length > 15
                    ? selectedFile.name.substring(0, 20) + '...'
                    : selectedFile.name}
                </Text>
                <div className="flex flex-row gap-4">
                  <Text
                    className={'text-tints-battleship-grey-tint-1'}
                    size={'sm'}
                    weight={'normal'}
                  >
                    {formatBytes(selectedFile?.size)}
                  </Text>
                  <Button
                    intent={'ghost'}
                    preIcon={
                      <Image
                        alt="close"
                        height={16}
                        onClick={handleRemoveFile}
                        src={close}
                        width={16}
                      />
                    }
                    size={'ghost'}
                  ></Button>
                </div>
              </div>
              <ProgressBar progress={uploadProgress} />
            </div>
          )}
        </div>
      ) : (
        <>
          {!isUploadingRef.current && (
            <>
              <label
                className="font-albertSans block self-center text-tints-forest-green-tint-1 font-semibold text-center"
                htmlFor={inputId}
              >
                {title}
              </label>
              <label
                className="font-albertSans block self-center text-tints-battleship-grey-tint-1 font-normal text-center text-sm"
                htmlFor={inputId}
              >
                {subTitle}
              </label>
            </>
          )}
        </>
      )}

      <input
        accept=".jpg,.jpeg,.png"
        className="hidden"
        id={inputId}
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
};
