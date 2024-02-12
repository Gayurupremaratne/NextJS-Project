import { Stage } from '../stage/stage.type';

export const APPLY_VALIDITY_PERIOD = ['YES', 'NO'] as const;
export const DELIVERY_GROUP = ['ALL', 'STAGE'] as const;
export const NOTICE_TYPE = ['NOTIFICATION', 'EMAIL', 'ALL'] as const;

export interface NotificationTranslation {
  localeId: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  noticeId?: string;
}

export interface Notification {
  id?: string;
  category?: string | null;
  stageId?: string | null;
  isValidityPeriodDefined: (typeof APPLY_VALIDITY_PERIOD)[number];
  startDate: Date;
  endDate: Date;
  deliveryGroup: (typeof DELIVERY_GROUP)[number];
  type: (typeof NOTICE_TYPE)[number];
  createdAt?: Date;
  updatedAt?: Date;
  stage?: Stage;
  notificationTranslations: NotificationTranslation[];
}

export interface NotificationRequest {
  category?: string | null;
  type: (typeof NOTICE_TYPE)[number];
  deliveryGroup: (typeof DELIVERY_GROUP)[number];
  isValidityPeriodDefined: (typeof APPLY_VALIDITY_PERIOD)[number];
  startDate: Date;
  endDate: Date;
  noticeTranslation: NotificationTranslation[];
}

export interface EnNotification {
  id?: string;
  title?: string;
  category?: string | null;
  stageId?: string | null;
  status: string;
  isValidityPeriodDefined: (typeof APPLY_VALIDITY_PERIOD)[number];
  startDate: Date;
  endDate: Date;
  deliveryGroup: (typeof DELIVERY_GROUP)[number];
  type: (typeof NOTICE_TYPE)[number];
  createdAt?: Date;
  updatedAt?: Date;
  noticeStage: Stage[];
  stage: Stage;
  notificationTranslations: NotificationTranslation[];
  isEligibleForModifyOrDelete?: boolean;
}

export interface PaginatedResult<T> {
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

export interface DeleteNotificationResponse {
  statusCode: number;
  data: Notification;
}
export interface NotificationPayload {
  id?: string;
  category?: string | null;
  isValidityPeriodDefined: (typeof APPLY_VALIDITY_PERIOD)[number];
  startDate: Date;
  endDate: Date;
  deliveryGroup: (typeof DELIVERY_GROUP)[number];
  type: (typeof NOTICE_TYPE)[number];
  createdAt?: Date;
  updatedAt?: Date;
  stage?: Stage;
  noticeTranslation: NotificationTranslation[];
}

export interface NotificationEditRequest {
  category?: string | null;
  deliveryGroup: (typeof DELIVERY_GROUP)[number];
  isValidityPeriodDefined: (typeof APPLY_VALIDITY_PERIOD)[number];
  startDate: Date;
  endDate: Date;
  noticeTranslation: NotificationTranslation[];
}

export interface NotificationEditConfirmResponse {
  statusCode: number;
  data: NotificationPayload;
}
