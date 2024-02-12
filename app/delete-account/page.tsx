'use client';

import React, { useEffect } from 'react';
import { Heading, PageHeader, Text } from '@/components/atomic';
import { AuthHeader } from '@/components/auth-header';
import { useDeleteAccountStore } from '@/store/account/useDeleteAccount';
import { DeleteAccountRequestForm } from '@/components/delete-account-request';
import Image from 'next/image';

const Index = () => {
  const { stage, clear } = useDeleteAccountStore();

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
          heading="Account deletion request"
          text="Enter the email address associated with your account. We will send a verification email to confirm your request for account deletion."
        >
          <DeleteAccountRequestForm />
        </AuthHeader>
      )}
      {stage === 2 && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-16">
          <Image
            alt="Success"
            height={48}
            src={'/svg/success.svg'}
            width={48}
          />

          <div className="w-full mx-auto">
            <Heading className="text-center" intent={'h1'} size={'4xl'}>
              Please check your email
            </Heading>
            <Text
              className="mt-4 text-center m-6 mx-auto sm:w-[500px]"
              size={'md'}
            >
              We have sent a verification email to confirm your request for
              account deletion. Please check your email and follow the
              instructions to delete your account.
            </Text>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
