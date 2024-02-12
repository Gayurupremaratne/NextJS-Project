'use client';

import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { cva } from 'class-variance-authority';
import { TabsProps } from './interface';
import _ from 'lodash';

export const Tabs = ({
  tabData,
  intent = 'Primary',
  tabIndex,
  formikProps,
  initialSelected,
  disabledIndex,
}: TabsProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [errors, setErrors] = useState<string | [] | null>(null);

  useEffect(() => {
    if (initialSelected) {
      setSelectedTabIndex(initialSelected);
    }
  }, [initialSelected]);
  useEffect(() => {
    if (tabIndex) {
      tabIndex(selectedTabIndex);
    }
  }, [selectedTabIndex]);

  useEffect(() => {
    setErrors(formikProps!);
  }, [formikProps]);

  const tabStyles = cva(
    `flex h-9 font-albertSans text-md font-semibold leading-5 !m-0 px-4 ${
      intent === 'Primary'
        ? 'rounded-[5px] text-tints-forest-green-tint-1'
        : 'text-shades-battleship-grey-shade-2'
    } outline-none`,
    {
      variants: {
        selected: {
          true: `${
            intent === 'Primary' ? 'bg-tints-forest-green-tint-6' : 'bg-white'
          } ${
            intent === 'Primary'
              ? 'border border-solid border-tints-forest-green-tint-1'
              : 'border-b border-solid border-tints-forest-green-tint-1'
          }`,
          false: `${
            intent === 'Primary'
              ? 'text-tints-forest-green-tint-1  border border-solid border-white'
              : 'border-b border-solid border-shades-battleship-grey-shade-1'
          } ${
            intent === 'Primary' && 'border border-solid border-white'
          } bg-white`,
        },
        hover: {
          true: `${
            intent === 'Primary' && 'hover:bg-tints-forest-green-tint-6'
          } ${
            intent === 'Primary'
              ? 'hover:text-tints-forest-green-tint-1'
              : 'hover:text-shades-forest-green-shade-6'
          }`,
        },
      },
      defaultVariants: {
        selected: false,
        hover: false,
      },
    },
  );

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group
        onChange={setSelectedTabIndex}
        selectedIndex={selectedTabIndex}
      >
        <Tab.List className="flex space-x-1 mb-5">
          {tabData.map((tab, index) => (
            <Tab
              className={`${tabStyles({
                selected: index === selectedTabIndex,
                hover: !(
                  Array.isArray(errors) &&
                  errors?.length > 0 &&
                  errors[index]
                ),
              })}
              ${
                index === 0 &&
                (intent === 'Primary' ? '' : 'text-left !p-0 mr-2')
              }
              ${
                index === tabData.length - 1 &&
                (intent === 'Primary' ? '' : 'text-right !p-0')
              }
              ${index > 0 && index < tabData.length - 1 ? 'text-center' : ''}
              ${
                Array.isArray(errors) && errors?.length > 0 && errors[index]
                  ? 'text-snacks-borders-error border-b border-solid border-snacks-borders-error'
                  : index === selectedTabIndex
                  ? 'text-shades-forest-green-shade-1'
                  : 'text-tints-battleship-grey-tint-1'
              }
              ${
                errors &&
                typeof errors === 'string' &&
                index === 0 &&
                'text-snacks-borders-error border-b border-solid border-snacks-borders-error'
              }
              `}
              disabled={initialSelected === 0 || disabledIndex === index}
              key={index}
              onClick={() => {
                setSelectedTabIndex(index);
              }}
            >
              <div className="!mr-8 md:m-0 ml-0 -m-2">{tab.title}</div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabData.map((tab, idx) => (
            <Tab.Panel
              className="rounded-xl bg-white focus:outline-none"
              key={idx}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
