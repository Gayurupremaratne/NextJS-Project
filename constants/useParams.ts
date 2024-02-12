export interface SortParams {
  field: string;
}

export interface UseParams {
  perPage?: number;
  pageNumber: number;
  search?: string;
  sortBy?: string;
  status?: string;
  stages?: number | string | null;
}
