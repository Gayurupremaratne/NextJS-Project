'use client';

import Image, { ImageProps, StaticImageData } from 'next/image';
import React from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { AvatarSize } from './types';

interface AvatarProps extends Omit<ImageProps, 'src'> {
  imageUrl?: string | StaticImageData;
  altText?: string;
  size?: AvatarSize;
  badge?: boolean;
  number?: React.ReactNode;
  badgePosition?: 'top' | 'bottom';
  initials?: string;
}

const getContainerSize = (avatarSize?: AvatarSize): number => {
  switch (avatarSize) {
    case 'sm':
      return 32;
    case 'md':
      return 40;
    case 'lg':
      return 48;
    case 'xl':
      return 50;
    case '2xl':
      return 71;
    case '3xl':
      return 112;
    default:
      return 48;
  }
};

export const Avatar = ({
  imageUrl,
  altText,
  size,
  badge,
  number,
  badgePosition,
  initials,
}: AvatarProps) => {
  let width = 'w-10';
  let height = 'h-10';

  switch (size) {
    case 'sm':
      width = 'w-8';
      height = 'h-8';
      break;
    case 'xl':
      width = 'w-14';
      height = 'h-14';
      break;
    case '2xl':
      width = 'w-[71px]';
      height = 'h-[71px]';
      break;
    case '3xl':
      width = 'w-28';
      height = 'h-28';
      break;
    default:
      break;
  }
  const getFallbackContent = () => {
    const containerSize = getContainerSize(size);

    if (imageUrl) {
      return (
        <Image
          alt={altText ?? 'alt'}
          height={containerSize}
          src={imageUrl}
          style={{
            borderRadius: 'inherit',
            objectFit: 'cover',
            width: containerSize,
            height: containerSize,
          }}
          width={containerSize}
        />
      );
    } else if (initials) {
      const displayLetters = initials.substring(0, 2);
      return (
        <div
          className={
            'w-full h-full rounded-full bg-tints-forest-green-tint-6 text-shades-forest-green-shade-1 flex justify-center items-center'
          }
        >
          <span className="text-center text-sm font-medium">
            {displayLetters}
          </span>
        </div>
      );
    }
    return (
      <div
        className={
          'w-full h-full rounded-full bg-tints-forest-green-tint-6 text-shades-forest-green-shade-1 flex justify-center items-center'
        }
      >
        <span className="text-center text-sm font-medium">NA</span>
      </div>
    );
  };

  return (
    <div className={`${width} ${height} rounded-full`}>
      {badge && (
        <div
          className={`absolute h-3 w-3 border border-solid border-white rounded-full ${
            badgePosition === 'top'
              ? 'top-0 right-0 bg-tints-forest-green-tint-1 flex justify-center items-center'
              : 'bottom-0 right-0 bg-shades-jungle-green-shade-6'
          }`}
        >
          {badgePosition === 'top' && (
            <span className="text-white leading-4 text-[10px] text-center">
              {number}
            </span>
          )}
          {badgePosition === 'bottom' && (
            <ArrowDown2
              aria-hidden="true"
              className="h-2 w-2 text-white m-[1px]"
              variant="Bold"
            />
          )}
        </div>
      )}
      {getFallbackContent()}
    </div>
  );
};
