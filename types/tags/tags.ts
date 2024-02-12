import { Stage } from '../stage/stage';

export interface ITag {
  id?: string;
  stageTagTranslation: ITagTranslation[];
  stageTagAssociation: ITagAssociation[] | null;
}

export interface IGetAllTags {
  perPage: number;
  pageNumber: number;
  stageNumber?: number | string | null;
}

export interface ITagTranslation {
  stageTagId?: string;
  localeId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITagAssociation {
  stageId: string;
  id: string;
  stage: Stage;
}

export interface IUpdateTagTranslation {
  name: string;
}

export interface IUpdateTagAssociation {
  stageIds: string[];
  stageTagId: string | undefined;
}

export interface TagEn {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  relatedStages?: number[];
}

export interface TagAssociateBatchUpdateOptions {
  count: number;
}

export interface TagAssociateBatchUpdate {
  0: TagAssociateBatchUpdateOptions;
  1: TagAssociateBatchUpdateOptions;
}
