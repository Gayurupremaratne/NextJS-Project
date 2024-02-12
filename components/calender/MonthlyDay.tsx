import { InventoryType } from '@/types/inventory/inventory.type';
import { ReactNode, useState } from 'react';
import { useMonthlyCalendar } from './MonthlyCalendar';
import { useMonthlyBody } from './MonthlyBody';
import { format } from 'date-fns';
import Dialog from '../atomic/Dialog/Dialog';
import { Text } from '../atomic';
import PassOrders from '@/components/pass-orders/PassOrders';
import { StageLite } from '@/types/stage/stage.type';

type MonthlyDayProps = {
  stageId: string;
  stage?: StageLite;
  renderDay: (inventory: InventoryType[]) => ReactNode;
};
export function MonthlyDay({ stageId, stage, renderDay }: MonthlyDayProps) {
  const { locale } = useMonthlyCalendar();
  const { day, inventory } = useMonthlyBody();
  const dayNumber = format(day, 'd', { locale });
  const [openDialog, setOpenDialog] = useState(false);

  const translations = stage?.stagesTranslation.find(
    translation => translation.localeId === 'en',
  );

  // similar to Days.tsx isDisabledInventoryDate
  // in components\atomic\DateRange\components\Calendar\Days.tsx
  const inventoryDateAllocation = () => {
    const isClosed = inventory.some(
      (d: InventoryType) => d.inventoryQuantity === 0,
    );

    if (isClosed) {
      return { closed: true, fullyBooked: false };
    }

    const fullyBooked = inventory.some(
      (d: InventoryType) => d.inventoryQuantity === d.reservedQuantity,
    );

    return { closed: false, fullyBooked };
  };

  return (
    <>
      <button
        onClick={() => {
          if (inventory.length > 0) {
            setOpenDialog(true);
          }
        }}
        title={
          inventory.length > 0
            ? inventoryDateAllocation().fullyBooked
              ? 'Fully Booked'
              : inventoryDateAllocation().closed
              ? 'Stage closed'
              : `Allocated tickets for day ${dayNumber}`
            : 'No inventory'
        }
      >
        <div
          className={`flex flex-col select-none justify-between h-[86px] w-auto p-3 m-1 border-[1px] border-tints-forest-green-tint-6 transition-all duration-100 hover:bg-tints-forest-green-tint-6 rounded-md ${
            inventoryDateAllocation().fullyBooked
              ? ' bg-tints-forest-green-tint-6'
              : inventoryDateAllocation().closed
              ? 'bg-tints-battleship-grey-tint-3 text-white'
              : ''
          } ${inventory.length > 0 ? 'cursor-pointer' : 'cursor-default'}
          `}
        >
          <div className="flex justify-between">
            <div className="font-bold">
              {parseInt(dayNumber) < 10 ? `0${dayNumber}` : dayNumber}
            </div>
            <div className="lg:hidden block">
              {format(day, 'EEEE', { locale })}
            </div>
          </div>
          <div className="flex justify-end items-center space-x-1 mt-2">
            {renderDay(inventory)}
          </div>
        </div>
      </button>

      <Dialog
        className="md:w-[884px] w-[370px] min-h-[727px]"
        isOpen={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        showFooter={false}
        title={
          <div className="flex gap-x-3">
            <Text
              className="leading-[24px] tracking-[1.28px]"
              intent="forestGreenTintTwo"
              size="md"
              weight="bold"
            >
              STAGE{' '}
              {stage?.number !== undefined && stage?.number >= 0
                ? stage?.number
                : 'Un-numbered'}
            </Text>
            <Text size="xl" weight={'semiBold'}>
              {translations?.stageHead || 'Un-named'} /{' '}
              {translations?.stageTail || 'Un-named'}
            </Text>
          </div>
        }
      >
        <div className="w-full mt-8 space-y-6 md:px-4 px-0">
          <PassOrders date={day} stageId={stageId} />
        </div>
      </Dialog>
    </>
  );
}
