export interface GuidelineTranslation {
  localeId: string;
  content: string;
  order: number;
}
export interface GuidelineMeta {
  title: string;
  description: string;
  localeId: string;
}

export interface Guideline {
  metaTranslations: GuidelineMeta[];
  onboardingGuidelines: GuidelineTranslation[];
}

export interface ContentTable {
  type: string;
  title: string;
  description: string;
}
