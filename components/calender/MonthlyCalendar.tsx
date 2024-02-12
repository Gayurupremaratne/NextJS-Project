import React, { ReactNode, useContext } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { Text } from '../atomic';

type CalendarState = {
  days: Date[];
  currentMonth: Date;
  locale?: Locale;
  onCurrentMonthChange: (date: Date) => unknown;
};

const MonthlyCalendarContext = React.createContext<CalendarState>(
  {} as CalendarState,
);

export const useMonthlyCalendar = () => useContext(MonthlyCalendarContext);

type Props = {
  locale?: Locale;
  children: ReactNode;
  currentMonth: Date;
  onCurrentMonthChange: (date: Date) => unknown;
};

export const MonthlyCalendar = ({
  locale,
  currentMonth,
  onCurrentMonthChange,
  children,
}: Props) => {
  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(monthStart),
  });

  return (
    <MonthlyCalendarContext.Provider
      value={{
        days,
        locale,
        onCurrentMonthChange,
        currentMonth: monthStart,
      }}
    >
      {children}
    </MonthlyCalendarContext.Provider>
  );
};

export const MonthlyNav = () => {
  const { locale, currentMonth, onCurrentMonthChange } = useMonthlyCalendar();

  return (
    <div className="flex md:flex-row flex-col md:h-12 h-20 md:gap-0 gap-2 justify-between items-center px-5 bg-tints-battleship-grey-tint-6 mb-4">
      <div className="flex gap-2 items-center">
        <button
          className="cursor-pointer"
          onClick={() => onCurrentMonthChange(subMonths(currentMonth, 1))}
        >
          <ArrowLeft2 size="20" />
        </button>
        <Text className="mx-5 w-40 text-center" size={'lg'} weight={'semiBold'}>
          {format(currentMonth, 'LLLL, yyyy', { locale })}
        </Text>
        <button
          className="cursor-pointer"
          onClick={() => onCurrentMonthChange(addMonths(currentMonth, 1))}
        >
          <ArrowRight2 size="20" />
        </button>
      </div>
      <div className="flex gap-4 items-center select-none">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-tints-forest-green-tint-3"></div>
          <Text className="text-tints-forest-green-tint-3" weight="semiBold">
            Fully booked
          </Text>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-tints-battleship-grey-tint-2"></div>
          <Text className="text-tints-battleship-grey-tint-2" weight="semiBold">
            Stage closed
          </Text>
        </div>
        <div className="flex items-center space-x-1">
          <Image
            alt="Arrow Right"
            height={16}
            src="/svg/ticket.svg"
            width={16}
          />
          <Text className="text-tints-forest-green-tint-3" weight="semiBold">
            Allocated passes
          </Text>
        </div>
      </div>
    </div>
  );
};
