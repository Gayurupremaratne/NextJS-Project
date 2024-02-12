'use client';
import { Text } from '@/components/atomic';
import { ContentTable } from '@/types/guidelines/guideline.type';
import { ColumnDef } from '@tanstack/react-table';
import { ActionButtons } from './ActionButtons';

export const columns: ColumnDef<ContentTable>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" size={'md'} weight={'medium'}>
            {row?.original?.type}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" size={'md'} weight={'medium'}>
            {row.original.description}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return <ActionButtons rowId={row.id} />;
    },
  },
];
