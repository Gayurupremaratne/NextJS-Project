import { getDay, Locale } from 'date-fns';

export const daysInWeek = () => [
  { day: 0, label: 'SUN' },
  { day: 1, label: 'MON' },
  { day: 2, label: 'TUE' },
  { day: 3, label: 'WED' },
  { day: 4, label: 'THU' },
  { day: 5, label: 'FRI' },
  { day: 6, label: 'SAT' },
];

type OmittedDaysProps = {
  days: Date[];
  omitDays?: number[];
  locale?: Locale;
};

export const handleOmittedDays = ({ days, omitDays }: OmittedDaysProps) => {
  let headings = daysInWeek();
  let daysToRender = days;

  // omit the headings and days of the week that were passed in
  if (omitDays) {
    headings = daysInWeek().filter(day => !omitDays.includes(day.day));
    daysToRender = days.filter(day => !omitDays.includes(getDay(day)));
  }

  // omit the padding if an omitted day was before the start of the month
  let firstDayOfMonth = getDay(daysToRender[0]) as number;
  if (omitDays) {
    const subtractOmittedDays = omitDays.filter(
      day => day < firstDayOfMonth,
    ).length;
    firstDayOfMonth = firstDayOfMonth - subtractOmittedDays;
  }
  const padding = new Array(firstDayOfMonth).fill(0);

  return { headings, daysToRender, padding };
};
