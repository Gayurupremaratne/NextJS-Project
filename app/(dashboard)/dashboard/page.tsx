'use client';

import { Heading, Item, SingleSelect } from '@/components/atomic';
import UserTrailView from '@/components/dashboard/UserTrailView';
import PassesCardView from '@/components/dashboard/PassesCardView';
import PassesChartView from '@/components/dashboard/PassesChartView';
import ReportedContentView from '@/components/dashboard/ReportedContentView';
import { useGetInventoriesByMonth } from '@/hooks/inventory/inventory';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { StageLite } from '@/types/stage/stage';
import { getAllMonths } from '@/utils/utils';
import { startOfMonth } from 'date-fns';
import { useState } from 'react';
import StagesClosedView from '@/components/dashboard/StageClosedView';

const initialStage = { id: 'All', name: 'All stages' };
const transformStageData = (data: StageLite[]) => {
  const items: Item[] = [initialStage];
  if (data) {
    data.forEach((stage: StageLite) => {
      items.push({
        id: stage.id!,
        name: `Stage ${stage.number.toString()}`,
      });
    });
  }
  return items;
};

const getMonthDropdownData = () => {
  const months = getAllMonths();
  const items: Item[] = [];
  months.forEach((month: string, index: number) => {
    items.push({
      id: (index + 1).toString(),
      name: month,
    });
  });
  return items;
};

const Dashboard = () => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(currentDate),
  );
  const [selectedStage, setSelectedStage] = useState<string | number>(1);
  const { data: stagesData } = useGetLiteStages();

  const { data } = useGetInventoriesByMonth({
    stageId: selectedStage.toString(),
    month: (currentMonth.getMonth() + 1).toString().padStart(2, '0'),
    year: currentMonth.getFullYear().toString(),
  });

  const initialItemMonth = getMonthDropdownData().find(
    month => month.id == currentMonth.getMonth() + 1,
  );
  return (
    <div className="flex flex-col gap-3 w-full space-y-5">
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-12 md:col-span-4 flex self-center">
          <Heading intent={'h3'}>Admin dashboard</Heading>
        </div>
        <div className="flex justify-end col-span-12 md:col-span-8 gap-x-4 md:gap-x-6 mt-3 md:mt-0">
          <div className="w-[200px]">
            <SingleSelect
              initialSelected={initialItemMonth}
              items={getMonthDropdownData()}
              tabIndex={month =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    parseInt(month.toString()) - 1,
                    1,
                  ),
                )
              }
            />
          </div>
          <div className="w-[200px]">
            <SingleSelect
              initialSelected={initialStage}
              items={transformStageData(stagesData || [])}
              tabIndex={e => setSelectedStage(e)}
            />
          </div>
        </div>
      </div>
      <PassesCardView analytics={data?.analytics} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
        <PassesChartView currentMonth={currentMonth} data={data} />
        <UserTrailView
          currentMonth={currentMonth}
          stageId={selectedStage.toString()}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-3 gap-x-0 sm:gap-x-4 w-full">
        <StagesClosedView currentMonth={currentMonth} />
        <ReportedContentView />
      </div>
    </div>
  );
};

export default Dashboard;
