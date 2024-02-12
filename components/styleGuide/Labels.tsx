'use client';

import React from 'react';
import { Avatar, Chip, Label, Tag, Text } from '../atomic';
import { Aave } from 'iconsax-react';
import sample from '../../public/images/sample.png';

export const Labels = () => {
  return (
    <div className="pt-[80px] pb-10 md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          LABELS & BADGES
        </Text>
      </div>
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-6">
          <Text
            className="text-tints-battleship-grey-tint-3"
            size={'3xl'}
            weight={'normal'}
          >
            Labels
          </Text>
          <div className="flex md:flex-row flex-col gap-24">
            <div className="flex flex-col gap-4">
              <Text size={'md'} weight={'semiBold'}>
                Label types
              </Text>
              <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-3">
                  <Text>Icon left</Text>
                  <Label preIcon={<Aave size={16} />}>Label</Label>
                </div>
                <div className="flex flex-col gap-3">
                  <Text>Icon right</Text>
                  <Label postIcon={<Aave size={16} />}>Label</Label>
                </div>
                <div className="flex flex-col gap-3">
                  <Text>Text only</Text>
                  <Label>Label</Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Text size={'md'} weight={'semiBold'}>
                Tags
              </Text>
              <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-3">
                  <Text>Text only</Text>
                  <Tag>Normal tags</Tag>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Text size={'md'} weight={'semiBold'}>
                Chips
              </Text>
              <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-3">
                  <Text>Text and icon</Text>
                  <Chip>Chip</Chip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Text
            className="text-tints-battleship-grey-tint-3"
            size={'3xl'}
            weight={'normal'}
          >
            Badges
          </Text>
          <div className="flex md:flex-row flex-col gap-24">
            <div className="flex flex-col gap-4">
              <Text size={'md'} weight={'semiBold'}>
                Badge types
              </Text>
              <div className="flex flex-row gap-8">
                <Avatar
                  alt={'sample'}
                  imageUrl={sample}
                  initials={'sample'}
                  size={'sm'}
                />
                <Avatar
                  alt={'sample'}
                  badge
                  badgePosition="bottom"
                  imageUrl={sample}
                  initials={'sample'}
                  size={'sm'}
                />
                <Avatar
                  alt={'sample'}
                  badge
                  badgePosition="bottom"
                  imageUrl={''}
                  initials={'sample'}
                  size={'sm'}
                />
                <Avatar
                  alt={'sample'}
                  badge
                  badgePosition="top"
                  imageUrl={sample}
                  initials={'sample'}
                  number={2}
                  size={'sm'}
                />
                <Avatar
                  alt={'sample'}
                  badge
                  badgePosition="top"
                  imageUrl={''}
                  initials={'sample'}
                  number={2}
                  size={'sm'}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Text size={'md'} weight={'semiBold'}>
                Badge sizes
              </Text>
              <div className="flex flex-row gap-8">
                <Avatar
                  alt={'sample'}
                  imageUrl={sample}
                  initials={'sample'}
                  size={'sm'}
                />
                <Avatar
                  alt={'sample'}
                  imageUrl={sample}
                  initials={'sample'}
                  size={'md'}
                />
                <Avatar
                  alt={'sample'}
                  imageUrl={sample}
                  initials={'sample'}
                  size={'lg'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
