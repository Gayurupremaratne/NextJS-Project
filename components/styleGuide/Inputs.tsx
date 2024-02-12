'use client';

import React, { useState } from 'react';
import {
  AutoSuggest,
  BasicFilter,
  Checkbox,
  ChipSelect,
  Input,
  InputContainer,
  MultiSelect,
  MultiSelectFilter,
  RadioButton,
  SingleSelect,
  Text,
} from '../atomic';
import { DateRange } from '../atomic/DateRange';
import { DateValueType } from '../atomic/DateRange/types';

export const Inputs = () => {
  const people = [
    { id: 1, name: 'Wade Cooper' },
    { id: 2, name: 'Arlene Mccoy' },
    { id: 3, name: 'Devon Webb' },
    { id: 4, name: 'Tom Cook' },
    { id: 5, name: 'Tanya Fox' },
    { id: 6, name: 'Hellen Schmidt' },
  ];

  const basicMenuItems = ['Kandy', 'Hatton', 'Nuwara Eliya', 'Ella'];

  const [value, setValue] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue);
  };

  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          INPUTS
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Text input
      </Text>
      <div className="flex md:flex-row flex-col gap-10">
        <div className="flex flex-col gap-1">
          <Text>Idle</Text>
          <InputContainer>
            <Input placeholder={'placeholder text'} type="text" />
          </InputContainer>
        </div>
        <div className="flex flex-col gap-1">
          <Text>Disabled</Text>
          <InputContainer disabled>
            <Input disabled placeholder={'placeholder text'} type="text" />
          </InputContainer>
        </div>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Dropdowns
      </Text>
      <div className="w-72 flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <Text>Auto suggest</Text>
          <AutoSuggest
            items={people}
            onSelect={() => {}}
            tabIndex={() => {
              return {};
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text>Single select</Text>
          <SingleSelect items={people} tabIndex={() => {}} />
        </div>
        <div className="flex flex-col gap-1">
          <Text>Multi select</Text>
          <MultiSelect
            items={people}
            onSelectedItemsChange={() => {
              return {};
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text>Chip select</Text>
          <ChipSelect items={people} tabIndex={() => {}} />
        </div>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Filters
      </Text>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <Text>Normal selection + search</Text>
          <BasicFilter
            filterTitle={'Select location'}
            menuItems={basicMenuItems}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text>Multiselect + search</Text>
          <MultiSelectFilter
            filterTitle={'Select location'}
            menuItems={basicMenuItems}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <Text>Date range filter</Text>
          <DateRange
            onChange={handleValueChange}
            showShortcuts={true}
            value={value}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <Text>Date picker</Text>
          <DateRange
            asSingle={true}
            onChange={handleValueChange}
            showFooter={false}
            showShortcuts={false}
            useRange={false}
            value={value}
          />
        </div>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Toggles and selectors
      </Text>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col gap-2">
          <Text>Checkbox</Text>
          <Checkbox checked={true} label="checked" onChange={() => {}} />
          <Checkbox checked={false} label="unchecked" onChange={() => {}} />
          <Checkbox
            checked={true}
            disabled
            label="disabled checked"
            onChange={() => {}}
          />
          <Checkbox disabled label="disabled unchecked" onChange={() => {}} />
        </div>
        <div className="flex flex-col gap-2">
          <Text>Radio buttons</Text>
          <RadioButton
            checked={false}
            label={'unselected'}
            onChange={() => {}}
          />
          <RadioButton checked={true} label={'selected'} onChange={() => {}} />
          <RadioButton
            checked={false}
            disabled
            label={'disabled unselected'}
            onChange={() => {}}
          />
          <RadioButton
            checked={true}
            disabled
            label={'disabled selected'}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
