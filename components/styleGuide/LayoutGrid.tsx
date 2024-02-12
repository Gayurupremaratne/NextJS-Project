'use client';

import React from 'react';
import { Text } from '@/components/atomic';

export const LayoutGrid = () => {
  return (
    <div className="pt-[80px]  px-14 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          LAYOUT GRID
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Desktop layout grid
      </Text>
      <div className="h-[108px] self-center bg-tints-forest-green-tint-6 w-[1336px]" />
      <div className="self-center text-center flex flex-col gap-1">
        <div className="left-0 right-0 bottom-0 h-0.5 bg-tints-forest-green-tint-6  w-[1336px]"></div>
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Max width - 1336px
        </Text>
      </div>
    </div>
  );
};
