'use client';

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowDown2, ArrowUp2, SearchNormal1 } from 'iconsax-react';
import { Button, Input, InputContainer, Text } from '@/components/atomic';

interface BasicFilterProps {
  filterTitle: string;
  menuItems: string[];
}

const useOutsideClickHandler = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void,
) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);
};

export const BasicFilter = ({ filterTitle, menuItems }: BasicFilterProps) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<string[]>(menuItems);
  const [selectedItem, setSelectedItem] = useState<string>('Options');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredItems = menuItems.filter(item =>
      item.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSuggestions(filteredItems);
  };

  const handleClearAllClick = () => {
    setInputValue('');
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setInputValue(item);
    setIsMenuOpen(false);
  };

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  };

  useOutsideClickHandler(menuRef, handleClickOutside);

  return (
    <div className="w-80">
      <Menu as="div" className="relative inline-block text-left" ref={menuRef}>
        <div className="w-28">
          <Menu.Button
            className="h-10 inline-flex w-[124px] rounded-[5px] px-4 py-2.5 text-md font-regular text-shades-forest-green-shade-6 bg-white border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="w-11/12 truncate text-left">{selectedItem}</span>
            {isMenuOpen ? (
              <ArrowUp2
                aria-hidden="true"
                className="ml-2 -mr-1 h-5 w-5 text-shades-forest-green-shade-6 hover:text-shades-forest-green-shade-6"
                variant="Bold"
              />
            ) : (
              <ArrowDown2
                aria-hidden="true"
                className="ml-2 -mr-1 h-5 w-5 text-shades-forest-green-shade-6 hover:text-shades-forest-green-shade-6"
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
        >
          <Menu.Items className="absolute z-20 w-80 mt-2 origin-top-left rounded-[5px] bg-white shadow-lg border border-solid border-tints-battleship-grey-tint-5 focus:outline-none">
            <div className="px-6 pt-6 pb-4 flex flex-row justify-between items-center">
              <Text size={'md'} weight={'semiBold'}>
                {filterTitle}
              </Text>
              <Button
                intent={'ghost'}
                onClick={handleClearAllClick}
                size={'ghost'}
              >
                Clear all
              </Button>
            </div>
            <div className="px-6 flex items-center">
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
              <Menu>
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
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? ' text-shades-forest-green-shade-6'
                              : 'text-shades-battleship-grey-shade-2'
                          } group bg-white flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => {
                            handleMenuItemClick(item);
                          }}
                        >
                          {item}
                        </button>
                      )}
                    </Menu.Item>
                  ))
                )}
              </Menu>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
