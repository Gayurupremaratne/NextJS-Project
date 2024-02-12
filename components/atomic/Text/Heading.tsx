'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { HeadingNode } from '@/components/atomic';

const headingStyles = cva('font-albertSans', {
  variants: {
    intent: {
      h1: 'text-shades-jungle-green-shade-6 text-4xl font-bold',
      h2: 'text-shades-jungle-green-shade-6 text-3xl font-medium',
      h3: 'text-shades-jungle-green-shade-6 text-2xl font-semibold',
      h4: 'text-shades-jungle-green-shade-6 text-xl font-semibold',
      h5: 'text-shades-jungle-green-shade-6 text-lg font-semibold',
      h6: 'text-shades-jungle-green-shade-6 text-md font-medium',
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
    defaultVariants: {
      intent: 'h1',
    },
  },
});
export interface HeadingProps
  extends VariantProps<typeof headingStyles>,
    HeadingNode {}

export const Heading = ({
  intent,
  weight,
  size,
  className = '',
  ...props
}: HeadingProps) => {
  const IntentTag = intent ? intent : 'h1';

  return (
    <IntentTag
      className={`${headingStyles({
        intent,
        weight,
        size,
      })} ${className}`}
      {...props}
    />
  );
};
