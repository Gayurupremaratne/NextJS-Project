import {
  CreatePolicy,
  DeletePolicy,
  EditPolicy,
  FindPolicy,
  GetPolicy,
  UpsertPolicyTranslation,
} from '@/api/policies/policy';
import { IPolicy, IPolicyTranslation } from '@/types/policy/policy.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePolicyByIdOrSlug = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['policies', idOrSlug],
    queryFn: async () => {
      const policy = await FindPolicy(idOrSlug);
      return policy;
    },
  });
};

export const useGetPolicies = () => {
  return useQuery({
    queryKey: ['allPolicies'],
    queryFn: async () => {
      const response = await GetPolicy();
      return response.data;
    },
  });
};

export const useDeletePolicy = () => {
  return useMutation(async (id: string) => {
    const response = await DeletePolicy(id);

    if (response.data.statusCode === 200) {
      return response;
    }
  });
};

export const useCreatePolicy = () => {
  const client = useQueryClient();
  return useMutation(
    async (payload: IPolicy) => {
      const response = await CreatePolicy(payload);

      return response;
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['allPolicies'] });
      },
    },
  );
};

export const useEditPolicy = () => {
  return useMutation(async (payload: IPolicy) => {
    const response = await EditPolicy(payload.id as string, payload);

    if (response.status === 200) {
      return response;
    }
  });
};

export const useUpsertPolicyTranslation = () => {
  return useMutation(async (payload: IPolicyTranslation) => {
    const { localeId, policyId, ...rest } = payload;

    const response = await UpsertPolicyTranslation(
      rest,
      policyId as string,
      localeId as string,
    );
    if (response.status === 200) {
      return response;
    }
  });
};
