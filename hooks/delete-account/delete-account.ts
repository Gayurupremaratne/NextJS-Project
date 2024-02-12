import {
  DeleteAccountConfirmation,
  DeleteAccountRequest,
} from '@/api/delete-account/delete-account';
import { useDeleteAccountStore } from '@/store/account/useDeleteAccount';
import { useDeleteAccountConfirmationStore } from '@/store/account/useDeleteAccountConfirmation';
import {
  AccountDeleteConfirm,
  AccountDeleteConfirmResponse,
} from '@/types/account-delete/account-delete.confirm.type';
import {
  AccountDeleteReqData,
  AccountDeleteRequest,
} from '@/types/account-delete/account-delete.request.type';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const useDeleteAccountRequest = (): UseMutationResult<
  AccountDeleteRequest,
  unknown,
  AccountDeleteReqData,
  unknown
> => {
  const { setStage, setEmail } = useDeleteAccountStore();
  return useMutation(
    async (data: { email: string }) => {
      const response = await DeleteAccountRequest(data);
      return response;
    },
    {
      onSuccess(data, variables) {
        if (data.statusCode === 201) {
          setEmail(variables.email);
          setStage(2); //  move to the email sent confirmation stage
        }
      },
    },
  );
};

export const useDeleteAccountConfirmation = (): UseMutationResult<
  AccountDeleteConfirmResponse,
  unknown,
  AccountDeleteConfirm,
  unknown
> => {
  const { setStage } = useDeleteAccountConfirmationStore();
  return useMutation(
    async (data: { userId: string; token: string }) => {
      const response = await DeleteAccountConfirmation(data);
      return response;
    },
    {
      onSuccess(data) {
        if (data.statusCode === 201) {
          setStage(2); //  move to the email sent confirmation stage
        }
      },
    },
  );
};
