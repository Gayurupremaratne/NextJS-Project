export interface PromotionTranslation {
  localeId: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  promotionId?: string;
  ctaText?: string;
}
export interface Promotion {
  id?: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  image: File | undefined;
  mediaKey?: string;
  isActive: boolean;
  promotionTranslations: PromotionTranslation[];
  activePromotionCount?: number;
  title?: string;
  description?: string;
  ctaText?: string;
}

export interface PromotionRequest {
  url: string;
  createdAt?: string;
  updatedAt?: string;
  image: File | undefined;
  mediaKey?: string;
  isActive: boolean;
}
