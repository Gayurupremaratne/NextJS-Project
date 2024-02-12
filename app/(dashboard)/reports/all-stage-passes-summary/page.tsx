'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, DataTable, Heading } from '@/components/atomic';
import { DateRange } from '@/components/atomic/DateRange';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';

import { DocumentDownload } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { DateValueType } from '@/components/atomic/DateRange/types';
import {
  useGetDownloadableStageSummaryReport,
  useGetStagePassesSummaryReport,
} from '@/hooks/reports/report';
import { StageSummaryData } from '@/types/report/report.type';
import { columns } from './StagePassesSummartTableColumns';
import moment from 'moment';
import { Text } from '@/components/atomic';

const AllStagePassesSummaryReport: React.FC = () => {
  const [date, setDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  const { data: reportData, refetch } = useGetStagePassesSummaryReport(
    moment(date?.startDate).format('YYYY-MM-DD'),
    moment(date?.endDate).format('YYYY-MM-DD'),
  );

  const { refetch: getDownloadableReport, isFetching } =
    useGetDownloadableStageSummaryReport(
      moment(date?.startDate).format('YYYY-MM-DD'),
      moment(date?.endDate).format('YYYY-MM-DD'),
    );

  useEffect(() => {
    if (!date?.startDate || !date?.endDate) {
      return;
    }
    const dateRangeIsValid = moment(date?.endDate).isSameOrBefore(
      moment(date?.startDate).add('months', 1),
    );
    if (dateRangeIsValid) {
      setDateRangeError(null);
      refetch();
    } else {
      setDateRangeError('Select a date range of up to 1 month.');
    }
  }, [date?.startDate, date?.endDate]);

  return (
    <ProtectedRoute>
      <CustomCan
        a={Subject.StageWiseSummary}
        I={UserActions.Read}
        isForbidden={true}
      >
        <div className="flex flex-col gap-3 w-full mb-10">
          <div className="w-full self-center mb-8">
            <div className="flex xl:flex-row flex-col gap-x-6 gap-y-3 lg:justify-between w-full">
              <div>
                <Heading className="mb-2" intent="h3">
                  All stage passes summary report
                </Heading>
              </div>
              <div className="flex items-center gap-x-6 gap-y-4 sm:flex-row flex-col">
                <div>
                  <DateRange
                    displayFormat="DD MMM YYYY"
                    inputClassName={
                      'outline-none relative transition-all duration-300 py-2.5 pl-4 pr-14 border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none rounded-[5px] tracking-wide font-normal text-sm placeholder-tints-jungle-green-tint-6 bg-white disabled:cursor-not-allowed w-[300px]'
                    }
                    onChange={value => {
                      setDate(value);
                    }}
                    placeholder="Select a date range"
                    readOnly
                    showFooter={false}
                    showShortcuts={false}
                    useRange={false}
                    value={date}
                  />
                  {dateRangeError && (
                    <Text intent={'red'} size={'sm'}>
                      {dateRangeError}
                    </Text>
                  )}
                </div>
                <div>
                  <Button
                    disabled={reportData?.length === 0}
                    intent="primary"
                    loading={isFetching}
                    onClick={() => getDownloadableReport()}
                    preIcon={<DocumentDownload className="m-2" size="20" />}
                  >
                    Export to xlsx
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DataTable<StageSummaryData>
            columns={columns}
            currentPage={0}
            data={reportData ? reportData : []}
            onPageChange={() => {}}
            totalPages={0}
          />
        </div>
      </CustomCan>
    </ProtectedRoute>
  );
};

export default AllStagePassesSummaryReport;
