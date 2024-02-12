'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { EnNotification } from '@/types/notifications/notification.type';
import { ActionButtons } from '@/app/(dashboard)/notifications/actionButtons';
import { capitalizeFirstLetter, dateFormatter } from '@/utils/utils';

const statusCellComponent = (status: string) => {
  if (status === 'SENT') {
    return (
      <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
        Sent
      </Text>
    );
  } else if (status === 'PROCESSING') {
    return (
      <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
        Processing
      </Text>
    );
  } else if (status === 'PENDING') {
    return (
      <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
        Pending
      </Text>
    );
  }
};

export const columns: ColumnDef<EnNotification>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.title}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
    cell: ({ row }) => {
      if (row?.original?.category) {
        return (
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            Stage-wise
          </Text>
        );
      }
      return (
        <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
          Normal
        </Text>
      );
    },
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid from',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {dateFormatter(row.original.startDate)}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'validTo',
    header: 'Valid to',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {dateFormatter(row.original.endDate)}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Notification type',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'dark'} size={'md'} weight={'medium'}>
            {capitalizeFirstLetter(row.original.type)}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      return statusCellComponent(row.original.status);
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
