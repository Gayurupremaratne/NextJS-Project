import { GetRegions } from '@/api/region/region';
import { Region } from '@/types/region/region.type';
import { useQuery } from '@tanstack/react-query';

export const useGetRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const response = await GetRegions();
      return response.data as Region[];
    },
  });
};
