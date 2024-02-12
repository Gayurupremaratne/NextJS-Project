'use client';

import { theme } from '@/tailwind.config';
import { SpinnerSizes, SpinnerTypes } from '../types';
import { Oval } from 'react-loader-spinner';

const color: Record<SpinnerTypes, string> = {
  primary: theme.colors.white,
  secondary: theme.colors.tints['forest-green']['tint-1'],
};

const size: Record<SpinnerSizes, string> = {
  xs: '16',
  sm: '24',
  md: '48',
  lg: '64',
};

interface SpinnerProps {
  loading?: boolean;
  intent?: SpinnerTypes | null;
  className?: string;
  spinnerSize?: SpinnerSizes | null;
}

export function Spinner({
  className = '',
  loading = false,
  intent = 'primary',
  spinnerSize = 'xs',
}: SpinnerProps) {
  return (
    <Oval
      ariaLabel="oval-loading"
      color={color[intent || 'primary']}
      height={size[spinnerSize || 'xs']}
      strokeWidth={2}
      strokeWidthSecondary={2}
      visible={loading}
      width={size[spinnerSize || 'xs']}
      wrapperClass={`${className}`}
      wrapperStyle={{}}
    />
  );
}
