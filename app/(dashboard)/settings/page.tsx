'use client';

import AccountSettingForm from './form/AccountSettingForm';
import { useGetMe } from '@/hooks/user/user';
import { useEffect, useState } from 'react';
import { UserMe } from '@/types/user/user.type';

const SettingPage = () => {
  const { data: loggedInUserData, refetch } = useGetMe();

  const [accountSettingSuccess, setAccountSettingSuccess] = useState(false);

  const [loggedUser, setLoggedUser] = useState<UserMe>();

  useEffect(() => {
    if (loggedInUserData) {
      setLoggedUser(loggedInUserData.data);
    }
    if (accountSettingSuccess === true) {
      refetch();
      setAccountSettingSuccess(false);
    }
  }, [loggedInUserData, accountSettingSuccess]);

  return (
    <AccountSettingForm
      setAccountSettingSuccess={setAccountSettingSuccess}
      userData={loggedUser as UserMe}
    />
  );
};

export default SettingPage;
