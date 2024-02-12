'use client';

import { useGetMe } from '@/hooks/user/user';
import { useMenuStore } from '@/store/menu/useMenuStore';
import { CloseCircle, HambergerMenu } from 'iconsax-react';
import _ from 'lodash';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../../public/images/logo.svg';
import { Avatar, Button, Text } from '../atomic';
import ListItem from './common/ListItem';
import { useLogout } from '@/hooks/auth/auth';
import { useUserAbilityStore } from '@/store/permission/useUserAbilityStore';
import { defineAbilitiesFor } from '@/utils/casl/ability';
import logout from '../../public/images/icons/logout.svg';
import { getAvatarInitials } from './common';

export const SideBar = () => {
  const [ariaHidden, setAriaHidden] = useState(true);
  const [ariaModal, setAriaModal] = useState(false);
  const { menu } = useMenuStore();
  const path = usePathname();
  const asideRef = useRef<HTMLDivElement | null>(null);
  const [updatedMenu, setUpdatedMenu] = useState(menu);

  const { data, isFetched } = useGetMe();

  const toggleAriaHidden = () => {
    setAriaHidden(!ariaHidden);
    setAriaModal(!ariaModal);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        asideRef.current &&
        !asideRef.current.contains(event.target as Node)
      ) {
        setAriaHidden(true);
        setAriaModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Update menu for selected items
    const selectedMenu = menu.map(item => {
      if (item.routeTo == path) {
        item.selected = true;
      } else {
        item.selected = false;
      }

      if (!_.isEmpty(item?.subMenuItems)) {
        let selectItem = false;
        //update sub menu
        item.subMenuItems?.forEach(subItem => {
          if (subItem.routeTo === path) {
            subItem.selected = true;
            selectItem = true;
          } else {
            subItem.selected = false;
          }
        });

        item.expanded = selectItem;
        item.selected = selectItem;
      }
      return item;
    });
    setUpdatedMenu([...selectedMenu]);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const memoizedImage = useMemo(() => {
    return <Image alt="logo" height={82} src={logo} width={114} />;
  }, []);

  const { mutate: logoutFn } = useLogout();
  const handleLogout = () => {
    logoutFn();

    //Remove user abilities to global store
    useUserAbilityStore.setState({
      abilities: defineAbilitiesFor([]),
    });
  };

  return (
    <>
      <div className="flex lg:hidden px-5 py-3 border-b border-solid border-tints-forest-green-tint-6 z-50">
        <Button
          className={'lg:hidden'}
          intent={'ghost'}
          onClick={toggleAriaHidden}
          preIcon={<HambergerMenu />}
          size={'ghost'}
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex flex-row items-center justify-between w-full gap-2 ml-4">
          {/* Notification bell to be added in the future */}
          {/* <Button intent={'ghost'} size={'ghost'}>
            <Notification
              color={theme.colors.tints['forest-green']['tint-1']}
              size="20"
              variant="Bold"
            />
          </Button> */}
          {isFetched && data && (
            <>
              <div className="flex items-center">
                <Button intent={'ghost'} size={'ghost'}>
                  <Avatar
                    alt={'Profile Picture'}
                    imageUrl={
                      data?.data.apiData.profileImageKey &&
                      `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${data?.data.apiData.profileImageKey}`
                    }
                    initials={getAvatarInitials(
                      data?.data.apiData.firstName,
                      data?.data.apiData.lastName,
                    )}
                  />
                </Button>
                <div className="flex-col text-left ml-2">
                  <Text weight={'semiBold'}>
                    {data.data.apiData.firstName} {data.data.apiData.lastName}
                  </Text>
                  <Text>{data.data.apiData.email}</Text>
                </div>
              </div>
              <Button intent={'ghost'} onClick={handleLogout} size={'ghost'}>
                <Image alt="logout" height={20} src={logout} width={20} />
              </Button>
            </>
          )}
        </div>
      </div>
      <aside
        aria-hidden={ariaHidden}
        aria-label="Sidebar"
        aria-modal={ariaModal}
        className={`flex flex-col z-50 xl:w-64 lg:w-56 md:w-64 fixed h-screen top-0 bg-white border border-solid border-tints-forest-green-tint-6 transition-transform lg:translate-x-0  ${
          ariaHidden ? '-translate-x-full' : '-translate-none'
        }`}
        id="default-sidebar"
        ref={asideRef}
        role="dialog"
      >
        <div className="flex flex-col flex-grow overflow-y-auto gap-y-9 my-8">
          <div className="flex justify-center w-full bg-white z-50">
            {memoizedImage}
          </div>
          <div className="flex flex-col pt-5 z-10 overflow-auto">
            {!_.isEmpty(updatedMenu) && (
              <nav>
                <ul className="relative m-0 list-none space-y-5 xl:px-6 px-2">
                  {updatedMenu.map(item => {
                    return <ListItem key={item.name} listItem={item} />;
                  })}
                </ul>
              </nav>
            )}
          </div>
          {ariaModal && (
            <div
              className="cursor-pointer absolute top-2 right-2 lg:hidden"
              onClick={toggleAriaHidden}
            >
              <CloseCircle size="20" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
