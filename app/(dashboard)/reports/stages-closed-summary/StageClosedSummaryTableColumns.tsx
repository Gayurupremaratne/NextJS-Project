'use client';

import React from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { ClosedStagesSummaryData } from '@/types/report/report.type';
import { getFormattedDate } from '../stage-wise-summary/StageWiseSummaryTableColumns';

export const columns: ColumnDef<ClosedStagesSummaryData>[] = [
  {
    accessorKey: 'trail',
    header: 'Trail',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 h-11">
          <Text
            className="text-tints-forest-green-tint-2"
            size="xs"
            weight={'bold'}
          >
            STAGE {row.original.stageNumber}
          </Text>
          <Text size={'md'} weight={'medium'}>
            {`${row.original.stageHead} / ${row.original.stageTail}`}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.closedDate
              ? getFormattedDate(row.original.closedDate)
              : ''}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason for closure',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row.original.closeReason}
          </Text>
        </div>
      );
    },
  },
];
