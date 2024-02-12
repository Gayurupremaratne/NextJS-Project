'use client';

import { useDeleteAccountConfirmation } from '@/hooks/delete-account/delete-account';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '../atomic';
import { Snackbar } from '../atomic/Snackbar/Snackbar';

interface DeleteAccountConfirmationProps {
  userId: string;
  token: string;
}

export const DeleteAccountConfirmation = (
  props: DeleteAccountConfirmationProps,
) => {
  const {
    isError,
    error,
    isLoading,
    mutate: deleteRequest,
  } = useDeleteAccountConfirmation();

  const navigation = useRouter();

  return (
    <div>
      <div className="flex items-center justify-center"></div>
      <div className="flex items-center justify-center">
        <div className="w-full h-1 p-4 space-y-5">
          <Snackbar
            intent="error"
            show={isError}
            snackContent={
              isError && isAxiosError(error)
                ? error.response?.data?.message
                : 'Account deletion request failed, please try again.'
            }
          />
          <div className="flex justify-center space-x-4 mx-auto">
            <div>
              <Button
                className="h-9"
                intent={'danger'}
                loading={isLoading}
                onClick={() =>
                  deleteRequest({ userId: props.userId, token: props.token })
                }
                size={'md'}
                type="button"
              >
                <span className="m-auto">Delete account</span>
              </Button>
            </div>
            <div>
              <Button
                className="h-9"
                disabled={isLoading}
                onClick={() => navigation.push('/delete-account')}
                size={'md'}
                type="submit"
              >
                <span className="m-auto">Cancel request</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
