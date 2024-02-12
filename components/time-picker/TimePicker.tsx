import React from 'react';
import { AutoSuggest, InputContainer, Item } from '../atomic';

export interface TimePickerProps {
  onHoursSelect: (item: Item) => void;
  onMinutesSelect: (item: Item) => void;
  isUnitVisible?: boolean;
  initialHourValue?: Item;
  initialMinuteValue?: Item;
}

const TimePicker = ({
  onHoursSelect,
  onMinutesSelect,
  isUnitVisible = false,
  initialHourValue,
  initialMinuteValue,
}: TimePickerProps) => {
  const hoursDropdown = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    name: i.toString().padStart(2, '0'),
  }));

  const minutesDropdown = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    name: i.toString().padStart(2, '0'),
  }));

  return (
    <InputContainer className="flex">
      <div className="w-1/3 flex flex-row items-center">
        <AutoSuggest
          initialSelected={initialHourValue}
          isBorderVisible={false}
          items={hoursDropdown}
          onSelect={item => {
            onHoursSelect(item);
          }}
          tabIndex={() => {}}
        />
        {isUnitVisible && <span>hours</span>}
      </div>
      <div className="w-1/3 flex items-center">
        <AutoSuggest
          initialSelected={initialMinuteValue}
          isBorderVisible={false}
          items={minutesDropdown}
          onSelect={item => {
            onMinutesSelect(item);
          }}
          tabIndex={() => {}}
        />
        {isUnitVisible && <span>mins</span>}
      </div>
    </InputContainer>
  );
};

export default TimePicker;
