import {
  ChangeStatusReportedImage,
  GetAllReportedImages,
  GetAllReportedImagesUserData,
} from '@/api/reported-images/reported-images';
import { IReportedImageStatusUpdateRequest } from '@/types/reported-images/reported-images';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllReportedImages = (
  perPage: number,
  pageNumber: number,
  status: string | null,
  sortBy?: string,
) => {
  return useQuery({
    queryKey: ['asset-reports'],
    queryFn: async () => {
      const reportedImages = await GetAllReportedImages(
        perPage,
        pageNumber,
        status,
        sortBy,
      );
      return reportedImages;
    },
  });
};

export const useChangeStatusReportedImage = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IReportedImageStatusUpdateRequest) => {
      const response = await ChangeStatusReportedImage(
        payload.fileKey,
        payload.status,
      );
      if (response.data.statusCode === 200) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['asset-reports'] });
    },
  });
};

export const useGetAllReportedImagesUserData = (
  perPage: number,
  pageNumber: number,
  reportId: string | null,
  sortBy?: string,
) => {
  return useQuery({
    queryKey: ['asset-reports-user-data'],
    queryFn: async () => {
      const reportedImages = await GetAllReportedImagesUserData(
        perPage,
        pageNumber,
        reportId,
        sortBy,
      );
      return reportedImages;
    },
  });
};
