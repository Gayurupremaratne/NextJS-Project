'use client';

import React from 'react';
import { Text } from '@/components/atomic';

export const Colors = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Colors
        </Text>
      </div>
      {/* primary color */}
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Primary color
        </Text>
        <div className="flex flex-col gap-2">
          <div className="md:w-[432px] bg-tints-forest-green-tint-1 h-14 rounded-md"></div>
          <Text size={'md'} weight={'medium'}>
            Forest green
          </Text>
          <Text size={'md'} weight={'medium'}>
            #577434
          </Text>
        </div>
      </div>
      {/* secondary colors */}
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Secondary colors
        </Text>
        <div className="flex xl:flex-row flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="md:w-[432px] bg-tints-teal-mist-tint-1 h-14 rounded-md"></div>
            <Text size={'md'} weight={'medium'}>
              Teal mist
            </Text>
            <Text size={'md'} weight={'medium'}>
              #18AEBB
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <div className="md:w-[432px] bg-tints-leaf-green-tint-1 h-14 rounded-md"></div>
            <Text size={'md'} weight={'medium'}>
              Leaf green
            </Text>
            <Text size={'md'} weight={'medium'}>
              #A3A436
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <div className="md:w-[432px] bg-tints-jungle-green-tint-1 h-14 rounded-md"></div>
            <Text size={'md'} weight={'medium'}>
              Jungle green
            </Text>
            <Text size={'md'} weight={'medium'}>
              #314D25
            </Text>
          </div>
        </div>
      </div>
      {/* shades and tints */}
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Shades and tints
        </Text>
        <div className="flex xl:flex-row flex-col gap-14">
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-tints-forest-green-tint-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-tints-forest-green-tint-2 h-14" />
                <div className="w-[48px] bg-tints-forest-green-tint-3 h-14" />
                <div className="w-[48px] bg-tints-forest-green-tint-4 h-14" />
                <div className="w-[48px] bg-tints-forest-green-tint-5 h-14" />
                <div className="w-[48px] bg-tints-forest-green-tint-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Forest green - Tints
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-tints-teal-mist-tint-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-tints-teal-mist-tint-2 h-14" />
                <div className="w-[48px] bg-tints-teal-mist-tint-3 h-14" />
                <div className="w-[48px] bg-tints-teal-mist-tint-4 h-14" />
                <div className="w-[48px] bg-tints-teal-mist-tint-5 h-14" />
                <div className="w-[48px] bg-tints-teal-mist-tint-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Teal mist - Tints
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-tints-leaf-green-tint-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-tints-leaf-green-tint-2 h-14" />
                <div className="w-[48px] bg-tints-leaf-green-tint-3 h-14" />
                <div className="w-[48px] bg-tints-leaf-green-tint-4 h-14" />
                <div className="w-[48px] bg-tints-leaf-green-tint-5 h-14" />
                <div className="w-[48px] bg-tints-leaf-green-tint-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Leaf green - Tints
              </Text>
            </div>
          </div>
        </div>
        <div className="flex xl:flex-row flex-col gap-14">
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-shades-forest-green-shade-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-shades-forest-green-shade-2 h-14" />
                <div className="w-[48px] bg-shades-forest-green-shade-3 h-14" />
                <div className="w-[48px] bg-shades-forest-green-shade-4 h-14" />
                <div className="w-[48px] bg-shades-forest-green-shade-5 h-14" />
                <div className="w-[48px] bg-shades-forest-green-shade-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Forest green - Shades
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-shades-teal-mist-shade-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-shades-teal-mist-shade-2 h-14" />
                <div className="w-[48px] bg-shades-teal-mist-shade-3 h-14" />
                <div className="w-[48px] bg-shades-teal-mist-shade-4 h-14" />
                <div className="w-[48px] bg-shades-teal-mist-shade-5 h-14" />
                <div className="w-[48px] bg-shades-teal-mist-shade-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Teal mist - Shades
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-shades-leaf-green-shade-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-shades-leaf-green-shade-2 h-14" />
                <div className="w-[48px] bg-shades-leaf-green-shade-3 h-14" />
                <div className="w-[48px] bg-shades-leaf-green-shade-4 h-14" />
                <div className="w-[48px] bg-shades-leaf-green-shade-5 h-14" />
                <div className="w-[48px] bg-shades-leaf-green-shade-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Leaf green - Shades
              </Text>
            </div>
          </div>
        </div>
      </div>
      {/* grey shades and tints */}
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Shades and tints
        </Text>
        <div className="flex xl:flex-row flex-col gap-14">
          <div className="flex flex-col gap-2">
            <div className="w-[319px] bg-tints-battleship-grey-tint-1 h-14 rounded-md"></div>
            <Text size={'md'} weight={'medium'}>
              Battleship gray
            </Text>
            <Text size={'md'} weight={'medium'}>
              #949A92
            </Text>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-tints-battleship-grey-tint-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-tints-battleship-grey-tint-2 h-14" />
                <div className="w-[48px] bg-tints-battleship-grey-tint-3 h-14" />
                <div className="w-[48px] bg-tints-battleship-grey-tint-4 h-14" />
                <div className="w-[48px] bg-tints-battleship-grey-tint-5 h-14" />
                <div className="w-[48px] bg-tints-battleship-grey-tint-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Battleship gray - Tints
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-2">
              <div className="w-[288px] h-14 flex flex-row">
                <div className="w-[48px] bg-shades-battleship-grey-shade-1 h-14 rounded-l-md" />
                <div className="w-[48px] bg-shades-battleship-grey-shade-2 h-14" />
                <div className="w-[48px] bg-shades-battleship-grey-shade-3 h-14" />
                <div className="w-[48px] bg-shades-battleship-grey-shade-4 h-14" />
                <div className="w-[48px] bg-shades-battleship-grey-shade-5 h-14" />
                <div className="w-[48px] bg-shades-battleship-grey-shade-6 h-14 rounded-r-md" />
              </div>
              <Text size={'md'} weight={'medium'}>
                Battleship gray - Shades
              </Text>
            </div>
          </div>
        </div>
      </div>
      {/* data visualization colors */}
      <div className="flex flex-col gap-8">
        <Text
          className="text-tints-battleship-grey-tint-3"
          size={'3xl'}
          weight={'normal'}
        >
          Data visualization colors
        </Text>
        <div className="flex flex-col gap-5">
          <div className="flex xl:flex-row flex-col gap-11">
            <div className="flex flex-col gap-2">
              <div className="w-[184px] bg-data-color-1 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #DFE566
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-2 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #F7A47B
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-3 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #79D4F1
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-4 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #9092BE
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-5 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #FBD07B
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-6 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #AC9A81
              </Text>
            </div>
          </div>
          <div className="flex xl:flex-row flex-col gap-11">
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-7 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #A8A8A9
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-8 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #F4A3A0
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-9 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #B0E195
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[184px]  bg-data-color-10 h-14 rounded-md"></div>
              <Text size={'md'} weight={'medium'}>
                #BA80C6
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
