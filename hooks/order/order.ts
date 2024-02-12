import {
  CreateOrder,
  DeleteOrder,
  GetOrdersByStage,
} from '@/api/orders/orders';
import { CreateOrderPayload } from '@/types/order/order.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateOrder = () => {
  return useMutation(async (data: CreateOrderPayload) => {
    const response = await CreateOrder(data);
    return response.data;
  });
};

export const useGetOrdersByStage = (
  stageId: string,
  date: string,
  perPage: number,
  pageNumber: number,
  sortBy: string,
) => {
  return useQuery(['orders-by-stage', stageId, date], async () => {
    const response = await GetOrdersByStage(
      stageId,
      date,
      perPage,
      pageNumber,
      sortBy,
    );
    return response.data;
  });
};

export const useDeleteOrder = () => {
  return useMutation(async (id: string) => {
    const response = await DeleteOrder(id);
    return response.data;
  });
};
