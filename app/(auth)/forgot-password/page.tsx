'use client';

import React, { useEffect } from 'react';
import { PageHeader } from '@/components/atomic';
import { AuthHeader } from '@/components/auth-header';
import { ResetForm } from '@/components/reset-form';
import { RecoveryCode } from '@/components/recovery-code';
import { NewPassword } from '@/components/new-password';
import { Button } from '@/components/atomic/Button/Button';
import { useRouter } from 'next/navigation';
import { useResetStore } from '@/store/auth/useResetStore';

const Index = () => {
  const router = useRouter();

  const { stage, clear } = useResetStore();

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return (
    <>
      <PageHeader />
      {stage === 1 && (
        <AuthHeader
          heading="Reset password"
          text="Enter the email linked with your account and we’ll send you a
        code to reset your password."
        >
          <ResetForm />
        </AuthHeader>
      )}
      {stage === 2 && (
        <AuthHeader
          heading="Enter recovery code"
          text="The recovery code was sent to your email."
        >
          <RecoveryCode />
        </AuthHeader>
      )}
      {stage === 3 && (
        <AuthHeader
          heading="Set new password"
          text="This must be at least 8 characters long."
        >
          <NewPassword />
        </AuthHeader>
      )}
      {stage === 4 && (
        <AuthHeader
          heading="Reset successful"
          text="You can now log in to your account using your new password."
        >
          <Button
            className="h-12 mt-10 w-full justify-center mb-80"
            onClick={() => {
              router.push('/');
            }}
          >
            Back to login
          </Button>
        </AuthHeader>
      )}
    </>
  );
};

export default Index;
