'use client';

import AssignPasses from '@/components/assign-passes/AssignPasses';
import { Button, Heading, Item, SingleSelect } from '@/components/atomic';
import Dialog from '@/components/atomic/Dialog/Dialog';
import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyNav,
  TicketCount,
} from '@/components/calender';
import { MonthlyDay } from '@/components/calender/MonthlyDay';
import { InventoryCard } from '@/components/card';
import LandingInventory from '@/components/inventory/Landing';
import PassAllocation from '@/components/inventory/PassAllocation';
import { useGetInventoriesByMonth } from '@/hooks/inventory/inventory';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { StageLite } from '@/types/stage/stage';
import { startOfMonth } from 'date-fns';
import { useState } from 'react';

const transformStageData = (data: StageLite[]) => {
  const items: Item[] = [];
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

const ViewInventory = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date()),
  );
  const [selectedStage, setSelectedStage] = useState<string | number>('0');

  const [showAssignPassDialog, setShowAssignPassDialog] = useState(false);

  const { data: stagesData } = useGetLiteStages();

  const { data } = useGetInventoriesByMonth({
    stageId: selectedStage.toString(),
    month: (currentMonth.getMonth() + 1).toString(),
    year: currentMonth.getFullYear().toString(),
  });

  return (
    <div className="flex flex-col gap-3 w-full space-y-5">
      <div className="flex justify-between items-center w-full md:flex-row flex-col md:gap-y-0 gap-y-4">
        <div>
          <Heading intent={'h3'}>Inventory</Heading>
        </div>
        <div className="flex gap-6 items-center">
          <div className="w-[150px]">
            <SingleSelect
              items={transformStageData(stagesData || [])}
              placeholderText="Select stage"
              tabIndex={e => setSelectedStage(e)}
            />
          </div>
          <div>
            <Button
              disabled={selectedStage === '0'}
              intent="primary"
              onClick={() => setShowAssignPassDialog(true)}
              size={'md'}
            >
              Assign Pass
            </Button>
          </div>
          <Dialog
            className="md:w-[432px] w-[370px]"
            isOpen={showAssignPassDialog}
            onClose={() => {
              setShowAssignPassDialog(false);
            }}
            showFooter={false}
            title={<Heading intent={'h4'}>Assign Passes</Heading>}
          >
            <AssignPasses
              setShowAssignPassDialog={setShowAssignPassDialog}
              stageId={selectedStage.toString()}
            />
          </Dialog>
        </div>
      </div>

      {selectedStage !== '0' ? (
        <div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-full">
            <InventoryCard
              title="Total passes"
              value={data?.analytics?.totalInventory.toString() || ''}
            />
            <InventoryCard
              title="Allocated passes"
              value={data?.analytics?.allocatedInventory.toString() || ''}
            />
            <InventoryCard
              title="Remaining passes"
              value={data?.analytics?.remainingInventory.toString() || ''}
            />
          </div>

          <div className="mt-10">
            <PassAllocation
              currentMonth={currentMonth}
              stageId={selectedStage.toString()}
            />
          </div>

          <div className="mt-10">
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={setCurrentMonth}
            >
              <MonthlyNav />
              <MonthlyBody inventory={data?.data || []}>
                <MonthlyDay
                  renderDay={d =>
                    d.map((item, index) => (
                      <TicketCount count={item} key={index} />
                    ))
                  }
                  stage={stagesData?.find(
                    (stage: StageLite) => stage.id === selectedStage,
                  )}
                  stageId={selectedStage.toString()}
                />
              </MonthlyBody>
            </MonthlyCalendar>
          </div>
        </div>
      ) : (
        <LandingInventory />
      )}
    </div>
  );
};

export default ViewInventory;
