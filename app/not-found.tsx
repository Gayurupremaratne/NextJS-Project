'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Heading, Text } from '@/components/atomic';
import fourOFourImage from '../public/images/404.svg';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center p-5 text-center">
      <Image alt="page-not-found" className="mb-10" src={fourOFourImage} />
      <Heading className="mb-5" intent="h3" weight="semiBold">
        Oops! Something went wrong
      </Heading>
      <Text className="mb-10" size="md">
        The page you’re looking for cannot be found
      </Text>
      <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
    </div>
  );
};

export default NotFound;
