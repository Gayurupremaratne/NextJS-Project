import { ImageDimensions } from '@/types/common.type';
import validator from 'validator';

export const imageWidthAndHeight = (
  provideFile: Blob,
): Promise<ImageDimensions> => {
  const imgDimensions: ImageDimensions = { width: 0, height: 0 };

  return new Promise(resolve => {
    const reader = new FileReader();

    reader.readAsDataURL(provideFile);
    reader.onload = function () {
      const img = new Image();
      img.src = typeof reader.result === 'string' ? reader.result : '';

      img.onload = function () {
        imgDimensions.width = img.width;
        imgDimensions.height = img.height;

        resolve(imgDimensions);
      };
    };
  });
};

export const isValidNumber = (number: string) => {
  const regex = /^\d{2,15}$/;
  return regex.test(number.replaceAll(' ', ''));
};

export const isValidPassport = (passport: string) => {
  const regex = /^[A-Z0-9]{5,9}$/;
  return regex.test(passport);
};

export const isValidEmail = (email: string) => validator.isEmail(email);

export const isValidNicNumber = (nicNumber: string) => {
  const regex = /^(\d{9}[xXvV]|\d{12})$/;
  return regex.test(nicNumber);
};
