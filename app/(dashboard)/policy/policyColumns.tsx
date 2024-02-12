'use client';

import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Text } from '@/components/atomic';
import { ActionButtons } from './actionButtons';
import { IPolicy } from '@/types/policy/policy.type';

export const columns: ColumnDef<IPolicy>[] = [
  {
    accessorKey: 'title',
    header: 'Policy name',
    cell: ({ row }) => {
      const translation = row.original.policyTranslations?.find(
        t => t.localeId === 'en',
      );
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {translation?.title}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Policy type',
    cell: ({ row }) => {
      if (row.original.isGroupParent === true) {
        return (
          <div className="flex items-center">
            <Text
              className="pr-2"
              intent={'dark'}
              size={'md'}
              weight={'medium'}
            >
              Group
            </Text>
          </div>
        );
      }
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            Single
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'tag',
    header: 'Policy tag',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.slug}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return <ActionButtons initialData={row.original} />;
    },
  },
];
