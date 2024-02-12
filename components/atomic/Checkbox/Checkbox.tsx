import React from 'react';
import { Text } from '../Text';
import Image from 'next/image';
import check from '../../../public/images/icons/check.svg';
import checkDisabled from '../../../public/images/icons/check-disabled.svg';

interface CheckboxProps {
  label: string;
  error?: string[];
  checked?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({
  label,
  error = [],
  checked,
  disabled,
  onChange,
}: CheckboxProps) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
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
          type="checkbox"
        />
        <div
          className={`checkbox-button ${
            error.length > 0 ? 'error' : ''
          } w-5 h-5 border border-solid rounded ${
            checked
              ? disabled
                ? 'bg-tints-battleship-grey-tint-4'
                : 'bg-tints-forest-green-tint-1 border-tints-forest-green-tint-1'
              : 'bg-white border-tints-forest-green-tint-1'
          }  ${
            disabled
              ? 'opacity-50 cursor-not-allowed border-tints-battleship-grey-tint-4'
              : 'cursor-pointer'
          }`}
        >
          {checked &&
            (disabled ? (
              <Image alt={'check'} src={checkDisabled} />
            ) : (
              <Image alt={'check'} src={check} />
            ))}
        </div>
      </div>
      <div className="ml-2 text-md text-shades-forest-green-shade-6">
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
