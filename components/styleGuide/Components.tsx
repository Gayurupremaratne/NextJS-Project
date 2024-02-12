'use client';

import React from 'react';
import { Button, Text } from '../atomic';
import { ArrowDown2, ArrowRight2 } from 'iconsax-react';

export const Components = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <Text className="text-[40px]" weight={'semiBold'}>
        Components
      </Text>
      <Text size={'md'} weight={'normal'}>
        This includes different component styles and states.
      </Text>
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Buttons
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Button styles and states
      </Text>
      {/* primary */}
      <div className="flex flex-col gap-3 w-full">
        <Text size={'md'} weight={'normal'}>
          Primary
        </Text>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button intent="primary" size={'md'}>
            Button
          </Button>
          <Button
            intent="primary"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            intent="primary"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            intent="primary"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'md'}
          ></Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button disabled intent="primary" size={'md'}>
            Button
          </Button>
          <Button
            disabled
            intent="primary"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="primary"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="primary"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'md'}
          ></Button>
        </div>
      </div>
      {/* secondary */}
      <div className="flex flex-col gap-3 w-20">
        <Text size={'md'} weight={'normal'}>
          Secondary
        </Text>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button intent="secondary" size={'md'}>
            Button
          </Button>
          <Button
            intent="secondary"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            intent="secondary"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            intent="secondary"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'md'}
          ></Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button disabled intent="secondary" size={'md'}>
            Button
          </Button>
          <Button
            disabled
            intent="secondary"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="secondary"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'md'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="secondary"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'md'}
          ></Button>
        </div>
      </div>
      {/* ghost */}
      <div className="flex flex-col gap-3 w-20">
        <Text size={'md'} weight={'normal'}>
          Ghost
        </Text>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button intent="ghost" size={'ghost'}>
            Button
          </Button>
          <Button
            intent="ghost"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'ghost'}
          >
            Button
          </Button>
          <Button
            intent="ghost"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'ghost'}
          >
            Button
          </Button>
          <Button
            intent="ghost"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'ghost'}
          ></Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-5 self-start">
          <Button disabled intent="ghost" size={'ghost'}>
            Button
          </Button>
          <Button
            disabled
            intent="ghost"
            preIcon={<ArrowDown2 variant="Bold" />}
            size={'ghost'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="ghost"
            postIcon={<ArrowDown2 variant="Bold" />}
            size={'ghost'}
          >
            Button
          </Button>
          <Button
            disabled
            intent="ghost"
            postIcon={<ArrowRight2 className="m-0" variant="Bold" />}
            size={'ghost'}
          ></Button>
        </div>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Button sizes
      </Text>
      <div className="flex sm:flex-row flex-col gap-10 self-start">
        <Button intent="primary" size={'sm'}>
          Small Button
        </Button>
        <Button intent="primary" size={'md'}>
          Medium Button
        </Button>
        <Button intent="primary" size={'lg'}>
          Large Button
        </Button>
        <Button intent="primary" size={'xl'}>
          Extra Large Button
        </Button>
      </div>
    </div>
  );
};
