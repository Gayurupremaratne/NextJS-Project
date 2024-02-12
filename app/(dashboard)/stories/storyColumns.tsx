'use client';

import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { StoryEn } from '@/types/stories/story.type';
import { Text } from '@/components/atomic';
import { ActionButtons } from './ActionButtons';
import _ from 'lodash';

export const columns: ColumnDef<StoryEn>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" size={'md'} weight={'medium'}>
            {row.original.title}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'stageNumber',
    header: 'Stages assigned to',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            className="tracking-wide"
            intent={'forestGreenTintTwo'}
            size={'xs'}
            weight={'bold'}
          >
            {!_.isNil(row.original.stageNumber)
              ? `Stage  ${row.original.stageNumber}`.toUpperCase()
              : undefined}
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
