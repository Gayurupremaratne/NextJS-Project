import React, { ReactNode } from 'react';
import { Text } from '../atomic';

interface ErrorTextProps {
  children: ReactNode;
}

const ErrorText = ({ children }: ErrorTextProps) => {
  return (
    <Text intent={'red'} size={'sm'}>
      {children}
    </Text>
  );
};

export default ErrorText;
