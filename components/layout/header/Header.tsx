'use client';

import { useLogout } from '@/hooks/auth/auth';
import { useGetMe } from '@/hooks/user/user';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useUserAbilityStore } from '@/store/permission/useUserAbilityStore';
import { defineAbilitiesFor } from '@/utils/casl/ability';
import Image from 'next/image';
import { useEffect } from 'react';
import logout from '../../../public/images/icons/logout.svg';
import { Avatar, Button, Text } from '../../atomic';
import { getAvatarInitials } from '../common';

export const Header = () => {
  const { mutate: logoutFn } = useLogout();
  const handleLogout = () => {
    logoutFn();
  };

  const { data, isFetched } = useGetMe();

  useEffect(() => {
    if (isFetched && data?.data?.userPermissions) {
      //Set user abilities to global store
      const abilities = defineAbilitiesFor(data?.data?.userPermissions);
      useUserAbilityStore.setState({
        abilities: abilities,
      });

      useAuthStore.setState({
        userPermissionsFetched: true,
      });
    }
  }, [isFetched]);

  return (
    <header className="z-10 lg:flex h-[68px] hidden fixed bg-white custom-width border-b border-solid border-tints-forest-green-tint-6">
      <div className="pl-10 pr-[52px] w-full self-center">
        <div className="flex gap-x-6 items-center justify-end w-full">
          <div className="flex gap-x-6 items-center">
            {/* Notification bell to be added in the future */}
            {/* <Button intent={'ghost'} size={'ghost'}>
              <Notification
                color={theme.colors.tints['forest-green']['tint-1']}
                size="20"
                variant="Bold"
              />
            </Button> */}
            <div className="flex flex-row items-center">
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
              {isFetched && data && (
                <div className="flex-col text-left ml-[12px]">
                  <Text weight={'semiBold'}>
                    {data.data.apiData.firstName} {data.data.apiData.lastName}
                  </Text>
                  <Text>{data.data.apiData.email}</Text>
                </div>
              )}
            </div>
            <Button intent={'ghost'} onClick={handleLogout} size={'ghost'}>
              <Image alt="logout" height={20} src={logout} width={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
