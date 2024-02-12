import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/card';
import moment from 'moment';
import { useGetClosedStagesSummaryReport } from '@/hooks/reports/report';
import { ClosedStagesSummaryData } from '@/types/report/report.type';
import { Button, DataTable, Text } from '@/components/atomic';
import { columns } from '@/app/(dashboard)/reports/stages-closed-summary/StageClosedSummaryDashboardTableColumns';

interface Props {
  currentMonth: Date;
}

const StagesClosedView = ({ currentMonth }: Props) => {
  const router = useRouter();

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 10);

  const [orderBy, setOrderBy] = useState('');

  const { data: reportData } = useGetClosedStagesSummaryReport(
    moment(currentMonth).startOf('month').format('YYYY-MM-DD'),
    moment(currentMonth).endOf('month').format('YYYY-MM-DD'),
    orderBy,
  );

  const filteredData = reportData
    ? reportData.filter(item => {
        const closedDate = moment(item.closedDate).startOf('day');
        const todayDate = moment(today).startOf('day');
        const nextWeekDate = moment(nextWeek).startOf('day');
        return (
          closedDate.isSameOrAfter(todayDate) &&
          closedDate.isSameOrBefore(nextWeekDate)
        );
      })
    : [];

  const limitedData = filteredData.slice(0, 10);

  return (
    <DashboardCard className="col-span-3 p-0 h-auto">
      <div className="flex flex-row justify-between py-2 px-4 items-center w-full border-b border-tints-forest-green-tint-6">
        <Text size={'md'} weight={'semiBold'}>
          Stages closed
        </Text>
        <Button
          intent={'ghost'}
          onClick={() => router.push('/reports/stages-closed-summary')}
        >
          View all
        </Button>
      </div>
      <DataTable<ClosedStagesSummaryData>
        border={false}
        columns={columns}
        currentPage={0}
        data={limitedData}
        onPageChange={() => {}}
        setSortBy={e => {
          setOrderBy(e);
        }}
        totalPages={0}
      />
    </DashboardCard>
  );
};

export default StagesClosedView;
