'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/atomic';
import LoginForm from '@/components/login-form/LoginForm';
import { AuthHeader } from '@/components/auth-header';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/useAuthStore';

const Index = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore.getState();

  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setShowPage(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      {showPage && (
        <>
          <PageHeader />
          <AuthHeader
            heading="Welcome back"
            text="Login to your account to continue."
          >
            <LoginForm />
          </AuthHeader>
        </>
      )}
    </>
  );
};

export default Index;
