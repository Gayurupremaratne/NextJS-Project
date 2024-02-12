'use client';

import React from 'react';
import { Text } from '../Text';
import Image from 'next/image';
import radio from '../../../public/images/icons/radio.svg';
import radioDisabled from '../../../public/images/icons/radio-disabled.svg';

interface RadioButtonProps {
  label: string;
  error?: string[];
  checked?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const RadioButton = ({
  label,
  error = [],
  checked,
  disabled,
  onChange,
  className,
}: RadioButtonProps) => {
  const handleChange = () => {
    if (!disabled && !checked) {
      onChange(true);
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          checked={checked}
          className="hidden"
          disabled={disabled}
          onChange={handleChange}
          type="radio"
        />
        <div
          className={`radio-button ${
            error.length > 0 ? 'error' : ''
          } w-5 h-5 border border-solid rounded-full ${
            checked
              ? disabled
                ? 'bg-tints-battleship-grey-tint-4 border-tints-battleship-grey-tint-4'
                : 'bg-tints-forest-green-tint-1 border-tints-forest-green-tint-1'
              : 'bg-white border-tints-forest-green-tint-1'
          }  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {checked &&
            (disabled ? (
              <Image alt={'radio'} src={radioDisabled} />
            ) : (
              <Image alt={'radio'} src={radio} />
            ))}
        </div>
      </div>
      <div
        className={`${className} ml-2 text-md text-shades-forest-green-shade-6`}
      >
        {label}
      </div>
      {error.length > 0 && (
        <Text intent="red" size="xs" type="p">
          {error[0]}
        </Text>
      )}
    </label>
  );
};
