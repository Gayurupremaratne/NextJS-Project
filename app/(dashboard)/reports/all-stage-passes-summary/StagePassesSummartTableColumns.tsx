'use client';

import React from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { StageSummaryData } from '@/types/report/report.type';

export const columns: ColumnDef<StageSummaryData>[] = [
  {
    accessorKey: 'trail',
    header: 'Trail',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          {row.original.id !== 'total_passes' && (
            <Text
              className="text-tints-forest-green-tint-2"
              size="xs"
              weight={row.original.id === 'total_passes' ? 'semiBold' : 'bold'}
            >
              STAGE {row.original.stageNumber}
            </Text>
          )}
          <Text
            size={'md'}
            weight={row.original.id === 'total_passes' ? 'semiBold' : 'medium'}
          >
            {row.original.stageName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalPasses',
    header: 'Total Passes',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            size={'md'}
            weight={row.original.id === 'total_passes' ? 'semiBold' : 'medium'}
          >
            {row.original.inventoryQuantity}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'allocatedPasses',
    header: 'Allocated passes',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            size={'md'}
            weight={row.original.id === 'total_passes' ? 'semiBold' : 'medium'}
          >
            {row.original.passQuantity}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'remainingPasses',
    header: 'Remaining passes',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text
            size={'md'}
            weight={row.original.id === 'total_passes' ? 'semiBold' : 'normal'}
          >
            {row.original.remainingQuantity}
          </Text>
        </div>
      );
    },
  },
];
