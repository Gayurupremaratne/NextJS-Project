import React, { ChangeEvent, createRef, forwardRef } from 'react';

interface FileInputProps {
  key: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(props => {
  const { key, handleFileChange } = props;

  const ref = createRef<HTMLInputElement>();

  return (
    <input
      accept=".jpg,.jpeg,.png"
      className="hidden"
      id="fileUpload"
      key={key}
      onChange={handleFileChange}
      ref={ref}
      type="file"
    />
  );
});

export default FileInput;
