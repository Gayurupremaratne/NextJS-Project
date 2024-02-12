import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useCallback, useContext } from 'react';

import { theme } from '@/tailwind.config';
import DatepickerContext from '../../contexts/DatepickerContext';
import {
  classNames as cn,
  formatDate,
  nextMonth,
  previousMonth,
} from '../../helpers';
import { Period } from '../../types';

dayjs.extend(isBetween);

interface Props {
  calendarData: {
    date: dayjs.Dayjs;
    days: {
      previous: number[];
      current: number[];
      next: number[];
    };
  };
  onClickPreviousDays: (day: number) => void;
  onClickDay: (day: number) => void;
  onClickNextDays: (day: number) => void;
}

const Days: React.FC<Props> = ({
  calendarData,
  onClickPreviousDays,
  onClickDay,
  onClickNextDays,
}) => {
  // Contexts
  const {
    primaryColor,
    period,
    changePeriod,
    dayHover,
    changeDayHover,
    minDate,
    maxDate,
    disabledDates,
    disableAllocatedDates,
    isDisabledPastDates,
  } = useContext(DatepickerContext);

  // Functions
  const currentDateClass = useCallback(
    (item: number) => {
      const itemDate = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${item >= 10 ? item : '0' + item}`;
      if (formatDate(dayjs()) === formatDate(dayjs(itemDate))) {
        return theme.colors.red;
      }
      return '';
    },
    [calendarData.date, primaryColor],
  );

  const activeDateData = useCallback(
    (day: number) => {
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day}`;
      let className = '';

      if (
        dayjs(fullDay).isSame(period.start) &&
        dayjs(fullDay).isSame(period.end)
      ) {
        className =
          'text-white font-medium bg-tints-forest-green-tint-1 hover:text-white hover:font-medium hover:bg-tints-forest-green-tint-6';
      } else if (dayjs(fullDay).isSame(period.start)) {
        className = `text-white font-medium bg-tints-forest-green-tint-1 hover:text-white hover:font-medium hover:bg-tints-forest-green-tint-6 ${
          dayjs(fullDay).isSame(dayHover) && !period.end
            ? 'rounded-full'
            : 'rounded-l-[5px]'
        }`;
      } else if (dayjs(fullDay).isSame(period.end)) {
        className = `text-white font-medium bg-tints-forest-green-tint-1 hover:text-white hover:font-medium hover:bg-tints-forest-green-tint-6 ${
          dayjs(fullDay).isSame(dayHover) && !period.start
            ? 'rounded-full'
            : 'rounded-r-[5px]'
        }`;
      }

      return {
        active:
          dayjs(fullDay).isSame(period.start) ||
          dayjs(fullDay).isSame(period.end),
        className: className,
      };
    },
    [calendarData.date, dayHover, period.end, period.start, primaryColor],
  );

  const hoverClassByDay = useCallback(
    (day: number) => {
      let className = currentDateClass(day);
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day >= 10 ? day : '0' + day}`;

      if (period.start && period.end) {
        if (dayjs(fullDay).isBetween(period.start, period.end, 'day', '[)')) {
          return `bg-tints-forest-green-tint-6 text-tints-forest-green-tint-1 ${currentDateClass(
            day,
          )}`;
        }
      }

      if (!dayHover) {
        return className;
      }

      if (
        period.start &&
        dayjs(fullDay).isBetween(period.start, dayHover, 'day', '[)')
      ) {
        className = `bg-tints-forest-green-tint-6 ${currentDateClass(day)}`;
      }

      if (
        period.end &&
        dayjs(fullDay).isBetween(dayHover, period.end, 'day', '[)')
      ) {
        className = `bg-tints-forest-green-tint-6 ${currentDateClass(day)}`;
      }

      if (dayHover === fullDay) {
        className = `transition-all duration-500 text-white font-medium bg-tints-forest-green-tint-1 ${
          period.start ? 'rounded-r-[5px]' : 'rounded-l-[5px]'
        }`;
      }

      return className;
    },
    [
      calendarData.date,
      currentDateClass,
      dayHover,
      period.end,
      period.start,
      primaryColor,
    ],
  );

  type CalendarType = 'current' | 'previous' | 'next';

  const isDateTooEarly = useCallback(
    (day: number, type: CalendarType) => {
      if (!minDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type];
      const formattedDate = newDate.set('date', day);
      return dayjs(formattedDate).isSame(dayjs(minDate), 'day')
        ? false
        : dayjs(formattedDate).isBefore(dayjs(minDate));
    },
    [calendarData.date, minDate],
  );

  const isDateTooLate = useCallback(
    (day: number, type: CalendarType) => {
      if (!maxDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type];
      const formattedDate = newDate.set('date', day);
      return dayjs(formattedDate).isSame(dayjs(maxDate), 'day')
        ? false
        : dayjs(formattedDate).isAfter(dayjs(maxDate));
    },
    [calendarData.date, maxDate],
  );

  const isDateDisabled = useCallback(
    (day: number, type: CalendarType) => {
      if (isDateTooEarly(day, type) || isDateTooLate(day, type)) {
        return true;
      }
      if (
        isDisabledPastDates &&
        dayjs()
          .startOf('day')
          .isAfter(
            dayjs(
              `${calendarData.date.year()}-${
                calendarData.date.month() + 1
              }-${day}`,
            ).startOf('day'),
          )
      ) {
        return true;
      }

      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type];
      const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : '0' + day
      }`;

      if (type !== 'current' && disableAllocatedDates) {
        return true;
      }

      if (
        !disabledDates ||
        (Array.isArray(disabledDates) && !disabledDates.length)
      ) {
        return false;
      }

      let matchingCount = 0;
      disabledDates?.forEach(dateRange => {
        if (
          dayjs(formattedDate).isAfter(dateRange.startDate) &&
          dayjs(formattedDate).isBefore(dateRange.endDate)
        ) {
          matchingCount++;
        }
        if (
          dayjs(formattedDate).isSame(dateRange.startDate) ||
          dayjs(formattedDate).isSame(dateRange.endDate)
        ) {
          matchingCount++;
        }
      });

      return matchingCount > 0;
    },
    [
      calendarData.date,
      isDateTooEarly,
      isDateTooLate,
      disabledDates,
      disableAllocatedDates,
    ],
  );

  const isDisabledInventoryDate = useCallback(
    (day: number) => {
      if (!disableAllocatedDates) {
        return { closed: false, fullyBooked: false };
      }

      const newDate = calendarData.date.set('date', day);
      const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : '0' + day
      }`;

      const isClosed = disableAllocatedDates?.some(date => {
        return (
          dayjs(formattedDate).isSame(date.date.split('T')[0], 'day') &&
          date.inventoryQuantity === 0
        );
      });

      if (isClosed) {
        return { closed: true, fullyBooked: false };
      }

      const isFullyBooked = disableAllocatedDates?.some(date => {
        return (
          dayjs(formattedDate).isSame(date.date.split('T')[0], 'day') &&
          date.inventoryQuantity === date.reservedQuantity
        );
      });

      return { closed: false, fullyBooked: isFullyBooked };
    },
    [[calendarData.date, disableAllocatedDates]],
  );

  const buttonClass = useCallback(
    (day: number, type: CalendarType) => {
      const baseClass =
        'font-albertSans flex items-center justify-center w-12 h-12 lg:w-10 text-sm lg:h-10 text-shades-battleship-grey-shade-2';
      if (type === 'current') {
        return cn(
          baseClass,
          !activeDateData(day).active
            ? hoverClassByDay(day)
            : activeDateData(day).className,
          isDateDisabled(day, type) && 'text-tints-battleship-grey-tint-5',
          isDisabledInventoryDate(day).closed &&
            'text-white bg-tints-battleship-grey-tint-3',
          isDisabledInventoryDate(day).fullyBooked &&
            'text-white bg-tints-forest-green-tint-3',
        );
      }
      return cn(baseClass, 'text-tints-battleship-grey-tint-5');
    },
    [activeDateData, hoverClassByDay, isDateDisabled, isDisabledInventoryDate],
  );

  const checkIfHoverPeriodContainsDisabledPeriod = useCallback(
    (hoverPeriod: Period) => {
      if (!Array.isArray(disabledDates)) {
        return false;
      }
      for (const disabledDate of disabledDates) {
        if (
          dayjs(hoverPeriod.start).isBefore(disabledDate.startDate) &&
          dayjs(hoverPeriod.end).isAfter(disabledDate.endDate)
        ) {
          return true;
        }
      }
      return false;
    },
    [disabledDates],
  );

  const getMetaData = useCallback(() => {
    return {
      previous: previousMonth(calendarData.date),
      current: calendarData.date,
      next: nextMonth(calendarData.date),
    };
  }, [calendarData.date]);

  const hoverDay = useCallback(
    (day: number, type: string) => {
      const object = getMetaData();
      const newDate = object[type as keyof typeof object];
      const newHover = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : '0' + day
      }`;

      if (period.start && !period.end) {
        const hoverPeriod = { ...period, end: newHover };
        if (dayjs(newHover).isBefore(dayjs(period.start))) {
          hoverPeriod.start = newHover;
          hoverPeriod.end = period.start;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: null,
              end: period.start,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }

      if (!period.start && period.end) {
        const hoverPeriod = { ...period, start: newHover };
        if (dayjs(newHover).isAfter(dayjs(period.end))) {
          hoverPeriod.start = period.end;
          hoverPeriod.end = newHover;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: period.end,
              end: null,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }
    },
    [
      changeDayHover,
      changePeriod,
      checkIfHoverPeriodContainsDisabledPeriod,
      getMetaData,
      period,
    ],
  );

  const handleClickDay = useCallback(
    (day: number, type: CalendarType) => {
      function continueClick() {
        if (type === 'previous') {
          onClickPreviousDays(day);
        }

        if (type === 'current') {
          onClickDay(day);
        }

        if (type === 'next') {
          onClickNextDays(day);
        }
      }

      if (disabledDates?.length) {
        const object = getMetaData();
        const newDate = object[type];
        const clickDay = `${newDate.year()}-${newDate.month() + 1}-${
          day >= 10 ? day : '0' + day
        }`;

        if (period.start && !period.end) {
          if (dayjs(clickDay).isSame(dayHover)) {
            continueClick();
          }
        } else if (!period.start && period.end) {
          if (dayjs(clickDay).isSame(dayHover)) {
            continueClick();
          }
        } else {
          continueClick();
        }
      } else {
        continueClick();
      }
    },
    [
      dayHover,
      disabledDates?.length,
      getMetaData,
      onClickDay,
      onClickNextDays,
      onClickPreviousDays,
      period.end,
      period.start,
    ],
  );

  return (
    <div className="grid grid-cols-7 gap-y-0.5 my-1">
      {calendarData.days.previous.map((item, index) => (
        <button
          className={`${buttonClass(item, 'previous')}`}
          disabled={isDateDisabled(item, 'previous')}
          key={index}
          onClick={() => handleClickDay(item, 'previous')}
          onMouseOver={() => {
            hoverDay(item, 'previous');
          }}
          type="button"
        >
          {item}
        </button>
      ))}

      {calendarData.days.current.map((item, index) => {
        const inventoryDisabled = isDisabledInventoryDate(item);
        return (
          <button
            className={`${buttonClass(item, 'current')}`}
            disabled={
              isDateDisabled(item, 'current') ||
              inventoryDisabled.closed ||
              inventoryDisabled.fullyBooked
            }
            key={index}
            onClick={() => handleClickDay(item, 'current')}
            onMouseOver={() => {
              hoverDay(item, 'current');
            }}
            title={
              inventoryDisabled.closed
                ? 'Stage closed'
                : inventoryDisabled.fullyBooked
                ? 'Fully booked'
                : ''
            }
            type="button"
          >
            {item}
          </button>
        );
      })}

      {calendarData.days.next.map((item, index) => (
        <button
          className={`${buttonClass(item, 'next')}`}
          disabled={isDateDisabled(item, 'next')}
          key={index}
          onClick={() => handleClickDay(item, 'next')}
          onMouseOver={() => {
            hoverDay(item, 'next');
          }}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Days;
