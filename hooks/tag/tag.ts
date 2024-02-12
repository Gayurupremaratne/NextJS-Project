import {
  CreateTag,
  DeleteTag,
  GetAllTags,
  GetTagById,
  UpdateTagAssociation,
  UpdateTagTranslation,
} from '@/api/tags/tags';
import { UseParams } from '@/constants/useParams';
import { ITagTranslation, IUpdateTagAssociation } from '@/types/tags/tags';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllTags = (params: UseParams) => {
  return useQuery({
    queryKey: ['stage-tags'],
    queryFn: async () => {
      const tags = await GetAllTags(params);

      return tags.data;
    },
  });
};

export const useGetTagById = (stageTagId: string) => {
  return useQuery({
    queryKey: ['stage-tags', stageTagId],
    queryFn: async () => {
      const tag = await GetTagById(stageTagId);
      return tag.data;
    },
  });
};

export const useCreateTag = () => {
  const client = useQueryClient();
  return useMutation(
    async () => {
      const response = await CreateTag();
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stage-tags'] });
      },
    },
  );
};

export const useCreateTagTranslation = () => {
  const client = useQueryClient();
  return useMutation(
    async (tag: ITagTranslation) => {
      const finalTranslation = {
        name: tag.name,
      };
      const response = await UpdateTagTranslation(
        tag.stageTagId!,
        tag.localeId,
        finalTranslation,
      );
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stage-tags'] });
      },
    },
  );
};

export const useCreateTagAssociation = () => {
  const client = useQueryClient();
  return useMutation(
    async (updateTagAssociation: IUpdateTagAssociation) => {
      if (!updateTagAssociation.stageTagId) {
        return;
      }

      const response = await UpdateTagAssociation(
        updateTagAssociation.stageTagId,
        updateTagAssociation.stageIds,
      );
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stage-tags'] });
      },
    },
  );
};

export const useDeleteTag = () => {
  const client = useQueryClient();
  return useMutation(
    async (stageTagId: string) => {
      const response = await DeleteTag(stageTagId);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stage-tags'] });
      },
    },
  );
};
