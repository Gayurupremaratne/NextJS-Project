'use client';

import React, { useState } from 'react';

import dynamic from 'next/dynamic';
import { Text } from '../atomic';
import { OutputData } from '@editorjs/editorjs';

const Editor = dynamic(() => import('../../components/editor/Editor'), {
  ssr: false,
});

export const RichTextEditor = () => {
  const [data, setData] = useState<OutputData>();
  return (
    <div className="pt-[80px] px-14 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          Editor
        </Text>
      </div>
      <div className="flex justify-center w-full">
        <div className="w-full">
          <Editor
            data={data}
            holder="editorjs-container"
            onChange={setData}
            placeholder="Policy content here"
          />
        </div>
      </div>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
};
