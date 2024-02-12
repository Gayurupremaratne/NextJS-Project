'use client';
import React from 'react';
import { Heading, Text } from '@/components/atomic';

export interface CardProps {
  cardTitle: string;
  cardDescription: string;
}

export const Card = ({ cardTitle, cardDescription }: CardProps) => {
  return (
    <div className="flex flex-col w-full border border-solid border-tints-forest-green-tint-6 p-4 rounded gap-2 bg-white shadow-sm">
      <Text size={'md'} weight={'medium'}>
        {cardTitle}
      </Text>
      <Heading intent={'h2'}>{cardDescription}</Heading>
    </div>
  );
};
