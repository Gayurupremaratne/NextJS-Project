'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { TagNode } from '../types';

const TagStyles = cva(
  'font-albertSans flex bg-tints-battleship-grey-tint-6 text-shades-battleship-grey-shade-2 rounded-md w-max items-center border border-tints-battleship-grey-tint-2 border-solid',
  {
    variants: {
      size: {
        xs: 'py-1 px-2 font-regular text-xs h-[21px]',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
);

export interface TagProps extends VariantProps<typeof TagStyles>, TagNode {}

export const Tag = ({ className = '', children, ...props }: TagProps) => {
  return (
    <span className={`${TagStyles()} ${className}`} {...props}>
      {children}
    </span>
  );
};
