'use client';

import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import { BasicDropdownProps, Item } from './interface';

export const BasicSelect: React.FC<BasicDropdownProps> = ({
  items,
  onChange,
  value,
}: BasicDropdownProps) => {
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    setSelected(items.find(item => item.id === value) || null);
  }, [value, items]);

  return (
    <div className="w-full outline-none">
      <Listbox onChange={onChange} value={selected}>
        <div className="relative outline-none">
          <Listbox.Button className="w-full h-10 flex py-2 pl-3 pr-10 text-md leading-5 text-shades-jungle-green-shade-6 hover:text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-6 rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 active:border active:border-solid active:border-tints-forest-green-tint-1 outline-none">
            <span className="block truncate">{selected?.name}</span>
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
            <Listbox.Options className="absolute z-20 px-1 mt-1 max-h-60 w-full overflow-auto rounded-[5px] bg-white py-1 text-base shadow-lg border border-solid border-tints-battleship-grey-tint-6 focus:outline-none sm:text-sm">
              {items.map((item, itemIdx) => (
                <Listbox.Option
                  className={listboxProperties =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 ${
                      listboxProperties.active
                        ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                        : 'text-shades-jungle-green-shade-6'
                    }
                      ${
                        listboxProperties.selected
                          ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                          : 'text-shades-jungle-green-shade-6'
                      }`
                  }
                  key={itemIdx}
                  value={item}
                >
                  {item.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
