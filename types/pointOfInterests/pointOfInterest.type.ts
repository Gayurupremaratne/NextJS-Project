import { Stage } from '../stage/stage';

export interface PointOfInterestTranslation {
  localeId: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  pointOfInterestId?: string;
}

export interface PointOfInterest {
  id?: string;
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  image: File | undefined;
  mediaKey?: string;
  pointOfInterestTranslation: PointOfInterestTranslation[];
  pointOfInterestStage: Stage[];
}

export interface PointOfInterestRequest {
  id?: string;
  latitude: string;
  longitude: string;
  createdAt?: Date;
  updatedAt?: Date;
  assetKey?: string;
  pointOfInterestTranslations: PointOfInterestTranslation[];
  stageIds: string[];
  image: File | undefined;
}
