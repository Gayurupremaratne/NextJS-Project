'use client';
import React, { forwardRef } from 'react';
import {
  Input,
  InputContainer,
  InputContainerProps,
  InputLabel,
  InputProps,
} from './common';

interface TextInputProps extends InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  container?: InputContainerProps;
  label?: string;
}

// Apply forwardRef directly to the TextInput component
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { value, onChange, container, label, ...inputProps }: TextInputProps,
    ref,
  ) => (
    <>
      {label && <InputLabel>{label}</InputLabel>}
      <InputContainer {...container}>
        <Input
          onChange={onChange}
          type="text"
          value={value}
          {...inputProps}
          ref={ref}
        />
      </InputContainer>
    </>
  ),
);
