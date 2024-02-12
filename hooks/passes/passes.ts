import { GetPassesByUserId } from '@/api/passes/passes';
import { useQuery } from '@tanstack/react-query';

export const useGetPassesByUserId = (
  id: string,
  perPage: number,
  pageNumber: number,
  type?: string,
) => {
  return useQuery({
    queryKey: ['passes'],
    queryFn: async () => {
      const response = await GetPassesByUserId(id, perPage, pageNumber, type);
      return response;
    },
  });
};
