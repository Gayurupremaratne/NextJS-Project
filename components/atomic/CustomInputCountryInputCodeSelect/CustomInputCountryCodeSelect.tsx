import React, { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  setCountryCode: (value: string) => void; // Add setCountryCode prop
}

const CustomInputComponent = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    const { value, onChange, setCountryCode, ...rest } = props; // Extract setCountryCode
    setCountryCode(value); // Call setCountryCode with the value

    return (
      <div className="w-1/3">
        <div className={'flex flex-row items-center w-full border-none h-full'}>
          <input
            className="pl-1 rounded-[5px] h-full border-none text-shades-battleship-grey-shade-6 font-sm font-albertSans font-normal focus:outline-none bg-white"
            onChange={onChange}
            ref={ref}
            value={value}
            {...rest}
          />
        </div>
      </div>
    );
  },
);

const customInputComponentWithSetCountryCode =
  (setCountryCode: (value: string) => void) =>
  (
    props: React.JSX.IntrinsicAttributes &
      CustomInputProps &
      React.RefAttributes<HTMLInputElement>,
  ) => <CustomInputComponent {...props} setCountryCode={setCountryCode} />;

export default customInputComponentWithSetCountryCode;
