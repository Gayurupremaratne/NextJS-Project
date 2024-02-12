'use client';

import React, { ComponentProps, forwardRef } from 'react';

export interface AddonProps {
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
}

export interface InputProps extends ComponentProps<'input'> {
  children?: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
  error?: string[];
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      containerClassName = '',
      disabled = false,
      icon,
      ...props
    }: InputProps,
    ref,
  ) => (
    <div className={`flex flex-row items-center w-full ${containerClassName}`}>
      {props.children ? (
        props.children
      ) : (
        <div className={`relative flex items-center flex-1 ${className}`}>
          {icon && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={`rounded-[5px] border-none text-shades-battleship-grey-shade-6 font-sm w-full p-3 h-10 font-albertSans font-normal focus:outline-none
          ${className} ${icon && 'mr-7'}`}
            disabled={disabled}
            {...props}
            ref={ref}
          />
        </div>
      )}
    </div>
  ),
);
