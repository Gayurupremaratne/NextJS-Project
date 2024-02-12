import {
  CreateNotification,
  DeleteNotification,
  EditNotification,
  GetNotificationById,
  GetNotifications,
} from '@/api/notifications/notifications';
import {
  NotificationEditRequest,
  NotificationRequest,
} from '@/types/notifications/notification.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UseParams } from '@/constants/useParams';

export const useCreateNotification = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NotificationRequest) => {
      const response = await CreateNotification(payload);
      if (response.data.statusCode === 201) {
        return response;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });
};

export const useGetNotifications = (payload: UseParams) => {
  return useQuery({
    queryKey: ['allNotifications'],
    queryFn: async () => {
      const response = await GetNotifications(payload);

      return response.data;
    },
  });
};

export const useGetNotificationById = (id: string) => {
  return useQuery({
    queryKey: ['allNotifications', id],
    queryFn: async () => {
      const response = await GetNotificationById(id);
      return response.data;
    },
  });
};

export const useEditNotification = (id: string) => {
  const client = useQueryClient();
  return useMutation(
    async (payload: NotificationEditRequest) => {
      const response = await EditNotification(id, payload);
      if (response.statusCode === 200) {
        return response;
      }
    },
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['allNotifications'] });
      },
    },
  );
};

export const useDeleteNotification = () => {
  const client = useQueryClient();
  return useMutation(
    async (notificationId: string) => {
      const response = await DeleteNotification(notificationId);
      if (response.statusCode === 200) {
        return response;
      }
    },
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['allNotifications'] });
      },
    },
  );
};
