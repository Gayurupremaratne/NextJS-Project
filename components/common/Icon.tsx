import AddCircle from '@/public/images/icons/AddCircle.svg';
import close from '@/public/images/icons/close.svg';

export const Icons = {
  AddCircle: AddCircle,
  close: close,
} as const;

export type IconTypes = keyof typeof Icons;
