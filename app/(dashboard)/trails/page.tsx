'use client';

import { Button, DataTable, Heading, Text } from '@/components/atomic';
import React, { useEffect, useState } from 'react';
import { Stage } from '@/types/stage/stage.type';
import { getStageTableColumns } from './stageColumns';
import { STAGE_LIST_PAGE_SIZE } from '@/constants/pagination-page-size';
import { useGetStages } from '@/hooks/stage/stage';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CreateTrailForm from './forms/CreateTrailForm';
import { FormActions } from '@/constants/form-actions';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { StageParams } from '@/constants/stageParams';

const Page = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stages, setStages] = useState<Stage[]>([]);
  const [show, setShow] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const fetchDataOptions: StageParams = {
    pageNumber: currentPage + 1,
    perPage: STAGE_LIST_PAGE_SIZE,
    sort: sortBy,
  };
  const { data, refetch } = useGetStages(fetchDataOptions);

  useEffect(() => {
    if (data) {
      setStages(data?.data);
      setTotalPages(data?.meta?.lastPage);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <CustomCan a={Subject.Trail} I={UserActions.Read} isForbidden={true}>
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-60 xl:w-96">
            <Heading intent="h3">Trails ({data?.meta?.total})</Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all trails/stages
            </Text>
          </div>
          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
            <Button intent="primary" onClick={() => setShow(true)} size={'md'}>
              Create new trail
            </Button>
          </div>
        </div>
        <DataTable<Stage>
          columns={getStageTableColumns()}
          currentPage={currentPage}
          data={stages}
          onPageChange={handlePageChange}
          setSortBy={e => {
            setSortBy(e);
          }}
          totalPages={totalPages}
        />
      </div>
      <SlideOver setShow={setShow} show={show} title="Create new trail">
        <CreateTrailForm action={FormActions.ADD} setSlideOver={setShow} />
      </SlideOver>
    </CustomCan>
  );
};

export default Page;
