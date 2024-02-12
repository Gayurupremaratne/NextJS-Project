import { Stage } from '../stage/stage.type';

export interface IBadge {
  id?: string;
  badgeKey?: string;
  stageId?: string | null;
  type: string | number;
  badgeTranslation: IBadgeTranslation[];
  assetKeys: IAssetKeys;
  stage?: Stage;
  badgeImage?: string | null;
}
export interface IBadgeEn {
  id?: string;
  badgeKey?: string;
  stageId?: string | null;
  type: string | number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBadgeForm {
  id?: string;
  badgeKey?: string;
  stageId?: string | null;
  type: string | number;
  badgeTranslation: IBadgeTranslation[];
  stage?: Stage;
  badgeImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  userAwardedBadge?: IGetUserBadges[];
}

export interface IBadgeTranslation {
  badgeId?: string;
  localeId: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssetKeys {
  id: string;
  fileKey: string;
  module: string;
}

export interface IUpdateBadge {
  id: string;
  badgeKey: string;
  stageId?: string;
  type: string | number;
  badgeTranslation: IBadgeTranslation[];
}

export interface IUpdateBadgeTranslation {
  name: string;
  description: string;
}

export interface ICreateBadge {
  badgeKey: string;
  stageId?: string | null;
  type: string | number;
  badgeTranslation: IBadgeTranslation[];
}

export interface ICreateBadgeForm {
  name: string;
  description: string;
  type: string | number;
  stageId: string;
  badgeKey?: string;
}

export interface IUpdateBadgeForm {
  id?: string;
  name: string;
  description: string;
  type: string | number;
  stageId: string;
  badgeKey?: string;
}

export interface IGetUserBadges {
  id: string;
  userId: string;
  badgeId: string;
  stageId: string;
  createdAt: Date;
  updatedAt: Date;
  badge: IBadgeForm;
}

export interface IAssignBadgeToUser {
  badgeId: string;
  userId: string;
}
