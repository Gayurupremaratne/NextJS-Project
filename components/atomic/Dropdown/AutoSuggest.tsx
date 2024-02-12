'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import { DropdownProps, Item } from './interface';
import { useOutsideClickHandler } from '@/components/common/utils';

export const AutoSuggest: React.FC<
  DropdownProps & {
    onSelect: (selectedItem: Item) => void;
    isBorderVisible?: boolean;
    onChange?: (value: string) => void;
  }
> = ({
  items,
  onSelect,
  onChange,
  placeholderText,
  isBorderVisible = true,
  initialSelected,
}: DropdownProps & {
  onSelect: (selectedItem: Item) => void;
  onChange?: (value: string) => void;
  isBorderVisible?: boolean;
}) => {
  const [selected, setSelected] = useState(initialSelected ?? items[0]);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPeople =
    query === ''
      ? items
      : items.filter(item =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const handleClickOutside = () => {
    setMenuOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (menuOpen && selected) {
      setMenuOpen(false);
      inputRef.current?.blur();
    }
  }, [selected]);

  useOutsideClickHandler(dropdownRef, handleClickOutside);

  const handleOptionClick = (item: Item) => {
    setSelected(item);
    setQuery(item.name);
    if (menuOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setMenuOpen(false);
    onSelect(item);
  };

  return (
    <div className="w-full outline-none" ref={dropdownRef}>
      <Combobox onChange={handleOptionClick} value={selected}>
        <div
          className="relative mt-1 outline-none"
          onClick={() => setMenuOpen(prevState => !prevState)}
        >
          <div
            className={`relative w-full outline-none cursor-${
              menuOpen ? 'pointer' : 'default'
            } overflow-hidden text-left sm:text-sm !focus-visible:border-none`}
          >
            <Combobox.Input
              className={`w-full py-2 pl-3 pr-10 text-md leading-5 text-shades-jungle-green-shade-6 hover:text-shades-forest-green-shade-6 active:text-shades-forest-green-shade-6 rounded-[5px] border ${
                isBorderVisible
                  ? 'border-solid hover:border hover:border-solid hover:border-tints-forest-green-tint-1 active:border active:border-solid active:border-tints-forest-green-tint-1'
                  : 'border-none'
              }  border-tints-battleship-grey-tint-5 outline-none`}
              displayValue={(item: Item) => item.name}
              onChange={event => {
                setQuery(event.currentTarget.value);
                if (onChange) {
                  onChange(event.currentTarget.value);
                }
              }}
              placeholder={placeholderText}
              ref={inputRef}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ArrowDown2
                aria-hidden="true"
                className="h-5 w-5 active:text-shades-forest-green-shade-1 hover:text-shades-forest-green-shade-1"
                variant="Bold"
              />
            </Combobox.Button>
          </div>
          <Transition
            afterLeave={() => setQuery('')}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={menuOpen}
          >
            <Combobox.Options className="absolute z-20 px-1 mt-1 max-h-60 w-full overflow-auto rounded-[5px] bg-white py-1 text-base shadow-lg border border-solid border-tints-battleship-grey-tint-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-shades-forest-green-shade-6">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map(item => (
                  <Combobox.Option
                    className={comboBoxOption =>
                      `relative cursor-default select-none py-2 px-2 text-md hover:bg-tints-forest-green-tint-6 active:bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6 ${
                        comboBoxOption.active
                          ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                          : 'text-shades-jungle-green-shade-6'
                      }
                      ${
                        comboBoxOption.selected
                          ? 'bg-tints-forest-green-tint-6 text-shades-jungle-green-shade-6'
                          : 'text-shades-jungle-green-shade-6'
                      }`
                    }
                    key={item.id}
                    onClick={() => handleOptionClick(item)}
                    value={item}
                  >
                    {properties => (
                      <>
                        {properties.selected ? (
                          <span
                            className={
                              'block truncate font-normal bg-tints-forest-green-tint-6'
                            }
                          >
                            {item.name}
                          </span>
                        ) : (
                          <span
                            className={`block truncate ${
                              properties.selected ? 'font-normal' : null
                            }`}
                          >
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
