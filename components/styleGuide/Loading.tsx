'use client';

import React from 'react';
import { ProgressBar, Spinner, Text } from '../atomic';

export const Loading = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          LOADINGS AND PROGRESSBAR
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Scales
      </Text>
      <div className="flex md:flex-row flex-col gap-28">
        <div className="flex flex-col gap-2">
          <Text>Loading scale</Text>
          <div className="flex flex-row gap-10">
            <Spinner intent="secondary" loading spinnerSize="xs" />
            <Spinner intent="secondary" loading spinnerSize="sm" />
            <Spinner intent="secondary" loading spinnerSize="md" />
            <Spinner intent="secondary" loading spinnerSize="lg" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Text>Progressbar scale</Text>
          <div className="flex flex-col gap-10">
            <div className="w-12">
              <ProgressBar progress={30} />
            </div>
            <div className="w-16">
              <ProgressBar progress={50} />
            </div>
            <div className="w-20">
              <ProgressBar progress={80} />
            </div>
            <div className="w-40">
              <ProgressBar progress={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
