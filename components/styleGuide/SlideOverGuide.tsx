'use client';

import React, { useState } from 'react';
import { Button, Text } from '../atomic';
import SlideOver from '../atomic/SlideOver/SlideOver';

export const SlideOverGuide = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="pt-[80px] px-14 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Slide Over
        </Text>
      </div>
      <div className="items-center gap-3 pt-8 mt-7">
        <Button onClick={() => setShow(!show)}>Click to view slide over</Button>
      </div>
      <SlideOver setShow={setShow} show={show} title="Title">
        <h2>slide context</h2>
      </SlideOver>
    </div>
  );
};
