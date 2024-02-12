'use client';
import { DataTable, Heading, SingleSelect, Text } from '@/components/atomic';
import { Subject, UserActions } from '@/constants/userPermissions';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { columns } from './reportedAssetColumns';
import CustomCan from '@/components/casl/CustomCan';
import { IReportedImage } from '@/types/reported-images/reported-images';
import { useGetAllReportedImages } from '@/hooks/reported-images/reported-images';
import { ReportImagesStatus } from '@/constants/report-images-status';

const ViewAllReportedAssets = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('updatedAt');
  const { data: reportedImages, refetch: reportedImagesRefetch } =
    useGetAllReportedImages(10, currentPage + 1, status, sortBy);

  const [reports, setReports] = useState<IReportedImage[]>([]);

  const handleReportImageStatus = (e: string) => {
    setStatus(e);
  };

  useEffect(() => {
    if (reportedImages) {
      setReports(reportedImages.data.data.data);
      setTotalPages(reportedImages.data.data.meta?.lastPage);
    }
  }, [reportedImages, sortBy]);

  useEffect(() => {
    reportedImagesRefetch();
  }, [currentPage, status, sortBy]);

  useEffect(() => {
    if (reports && reports.length > 0) {
      setReports(reports);
    }
  }, [reports]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getReportImagesStatus = () => {
    const reportImageStatus = [
      {
        id: '',
        name: 'All',
      },
      {
        id: ReportImagesStatus.PENDING,
        name: 'Pending',
      },
      {
        id: ReportImagesStatus.REMOVED,
        name: 'Removed',
      },
      {
        id: ReportImagesStatus.RESOLVED,
        name: 'Resolved',
      },
    ];
    return [...reportImageStatus];
  };

  return (
    <CustomCan
      a={Subject.REPORTED_IMAGES}
      I={UserActions.Manage}
      isForbidden={true}
    >
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>
              {`Reported images (${
                reportedImages ? reportedImages?.data.data.meta?.total : 0
              })`}
            </Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all reported images
            </Text>
          </div>
          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start items-end">
            <div className="w-56 lg:flex-row flex-row">
              <div className="lg:flex flex-row gap-1">
                <Text className="mt-2 mx-2" size={'md'} weight={'medium'}>
                  Status
                </Text>
                <div className="w-full">
                  <SingleSelect
                    items={getReportImagesStatus()}
                    placeholderText="All"
                    tabIndex={e => {
                      handleReportImageStatus(e as string);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DataTable<IReportedImage>
          columns={columns}
          currentPage={currentPage}
          data={reports}
          onPageChange={handlePageChange}
          setSortBy={e => {
            setSortBy(e);
          }}
          totalPages={totalPages}
        />
      </div>
    </CustomCan>
  );
};
export default ViewAllReportedAssets;
