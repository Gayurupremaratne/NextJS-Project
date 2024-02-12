import { UserResponse } from '../user/user.type';

export interface StageWiseSummaryReportRecord {
  bookingDate: Date;

  expiredAt?: Date;

  user: UserResponse;

  orderId?: string;

  userId?: string;

  stageId: string;

  reservedFor: Date;

  passCount: number;
}

export interface StageWiseSummaryReportUser {
  id?: string;
  lastName: string;
  firstName: string;
  nationalityCode: string;
}

export interface StageWiseSummaryReportDto {
  bookingDate?: Date;
  user: StageWiseSummaryReportUser;
  stageId?: string;
  reservedFor?: Date;
  passCount: number;
}

export interface StageSummaryReportResponse {
  summary: {
    totalInventoryQuantityForDay: number;
    totalPassQuantityForDay: number;
    totalRemainingQuantityForDay: number;
  };
  data: Array<StageSummaryData>;
}

export interface StageSummaryData {
  id: string;
  stageNumber: number;
  stageName: string;
  inventoryQuantity: number;
  passQuantity: number;
  remainingQuantity: number;
}

export interface CancelledPassRecord {
  cancelledDate?: Date;
  passesCount: number;
  user: CancelledUser;
}

export interface CancelledUser {
  id?: string;
  lastName: string;
  firstName: string;
  nationalityCode: string;
}

export interface ClosedStagesSummaryData {
  stageId: string;
  stageNumber: number;
  stageHead: string;
  stageTail: string;
  closedDate: Date;
  closeReason: string;
}
