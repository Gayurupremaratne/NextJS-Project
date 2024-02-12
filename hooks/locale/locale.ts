import { GetLocales } from '@/api/locale/locale';
import { Locale } from '@/types/locale/locale.type';
import { useQuery } from '@tanstack/react-query';

export const useGetLocales = () => {
  return useQuery({
    queryKey: ['locales'],
    queryFn: async () => {
      const response = await GetLocales();
      return response.data as Locale[];
    },
  });
};
