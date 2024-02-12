import { ErrorState } from '@/types/common.type';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';

export const dateFormatter = (inputDate: Date): string => {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const capitalizeFirstLetter = (inputString: string): string => {
  const capitalizedString =
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  return capitalizedString;
};

export const getAllMonths = () => {
  const monthNames = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2023, i, 1);
    const monthName = format(date, 'MMMM');
    monthNames.push(monthName);
  }
  return monthNames;
};

export function setErrorState(currentState: ErrorState, e?: unknown) {
  return {
    ...currentState,
    has: true,
    message: isAxiosError(e)
      ? e.response?.data?.message
      : 'Something went wrong, please try again',
  };
}
