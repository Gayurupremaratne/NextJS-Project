import { AxiosResponse as Response } from 'axios';

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface JsonRequest<T> {
  statusCode: number;
  data: T;
}

export type SidebarNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  icon?: React.JSX.Element;
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface JsonResponse<T> {
  message?: string;
  data: T;
  statusCode?: number;
}

export interface AxiosResponse<T> extends Response<JsonResponse<T>> {}

export type ErrorState = {
  has: boolean;
  message: string;
};

export const initialErrorState: ErrorState = {
  has: false,
  message: '',
};
