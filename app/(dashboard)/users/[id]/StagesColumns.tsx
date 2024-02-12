'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { UserStage } from '@/types/stage/stage.type';

const Status = {
  COMPLETE: 'Complete',
  INCOMPLETE: 'Incomplete',
};

export const columns: ColumnDef<UserStage>[] = [
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
    accessorKey: 'status',
    header: 'Completion status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {`${row.original.status ? Status.COMPLETE : Status.INCOMPLETE}`} -{' '}
            {`${parseFloat(row.original.completedPercentage).toFixed(2)}%`}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Booked date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.bookedDate.toLocaleDateString()}
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
];
