'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ContainerNode } from '../types';

const containerStyles = cva('bg-white rounded-md border border-grey_2 w-max');

export interface ContainerProps
  extends VariantProps<typeof containerStyles>,
    ContainerNode {}

export const Container = ({
  className = '',
  children,
  ...props
}: ContainerProps) => {
  return (
    <div className={`${containerStyles()} ${className}`} {...props}>
      {children}
    </div>
  );
};
