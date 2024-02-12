import dayjs from 'dayjs';
import React, { useCallback, useContext, useMemo } from 'react';

import { DATE_FORMAT } from '../constants';
import DEFAULT_SHORTCUTS from '../constants/shortcuts';
import DatepickerContext from '../contexts/DatepickerContext';
import { Period, ShortcutsItem } from '../types';

interface ItemTemplateProps {
  children: JSX.Element;
  key: number;
  item: ShortcutsItem | ShortcutsItem[];
}

// eslint-disable-next-line react/display-name
const ItemTemplate = React.memo((props: ItemTemplateProps) => {
  const {
    primaryColor,
    period,
    changePeriod,
    updateFirstDate,
    dayHover,
    changeDayHover,
    hideDatepicker,
    changeDatepickerValue,
  } = useContext(DatepickerContext);

  // Functions
  const getClassName: () => string = useCallback(() => {
    return 'font-albertSans text-sm whitespace-nowrap w-1/2 md:w-1/3 lg:w-auto transition-all duration-300 hover:bg-tints-forest-green-tint-6 p-3 rounded cursor-pointer text-tints-battleship-grey-tint-1 hover:text-tints-forest-green-tint-1';
  }, [primaryColor]);

  const chosePeriod = useCallback(
    (item: Period) => {
      if (dayHover) {
        changeDayHover(null);
      }
      if (period.start || period.end) {
        changePeriod({
          start: null,
          end: null,
        });
      }
      changePeriod(item);
      changeDatepickerValue({
        startDate: item.start,
        endDate: item.end,
      });
      updateFirstDate(dayjs(item.start));
      hideDatepicker();
    },
    [
      changeDatepickerValue,
      changeDayHover,
      changePeriod,
      dayHover,
      hideDatepicker,
      period.end,
      period.start,
      updateFirstDate,
    ],
  );

  const children = props?.children;

  return (
    <li
      className={getClassName()}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        chosePeriod(props?.item.period);
      }}
    >
      {children}
    </li>
  );
});

const Shortcuts: React.FC = () => {
  // Contexts
  const { configs } = useContext(DatepickerContext);

  const callPastFunction = useCallback((data: unknown, numberValue: number) => {
    return typeof data === 'function' ? data(numberValue) : null;
  }, []);

  const shortcutOptions = useMemo<
    [string, ShortcutsItem | ShortcutsItem[]][]
  >(() => {
    if (!configs?.shortcuts) {
      return Object.entries(DEFAULT_SHORTCUTS);
    }

    return Object.entries(configs.shortcuts).flatMap(([key, customConfig]) => {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_SHORTCUTS, key)) {
        return [[key, DEFAULT_SHORTCUTS[key]]];
      }

      const { text, period } = customConfig as {
        text: string;
        period: { start: string; end: string };
      };
      if (!text || !period) {
        return [];
      }

      const start = dayjs(period.start);
      const end = dayjs(period.end);

      if (
        start.isValid() &&
        end.isValid() &&
        (start.isBefore(end) || start.isSame(end))
      ) {
        return [
          [
            text,
            {
              text,
              period: {
                start: start.format(DATE_FORMAT),
                end: end.format(DATE_FORMAT),
              },
            },
          ],
        ];
      }

      return [];
    });
  }, [configs]);

  const printItemText = useCallback((item: ShortcutsItem) => {
    return item?.text ?? null;
  }, []);

  return shortcutOptions?.length ? (
    <div className="md:border-b mb-3 py-5 lg:mb-0 lg:border-r lg:border-b-0 border-tints-battleship-grey-tint-5 pr-1">
      <ul className="w-full tracking-wide flex flex-wrap lg:flex-col pb-1 lg:pb-0">
        {shortcutOptions.map(([key, item], index: number) =>
          Array.isArray(item) ? (
            item.map((itemElement, elementIndex) => (
              <ItemTemplate item={itemElement} key={elementIndex}>
                <>
                  {key === 'past' &&
                  configs?.shortcuts &&
                  key in configs.shortcuts &&
                  itemElement.daysNumber
                    ? callPastFunction(
                        configs.shortcuts[key as 'past'],
                        itemElement.daysNumber,
                      )
                    : itemElement.text}
                </>
              </ItemTemplate>
            ))
          ) : (
            <ItemTemplate item={item} key={index}>
              <>
                {configs?.shortcuts && key in configs.shortcuts
                  ? typeof configs.shortcuts[
                      key as keyof typeof configs.shortcuts
                    ] === 'object'
                    ? printItemText(item)
                    : configs.shortcuts[key as keyof typeof configs.shortcuts]
                  : printItemText(item)}
              </>
            </ItemTemplate>
          ),
        )}
      </ul>
    </div>
  ) : null;
};

export default Shortcuts;
