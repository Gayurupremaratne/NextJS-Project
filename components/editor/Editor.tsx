import React, { memo, useEffect, useRef } from 'react';
import EditorJS, { OutputData, ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Underline from '@editorjs/underline';
import _ from 'lodash';

type EditorProps = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  placeholder?: string;
};

const Editor = ({ data, onChange, holder, placeholder }: EditorProps) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        inlineToolbar: ['bold', 'italic', 'underline'],
        tools: {
          header: {
            // eslint-disable-next-line
            class: Header as unknown as ToolConstructable,
            config: {
              levels: [1, 2, 3],
              defaultLevel: 1,
            },
            inlineToolbar: ['bold', 'italic', 'underline'],
          },
          underline: Underline,
        },
        hideToolbar: false,
        data,
        async onChange(api, _event) {
          const params = await api.saver.save();
          onChange(params);
        },
        placeholder: placeholder,
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="prose border-tints-battleship-grey-tint-6 border-[1px] w-full rounded-[5px] px-[14px] py-[8px]"
      id={holder}
    />
  );
};

export default memo(Editor);
