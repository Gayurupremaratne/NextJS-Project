/* eslint-disable import/no-extraneous-dependencies */
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { UserResponse } from '@/types/user/user.type';
import React from 'react';
import { dateFormatter } from '@/utils/utils';
import UserStatusCellComponent from '@/components/atomic/UserStatusCellComponent/UserStatusCellComponent';

export const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original.firstName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original.lastName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original.email}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'nicNumber',
    header: 'Identity',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original.nicNumber}
          </Text>
        </div>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    header: 'Assigned Date',
    cell: ({ row }) => {
      const createdAt = row?.original?.createdAt;

      if (createdAt) {
        return (
          <div className="flex items-center">
            <Text>{dateFormatter(createdAt)}</Text>
          </div>
        );
      }

      return null;
    },
  },

  {
    accessorKey: 'loginAt',
    header: 'Status',
    cell: ({ row }) => {
      return UserStatusCellComponent(row.original.loginAt);
    },
  },
];
