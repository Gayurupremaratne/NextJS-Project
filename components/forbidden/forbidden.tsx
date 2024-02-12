'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Heading, Text } from '@/components/atomic';
import fourOThree from '../../public/images/403.svg';

const Forbidden = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-5 text-center w-full">
      <Image alt="page-not-found" className="mb-10" src={fourOThree} />
      <Heading className="mb-5" intent="h3" weight="semiBold">
        Access denied
      </Heading>
      <Text className="mb-10" size="md">
        You don’t have permission to access this page
      </Text>
      <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
    </div>
  );
};

export default Forbidden;
