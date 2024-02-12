'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, DataTable, Heading, Text } from '@/components/atomic';
import { DateRange } from '@/components/atomic/DateRange';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';

import { DocumentDownload } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { DateValueType } from '@/components/atomic/DateRange/types';
import { ClosedStagesSummaryData } from '@/types/report/report.type';
import { columns } from './StageClosedSummaryTableColumns';
import moment from 'moment';
import {
  useGetClosedStagesSummaryReport,
  useGetDownloadableClosedStagesSummaryReport,
} from '@/hooks/reports/report';

const AllStageClosedSummaryReport: React.FC = () => {
  const [date, setDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [orderBy, setOrderBy] = useState('');

  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const { data: reportData, refetch } = useGetClosedStagesSummaryReport(
    moment(date?.startDate).format('YYYY-MM-DD'),
    moment(date?.endDate).format('YYYY-MM-DD'),
    orderBy,
  );

  const { refetch: getDownloadableReport, isFetching } =
    useGetDownloadableClosedStagesSummaryReport(
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
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full self-center mb-8">
            <div className="flex xl:flex-row xl:gap-y-0 gap-y-2 flex-col gap-x-6 lg:justify-between w-full">
              <div>
                <Heading className="mb-2" intent="h3">
                  Stages closed summary report
                </Heading>
              </div>
              <div className="flex flex-col sm:flex-row gap-y-2 items-center gap-x-6">
                <div className="flex flex-col w-[255px]">
                  <DateRange
                    onChange={value => {
                      setDate(value);
                    }}
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
                    className="w-48"
                    disabled={reportData?.length === 0}
                    intent="primary"
                    loading={isFetching}
                    onClick={() => getDownloadableReport()}
                    preIcon={<DocumentDownload className="m-2" size="20" />}
                    size={'md'}
                  >
                    Export to xlsx
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DataTable<ClosedStagesSummaryData>
            columns={columns}
            currentPage={0}
            data={reportData ?? []}
            onPageChange={() => {}}
            setSortBy={e => {
              setOrderBy(e);
            }}
            totalPages={0}
          />
        </div>
      </CustomCan>
    </ProtectedRoute>
  );
};

export default AllStageClosedSummaryReport;
