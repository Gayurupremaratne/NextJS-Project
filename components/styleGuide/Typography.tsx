'use client';

import React from 'react';
import { Heading, Text } from '@/components/atomic';

export const Typography = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Typography
        </Text>
      </div>
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Typographic scales
        </Text>
        <div className="flex md:flex-row flex-col md:gap-52 gap-5">
          {/* headings */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 01
              </Text>
              <Heading intent={'h1'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Bold | 32/42 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 02
              </Text>
              <Heading intent={'h2'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Medium | 28/32 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 03
              </Text>
              <Heading intent={'h3'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | SemiBold | 24/28 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 04
              </Text>
              <Heading intent={'h4'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | SemiBold | 20/24 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 05
              </Text>
              <Heading intent={'h5'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | SemiBold | 18/24 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Heading 06
              </Text>
              <Heading intent={'h6'}>Admin Portal</Heading>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | medium | 16/22 | 0%
              </Text>
            </div>
          </div>
          {/* texts */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Subtitle
              </Text>
              <Text intent={'green'} size={'xs'} weight={'bold'}>
                Admin Portal
              </Text>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Bold | 12/24 | 80%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Body 01
              </Text>
              <Text intent={'dark'} size={'md'} weight={'normal'}>
                Admin Portal
              </Text>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Regular | 16/22 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Body 02
              </Text>
              <Text intent={'dark'} size={'sm'} weight={'normal'}>
                Admin Portal
              </Text>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Regular | 14/18 | 0%
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text intent={'green'} size={'md'} weight={'bold'}>
                Button text
              </Text>
              <Text intent={'dark'} size={'md'} weight={'semiBold'}>
                Admin Portal
              </Text>
              <Text
                className="text-tints-battleship-grey-tint-2"
                size={'md'}
                weight={'medium'}
              >
                Albert Sans | Semibold | 16/22 | 0%
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
