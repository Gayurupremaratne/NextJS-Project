'use client';

import React from 'react';
import moment from 'moment';
import { getName } from 'country-list';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { CancelledPassRecord } from '@/types/report/report.type';

const getFormattedDate = (date: Date) => {
  const d = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
  }).format(new Date(date));
  return moment(new Date(d)).format('DD-MM-YYYY');
};

export const columns: ColumnDef<CancelledPassRecord>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Text
            size={'md'}
            weight={row.original.user.nationalityCode ? 'medium' : 'semiBold'}
          >
            {row.original.user.firstName} {row.original.user.lastName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'cancelledPasses',
    header: 'Cancelled passes',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            size={'md'}
            weight={row.original.user.nationalityCode ? 'medium' : 'semiBold'}
          >
            {row.original.passesCount}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {getName(row.original.user.nationalityCode) ??
              row.original.user.nationalityCode}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Cancelled date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.cancelledDate
              ? getFormattedDate(row.original.cancelledDate)
              : ''}
          </Text>
        </div>
      );
    },
  },
];
