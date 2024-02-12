import { GetAllUsersTrailCompletionSummary } from '@/api/trailTracking/trail-tracking';
import { TrailByMonthType } from '@/types/trail-tracking/trail-tracking';
import { useQuery } from '@tanstack/react-query';

export const useGetAllUsersTrailCompletionSummary = (
  params: TrailByMonthType,
) => {
  return useQuery({
    queryKey: [
      'trail-tracking-summary',
      params.stageId,
      params.month,
      params.year,
    ],
    queryFn: async () => {
      const response = await GetAllUsersTrailCompletionSummary(params);
      return response;
    },
  });
};
