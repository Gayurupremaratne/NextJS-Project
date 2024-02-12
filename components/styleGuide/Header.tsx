'use client';

import React from 'react';
import Image from 'next/image';
import logo from '../../public/images/logo.svg';
import { Text } from '@/components/atomic';

export const Header = () => {
  return (
    <div
      className={
        'font-albertSans bg-tints-forest-green-tint-6 flex flex-col gap-6 pt-16 pb-12 md:px-14 px-4'
      }
    >
      <div>
        <Image alt="logo" height={111} src={logo} width={152} />
      </div>
      <div>
        <h1 className="text-[80px]">Design System - Admin</h1>
      </div>
      <div className="md:w-[704px]">
        <Text size={'md'}>
          This design system is created for application to keep user
          interfaces standardized across the platform and to keep things
          consistent whenever new components are added.
        </Text>
      </div>
      <div className="flex lg:flex-row flex-col gap-12 pt-8">
        <Text intent={'green'} size={'md'} weight={'bold'}>
          LAYOUT GRID
        </Text>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          SPACING
        </Text>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          COLORS
        </Text>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          TYPOGRAPHY
        </Text>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          ICONOGRAPHY
        </Text>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          COMPONENTS
        </Text>
      </div>
    </div>
  );
};
