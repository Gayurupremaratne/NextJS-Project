'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ChipNode } from '../types';
import Image from 'next/image';
import close from '../../../public/images/icons/close.svg';

const chipStyles = cva(
  'font-albertSans flex bg-tints-forest-green-tint-6 text-tints-forest-green-tint-1 rounded-md w-max items-center',
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

export interface ChipProps extends VariantProps<typeof chipStyles>, ChipNode {
  onClose?: () => void;
}

export const Chip = ({
  className = '',
  children,
  onClose,
  ...props
}: ChipProps) => {
  const handleRemoveChip = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <span className={`${chipStyles()} ${className}`} {...props}>
      {children}
      <span className="ml-1 w-max cursor-pointer" onClick={handleRemoveChip}>
        <Image alt="close" height={16} src={close} width={16} />
      </span>
    </span>
  );
};
