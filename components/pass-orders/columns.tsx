'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button, Heading, Text } from '@/components/atomic';
import { MinusCirlce } from 'iconsax-react';

import React, { useState } from 'react';
import { dateFormatter } from '@/utils/utils';
import { OrderByStageResponse } from '@/types/order/order.type';
import { AlertDialog } from '../atomic/Modal';
import { useDeleteOrder } from '@/hooks/order/order';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Snackbar } from '../atomic/Snackbar/Snackbar';

const DeletePass = ({ data }: { data: OrderByStageResponse }) => {
  const { stageId, reservedFor, user } = data;
  const [isError, setIsError] = useState<string | null>(null);
  const deleteOrder = useDeleteOrder();
  const queryClient = useQueryClient();

  const [showModal, setshowModal] = useState(false);

  const handleDelete = async () => {
    try {
      setIsError(null);
      await deleteOrder.mutateAsync(data.orderId as string);

      const month = reservedFor.toString().split('-')[1];

      queryClient.invalidateQueries([
        'orders-by-stage',
        stageId,
        reservedFor.toString().split('T')[0],
      ]);

      queryClient.invalidateQueries([
        'get-inventories-by-month',
        stageId,
        month.charAt(0) === '0' ? month.slice(1) : month,
        reservedFor.toString().split('-')[0],
      ]);
      setshowModal(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        setIsError(error?.response?.data?.message);
      } else {
        setIsError('Something went wrong, please try again');
      }
    }
  };

  return (
    <div className="flex items-center gap-x-6">
      <Button
        intent="ghost"
        onClick={() => {
          setshowModal(true);
        }}
        postIcon={
          <MinusCirlce
            className="text-snacks-borders-error"
            size="16"
            variant="Bulk"
          />
        }
        size={'ghost'}
      />
      <AlertDialog
        buttonFunction={() => {
          handleDelete();
        }}
        buttontText="Delete"
        modalAutoCloseOnSubmit={false}
        modalTitle="Delete pass"
        setShow={value => {
          setIsError(null);
          setshowModal(value);
        }}
        show={showModal}
      >
        <Snackbar
          intent="error"
          show={!!isError}
          snackContent={isError || ''}
        />
        <Heading
          intent={'h6'}
        >{`Are you sure you want to delete "${user.firstName} ${user.lastName}'s pass"?`}</Heading>
        <Text
          className="text-tints-battleship-grey-tint-3 mt-2"
          size={'sm'}
          weight={'normal'}
        >
          You cannot undo this action. All text and information associated with
          this pass will be permanently deleted.
        </Text>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<OrderByStageResponse>[] = [
  {
    accessorKey: 'user,firstName',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center mr-28 my-2 space-x-2">
          <Text size={'md'} weight={'medium'}>
            {row?.original?.user.firstName} {row?.original?.user.lastName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'passCount',
    header: 'Reserved Passes',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {row?.original?.passCount}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'reservedFor',
    header: 'Reserved Date',
    cell: ({ row }) => {
      const reservedFor = row?.original?.reservedFor;

      if (reservedFor) {
        return (
          <div className="flex items-center">
            <Text size={'md'} weight={'medium'}>
              {dateFormatter(reservedFor)}
            </Text>
          </div>
        );
      }

      return null;
    },
  },
  {
    accessorKey: 'orderId',
    header: '',
    cell: ({ row }) => {
      return <DeletePass data={row.original} />;
    },
  },
];
