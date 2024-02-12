import {
  CreatePromotion,
  DeletePromotion,
  EditPromotion,
  EditPromotionTranslation,
  GetPromotion,
  GetPromotions,
} from '@/api/promotions/promotion';
import { UseParams } from '@/constants/useParams';
import {
  PromotionRequest,
  PromotionTranslation,
} from '@/types/promotions/promotion.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPromotions = (payload: UseParams) => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const response = await GetPromotions(payload);
      return response.data;
    },
  });
};

export const useGetPromotion = (id: string) => {
  return useQuery({
    queryKey: ['promotions', id],
    queryFn: async () => {
      const response = await GetPromotion(id);
      return response.data;
    },
  });
};

export const useDeletePromotion = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await DeletePromotion(id);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useCreatePromotion = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PromotionRequest) => {
      const response = await CreatePromotion(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useEditPromotion = (id: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PromotionRequest) => {
      const response = await EditPromotion(id, payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useEditPromotionTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PromotionTranslation) => {
      const response = await EditPromotionTranslation(payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};
