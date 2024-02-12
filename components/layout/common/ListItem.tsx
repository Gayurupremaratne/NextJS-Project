'use client';

import React, { useCallback } from 'react';
import _ from 'lodash';
import {
  IMenuItem,
  ISubMenuItem,
  useMenuStore,
} from '@/store/menu/useMenuStore';
import { useRouter } from 'next/navigation';
import * as icons from 'iconsax-react';
import { Tooltip } from 'react-tooltip';

export interface ListItemProps {
  listItem: IMenuItem;
}

const getMenuIcon = (iconName: string, variant: icons.IconProps['variant']) => {
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent ? <IconComponent size="32" variant={variant} /> : null;
};

const ListItem = ({ listItem }: ListItemProps) => {
  const { menu, setMenu } = useMenuStore(state => state);
  const router = useRouter();

  const menuHandler = useCallback(() => {
    if (!_.isEmpty(listItem?.subMenuItems)) {
      const updatedMenu = menu.map(item => {
        if (item.name === listItem.name) {
          item.expanded = !item.expanded;
          item.selected = !item.selected;
        }
        return item;
      });
      setMenu([...updatedMenu]);
    } else if (listItem.routeTo) {
      const updatedMenu = menu.map(item => {
        if (item.name === listItem.name) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        if (!_.isEmpty(item?.subMenuItems)) {
          item.subMenuItems?.forEach(subItem => {
            subItem.selected = false;
          });
        }
        return item;
      });
      setMenu([...updatedMenu]);
      return router.push(listItem.routeTo);
    }
  }, []);

  const subMenuHandler = useCallback((subMenuItem: ISubMenuItem) => {
    const updatedMenu = menu.map(item => {
      if (item.name === listItem.name) {
        item.expanded = true;
        item.selected = true;
      } else {
        item.selected = false;
      }

      if (!_.isEmpty(item?.subMenuItems)) {
        item.subMenuItems?.forEach(subItem => {
          if (subMenuItem.name === subItem.name) {
            subItem.selected = true;
          } else {
            subItem.selected = false;
          }
        });
      }
      return item;
    });
    setMenu([...updatedMenu]);
    return router.push(subMenuItem.routeTo);
  }, []);

  return (
    <li className="relative">
      <div
        className={`flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-md font-semibold text-shades-jungle-green-shade-6 outline-none transition duration-300 ease-linear hover:bg-tints-forest-green-tint-6 hover:text-tints-forest-green-tint-1 hover:text-inherit hover:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none ${
          listItem?.selected && listItem?.expanded
            ? 'text-tints-forest-green-tint-1 text-inherit outline-none'
            : listItem?.selected && _.isEmpty(listItem?.subMenuItems)
            ? 'bg-tints-forest-green-tint-6 text-tints-forest-green-tint-1 text-inherit outline-none'
            : ''
        }`}
        onClick={menuHandler}
      >
        <span className="mr-2 [&>svg]:h-5 [&>svg]:w-5 transition duration-75">
          {getMenuIcon(listItem.icon, listItem?.selected ? 'Bold' : 'Linear')}
        </span>
        <span className="flex content-between justify-between grow">
          {listItem.name}
          {!_.isEmpty(listItem?.subMenuItems) && (
            <icons.ArrowDown2
              aria-hidden="true"
              className="h-5 w-5 active:text-shades-forest-green-shade-1 hover:text-shades-forest-green-shade-1"
            />
          )}
        </span>
      </div>
      {!_.isEmpty(listItem?.subMenuItems) && listItem.expanded && (
        <div className="flex flex-col">
          <ul className="border-l-2 border-tints-forest-green-tint-6 ml-[25px]">
            {listItem.subMenuItems &&
              listItem?.subMenuItems.map(item => {
                return (
                  <li key={item.name}>
                    <div
                      className={`flex h-12 cursor-pointer items-center truncate rounded-[5px] px-4 py-4 text-[0.875rem] text-md font-semibold text-shades-jungle-green-shade-6 outline-none transition duration-300 ease-linear hover:text-tints-forest-green-tint-1 hover:text-inherit hover:outline-none focus:bg-tints-forest-green-tint-6 focus:text-inherit focus:outline-none  active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none ${
                        item.selected
                          ? 'text-tints-forest-green-tint-1 text-inherit outline-none'
                          : ''
                      }`}
                      data-tooltip-content={item.name}
                      data-tooltip-id={item.name}
                      data-tooltip-place="top-end"
                      onClick={() => subMenuHandler(item)}
                    >
                      {item.name}
                    </div>
                    <Tooltip id={item.name} />
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ListItem;
