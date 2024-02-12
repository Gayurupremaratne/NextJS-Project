export interface IReportedImage {
  id: string;
  status: string;
  assetReportUser: IReportedImageUser[];
  fileKey?: string;
  _count: ICountReportedImages;
  updatedAt: string;
}

export interface IGetAllReportedImages {
  perPage: number;
  pageNumber: number;
  status?: string | null;
}

export interface IReportedImageUser {
  user: User;
  reportedDate: string;
}

export interface ICountReportedImages {
  assetReportUser: number;
}

export interface User {
  firstName: string;
  lastName: string;
}

export interface IReportedImageStatusUpdateRequest {
  fileKey: string;
  status: string;
}

export interface IReportUserDetails {
  id: string;
  reportedDate: string;
  comment: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
  assetReportId: string;
  user: User;
}
