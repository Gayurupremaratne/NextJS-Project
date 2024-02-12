'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RoleResponse } from '@/types/role/role.type';
import { Button, Text } from '@/components/atomic';
import { Edit2, Eye } from 'iconsax-react';

import React from 'react';
import { dateFormatter } from '@/utils/utils';

export const columns = (
  setEditShow: (id: number) => void,
  handleViewRole: (id: number) => void,
): ColumnDef<RoleResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Role',
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
    cell: ({ row }) => {
      const createdAt = row?.original?.createdAt;

      if (createdAt) {
        return (
          <div className="flex items-center">
            <Text size={'md'}>{dateFormatter(createdAt)}</Text>
          </div>
        );
      }

      return null;
    },
  },
  {
    accessorKey: 'userCount',
    header: 'No of users',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'}>{row?.original?.userCount}</Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-x-6">
          <Button
            intent="ghost"
            onClick={() => {
              handleViewRole(row.original.id);
            }}
            postIcon={<Eye size="16" variant="Bulk" />}
            size={'ghost'}
          />
          {row.original.id > 3 && (
            <Button
              intent="ghost"
              onClick={() => setEditShow(row.original.id)}
              postIcon={<Edit2 size="16" variant="Bulk" />}
              size={'ghost'}
            />
          )}
        </div>
      );
    },
  },
];
