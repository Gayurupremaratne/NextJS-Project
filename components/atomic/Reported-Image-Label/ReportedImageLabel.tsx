'use client';
import { cva, VariantProps } from 'class-variance-authority';
import { LabelNode } from '../types';

const labelStyles = cva('font-albertSans flex rounded-md w-max items-center', {
  variants: {
    intent: {
      active: '',
      inactive: '',
    },
    size: {
      sm: 'py-1 px-2 font-semiBold text-sm h-[21px]',
    },
  },
  defaultVariants: {
    size: 'sm',
    intent: 'active',
  },
});

export interface LabelProps
  extends VariantProps<typeof labelStyles>,
    LabelNode {
  preIcon?: JSX.Element;
  postIcon?: JSX.Element;
}

export const ReportedImageLabel = ({
  className = '',
  children,
  preIcon,
  postIcon,
  intent,
  ...props
}: LabelProps) => {
  return (
    <span className={`${labelStyles({ intent })} ${className}`} {...props}>
      {preIcon && <span className="mr-1">{preIcon}</span>}
      {children}
      {postIcon && <span className="ml-1">{postIcon}</span>}
    </span>
  );
};
