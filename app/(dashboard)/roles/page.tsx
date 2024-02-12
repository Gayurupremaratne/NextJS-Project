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
import { RoleResponse } from '@/types/role/role.type';
import { useGetAllRoles } from '@/hooks/role/role';
import CreateRole from '@/components/create-role';
import EditRole from '@/components/edit-role';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { UseParams } from '@/constants/useParams';
import { SearchNormal1 } from 'iconsax-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    search,
    perPage: 10,
    sortBy,
  };

  const { data, refetch } = useGetAllRoles(fetchDataOptions);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState({
    show: false,
    id: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setRoles(data.data.data.data);
      setTotalPages(data.data.data.meta?.lastPage);
    }
    if (data && currentPage >= data?.data?.data?.meta?.lastPage) {
      setCurrentPage(data?.data?.data?.meta?.lastPage - 1);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
    setCurrentPage(0);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleViewRole = (id: number) => {
    router.push(`/roles/${id}`);
  };

  const toggleEditShow = (id: number) => {
    setEditShow(prev => ({
      show: !prev.show,
      id,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
        <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
          <Heading intent={'h3'}>Roles ({data?.data.data.meta?.total})</Heading>
          <Text
            className="text-tints-battleship-grey-tint-2"
            size={'md'}
            weight={'medium'}
          >
            Overview of all user roles
          </Text>
        </div>
        <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
          <InputContainer className="mr-6">
            <Input
              className="rounded"
              icon={
                <SearchNormal1
                  className="mx-2 text-shades-battleship-grey-shade-1"
                  size="16"
                  variant="Outline"
                />
              }
              name="search"
              onChange={event => setSearch(event.target.value)}
              placeholder={'Search'}
              type="text"
              value={search}
            />
          </InputContainer>
          <div>
            <Button intent="primary" onClick={() => setShow(true)}>
              Create new role
            </Button>
          </div>

          <SlideOver setShow={setShow} show={show} title="Create new role">
            <CreateRole setShow={setShow} />
          </SlideOver>

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
      <DataTable<RoleResponse>
        columns={columns(toggleEditShow, handleViewRole)}
        currentPage={currentPage}
        data={roles}
        onPageChange={handlePageChange}
        setSortBy={e => {
          setSortBy(e);
        }}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Index;
