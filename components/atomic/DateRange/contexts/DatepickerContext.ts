import dayjs from 'dayjs';
import React, { createContext } from 'react';

import { InventoryType } from '@/types/inventory/inventory.type';
import { DATE_FORMAT, LANGUAGE, START_WEEK } from '../constants';
import {
  ClassNamesTypeProp,
  ColorKeys,
  Configs,
  DateRangeType,
  DateType,
  DateValueType,
  Period,
  PopoverDirectionType,
} from '../types';

type InputClassName = ((className: string) => string) | string | null;
interface DatepickerStore {
  input?: React.RefObject<HTMLInputElement>;
  asSingle?: boolean;
  primaryColor: ColorKeys;
  configs?: Configs;
  calendarContainer: React.RefObject<HTMLDivElement> | null;
  hideDatepicker: () => void;
  period: Period;
  changePeriod: (period: Period) => void;
  dayHover: string | null;
  changeDayHover: (day: string | null) => void;
  inputText: string;
  changeInputText: (text: string) => void;
  updateFirstDate: (date: dayjs.Dayjs) => void;
  changeDatepickerValue: (
    value: DateValueType,
    e?: HTMLInputElement | null | undefined,
  ) => void;
  showFooter?: boolean;
  placeholder?: string | null;
  separator: string;
  i18n: string;
  value: DateValueType;
  disabled?: boolean;
  inputClassName?: InputClassName;
  containerClassName?: InputClassName;
  toggleClassName?: InputClassName;
  toggleIcon?: (open: boolean) => React.ReactNode;
  readOnly?: boolean;
  startWeekOn?: string | null;
  displayFormat: string;
  minDate?: DateType | null;
  maxDate?: DateType | null;
  dateLooking?: 'forward' | 'backward' | 'middle';
  disabledDates?: DateRangeType[] | null;
  inputId?: string;
  inputName?: string;
  classNames?: ClassNamesTypeProp;
  popoverDirection?: PopoverDirectionType;
  disableAllocatedDates?: InventoryType[];
  isDisabledPastDates: boolean;
}

const DatepickerContext = createContext<DatepickerStore>({
  input: undefined,
  primaryColor: 'blue',
  configs: undefined,
  calendarContainer: null,
  period: { start: null, end: null },
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  changePeriod: period => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideDatepicker: () => {},
  dayHover: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  changeDayHover: (day: string | null) => {},
  inputText: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  changeInputText: text => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  updateFirstDate: date => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  changeDatepickerValue: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: DateValueType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e: HTMLInputElement | null | undefined,
  ) => {},
  showFooter: false,
  value: null,
  i18n: LANGUAGE,
  disabled: false,
  inputClassName: '',
  containerClassName: '',
  toggleClassName: '',
  readOnly: false,
  displayFormat: DATE_FORMAT,
  minDate: null,
  maxDate: null,
  dateLooking: 'forward',
  disabledDates: null,
  inputId: undefined,
  inputName: undefined,
  startWeekOn: START_WEEK,
  toggleIcon: undefined,
  classNames: undefined,
  popoverDirection: undefined,
  separator: '~',
  isDisabledPastDates: false,
});

export default DatepickerContext;
