'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { TagEn } from '@/types/tags/tags';
import { ActionButtons } from '@/components/tag-form/ActionButtons';

export const columns: ColumnDef<TagEn>[] = [
  {
    accessorKey: 'name',
    header: 'Title',
    enableSorting: true,
    cell: ({ row }) => {
      const translatedName = row?.original?.name;
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {translatedName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'stages',
    header: 'Stages assigned to',
    cell: ({ row }) => {
      const stageAssociation = row?.original?.relatedStages;

      if (stageAssociation && stageAssociation.length > 0) {
        stageAssociation.sort((a, b) => {
          const stageNumberA = parseInt(a?.toString(), 10);
          const stageNumberB = parseInt(b?.toString(), 10);
          return stageNumberA - stageNumberB;
        });

        const stageNumbers = stageAssociation
          .map(assoc => {
            const stageNumber = assoc.toString().padStart(2, '0');
            return 'STAGE ' + stageNumber;
          })
          .join(', ');

        return (
          <div className="flex items-center">
            <Text
              className="text-tints-forest-green-tint-2 whitespace-pre-wrap"
              size={'xs'}
              weight={'bold'}
            >
              {stageNumbers}
            </Text>
          </div>
        );
      }
      return (
        <div className="flex items-center">
          <Text
            className="text-tints-forest-green-tint-2"
            size={'xs'}
            weight={'bold'}
          >
            {'-'}
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
