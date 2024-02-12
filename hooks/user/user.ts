import {
  CreateUser,
  GetAllUsers,
  GetMe,
  GetUserById,
  GetUsersByEmail,
  GetUsersByRole,
  GetUserTrailTrackingStages,
  GetUserTrailTrackingSummary,
  UpdatePassword,
  UpdateUser,
} from '@/api/users/user';
import { UseParams } from '@/constants/useParams';
import {
  UpdateUserPayload,
  UserChangePasswordPayload,
  UserEmail,
  UserPayload,
} from '@/types/user/user.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllUsers = (params: UseParams) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await GetAllUsers(params);
      return response;
    },
  });
};

export const useGetUsersByRole = (roleId: number, params: UseParams) => {
  return useQuery({
    queryKey: ['users', 'role', roleId],
    queryFn: async () => {
      const response = await GetUsersByRole(roleId, params);
      return response;
    },
  });
};

export const useCreateUser = () => {
  return useMutation(async (data: UserPayload) => {
    const response = await CreateUser(data);
    return response;
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation(
    async (data: UpdateUserPayload) => {
      const response = await UpdateUser(data);

      return response;
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['users'] });
      },
    },
  );
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await GetMe();
      return response;
    },
  });
};

export const useGetUsersByEmail = (email: string) => {
  return useQuery({
    queryKey: ['users', 'email', email],
    queryFn: async () => {
      if (email.length < 3) {
        return Promise.resolve([]);
      }
      const response = await GetUsersByEmail(email);

      const data = response.data.data.map((item: UserEmail) => {
        return {
          id: item.id,
          name: item.firstName + ' ' + item.lastName + ' - ' + item.email,
        };
      });

      return data;
    },
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await GetUserById(id);
      return response;
    },
  });
};

export const useGetUserTrailTrackingSummary = (id: string) => {
  return useQuery({
    queryKey: ['user-trail-summary'],
    queryFn: async () => {
      const response = await GetUserTrailTrackingSummary(id);
      return response;
    },
  });
};

export const useGetUserTrailTrackingStages = (
  id: string,
  perPage: number,
  pageNumber: number,
  type?: string,
) => {
  return useQuery({
    queryKey: ['user-trail-summary', 'stages'],
    queryFn: async () => {
      const response = await GetUserTrailTrackingStages(
        id,
        perPage,
        pageNumber,
        type,
      );
      return response;
    },
  });
};

export const useChangePassword = () => {
  return useMutation(async (data: UserChangePasswordPayload) => {
    const response = await UpdatePassword(data);
    return response;
  });
};
