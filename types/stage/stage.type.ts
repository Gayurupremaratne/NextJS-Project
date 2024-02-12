import { UserResponse } from '../user/user.type';

export interface ReviewRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface Duration {
  hours: string;
  minutes: string;
}

export interface StageRequestDuration {
  hours: number;
  minutes: number;
}

export interface Translation {
  localeId: string;

  stageHead: string;

  stageTail: string;

  description: string;

  stageId?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const STAGE_DIFFICULTY_TYPES = [
  'BEGINNER',
  'MODERATE',
  'ADVANCED',
] as const;

export const FAMILY_FRIENDLY_STATUS = ['YES', 'NO'] as const;

export const PEOPLE_INTERACTIONS = ['LOW', 'HIGH'] as const;

export const STAGE_MEDIA_TYPE = ['IMAGE', 'VIDEO'] as const;

export const STAGE_MEDIA_KEY_TYPES = [
  'MAIN_IMAGE',
  'SUPPLEMENTARY_IMAGE',
  'ELEVATION_GRAPH_IMAGE',
] as const;

export const USER_SEARCH_FIELD_NAMES = [
  'firstName',
  'lastName',
  'email',
  'nationalityCode',
] as const;

export const PASS_USER_TYPE = ['ADULT', 'CHILD'] as const;

export interface Stage {
  id?: string;
  distance: number;
  estimatedDuration: Duration;
  openTime: string;
  closeTime: string;
  elevationGain: number;
  open: boolean;
  number: number;
  cumulativeReviews: number;
  reviewsCount: number;
  difficultyType: (typeof STAGE_DIFFICULTY_TYPES)[number];
  starCount?: ReviewRating;
  createdAt?: Date;
  updatedAt?: Date;
  kmlFileKey: string;
  startPoint: number[];
  endPoint: number[];
  translations: Translation[];
  regions: Region[];
  familyFriendly: (typeof FAMILY_FRIENDLY_STATUS)[number];
  peopleInteraction: (typeof PEOPLE_INTERACTIONS)[number];
}

export interface StageForm {
  distance: string;

  estimatedDuration: string;

  openTime: string;

  closeTime: string;

  elevationGain: string;

  open: boolean | null;

  number: string;

  difficultyType: string;

  peopleInteraction: string;

  familyFriendly: string;

  regionIds: number[];

  stageTranslation: Translation[];
}

export interface StageRequest {
  distance: number;

  estimatedDuration: StageRequestDuration;

  openTime: string;

  closeTime: string;

  elevationGain: number;

  open: boolean;

  number: number;

  difficultyType: (typeof STAGE_DIFFICULTY_TYPES)[number];

  peopleInteraction: (typeof PEOPLE_INTERACTIONS)[number];

  familyFriendly: (typeof FAMILY_FRIENDLY_STATUS)[number];

  cumulativeReviews?: number;

  reviewsCount?: number;
}

export interface AddRegionType {
  id: string;
  regionIds: number[];
}

export interface Region {
  localeId: string;
  regionId: number;
  name: string;
}

export interface EditStageType {
  id: string;
  payload: StageRequest;
}

export interface LiteStageType {
  id: string;
  number: number;
}

export interface UserStage {
  id?: string;
  number: string;
  trailHead: string;
  trailEnd: string;
  status: boolean;
  bookedDate: Date;
  travelDate: Date;
  completedPercentage: string;
}

export interface StageMedia {
  type?: (typeof STAGE_MEDIA_TYPE)[number];
  mediaType: (typeof STAGE_MEDIA_KEY_TYPES)[number];
  id?: string;
  mediaKey: string;
}

export interface UserTrailTracking {
  averagePace: number;
  averageSpeed: number;
  completion: number;
  createdAt: Date;
  distanceTravelled: number;
  elevationGain: number;
  elevationLoss: number;
  isActiveTrack: boolean;
  isCompleted: boolean;
  latitude: number;
  longitude: number;
  passesId: string;
  startTime: Date;
  timestamp: Date;
  totalTime: number;
  updatedAt: Date;
  userId: string;
}
export interface StageUser {
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date | null;
  id: string;
  isCancelled: boolean;
  isTransformed: boolean;
  orderId: string;
  reservedFor: string;
  stageId: string;
  type: (typeof PASS_USER_TYPE)[number];
  userId: string;
  user: UserResponse | null;
  userTrailTracking: UserTrailTracking | null;
}

export interface StageAssetEditForm {
  primaryImage: StageAssetType;
  supplementaryImages: StageAssetType[];
  elevationImage: StageAssetType;
}

export interface StageAssetType {
  type: string;

  mediaType: string;

  createdAt?: string | Date;

  updatedAt?: string | Date;

  id?: string;

  userId?: string;

  stageId?: string;

  mediaKey: string | undefined;

  image?: File;
}

export interface AddStageMediaType {
  id: string;
  mediaKeys: StageAssetType[];
}

export interface StageLite {
  id: string;
  number: number;
  stagesTranslation: Translation[];
}

export interface StageMediaBatchUpload {
  count: number;
}

export interface StageData {
  id: string;
  stage: {
    number: number;
    stagesTranslation: {
      stageHead: string;
      stageTail: string;
    }[];
  };
  userTrailTracking: {
    isCompleted: boolean;
    completion: number;
  } | null;
  createdAt: string;
  reservedFor: string;
}
