'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';
import { Spinner } from '../Spinner';
import { ButtonNode } from '../types';

const buttonStyles = cva(
  'font-albertSans flex lg:text-md md:text-sm sm:text-xs text-md items-center justify-center space-x-1',
  {
    variants: {
      intent: {
        primary:
          'bg-tints-forest-green-tint-1 text-white rounded-md p-5 hover:bg-tints-forest-green-tint-2 active:bg-shades-forest-green-shade-2 disabled:bg-tints-battleship-grey-tint-1 disabled:text-white disabled:shadow-none disabled:cursor-not-allowed',
        secondary:
          'bg-tints-forest-green-tint-6 text-tints-forest-green-tint-1 rounded-md p-5 hover:bg-tints-forest-green-tint-5 active:bg-tints-forest-green-tint-4 disabled:bg-tints-battleship-grey-tint-1 disabled:text-white disabled:shadow-none disabled:cursor-not-allowed',
        ghost:
          'text-tints-forest-green-tint-1 hover:text-tints-forest-green-tint-2 active:text-shades-forest-green-shade-2 disabled:text-tints-battleship-grey-tint-2 disabled:shadow-none disabled:cursor-not-allowed',
        danger:
          'bg-snacks-error text-snacks-borders-error rounded-md p-5 disabled:text-tints-battleship-grey-tint-2 disabled:shadow-none disabled:cursor-not-allowed',
        dangerGhost:
          'text-snacks-borders-error disabled:text-tints-battleship-grey-tint-2 disabled:shadow-none disabled:cursor-not-allowed',
      },
      size: {
        sm: 'h-4 py-1 px-4 font-semibold',
        md: 'h-10 py-2 px-5 font-semibold',
        lg: 'h-12 py-3 px-6 font-semibold',
        xl: 'h-14 p-4 px-7 font-semibold',
        ghost: 'font-semibold',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends VariantProps<typeof buttonStyles>,
    ButtonNode {
  loading?: boolean;
  isSubmitting?: boolean;
  preIcon?: JSX.Element;
  postIcon?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  intent,
  size,
  className = '',
  children,
  loading = false,
  isSubmitting,
  preIcon,
  postIcon,
  onClick,
  disabled = false,
  ...props
}: ButtonProps) => {
  const preIconElement = useMemo(() => {
    return loading ? (
      <Spinner className="mr-5" intent="primary" loading spinnerSize="xs" />
    ) : (
      preIcon
    );
  }, [loading, preIcon]);
  return (
    <button
      className={`${buttonStyles({ intent, size })} ${className}`}
      {...props}
      disabled={isSubmitting ?? disabled ?? loading}
      onClick={onClick}
    >
      {preIconElement && <span>{preIconElement}</span>}
      {children}
      {postIcon && <span>{postIcon}</span>}
    </button>
  );
};
