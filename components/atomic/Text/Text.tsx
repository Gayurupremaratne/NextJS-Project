'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { TextNode } from '@/components/atomic';

const textStyles = cva('font-albertSans', {
  variants: {
    intent: {
      dark: 'text-shades-jungle-green-shade-6',
      green: 'text-shades-forest-green-shade-1',
      red: 'text-red',
      grey: 'text-shades-battleship-grey-shade-1',
      forestGreenTintTwo: 'text-tints-forest-green-tint-2',
      battleshipShadeTwo: 'text-shades-battleship-grey-shade-2',
    },
    weight: {
      extraLight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semiBold: 'font-semibold',
      bold: 'font-bold',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
  },
  defaultVariants: {
    intent: 'dark',
    weight: 'normal',
    size: 'sm',
  },
});
export interface TextProps extends VariantProps<typeof textStyles>, TextNode {
  type?: 'p' | 'span';
}

export const Text = ({
  intent,
  weight,
  size,
  className,
  type = 'p',
  ...props
}: TextProps) => {
  const ElementType = type;

  return (
    <ElementType
      className={`${textStyles({ intent, weight, size })} ${className ?? ''}`}
      {...props}
    />
  );
};
