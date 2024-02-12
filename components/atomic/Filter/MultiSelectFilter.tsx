'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowDown2, ArrowUp2, SearchNormal1 } from 'iconsax-react';
import {
  Button,
  Checkbox,
  Input,
  InputContainer,
  Text,
} from '@/components/atomic';

interface MultiSelectFilterProps {
  filterTitle: string;
  menuItems: string[];
}

export const MultiSelectFilter = ({
  filterTitle,
  menuItems,
}: MultiSelectFilterProps) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<string[]>(menuItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredItems = menuItems.filter(item =>
      item.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSuggestions(filteredItems);
  };

  const handleMenuItemClick = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(selectedItem => selectedItem !== item),
      );
    } else {
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, item]);
    }
    setSelectAll(false);
  };

  const handleSelectAllClick = () => {
    setSelectedItems(menuItems);
    setSelectAll(true);
  };

  const handleDeselectAllClick = () => {
    setSelectedItems([]);
    setSelectAll(false);
  };

  const getLabelForSelectedItems = (): string => {
    const selectedCount = selectedItems.length;
    if (selectedCount === 0) {
      return 'Options';
    } else if (selectedCount === 1) {
      return selectedItems[0];
    }
    const firstSelectedItem = selectedItems[0];
    const remainingCount = selectedCount - 1;
    return `${firstSelectedItem} + ${remainingCount} more`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-80">
      <Menu as="div" className="relative inline-block text-left" ref={menuRef}>
        <div className="w-[124px]">
          <Menu.Button
            className="h-10 items-center inline-flex w-[124px] truncate justify-between rounded-[5px] px-4 py-2.5 text-md font-regular text-shades-forest-green-shade-6 bg-white border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="w-11/12 truncate text-left">
              {getLabelForSelectedItems()}
            </span>
            {isMenuOpen ? (
              <ArrowUp2
                aria-hidden="true"
                className="!h-4 !w-4 text-shades-forest-green-shade-6 hover:text-shades-forest-green-shade-6"
                variant="Bold"
              />
            ) : (
              <ArrowDown2
                aria-hidden="true"
                className="!h-4 !w-4 text-shades-forest-green-shade-6 hover:text-shades-forest-green-shade-6"
                variant="Bold"
              />
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          show={isMenuOpen}
        >
          <Menu.Items className="absolute z-20 w-80 mt-2 origin-top-left rounded-[5px] bg-white shadow-lg border border-solid border-tints-battleship-grey-tint-5 focus:outline-none">
            <div className="px-6 pt-6 pb-4 flex flex-row justify-between items-center">
              <Text size={'md'} weight={'semiBold'}>
                {filterTitle}
              </Text>
              <div>
                {selectAll ? (
                  <Button
                    intent={'ghost'}
                    onClick={handleDeselectAllClick}
                    size={'ghost'}
                  >
                    Deselect all
                  </Button>
                ) : (
                  <Button
                    intent={'ghost'}
                    onClick={handleSelectAllClick}
                    size={'ghost'}
                  >
                    Select all
                  </Button>
                )}
              </div>
            </div>
            <div className="px-6 flex items-center w-full">
              <InputContainer className="w-full justify-between">
                <Input
                  onChange={handleInputChange}
                  placeholder={'Search'}
                  type="text"
                  value={inputValue}
                />
                <SearchNormal1
                  className="m-2 text-shades-battleship-grey-shade-2"
                  size={16}
                />
              </InputContainer>
            </div>
            <div className="px-5 pt-3 pb-5">
              {filteredSuggestions.length === 0 ? (
                <Menu.Item>
                  <button
                    className="text-shades-battleship-grey-shade-2 group bg-white flex w-full items-center rounded-md px-2 py-2 text-sm"
                    disabled
                  >
                    No results
                  </button>
                </Menu.Item>
              ) : (
                filteredSuggestions.map(item => (
                  <Menu.Item key={item}>
                    {({ active: _active }) => (
                      <label className="group flex items-center rounded-md px-2 py-2 text-sm">
                        <Checkbox
                          checked={selectedItems.includes(item)}
                          label={item}
                          onChange={() => handleMenuItemClick(item)}
                        />
                      </label>
                    )}
                  </Menu.Item>
                ))
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
