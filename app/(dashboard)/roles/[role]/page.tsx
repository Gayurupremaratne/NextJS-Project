'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  DataTable,
  Heading,
  Input,
  InputContainer,
  Text,
} from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import { columns } from './roleColumns';
import { useGetRole } from '@/hooks/role/role';
import { USER_LIST_PAGE_SIZE } from '@/constants/pagination-page-size';
import EditRole from '@/components/edit-role';
import { useGetUsersByRole } from '@/hooks/user/user';
import { UserResponse } from '@/types/user/user.type';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    role: string;
  };
}

const Index = ({ params }: Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState('');
  const { data: role } = useGetRole(parseInt(params.role));
  const { data: usersData, refetch } = useGetUsersByRole(
    parseInt(params.role),
    { perPage: USER_LIST_PAGE_SIZE, pageNumber: currentPage + 1, search },
  );

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [editShow, setEditShow] = useState({
    show: false,
    id: 0,
  });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.data.data.data);
      setTotalPages(usersData.data.data.meta?.lastPage);
    }
  }, [usersData]);

  useEffect(() => {
    refetch();
  }, [currentPage, search]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleEditShow = (id: number) => {
    setEditShow(prev => ({
      show: !prev.show,
      id,
    }));
  };

  if (!role) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full mb-8">
        <div className="flex gap-x-6 justify-between w-full">
          <div className="space-y-3">
            <Heading intent={'h3'}>{role?.name}</Heading>

            {usersData?.data.data.meta && (
              <div className="flex">
                <Text className="text-tints-battleship-grey-tint-2">
                  Assigned count: &nbsp;
                </Text>
                <Text>{usersData?.data.data.meta.total}</Text>
              </div>
            )}
          </div>
          <div className="flex gap-x-4">
            <Button
              intent="secondary"
              onClick={() => {
                router.push('/roles');
              }}
            >
              Back
            </Button>
            {role?.id > 3 && (
              <Button
                intent="primary"
                onClick={() => {
                  setEditShow({
                    show: true,
                    id: role?.id ?? 0,
                  });
                }}
                size={'md'}
              >
                Edit
              </Button>
            )}
          </div>

          <SlideOver
            setShow={() => toggleEditShow(editShow.id)}
            show={editShow.show}
            title="Edit user role"
          >
            <EditRole
              id={editShow.id}
              setShow={() => toggleEditShow(editShow.id)}
            />
          </SlideOver>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <Heading intent={'h4'}>Assign users to {role?.name}</Heading>
        <div className="w-[353px]">
          <InputContainer className="py-5 w-full h-10">
            <Input
              className="rounded"
              name="search"
              onChange={event => setSearch(event.target.value)}
              placeholder={'Search'}
              type="text"
              value={search}
            />
          </InputContainer>
        </div>
      </div>
      <DataTable<UserResponse>
        columns={columns}
        currentPage={currentPage}
        data={users}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Index;
