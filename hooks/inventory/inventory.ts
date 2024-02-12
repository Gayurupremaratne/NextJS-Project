import {
  GetInventoriesAllocationByMonth,
  GetInventoriesByMonth,
  GetInventoryReservationForDay,
  UpdateInventoryPassAllocation,
} from '@/api/inventory/inventory';
import {
  InventoryByMonthType,
  InventoryPassAllocation,
  InventoryReservationType,
} from '@/types/inventory/inventory.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetInventoriesByMonth = ({
  stageId,
  month,
  year,
}: InventoryByMonthType) => {
  return useQuery({
    queryKey: ['get-inventories-by-month', stageId, month, year],
    queryFn: async () => {
      const response = await GetInventoriesByMonth({
        stageId: stageId,
        month: month,
        year: year,
      });
      return response;
    },
    enabled: stageId !== '0' && !!month && !!year,
  });
};

export const useGetInventoriesAllocationByMonth = ({
  stageId,
  month,
  year,
}: InventoryByMonthType) => {
  return useQuery({
    queryKey: ['get-inventory-allocation', stageId, month, year],
    queryFn: async () => {
      const response = await GetInventoriesAllocationByMonth({
        stageId: stageId,
        month: month,
        year: year,
      });
      return response;
    },
    enabled: stageId !== '0' && !!month && !!year,
  });
};

export const useGetInventoriesReservation = ({
  stageId,
  startDate,
  endDate,
}: InventoryReservationType) => {
  return useQuery({
    queryKey: ['get-inventory-reservation'],
    queryFn: async () => {
      if (startDate.length < 0 || endDate.length < 0) {
        return;
      }
      const response = await GetInventoryReservationForDay({
        stageId: stageId,
        startDate,
        endDate,
      });
      return response;
    },
    enabled: stageId !== '0',
  });
};

export const useUpdateInventoryPassAllocation = (stageId: string) => {
  return useMutation({
    mutationFn: async (payload: InventoryPassAllocation) => {
      const response = await UpdateInventoryPassAllocation(stageId, payload);
      return response;
    },
  });
};
