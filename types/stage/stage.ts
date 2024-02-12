export interface ReviewRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface Duration {
  hours: number;
  minutes: number;
}

export const STAGE_DIFFICULTY_TYPES = [
  'BEGINNER',
  'MODERATE',
  'ADVANCED',
] as const;

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
}

export interface StageLite {
  id: string;

  number: number;
}
