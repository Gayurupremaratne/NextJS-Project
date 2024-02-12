'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';
import { IReportedImage } from '@/types/reported-images/reported-images';
import { ReportedImageLabel } from '@/components/atomic/Reported-Image-Label';
import { ReportImagesStatus } from '@/constants/report-images-status';
import { Grammerly } from 'iconsax-react';

export const columns = (): ColumnDef<IReportedImage>[] => [
  {
    accessorKey: 'last-reported-date',
    header: 'Reported date',
    cell: ({ row }) => {
      const reportedDate = new Date(row?.original?.updatedAt);

      // Extract day, month, and year components
      const day = reportedDate.getUTCDate().toString().padStart(2, '0');
      const month = (reportedDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0'); // Months are 0-based, so add 1
      const year = reportedDate.getUTCFullYear();

      return (
        <div className="flex items-center h-6">
          <Text className="" size={'sm'} weight={'medium'}>
            {`${year}-${month}-${day}`}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row?.original?.status;
      let dynamicClassNames = '';
      let dynamicStatus = '';

      if (status === ReportImagesStatus.PENDING) {
        dynamicClassNames = 'text-snacks-borders-warn bg-snacks-warn';
        dynamicStatus = 'Pending';
      } else if (status === ReportImagesStatus.REMOVED) {
        dynamicClassNames = 'text-snacks-borders-error bg-snacks-error';
        dynamicStatus = 'Removed';
      } else if (status === ReportImagesStatus.RESOLVED) {
        dynamicClassNames = 'text-snacks-borders-success bg-snacks-success';
        dynamicStatus = 'Resolved';
      } else {
        dynamicClassNames = 'text-snacks-borders-info bg-snacks-info';
        dynamicStatus = 'Undefined';
      }

      return (
        <div className="flex items-center">
          <ReportedImageLabel
            className={dynamicClassNames}
            postIcon={<Grammerly size={16} variant="Bold" />}
          >
            {dynamicStatus}
          </ReportedImageLabel>
        </div>
      );
    },
  },
];
