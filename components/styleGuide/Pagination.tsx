'use client';

import React, { useState } from 'react';
import { Pagination, Text } from '../atomic';

export const Paginations = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          PAGINATION
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Pagination
      </Text>
      <div className="flex flex-col gap-10 w-max">
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={15}
        />
      </div>
    </div>
  );
};
