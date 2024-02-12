'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';

export interface ToggleProps {
  label: string;
}

export const Toggle = ({ label }: ToggleProps) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="place-items-center flex">
      <Switch
        checked={enabled}
        className={
          'bg-tints-battleship-grey-tint-6 relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75'
        }
        onChange={setEnabled}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled
              ? 'translate-x-6 bg-tints-forest-green-tint-1'
              : 'translate-x-0 bg-white'
          }
            pointer-events-none inline-block h-[22px] w-[22px] my-[2px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <span className="ml-2 text-sm font-medium text-shades-jungle-green-shade-6">
        {label}
      </span>
    </div>
  );
};
