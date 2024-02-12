'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { GetMe } from '@/api/users/user';
import { hasAdminPortalAccessPermission } from '@/utils/casl/ability';

interface IProps {
  children: React.JSX.Element;
}

const ProtectedRoute: React.FC<IProps> = ({ children }: IProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore.getState();

  const [showProtectedPage, setShowProtectedPage] = useState(false);

  const fetchData = async () => {
    if (isAuthenticated) {
      const response = await GetMe();
      const hasAdminPortalPermission = hasAdminPortalAccessPermission(
        response?.data?.userPermissions,
      );
      if (hasAdminPortalPermission) {
        setShowProtectedPage(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  return <>{showProtectedPage && children}</>;
};

export default ProtectedRoute;
