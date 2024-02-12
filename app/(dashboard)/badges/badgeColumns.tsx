'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, Text } from '@/components/atomic';
import { IBadgeEn } from '@/types/badge/badge.type';
import { ActionButtons } from '@/components/badge-form/ActionButtons';

export const columns: ColumnDef<IBadgeEn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="mr-5">
            <Avatar
              alt={row?.original?.name ?? 'alt'}
              imageUrl={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${row?.original?.badgeKey}`}
              initials={row?.original?.name}
              size={'sm'}
            />
          </div>
          <Text size={'md'} weight={'medium'}>
            {row?.original?.name}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original?.type === 'MANUAL' ? 'Special' : 'Stage'}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original?.description}
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
