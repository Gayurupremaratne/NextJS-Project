'use client';

import { ComponentProps } from 'react';

type InputLabelProps = ComponentProps<'label'>;

export const InputLabel = ({
  className,
  htmlFor,
  ...props
}: InputLabelProps) => {
  return (
    <label
      className={`text-sm font-normal shades-battleship-grey-shade-2  ${
        className ?? ''
      }`}
      htmlFor={htmlFor}
      {...props}
    />
  );
};
