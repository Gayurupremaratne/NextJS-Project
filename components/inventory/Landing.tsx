'use client';

import { Text } from '@/components/atomic';
import Image from 'next/image';
import grayBox from '/public/images/icons/gray-box.svg';

const LandingInventory = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] items-center justify-center">
      <Image alt="open" height={112} src={grayBox} width={112} />
      <Text
        className="text-center"
        intent={'grey'}
        size={'md'}
        weight={'normal'}
      >
        Please select a stage from the above dropdown <br />
        to view and edit inventory information
      </Text>
    </div>
  );
};

export default LandingInventory;
