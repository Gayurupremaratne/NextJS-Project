'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import { DropdownProps } from './interface';
import { Checkbox, Chip, Item } from '@/components/atomic';

const useOutsideClickHandler = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });
};

export const ChipSelect: React.FC<DropdownProps> = ({
  items: providedItems,
}: DropdownProps) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [items, setItems] = useState<Item[]>(providedItems);

  const handleToggleItem = (item: Item) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.some(selectedItem => selectedItem.id === item.id)
        ? prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id)
        : [...prevSelectedItems, item],
    );
  };

  const removeSelectedItem = (item: Item) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id),
    );
  };

  useEffect(() => {
    const checkedItems: Item[] = [];
    const uncheckedItems: Item[] = [];

    const selectedIds = selectedItems.map(selectedItem => selectedItem.id);

    items.forEach(item => {
      if (selectedIds.includes(item.id)) {
        checkedItems.push(item);
      } else {
        uncheckedItems.push(item);
      }
    });

    setItems([...checkedItems, ...uncheckedItems]);
  }, [selectedItems]);

  const handleToggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  useOutsideClickHandler(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="w-72 outline-none" ref={dropdownRef}>
      <div className="relative mt-1 outline-none">
        <div
          className={`w-full flex items-center ${
            selectedItems.length > 0 ? 'pl-1' : 'pl-3'
          } pr-10 py-1 text-md leading-5 text-shades-jungle-green-shade-6 hover:text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-6 rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 active:border active:border-solid active:border-tints-forest-green-tint-1 outline-none`}
          onClick={handleToggleDropdown}
        >
          <span className="flex truncate flex-wrap gap-1 items-center">
            {selectedItems.length > 0
              ? selectedItems.map(item => (
                  <Chip
                    className="!h-8"
                    key={item.id}
                    onClose={() => removeSelectedItem(item)}
                  >
                    {item.name}
                  </Chip>
                ))
              : 'Select'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ArrowDown2
              aria-hidden="true"
              className={`h-5 w-5 ${
                isOpen
                  ? 'text-shades-forest-green-shade-1'
                  : 'text-shades-forest-green-shade-6'
              } active:text-shades-forest-green-shade-1 hover:text-shades-forest-green-shade-1`}
              variant="Bold"
            />
          </span>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-in-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in-out duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          show={isOpen}
        >
          <div className="absolute z-20 w-full px-1 mt-1 max-h-60 overflow-auto rounded-[5px] bg-white py-1 text-base shadow-lg border border-solid border-tints-battleship-grey-tint-5 focus:outline-none sm:text-sm">
            {items.map((item, itemIdx) => (
              <label
                className={`block cursor-pointer select-none py-2 pl-3 pr-4 ${
                  selectedItems.some(
                    selectedItem => selectedItem.id === item.id,
                  )
                    ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                    : 'text-shades-jungle-green-shade-6'
                }`}
                key={itemIdx}
              >
                <Checkbox
                  checked={selectedItems.some(
                    selectedItem => selectedItem.id === item.id,
                  )}
                  label={item.name}
                  onChange={() => handleToggleItem(item)}
                />
              </label>
            ))}
          </div>
        </Transition>
      </div>
    </div>
  );
};
