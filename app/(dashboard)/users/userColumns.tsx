'use client';

import { Button } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import UserStatusCellComponent from '@/components/atomic/UserStatusCellComponent/UserStatusCellComponent';
import UserForm from '@/components/user-form/UserForm';
import { FormActions } from '@/constants/form-actions';
import { useGetEmergencyContacts } from '@/hooks/emergencyContact/emergencyContact';
import { UserResponse } from '@/types/user/user.type';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Eye } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const EditViewCellComponent = (userId: string, userData: UserResponse) => {
  const { data } = useGetEmergencyContacts(userId);

  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showEditPage, setShowEditPage] = useState(false);

  const handleEditClick = (updateUserId: string) => {
    setSelectedUserId(updateUserId);
    setShowEditPage(true);
  };

  const handleViewUser = () => {
    router.push(`/users/${userId}`);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-x-6">
        <Button
          intent="ghost"
          onClick={() => {
            handleViewUser();
          }}
          postIcon={<Eye size="16" variant="Bulk" />}
          size={'ghost'}
        />
        <Button
          intent="ghost"
          onClick={() => {
            handleEditClick(userId);
          }}
          postIcon={<Edit2 size="16" variant="Bulk" />}
          size={'ghost'}
        />
      </div>
      <SlideOver
        setShow={setShowEditPage}
        show={showEditPage}
        title="Edit User"
      >
        <UserForm
          action={FormActions.EDIT}
          emergencyContactData={data?.data.data}
          setEditShow={setShowEditPage}
          userData={userData}
          userId={selectedUserId}
        />
      </SlideOver>
    </>
  );
};

export const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {row?.getValue('firstName')} {row?.original?.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    enableSorting: true,
  },
  {
    accessorKey: 'role,name',
    header: 'Role',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row?.original?.role?.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'loginAt',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      return UserStatusCellComponent(row.original.loginAt);
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row: _row }) => {
      return EditViewCellComponent(_row.original.id.toString(), _row.original);
    },
  },
];
