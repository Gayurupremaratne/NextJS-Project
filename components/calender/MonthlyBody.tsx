import React, { ReactNode, useContext } from 'react';
import { useMonthlyCalendar } from './MonthlyCalendar';
import { isSameDay, subHours } from 'date-fns';
import { BodyState } from '@/types/inventory/calander.type';
import { InventoryType } from '@/types/inventory/inventory.type';
import { handleOmittedDays } from '@/components/calender/helpers/calander';

const MonthlyBodyContext = React.createContext({} as BodyState);

export function useMonthlyBody() {
  return useContext<BodyState>(MonthlyBodyContext);
}

type MonthlyBodyProps = {
  /*
    skip days, an array of days, starts at sunday (0), saturday is 6
    ex: [0,6] would remove sunday and saturday from rendering
  */
  omitDays?: number[];
  inventory: InventoryType[];
  children: ReactNode;
};

export function MonthlyBody({
  omitDays,
  inventory,
  children,
}: MonthlyBodyProps) {
  const { days, locale } = useMonthlyCalendar();
  const { headings, daysToRender, padding } = handleOmittedDays({
    days,
    omitDays,
    locale,
  });

  const headingClassName =
    'text-tints-forest-green-tint-2 pb-2 text-sm font-semibold text-center lg:block hidden';
  return (
    <div className="bg-white">
      <div
        className={
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7'
        }
      >
        {headings.map(day => (
          <div className={headingClassName} key={day.day} title="Day of Week">
            {day.label}
          </div>
        ))}
        {padding.map((_, index) => (
          <div className={headingClassName} key={index} title="Empty Day" />
        ))}
        {daysToRender.map(day => (
          <MonthlyBodyContext.Provider
            key={day.toISOString()}
            value={{
              day,
              inventory: inventory?.filter(data =>
                isSameDay(subHours(new Date(data.date), 1), day),
              ),
            }}
          >
            {children}
          </MonthlyBodyContext.Provider>
        ))}
      </div>
    </div>
  );
}
