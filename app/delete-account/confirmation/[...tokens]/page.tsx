'use client';

import React, { useEffect } from 'react';
import { Heading, PageHeader, Text } from '@/components/atomic';
import { AuthHeader } from '@/components/auth-header';
import Image from 'next/image';
import { useDeleteAccountConfirmationStore } from '@/store/account/useDeleteAccountConfirmation';
import { DeleteAccountConfirmation } from '@/components/delete-account-confirmation';

interface PageProps {
  params: {
    tokens: string[];
  };
}

const Index = ({ params }: PageProps) => {
  const { stage, clear } = useDeleteAccountConfirmationStore();

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
          heading="Are you sure you want to delete your account?"
          text="This action is irreversible and all your data will be permanently deleted."
        >
          <DeleteAccountConfirmation
            token={params.tokens[2]}
            userId={params.tokens[0]}
          />
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
              Account deletion request confirmed
            </Heading>
            <Text
              className="mt-4 text-center m-6 mx-auto sm:w-[500px]"
              size={'md'}
            >
              Your request has been received and is now being processed by our
              team. We will reach out to you soon to guide you through the final
              steps of account removal.
            </Text>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
