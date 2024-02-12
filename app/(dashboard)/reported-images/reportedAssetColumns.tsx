'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button, DataTable, Text } from '@/components/atomic';
import {
  IReportedImage,
  IReportedImageStatusUpdateRequest,
  IReportUserDetails,
} from '@/types/reported-images/reported-images';
import { ReportedImageLabel } from '@/components/atomic/Reported-Image-Label';
import { ReportImagesStatus } from '@/constants/report-images-status';
import { Edit2, Eye, Grammerly } from 'iconsax-react';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import Image from 'next/image';
import ReportedImageBlogModel, {
  ModalSize,
} from '@/components/atomic/Modal/ReportedImageModel';
import {
  useChangeStatusReportedImage,
  useGetAllReportedImagesUserData,
} from '@/hooks/reported-images/reported-images';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import { reportUserColumns } from './reportedAssetUserDataColumns';

const EditViewCellComponent = (
  reportedImage: IReportedImage,
  status: string | null,
) => {
  const changeStatusReportedImage = useChangeStatusReportedImage();
  const [showModal, setshowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState('reported_date');
  const [showError] = useState<boolean>(false);
  const {
    data: reportedImagesUserData,
    refetch: reportedImagesUserDataRefetch,
  } = useGetAllReportedImagesUserData(
    10,
    currentPage + 1,
    reportedImage.id,
    sortBy,
  );

  const [userReports, setuserReports] = useState<IReportUserDetails[]>([]);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (reportedImagesUserData) {
      setuserReports(reportedImagesUserData.data.data.data);
      setTotalPages(reportedImagesUserData.data.data.meta?.lastPage);
    }
  }, [reportedImagesUserData, sortBy]);

  useEffect(() => {
    reportedImagesUserDataRefetch();
  }, [currentPage, status, showModal, sortBy]);

  useEffect(() => {
    if (userReports && userReports.length > 0) {
      setuserReports(userReports);
    }
  }, [userReports]);

  const handleDelete = async () => {
    const requestBody: IReportedImageStatusUpdateRequest = {
      status: ReportImagesStatus.REMOVED,
      fileKey: reportedImage.fileKey as string,
    };
    await changeStatusReportedImage.mutateAsync(requestBody);
    setshowModal(false);
  };

  const handleResolve = async () => {
    const requestBody: IReportedImageStatusUpdateRequest = {
      status: ReportImagesStatus.RESOLVED,
      fileKey: reportedImage.fileKey as string,
    };
    await changeStatusReportedImage.mutateAsync(requestBody);

    setshowModal(false);
  };

  return (
    <div className="flex items-center gap-x-6">
      <CustomCan a={Subject.REPORTED_IMAGES} I={UserActions.Manage}>
        <Snackbar
          intent="error"
          show={showError as boolean}
          snackContent={'Something went wrong, please try again'}
        />

        {reportedImage.status !== ReportImagesStatus.REMOVED && (
          <div className="flex items-center justify-end gap-x-6">
            <Button
              intent="ghost"
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${reportedImage.fileKey}`,
                  '_blank',
                );
              }}
              postIcon={<Eye size="16" variant="Bulk" />}
              size={'ghost'}
            />
            <Button
              intent="ghost"
              onClick={() => {
                setshowModal(true);
              }}
              postIcon={<Edit2 size="16" variant="Bulk" />}
              size={'ghost'}
            />
          </div>
        )}
      </CustomCan>
      <ReportedImageBlogModel
        buttontText="Remove image"
        deleteButtonFunction={() => handleDelete()}
        isResolved={reportedImage.status === ReportImagesStatus.RESOLVED}
        modalTitle={reportedImage.fileKey?.split('/')[1]}
        resolveButtonFunction={() => handleResolve()}
        setShow={value => setshowModal(value)}
        show={showModal}
        size={'large' as ModalSize}
      >
        <div className="flex">
          <Image
            alt="Loading..."
            className="mb-10 max-h-60 object-cover rounded-md flex-1"
            height={220}
            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${reportedImage.fileKey}`}
            width={900}
          />
          <div className="flex-1 flex items-center justify-start mb-10 ml-5">
            <Button
              intent="ghost"
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${reportedImage.fileKey}`,
                  '_blank',
                );
              }}
              preIcon={<Eye size="16" variant="Bulk" />}
              size={'ghost'}
            >
              <Text
                className="text-tints-forest-green-tint-2 cursor-pointer"
                weight={'bold'}
              >
                Preview
              </Text>
            </Button>
          </div>
        </div>

        <div className="gap-3 space-y-6">
          <DataTable<IReportUserDetails>
            columns={reportUserColumns()}
            currentPage={currentPage}
            data={userReports}
            onPageChange={handlePageChange}
            setSortBy={e => {
              setSortBy(e);
            }}
            totalPages={totalPages}
          />
        </div>
      </ReportedImageBlogModel>
    </div>
  );
};

export const columns: ColumnDef<IReportedImage>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      const isMoreAvailable =
        row?.original?._count?.assetReportUser > 1
          ? `+ ${row?.original?._count?.assetReportUser - 1} more`
          : '';

      const fulleName = `${row?.original?.assetReportUser[0]?.user.firstName} ${row?.original?.assetReportUser[0]?.user.lastName} ${isMoreAvailable}`;
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {fulleName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
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
  {
    accessorKey: 'updatedAt',
    header: 'Last reported date',
    cell: ({ row }) => {
      const reportedDate = new Date(
        row?.original?.assetReportUser[0]?.reportedDate,
      );

      // Extract day, month, and year components
      const day = reportedDate.getUTCDate().toString().padStart(2, '0');
      const month = (reportedDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0'); // Months are 0-based, so add 1
      const year = reportedDate.getUTCFullYear();

      return (
        <div className="flex items-center">
          <Text className="" size={'md'} weight={'medium'}>
            {`${day}-${month}-${year}`}
          </Text>
        </div>
      );
    },
    enableSorting: false,
    sortUndefined: undefined,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const fileUrl = row?.original?.fileKey
        ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${row?.original?.fileKey}`
        : null;

      return EditViewCellComponent(row.original, fileUrl);
    },
  },
];
