import {
  CreateStory,
  DeleteStory,
  EditStory,
  GetStories,
  GetStoryById,
} from '@/api/stories/story';
import { UseParams } from '@/constants/useParams';
import { Story } from '@/types/stories/story.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetStories = (payload: UseParams) => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const response = await GetStories(payload);
      return response.data;
    },
  });
};

export const useDeleteStory = () => {
  const client = useQueryClient();
  return useMutation(
    async (id: string) => {
      const response = await DeleteStory(id);

      if (response.data.statusCode === 200) {
        return response;
      }
    },
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stories'] });
      },
    },
  );
};

export const useCreateStory = () => {
  return useMutation(async (payload: Story) => {
    const response = await CreateStory(payload);
    if (response.data.statusCode === 201) {
      return response;
    }
  });
};

export const useEditStory = (id: string) => {
  const client = useQueryClient();
  return useMutation(
    async (payload: Story) => {
      const response = await EditStory(id, payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['stories'] });
      },
    },
  );
};

export const useGetStoryById = (id: string, show: boolean) => {
  return useQuery({
    queryKey: ['stories', id],
    queryFn: async () => {
      const response = await GetStoryById(id);
      return response.data;
    },
    enabled: show,
  });
};
