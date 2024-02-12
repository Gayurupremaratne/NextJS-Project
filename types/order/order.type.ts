import { UserResponse } from '../user/user.type';

export interface PassCount {
  adults: number | string;
  children: number | string;
}

export interface CreateOrderPayload {
  stageId: string;
  reservedFor: string;
  userId?: string;
  passCount: PassCount;
}

export interface OrderByStageResponse {
  orderId: string;
  userId: string;
  stageId: string;
  reservedFor: Date;
  passCount: number;
  user: UserResponse;
}

export interface OrderDto {
  id: string;
  userId: string;
  stageId: string;
  reservedFor: Date;
  isRescheduled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
