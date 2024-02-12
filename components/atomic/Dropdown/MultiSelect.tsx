'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import { Checkbox, Item, MultiDropdownProps } from '@/components/atomic';
import { useOutsideClickHandler } from '@/components/common/utils';

export const MultiSelect: React.FC<MultiDropdownProps> = ({
  items: providedItems,
  onSelectedItemsChange,
  initialSelected,
  placeholder = 'Select',
}: MultiDropdownProps) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    initialSelected ? initialSelected : [],
  );
  const [items, setItems] = useState<Item[]>(providedItems);
  const [isOpen, setIsOpen] = useState(false);
  const MAX_DISPLAY_COUNT = 1;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleItem = (item: Item) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.some(selectedItem => selectedItem.id === item.id)
        ? selectedItems.filter(selectedItem => item.id != selectedItem.id)
        : [...prevSelectedItems, item],
    );
  };

  useEffect(() => {
    setSelectedItems(initialSelected ? initialSelected : []);
  }, [initialSelected]);

  useEffect(() => {
    setItems(providedItems);
  }, [isOpen]);

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

    onSelectedItemsChange(selectedItems);
  }, [selectedItems]);

  const getDisplayedItemText = () => {
    const selectedCount = selectedItems.length;
    if (selectedCount > MAX_DISPLAY_COUNT) {
      return `${selectedItems[0].name} + ${
        selectedCount - MAX_DISPLAY_COUNT
      } more`;
    }
    return selectedItems.map(item => item.name).join(', ');
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOutsideClickHandler(dropdownRef, handleClickOutside);

  return (
    <div className="w-full outline-none" ref={dropdownRef}>
      <div className="relative outline-none">
        <div
          className="w-full flex py-2.5 pl-3 pr-10 text-md leading-5 text-shades-jungle-green-shade-6 hover:text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-6 rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 active:border active:border-solid active:border-tints-forest-green-tint-1 outline-none"
          onClick={() => setIsOpen(prevState => !prevState)}
        >
          <span
            className={`block truncate ${
              selectedItems.length > 0
                ? ''
                : 'text-tints-battleship-grey-tint-1'
            }`}
          >
            {selectedItems.length > 0 ? getDisplayedItemText() : placeholder}
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
          <div className="absolute z-20 px-1 mt-1 max-h-60 w-full overflow-auto rounded-[5px] bg-white py-1 text-base shadow-lg border border-solid border-tints-battleship-grey-tint-5 focus:outline-none sm:text-sm">
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
