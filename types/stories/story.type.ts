export interface Translation {
  localeId: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  audioFile: File | undefined;
  audioKey: string | undefined;
  stageStoryId?: string;
}
export interface Stage {
  id: string;
  distance: string;
  estimatedDuration: number;
  openTime: Date;
  closeTime: Date;
  elevationGain: number;
  open: boolean;
  number: number;
  cumulativeReviews: number;
  reviewsCount: number;
  difficultyType: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Story {
  id?: string;
  latitude: string;
  longitude: string;
  stageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  stage?: Stage;
  stageStoryTranslations: Translation[];
}

export interface StoryEn {
  id?: string;
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  stageId: string;
  createdAt?: Date;
  updatedAt?: Date;
  stageNumber?: number;
}
