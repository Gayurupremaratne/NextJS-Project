import React, { useCallback, useContext } from 'react';

import DatepickerContext from '../contexts/DatepickerContext';
import { theme } from '@/tailwind.config';

interface IconProps {
  className: string;
}

interface Button {
  children: JSX.Element | JSX.Element[];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  roundedFull?: boolean;
  padding?: string;
  active?: boolean;
}

export const DateIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CloseIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 18L18 6M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.75 19.5L8.25 12l7.5-7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DoubleChevronLeftIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DoubleChevronRightIcon: React.FC<IconProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// eslint-disable-next-line react/display-name,@typescript-eslint/ban-types
export const Arrow = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div
      className="absolute z-20 h-4 w-4 rotate-45 mt-0.5 ml-[1.2rem] border-l border-t border-tints-battleship-grey-tint-5 bg-white"
      ref={ref}
    />
  );
});

export const SecondaryButton: React.FC<Button> = ({
  children,
  onClick,
  disabled = false,
}) => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);

  // Functions
  const getClassName: () => string = useCallback(() => {
    const ringColor = theme.colors.tints['battleship-grey']['tint-5'];
    return `w-full transition-all duration-300 bg-white font-medium border border-gray-300 px-4 py-2 text-sm rounded-md focus:ring-2 focus:ring-offset-2 hover:bg-gray-50 ${ringColor}`;
  }, [primaryColor]);

  return (
    <button
      className={getClassName()}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export const PrimaryButton: React.FC<Button> = ({
  children,
  onClick,
  disabled = false,
}) => {
  // Contexts
  const bgColor = theme.colors.tints['forest-green']['tint-1'];
  const borderColor = theme.colors.tints['forest-green']['tint-1'];
  const bgColorHover = theme.colors.tints['forest-green']['tint-1'];
  const ringColor = theme.colors.tints['forest-green']['tint-1'];

  // Functions
  const getClassName = useCallback(() => {
    return `w-full transition-all duration-300 ${bgColor} ${borderColor} text-red font-medium border px-4 py-2 text-sm rounded-md ${bgColorHover} ${ringColor} ${
      disabled ? ' cursor-no-drop' : ''
    }`;
  }, [bgColor, bgColorHover, borderColor, disabled, ringColor]);

  return (
    <button
      className={getClassName()}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export const RoundedButton: React.FC<Button> = ({
  children,
  onClick,
  disabled,
  roundedFull = false,
  padding = 'py-[0.55rem]',
  active = false,
}) => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);

  // Functions
  const getClassName = useCallback(() => {
    const activeClass = active
      ? 'font-semibold bg-tints-forest-green-tint-6'
      : '';
    const defaultClass = !roundedFull
      ? `font-albertSans w-full tracking-wide ${activeClass} transition-all duration-300 px-3 ${padding} uppercase hover:bg-tints-forest-green-tint-6 rounded-[5px] text-md`
      : `${activeClass} transition-all duration-300 hover:bg-tints-forest-green-tint-6 rounded-full p-[0.45rem] text-sm`;
    const buttonFocusColor = theme.colors.tints['battleship-grey']['tint-5'];
    const disabledClass = disabled ? 'line-through' : '';

    return `${defaultClass} ${buttonFocusColor} ${disabledClass}`;
  }, [disabled, padding, primaryColor, roundedFull, active]);

  return (
    <button
      className={getClassName()}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export const VerticalDash = () => {
  return (
    <div
      className={
        'bg-tints-forest-green-tint-1 h-7 w-1 rounded-full hidden md:block'
      }
    />
  );
};
