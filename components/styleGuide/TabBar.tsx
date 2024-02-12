'use client';

import { Tabs, Text } from '../atomic';

export const TabBar = () => {
  const tabData = [
    {
      title: 'Tab 1',
      content: <h1>Content for Tab 1</h1>,
    },
    {
      title: 'Tab 2',
      content: 'Content for Tab 2',
    },
    {
      title: 'Tab 3',
      content: 'Content for Tab 3',
    },
  ];

  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          TABBAR
        </Text>
      </div>
      <div className="flex md:flex-row flex-col gap-20">
        <div className="flex flex-col gap-6">
          <Text
            className="text-tints-battleship-grey-tint-3"
            size={'3xl'}
            weight={'normal'}
          >
            Main
          </Text>
          <Tabs intent="Primary" tabData={tabData} tabIndex={() => {}} />
        </div>
        <div className="flex flex-col gap-6">
          <Text
            className="text-tints-battleship-grey-tint-3"
            size={'3xl'}
            weight={'normal'}
          >
            Secondary
          </Text>
          <Tabs intent="Secondary" tabData={tabData} tabIndex={() => {}} />
        </div>
      </div>
    </div>
  );
};
