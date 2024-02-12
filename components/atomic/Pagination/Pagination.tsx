'use client';

import React, { FC } from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import {
  Pagination as HeadlessPagination,
  NextButton,
  PageButton,
  PrevButton,
} from 'react-headless-pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <HeadlessPagination
      className="flex items-center w-full h-10 select-none list-none"
      currentPage={currentPage}
      edgePageCount={2}
      middlePagesSiblingCount={1}
      setCurrentPage={onPageChange}
      totalPages={totalPages}
      truncableClassName="text-tints-battleship-grey-tint-5 text-4xl"
      truncableText="..."
    >
      <PrevButton
        className={`flex items-center gap-4 justify-center px-2 h-10 ml-0 leading-tight text-shades-jungle-green-shade-6 font-semibold bg-white border border-tints-battleship-grey-tint-5 rounded-[5px] ${
          currentPage === 1
            ? 'hover:bg-tints-forest-green-tint-6 bg-white hover:text-tints-forest-green-tint-1'
            : 'hover:bg-tints-forest-green-tint-6 hover:text-tints-forest-green-tint-1'
        }`}
      >
        <ArrowLeft2 size={20} variant="Bold" />
      </PrevButton>
      <div className="flex items-center justify-between -space-x-px h-10 text-md gap-3 mx-4">
        <PageButton
          activeClassName="text-tints-forest-green-tint-1 bg-tints-forest-green-tint-6 hover:bg-tints-forest-green-tint-6"
          className="cursor-pointer flex items-center justify-center px-3 h-10 ml-0 leading-tight text-shades-jungle-green-shade-6 font-semibold border border-tints-battleship-grey-tint-5 rounded-[5px]"
          inactiveClassName="hover:bg-tints-forest-green-tint-6 bg-white hover:text-tints-forest-green-tint-1"
        />
      </div>
      <NextButton
        className={`flex items-center justify-center px-2 h-10 ml-0 leading-tight text-shades-jungle-green-shade-6 font-semibold bg-white border border-tints-battleship-grey-tint-5 rounded-[5px] ${
          currentPage === totalPages
            ? 'hover:bg-tints-forest-green-tint-6 bg-white hover:text-tints-forest-green-tint-1'
            : 'hover:bg-tints-forest-green-tint-6 hover:text-tints-forest-green-tint-1'
        }`}
      >
        <ArrowRight2 size={20} variant="Bold" />
      </NextButton>
    </HeadlessPagination>
  );
};
