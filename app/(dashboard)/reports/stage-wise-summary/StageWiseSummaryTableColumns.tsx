'use client';

import React from 'react';
import moment from 'moment';
import { getName } from 'country-list';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { StageWiseSummaryReportDto } from '@/types/report/report.type';

export const getFormattedDate = (date: Date) => {
  const isoDate = new Date(date).toISOString();
  const d = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
  }).format(new Date(isoDate));
  return moment(new Date(d)).format('DD-MM-YYYY');
};

export const columns: ColumnDef<StageWiseSummaryReportDto>[] = [
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
    accessorKey: 'reservedPasses',
    header: 'Reserved Passes',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            size={'md'}
            weight={row.original.user.nationalityCode ? 'medium' : 'semiBold'}
          >
            {row.original.passCount}
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
    header: 'Booking date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.bookingDate
              ? getFormattedDate(row.original.bookingDate)
              : ''}
          </Text>
        </div>
      );
    },
  },
];
