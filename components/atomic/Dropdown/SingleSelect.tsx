'use client';

import { RadioButton } from '@/components/atomic';
import { Listbox, Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import _ from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { DropdownProps } from './interface';

export const SingleSelect: React.FC<DropdownProps> = ({
  items,
  initialSelected,
  placeholderText,
  tabIndex,
  className,
  disabled,
}: DropdownProps) => {
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    if (selected) {
      tabIndex(selected.id);
    }
  }, [selected]);

  return (
    <div className="w-full outline-none">
      <Listbox disabled={disabled} onChange={setSelected} value={selected}>
        <div className="relative outline-none ">
          <Listbox.Button
            className={`w-full flex h-10 py-2 pl-3 pr-10 text-md leading-5 ${
              disabled
                ? 'text-shades-battleship-grey-shade-1'
                : 'text-shades-jungle-green-shade-6 hover:text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-6 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 active:border active:border-solid active:border-tints-forest-green-tint-1'
            } rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 outline-none`}
          >
            {_.isEmpty(initialSelected) && _.isEmpty(selected?.name) && (
              <span className="block truncate text-shades-battleship-grey-shade-1">
                {placeholderText}
              </span>
            )}

            {selected?.name}

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ArrowDown2
                aria-hidden="true"
                className="h-5 w-5 text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-1 hover:text-shades-forest-green-shade-1"
                variant="Bold"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options
              className={`absolute z-20 px-1 mt-1 w-full overflow-auto rounded-[5px] bg-white py-1 text-base shadow-lg border border-solid border-tints-battleship-grey-tint-6 focus:outline-none sm:text-sm ${
                className ?? 'max-h-60'
              }`}
            >
              {items.map((item, itemIdx) => (
                <Listbox.Option
                  className={listboxProperties =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 ${
                      listboxProperties.active
                        ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                        : 'text-shades-jungle-green-shade-6'
                    }
                      ${
                        listboxProperties.selected || item.id === selected?.id
                          ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                          : 'text-shades-jungle-green-shade-6'
                      }`
                  }
                  key={itemIdx}
                  value={item}
                >
                  {properties => (
                    <label
                      className={`block truncate ${
                        properties.selected || item.id === selected?.id
                          ? 'font-normal'
                          : null
                      }`}
                    >
                      <RadioButton
                        checked={
                          properties.selected || item.id === selected?.id
                        }
                        label={item.name}
                        onChange={() => {
                          setSelected(item);
                          tabIndex(itemIdx);
                        }}
                      />
                    </label>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
