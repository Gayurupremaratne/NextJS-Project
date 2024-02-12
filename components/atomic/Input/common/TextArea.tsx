'use client';

import { ComponentProps } from 'react';

export interface TextAreaProps extends ComponentProps<'textarea'> {
  children?: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
  error?: string[];
  rows?: number;
}

export const TextArea = (props: TextAreaProps) => {
  const {
    className = '',
    containerClassName = '',
    disabled = false,
    error,
    rows = 4,
    ...textAreaProps
  } = props || {};

  return (
    <div className={`flex flex-row items-center ${containerClassName}`}>
      {props.children ? (
        props.children
      ) : (
        <textarea
          className={`rounded-[5px] border border-solid ${
            typeof error !== 'undefined'
              ? 'bg-red'
              : 'border-tints-battleship-grey-tint-5'
          } ${
            disabled
              ? 'bg-tints-battleship-grey-tint-6 hover:transparent'
              : 'border-tints-battleship-grey-tint-5 hover:border-tints-forest-green-tint-2 focus:border-tints-forest-green-tint-1'
          } ${className} text-shades-battleship-grey-shade-6 font-sm w-full p-3 font-albertSans font-normal focus:outline-none
          ${className}`}
          disabled={disabled}
          rows={rows} // Set the rows attribute for textarea
          {...textAreaProps}
        />
      )}
    </div>
  );
};
