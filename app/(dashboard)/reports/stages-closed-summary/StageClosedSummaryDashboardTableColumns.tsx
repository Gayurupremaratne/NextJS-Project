'use client';

import React from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { ClosedStagesSummaryData } from '@/types/report/report.type';
import { getFormattedDate } from '../stage-wise-summary/StageWiseSummaryTableColumns';

export const columns: ColumnDef<ClosedStagesSummaryData>[] = [
  {
    accessorKey: 'trail',
    header: 'Trail stage and name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 h-6">
          {row.original.stageId !== 'total_passes' && (
            <Text
              className="text-tints-forest-green-tint-2"
              size="xs"
              weight={'bold'}
            >
              STAGE {row.original.stageNumber}
            </Text>
          )}
          <Text
            className="truncate max-w-[240px]"
            size={'md'}
            weight={'medium'}
          >
            {`${row.original.stageHead} / ${row.original.stageTail}`}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'closureStartDate',
    header: 'Closure start date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.closedDate
              ? getFormattedDate(row.original.closedDate)
              : ''}{' '}
          </Text>
        </div>
      );
    },
  },
];
