'use client';

import { Text } from '@/components/atomic';
import { ComponentProps } from 'react';

export interface InputContainerProps extends ComponentProps<'div'> {
  error?: string[] | undefined;
  disabled?: boolean;
}

export const InputContainer = (containerProps: InputContainerProps) => {
  const {
    className = '',
    children,
    error = undefined,
    disabled,
    ...props
  } = containerProps;

  return (
    <>
      <div
        className={`flex flex-row items-center rounded-[5px] border border-solid ${
          disabled
            ? 'bg-tints-battleship-grey-tint-6 border-tints-battleship-grey-tint-5 hover:border-tints-battleship-grey-tint-5'
            : 'border-tints-battleship-grey-tint-5 hover:border-tints-forest-green-tint-2 focus:border-tints-forest-green-tint-1'
        }
        ${
          typeof error !== 'undefined'
            ? 'border-red'
            : 'border-tints-battleship-grey-tint-5'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
      {typeof error !== 'undefined' && (
        <Text intent="red" size="sm" type="p">
          {error[0]}
        </Text>
      )}
    </>
  );
};
