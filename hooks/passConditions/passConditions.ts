import {
  DeletePassConditionTranslation,
  GetPassConditions,
  UpdateMetaPassCondition,
  UpsertPassConditionTranslation,
} from '@/api/passConditions/passConditions';
import {
  PassConditionMeta,
  PassConditionTranslation,
} from '@/types/pass-conditions/pass-condition.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPassConditions = () => {
  return useQuery({
    queryKey: ['passconditions'],
    queryFn: async () => {
      const response = await GetPassConditions();
      return response.data;
    },
  });
};

export const useDeletePassConditionTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (params: { localeId: string; order: number }) => {
      const response = await DeletePassConditionTranslation(
        params.localeId,
        params.order,
      );

      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['passconditions'] });
    },
  });
};

export const useUpsertPassConditionTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PassConditionTranslation[]) => {
      const response = await UpsertPassConditionTranslation(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['passconditions'] });
    },
  });
};

export const useUpdateMetaPassConditions = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PassConditionMeta) => {
      const response = await UpdateMetaPassCondition(payload);
      return response;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['passconditions'] });
    },
  });
};
