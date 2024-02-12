'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { UserPass } from '@/types/inventory/inventory.type';

export const columns: ColumnDef<UserPass>[] = [
  {
    accessorKey: 'trailName',
    header: 'Trail name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Text intent={'green'} size={'xs'} weight={'bold'}>
            STAGE {row.original.number}
          </Text>
          <Text size={'md'} weight={'medium'}>
            {row.original.trailHead} / {row.original.trailEnd}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'passCount',
    header: 'Pass count',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.count}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Travel date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.travelDate.toLocaleDateString()}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Completion status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.status}
          </Text>
        </div>
      );
    },
  },
];
