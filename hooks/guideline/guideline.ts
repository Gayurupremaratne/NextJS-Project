import {
  DeleteGuidelineTranslation,
  GetGuidelines,
  UpdateMetaGuideline,
  UpsertGuidelineTranslation,
} from '@/api/guidelines/guideline';
import {
  GuidelineMeta,
  GuidelineTranslation,
} from '@/types/guidelines/guideline.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetGuidelines = () => {
  return useQuery({
    queryKey: ['guidelines'],
    queryFn: async () => {
      const response = await GetGuidelines();
      return response.data;
    },
  });
};

export const useDeleteGuidelineTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (params: { localeId: string; order: number }) => {
      const response = await DeleteGuidelineTranslation(
        params.localeId,
        params.order,
      );

      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['guidelines'] });
    },
  });
};

export const useUpsertGuidelineTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GuidelineTranslation[]) => {
      const response = await UpsertGuidelineTranslation(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['guidelines'] });
    },
  });
};

export const useUpdateMetaGuidelines = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GuidelineMeta) => {
      const response = await UpdateMetaGuideline(payload);
      return response;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['guidelines'] });
    },
  });
};
