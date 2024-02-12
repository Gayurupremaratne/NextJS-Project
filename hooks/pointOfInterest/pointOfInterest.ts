import {
  CreatePointOfInterest,
  DeletePointOfInterest,
  GetPointOfInterests,
  UpdatePointOfInterest,
} from '@/api/pointOfInterests/pointOfInterest';
import { UseParams } from '@/constants/useParams';
import { PointOfInterestRequest } from '@/types/pointOfInterests/pointOfInterest.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPointOfInterests = (payload: UseParams) => {
  return useQuery({
    queryKey: ['pointOfInterests'],
    queryFn: async () => {
      const response = await GetPointOfInterests(payload);
      return response.data;
    },
  });
};

export const useCreatePointOfInterest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PointOfInterestRequest) => {
      const response = await CreatePointOfInterest(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['pointOfInterests'] });
    },
  });
};

export const useEditPointOfInterest = (id: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PointOfInterestRequest) => {
      const response = await UpdatePointOfInterest(id, payload);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['pointOfInterests'] });
    },
  });
};

export const useDeletePointOfInterest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await DeletePointOfInterest(id);
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['pointOfInterests'] });
    },
  });
};
