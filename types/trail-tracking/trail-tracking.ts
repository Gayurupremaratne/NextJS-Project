export interface GetAllUsersTrailSummaryResponse {
  totalCompletedUsers: number;
  totalPartiallyCompleteUsers: number;
  totalNotAttemptedUsers: number;
}

export type TrailByMonthType = {
  stageId: string;
  month: string;
  year: string;
};
