'use client';
import { Label, Text } from '@/components/atomic';
import { Promotion } from '@/types/promotions/promotion.type';
import { ColumnDef } from '@tanstack/react-table';
import { Grammerly } from 'iconsax-react';
import Link from 'next/link';
import { ActionButtons } from './ActionButtons';

const PromotionStatusCellComponent = (isActive: boolean) => {
  return (
    <span>
      {isActive ? (
        <Label
          intent={'active'}
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Active
        </Label>
      ) : (
        <Label
          intent={'inactive'}
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Inactive
        </Label>
      )}
    </span>
  );
};

export const columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: 'title',
    header: 'Promotion title',
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
    accessorKey: 'url',
    header: 'Web URL',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text className="pr-2" intent={'green'} size={'md'} weight={'medium'}>
            <Link href={row.original.url}>{row.original.url}</Link>
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
      return PromotionStatusCellComponent(row.original.isActive);
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
