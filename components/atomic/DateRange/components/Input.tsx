import dayjs from 'dayjs';
import React, { useCallback, useContext, useEffect, useRef } from 'react';

import { DATE_FORMAT } from '../constants';
import DatepickerContext from '../contexts/DatepickerContext';
import { dateIsValid, parseFormattedDate } from '../helpers';

import ToggleButton from './ToggleButton';

type Props = {
  setContextRef?: (ref: React.RefObject<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = (e: Props) => {
  // Context
  const {
    primaryColor,
    period,
    dayHover,
    changeDayHover,
    calendarContainer,
    inputText,
    changeInputText,
    hideDatepicker,
    changeDatepickerValue,
    asSingle,
    placeholder,
    separator,
    disabled,
    inputClassName,
    toggleClassName,
    toggleIcon,
    readOnly,
    displayFormat,
    inputId,
    inputName,
    classNames,
    popoverDirection,
  } = useContext(DatepickerContext);

  // UseRefs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Functions
  const getClassName = useCallback(() => {
    const input = inputRef.current;

    if (
      input &&
      typeof classNames !== 'undefined' &&
      typeof classNames?.input === 'function'
    ) {
      return classNames.input(input);
    }

    const defaultInputClassName =
      'outline-none relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border border-solid border-tints-battleship-grey-tint-5 hover:border hover:border-solid hover:border-tints-forest-green-tint-1 focus:outline-none rounded-[5px] tracking-wide font-normal text-sm tints-jungle-green-tint-6 bg-white disabled:cursor-not-allowed';

    return typeof inputClassName === 'function'
      ? inputClassName(defaultInputClassName)
      : typeof inputClassName === 'string' && inputClassName !== ''
      ? inputClassName
      : defaultInputClassName;
  }, [inputRef, classNames, primaryColor, inputClassName]);

  const handleInputChange = useCallback(
    (handleInputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = handleInputChangeEvent.target.value;

      const dates = [];

      if (asSingle) {
        const date = parseFormattedDate(inputValue, displayFormat);
        if (dateIsValid(date.toDate())) {
          dates.push(date.format(DATE_FORMAT));
        }
      } else {
        const parsed = inputValue.split(separator);

        let startDate = null;
        let endDate = null;

        if (parsed.length === 2) {
          startDate = parseFormattedDate(parsed[0], displayFormat);
          endDate = parseFormattedDate(parsed[1], displayFormat);
        } else {
          const middle = Math.floor(inputValue.length / 2);
          startDate = parseFormattedDate(
            inputValue.slice(0, middle),
            displayFormat,
          );
          endDate = parseFormattedDate(inputValue.slice(middle), displayFormat);
        }

        if (
          dateIsValid(startDate.toDate()) &&
          dateIsValid(endDate.toDate()) &&
          startDate.isBefore(endDate)
        ) {
          dates.push(startDate.format(DATE_FORMAT));
          dates.push(endDate.format(DATE_FORMAT));
        }
      }

      if (dates[0]) {
        changeDatepickerValue(
          {
            startDate: dates[0],
            endDate: dates[1] || dates[0],
          },
          handleInputChangeEvent.target,
        );
        if (dates[1]) {
          changeDayHover(dayjs(dates[1]).add(-1, 'day').format(DATE_FORMAT));
        } else {
          changeDayHover(dates[0]);
        }
      }

      changeInputText(handleInputChangeEvent.target.value);
    },
    [
      asSingle,
      displayFormat,
      separator,
      changeDatepickerValue,
      changeDayHover,
      changeInputText,
    ],
  );

  const handleInputKeyDown = useCallback(
    (handleInputKeyDownEvent: React.KeyboardEvent<HTMLInputElement>) => {
      if (handleInputKeyDownEvent.key === 'Enter') {
        const input = inputRef.current;
        if (input) {
          input.blur();
        }
        hideDatepicker();
      }
    },
    [hideDatepicker],
  );

  const renderToggleIcon = useCallback(
    (isEmpty: boolean) => {
      return typeof toggleIcon === 'undefined' ? (
        <ToggleButton isEmpty={isEmpty} />
      ) : (
        toggleIcon(isEmpty)
      );
    },
    [toggleIcon],
  );

  const getToggleClassName = useCallback(() => {
    const button = buttonRef.current;

    if (
      button &&
      typeof classNames !== 'undefined' &&
      typeof classNames?.toggleButton === 'function'
    ) {
      return classNames.toggleButton(button);
    }

    const defaultToggleClassName =
      'absolute right-0 h-full px-3 text-tints-battleship-grey-tint-1 hover:text-tints-forest-green-tint-1 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';

    return typeof toggleClassName === 'function'
      ? toggleClassName(defaultToggleClassName)
      : typeof toggleClassName === 'string' && toggleClassName !== ''
      ? toggleClassName
      : defaultToggleClassName;
  }, [toggleClassName, buttonRef, classNames]);

  // UseEffects && UseLayoutEffect
  useEffect(() => {
    if (inputRef && e.setContextRef && typeof e.setContextRef === 'function') {
      e.setContextRef(inputRef);
    }
  }, [e, inputRef]);

  useEffect(() => {
    const button = buttonRef?.current;

    function focusInput(focusInputEvent: Event) {
      focusInputEvent.stopPropagation();
      const input = inputRef.current;

      if (input) {
        input.focus();
        if (inputText) {
          changeInputText('');
          if (dayHover) {
            changeDayHover(null);
          }
          if (period.start && period.end) {
            changeDatepickerValue(
              {
                startDate: null,
                endDate: null,
              },
              input,
            );
          }
        }
      }
    }

    if (button) {
      button.addEventListener('click', focusInput);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', focusInput);
      }
    };
  }, [
    changeDatepickerValue,
    changeDayHover,
    changeInputText,
    dayHover,
    inputText,
    period.end,
    period.start,
    inputRef,
  ]);

  useEffect(() => {
    const div = calendarContainer?.current;
    const input = inputRef.current;

    function showCalendarContainer() {
      if (div && div.classList.contains('hidden')) {
        div.classList.remove('hidden');
        div.classList.add('block');

        // window.innerWidth === 767
        const popoverOnUp = popoverDirection == 'up';
        const popoverOnDown = popoverDirection === 'down';
        if (
          popoverOnUp ||
          (window.innerWidth > 767 &&
            window.screen.height - 100 < div.getBoundingClientRect().bottom &&
            !popoverOnDown)
        ) {
          div.classList.add('bottom-full');
          div.classList.add('mb-2.5');
          div.classList.remove('mt-2.5');
        }

        setTimeout(() => {
          div.classList.remove('translate-y-4');
          div.classList.remove('opacity-0');
          div.classList.add('translate-y-0');
          div.classList.add('opacity-1');
        }, 1);
      }
    }

    if (div && input) {
      input.addEventListener('focus', showCalendarContainer);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', showCalendarContainer);
      }
    };
  }, [calendarContainer, popoverDirection]);

  return (
    <>
      <input
        autoComplete="off"
        className={getClassName()}
        disabled={disabled}
        id={inputId}
        name={inputName}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={
          placeholder
            ? placeholder
            : `${displayFormat}${
                asSingle ? '' : ` ${separator} ${displayFormat}`
              }`
        }
        readOnly={readOnly}
        ref={inputRef}
        role="presentation"
        type="text"
        value={inputText}
      />

      <button
        className={getToggleClassName()}
        disabled={disabled}
        ref={buttonRef}
        type="button"
      >
        {renderToggleIcon(inputText == null || !inputText?.length)}
      </button>
    </>
  );
};

export default Input;
