import {
  GetCancelledPassesReport,
  GetClosedStagesSummaryReport,
  GetDownloadableCancelledPassesReport,
  GetDownloadableClosedStagesSummaryReport,
  GetDownloadableStageSummaryReport,
  GetDownloadableStageWiseSummaryReport,
  GetStagePassesSummaryReport,
  GetStageWiseSummaryReport,
} from '@/api/reports/reports';
import {
  ClosedStagesSummaryData,
  StageSummaryReportResponse,
} from '@/types/report/report.type';
import { useQuery } from '@tanstack/react-query';

export const useGetStageWiseSummaryReport = (
  stageId: string,
  reservedFor: string,
) => {
  return useQuery(
    ['stage-wise-summary-report'],
    async () => {
      const response = await GetStageWiseSummaryReport(stageId, reservedFor);
      return response;
    },
    { enabled: false },
  );
};

export const useGetDownloadableStageWiseSummaryReport = (
  stageId: string,
  reservedFor: string,
) => {
  return useQuery(
    ['downloadable-stage-wise-summary-report'],
    async () => {
      const response = await GetDownloadableStageWiseSummaryReport(
        stageId,
        reservedFor,
      );
      return response;
    },
    { enabled: false },
  );
};

export const useGetStagePassesSummaryReport = (
  reservedForStartDate: string,
  reservedForEndDate: string,
) => {
  return useQuery({
    queryKey: ['get-stage-passes-summary-report'],
    queryFn: async () => {
      const response: StageSummaryReportResponse =
        await GetStagePassesSummaryReport(
          reservedForStartDate,
          reservedForEndDate,
        );

      response.data.push({
        id: 'total_passes',
        stageNumber: 0,
        stageName: 'Total passes',
        inventoryQuantity: response.summary.totalInventoryQuantityForDay,
        passQuantity: response.summary.totalPassQuantityForDay,
        remainingQuantity: response.summary.totalRemainingQuantityForDay,
      });
      return response.data;
    },
  });
};

export const useGetDownloadableStageSummaryReport = (
  reservedForStartDate: string,
  reservedForEndDate: string,
) => {
  return useQuery(
    ['downloadable-stage-passes-summary-report'],
    async () => {
      const response = await GetDownloadableStageSummaryReport(
        reservedForStartDate,
        reservedForEndDate,
      );
      return response;
    },
    { enabled: false },
  );
};

export const useGetCancelledPassesReport = (
  stageId: string,
  reservedFor: string,
) => {
  return useQuery(
    ['cancelled-passes-report'],
    async () => {
      const response = await GetCancelledPassesReport(stageId, reservedFor);
      return response;
    },
    { enabled: false },
  );
};

export const useGetDownloadableCancelledPassesReport = (
  stageId: string,
  reservedFor: string,
) => {
  return useQuery(
    ['downloadable-cancelled-passes-report'],
    async () => {
      const response = await GetDownloadableCancelledPassesReport(
        stageId,
        reservedFor,
      );
      return response;
    },
    { enabled: false },
  );
};

export const useGetClosedStagesSummaryReport = (
  closedStartDate: string,
  closedEndDate: string,
  orderBy?: string,
) => {
  return useQuery({
    queryKey: [
      'closed-stages-summary-report',
      closedStartDate,
      closedEndDate,
      orderBy,
    ],
    queryFn: async () => {
      const response: ClosedStagesSummaryData[] =
        await GetClosedStagesSummaryReport(
          closedStartDate,
          closedEndDate,
          orderBy,
        );

      return response;
    },
  });
};

export const useGetDownloadableClosedStagesSummaryReport = (
  closedStartDate: string,
  closedEndDate: string,
) => {
  return useQuery(
    ['downloadable-closed-stages-summary-report'],
    async () => {
      const response = await GetDownloadableClosedStagesSummaryReport(
        closedStartDate,
        closedEndDate,
      );
      return response;
    },
    { enabled: false },
  );
};
