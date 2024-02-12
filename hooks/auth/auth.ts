import { useMutation } from '@tanstack/react-query';
import {
  ForgotPassword,
  GetTokens,
  Login,
  Logout,
  RecoveryCode,
  ResetPassword,
} from '@/api/auth/auth';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useRouter } from 'next/navigation';
import {
  ForgotPasswordPayload,
  LoginPayload,
  RecoveryCodePayload,
  ResetPasswordPayload,
} from '@/types/auth/user';
import { useResetStore } from '@/store/auth/useResetStore';
import { GetMe } from '@/api/users/user';
import {
  defineAbilitiesFor,
  hasAdminPortalAccessPermission,
} from '@/utils/casl/ability';
import { useUserAbilityStore } from '@/store/permission/useUserAbilityStore';

export const useLoginUser = () => {
  const router = useRouter();
  const { clear } = useAuthStore();
  return useMutation(
    async (data: LoginPayload) => {
      let isAdmin = false;
      const response = await Login(data);
      if (response.data.statusCode === 201) {
        useAuthStore.setState({
          isAuthenticated: true,
          accessToken: response.data?.data?.keycloakTokens?.access_token || '',
          expiresIn: response.data?.data?.keycloakTokens?.expires_in || 0,
          user: response.data?.data.userData,
        });
        const meResponse = await GetMe();
        const hasAdminPortalPermission = hasAdminPortalAccessPermission(
          meResponse?.data?.userPermissions,
        );
        if (hasAdminPortalPermission) {
          isAdmin = true;
        } else {
          clear();
        }
      }
      return isAdmin;
    },
    {
      onSuccess: isAdmin => {
        if (isAdmin) {
          router.push('/dashboard');
        }
      },
    },
  );
};

export const useGetTokens = () => {
  const { setAccessToken, setAccessTokenExpiresIn, clear } = useAuthStore();
  return useMutation(async () => {
    const response = await GetTokens();
    if (response.data.statusCode === 201) {
      setAccessToken(response.data?.data?.access_token || '');
      setAccessTokenExpiresIn(response.data?.data?.expires_in || 0);
    } else {
      return clear();
    }
  });
};

export const useLogout = () => {
  const { clear } = useAuthStore();
  const router = useRouter();
  return useMutation(async () => {
    const response = await Logout();

    if (response.status === 201) {
      clear();
      //Remove user abilities to global store
      useUserAbilityStore.setState({
        abilities: defineAbilitiesFor([]),
      });
      router.push('/');
    }
  });
};

export const useForgotPassword = () => {
  const { setStage, setOtp, setEmail } = useResetStore();
  return useMutation(
    async (data: ForgotPasswordPayload) => {
      const response = await ForgotPassword(data);
      return response.data;
    },
    {
      onSuccess(data, variables) {
        if (data.statusCode === 201) {
          setOtp(data.data);
          setEmail(variables.email);
          setStage(2); //  move to the enter recovery code stage
        }
      },
    },
  );
};

export const useRecoveryCode = () => {
  const { setStage, setCode } = useResetStore();
  return useMutation(
    async (data: RecoveryCodePayload) => {
      const response = await RecoveryCode(data);
      return response.data;
    },
    {
      onSuccess(data, variables) {
        if (data.statusCode === 201 && data.data.verified) {
          setCode(variables.code);
          setStage(3); //  move to the enter new password stage
        }
      },
    },
  );
};

export const useResetPassword = () => {
  const { setStage } = useResetStore();

  return useMutation(
    async (data: ResetPasswordPayload) => {
      const response = await ResetPassword(data);
      return response.data;
    },
    {
      onSuccess(data) {
        if (data.statusCode === 201) {
          setStage(4); //  move to the reset successful stage
        }
      },
    },
  );
};
