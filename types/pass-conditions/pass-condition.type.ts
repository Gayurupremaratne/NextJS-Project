export interface PassConditionTranslation {
  localeId: string;
  content: string;
  order: number;
}
export interface PassConditionMeta {
  title: string;
  description: string;
  subTitle: string;
  localeId: string;
}

export interface PassCondition {
  metaTranslations: PassConditionMeta[];
  passConditions: PassConditionTranslation[];
}
