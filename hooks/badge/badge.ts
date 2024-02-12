import {
  AssignBadgeToUser,
  CreateBadge,
  DeleteAssignBadgeToUser,
  DeleteBadge,
  GetAllBadges,
  GetAllBadgesEn,
  GetBadgeById,
  GetBadgeByUserId,
  UpdateBadge,
} from '@/api/badges/badge';
import { UseParams } from '@/constants/useParams';
import { IAssignBadgeToUser, ICreateBadge } from '@/types/badge/badge.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllBadges = (payload: UseParams) => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const badges = await GetAllBadges(payload);
      return badges;
    },
  });
};

export const useGetAllBadgesEn = (payload: UseParams) => {
  return useQuery({
    queryKey: ['badgesEn'],
    queryFn: async () => {
      const badges = await GetAllBadgesEn(payload);
      return badges.data;
    },
  });
};

export const useGetBadgeById = (badgeId: string) => {
  return useQuery({
    queryKey: ['badges', badgeId],
    queryFn: async () => {
      const badge = await GetBadgeById(badgeId);
      return badge.data;
    },
  });
};

export const useCreateBadge = () => {
  const client = useQueryClient();
  return useMutation(
    async (badge: ICreateBadge) => {
      const response = await CreateBadge(badge);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['badgesEn'] });
      },
    },
  );
};

export const useUpdateBadge = (id: string) => {
  const client = useQueryClient();
  return useMutation(
    async (badge: ICreateBadge) => {
      const response = await UpdateBadge(id, badge);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['badgesEn'] });
      },
    },
  );
};

export const useDeleteBadge = () => {
  const client = useQueryClient();
  return useMutation(
    async (badgeId: string) => {
      const response = await DeleteBadge(badgeId);
      if (response.data.statusCode === 200) {
        return response.data;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['badgesEn'] });
      },
    },
  );
};

export const useGetBadgeByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['badges user'],
    queryFn: async () => {
      const badge = await GetBadgeByUserId(userId);
      return badge;
    },
  });
};

export const useAssignBadgeToUser = () => {
  return useMutation(async (data: IAssignBadgeToUser) => {
    const response = await AssignBadgeToUser(data.badgeId, data.userId);
    return response;
  });
};

export const useDeleteAssignBadgeToUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await DeleteAssignBadgeToUser(id);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['user badges delete'] });
    },
  });
};
