import {
  AddStageMedia,
  AddStageRegion,
  CreateStage,
  DeleteStageMedia,
  EditStage,
  EditStageTranslation,
  GetEditStageMedia,
  GetLiteStages,
  GetStage,
  GetStageById,
  GetStageMedia,
  GetStages,
  GetStageUsersById,
} from '@/api/stages/stages';
import { StageParams } from '@/constants/stageParams';
import {
  AddRegionType,
  AddStageMediaType,
  EditStageType,
  StageLite,
  StageRequest,
  Translation,
} from '@/types/stage/stage.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetStages = (payload: StageParams) => {
  return useQuery({
    queryKey: ['stages'],
    queryFn: async () => {
      const response = await GetStages(payload);
      return response;
    },
  });
};

export const useGetStage = (id: string) => {
  return useQuery({
    queryKey: ['stage', id],
    queryFn: async () => {
      const response = await GetStage(id);
      return response;
    },
  });
};

export const useGetLiteStages = () => {
  return useQuery({
    queryKey: ['lite/stages'],
    queryFn: async (): Promise<StageLite[]> => {
      const response = await GetLiteStages();
      return response.data;
    },
  });
};

export const useCreateStage = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: StageRequest) => {
      const response = await CreateStage(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stages'] });
    },
  });
};

export const useEditStage = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: EditStageType) => {
      const response = await EditStage(id, payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stages'] });
    },
  });
};

export const useEditStageTranslation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Translation) => {
      const response = await EditStageTranslation(payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stages'] });
    },
  });
};

export const useStageRegion = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, regionIds }: AddRegionType) => {
      const response = await AddStageRegion(id, regionIds);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stages'] });
    },
  });
};

export const useGetStageById = (id: string) => {
  return useQuery({
    queryKey: ['stages', id],
    queryFn: async () => {
      const response = await GetStageById(id);
      return response;
    },
  });
};

export const useGetStageMedia = (id: string) => {
  return useQuery({
    queryKey: ['stages media'],
    queryFn: async () => {
      const response = await GetStageMedia(id);
      return response;
    },
  });
};

export const useGetStageUsersById = (
  id: string,
  perPage: number,
  pageNumber: number,
  field?: string,
  value?: string,
  reservedFor?: string,
) => {
  return useQuery({
    queryKey: ['stages users', id],
    queryFn: async () => {
      const response = await GetStageUsersById(
        id,
        perPage,
        pageNumber,
        field,
        value,
        reservedFor,
      );
      return response;
    },
  });
};

export const useGetEditStageMedia = (stageId: string) => {
  return useQuery({
    queryKey: ['stage-media'],
    queryFn: async () => {
      const response = await GetEditStageMedia(stageId);
      return response.data;
    },
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useAddStageMedia = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, mediaKeys }: AddStageMediaType) => {
      const response = await AddStageMedia(id, mediaKeys);
      if (response.data) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stage-media'] });
    },
  });
};

export const useDeleteStageMedia = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await DeleteStageMedia(id);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stage-media'] });
    },
  });
};
