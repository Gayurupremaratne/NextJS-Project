'use client';

import React, { useState } from 'react';
import { DataTable, Text } from '../atomic';
import { columns } from '@/app/(dashboard)/users/userColumns';
import { UserResponse } from '@/types/user/user.type';

// Sample row data set user
const rows: UserResponse[] = [
  {
    id: 12324,
    firstName: 'Aurthur',
    lastName: 'Melo',
    email: 'authurmelo@example.com',
    nationalityCode: 'LK',
    countryCode: '+55',
    contactNumber: '123456789',
    contactNumberNationalityCode: 'LK',
    passportNumber: '123456789',
    nicNumber: '123456789',
    dateOfBirth: new Date(),
    profileImageKey: '',
    preferredLocaleId: '123456',
    registrationStatus: 'COMPLETE',
    loginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    roleId: '123456',
    role: {
      id: 123456,
      name: 'Admin',
      description: 'The admin role',
      createdAt: new Date(),
      updatedAt: new Date(),
      userCount: 1,
    },
    isGoogle: false,
    isFacebook: false,
    isApple: false,
  },
  {
    id: 12325,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    nationalityCode: 'LK',
    countryCode: '+55',
    contactNumber: '123456789',
    contactNumberNationalityCode: 'LK',
    passportNumber: '123456789',
    nicNumber: '123456789',
    dateOfBirth: new Date(),
    profileImageKey: '',
    preferredLocaleId: '123456',
    registrationStatus: 'COMPLETE',
    loginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    roleId: '123457',
    role: {
      id: 123457,
      name: 'Hiker',
      description: 'The hiker role',
      createdAt: new Date(),
      updatedAt: new Date(),
      userCount: 1,
    },
    isGoogle: false,
    isFacebook: false,
    isApple: false,
  },
];

export const Tables = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  return (
    <div className="pt-[80px] px-14 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Table
        </Text>
      </div>
      <div className="flex flex-col gap-10 w-max">
        <DataTable<UserResponse>
          columns={columns}
          currentPage={currentPage}
          data={rows}
          onPageChange={handlePageChange}
          totalPages={1}
        />
      </div>
    </div>
  );
};
