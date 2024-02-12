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
import { columns } from './userColumns';
import { UserResponse } from '@/types/user/user.type';
import { useGetAllUsers } from '@/hooks/user/user';
import _ from 'lodash';
import { UseParams } from '@/constants/useParams';
import { SearchNormal1 } from 'iconsax-react';
import UserForm from '@/components/user-form/UserForm';
import { FormActions } from '@/constants/form-actions';

const ViewAllUsers = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    search: search,
    perPage: 10,
    sortBy,
  };

  const { data, refetch } = useGetAllUsers(fetchDataOptions);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (data) {
      setUsers(data.data.data.data);
      setTotalPages(data.data.data.meta?.lastPage);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, show, sortBy]);

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
    setCurrentPage(0);
  }, [search]);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
        <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
          <Heading intent={'h3'}>Users ({data?.data.data.meta?.total})</Heading>
          <Text
            className="text-tints-battleship-grey-tint-2"
            size={'md'}
            weight={'medium'}
          >
            Overview of all users
          </Text>
        </div>
        <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
          <InputContainer className="mr-6 w-[300px]">
            <Input
              className="rounded w-full text-sm"
              icon={
                <SearchNormal1
                  className="mx-2 text-shades-battleship-grey-shade-1"
                  size="16"
                  variant="Outline"
                />
              }
              name="search"
              onChange={event => setSearch(event.target.value)}
              placeholder={'Search by name or email'}
              type="text"
              value={search}
            />
          </InputContainer>
          <div>
            <Button intent="primary" onClick={() => setShow(true)} size={'md'}>
              Create new user
            </Button>
          </div>
          <SlideOver setShow={setShow} show={show} title="Create user">
            <UserForm action={FormActions.ADD} setEditShow={setShow} />
          </SlideOver>
        </div>
      </div>
      <DataTable<UserResponse>
        columns={columns}
        currentPage={currentPage}
        data={users}
        onPageChange={handlePageChange}
        setSortBy={e => {
          setSortBy(e);
        }}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ViewAllUsers;
