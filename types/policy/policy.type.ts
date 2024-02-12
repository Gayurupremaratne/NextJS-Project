import { OutputBlockData } from '@editorjs/editorjs';

export interface IPolicyTranslation {
  id?: string;
  policyId?: string;
  localeId?: string;
  order?: number;
  title?: string;
  description?: string;
  content?: string;
  icon?: string;
  slug?: string | null;
  isGroupParent?: boolean;
  acceptanceRequired?: boolean;
  parentPolicyId?: null | string;
  policyTranslations?: IPolicyTranslation[];
  childPolicies?: IPolicyTranslation[];
  createdAt?: Date;
  updatedAt?: Date;
  blocks?: OutputBlockData[];
  dynamicProperties?: DynamicProperties;
}

interface DynamicProperties {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | IPolicyTranslation[]
    | OutputBlockData;
}
export interface IPolicy {
  id?: string;
  localeId?: string;
  order?: number;
  parentPolicyId?: null | string;
  acceptanceRequired?: boolean;
  icon?: string;
  isGroupParent?: boolean;
  slug?: string | null;
  updatedAt?: Date;
  policyTranslations?: IPolicyTranslation[];
  parentPolicy?: IPolicy | null;
  childPolicies?: IPolicy[];
}

export interface IParentPolicyTranslation {
  policyId?: string;
  localeId?: string;
  title: string;
}

export interface PolicyType {
  id: string;
  localeId?: string;
  order?: number;
  parentPolicyId?: null | string;
  acceptanceRequired?: boolean;
  icon?: string;
  isGroupParent?: boolean;
  slug?: string | null;
  updatedAt?: Date;
  policyTranslations?: IPolicyTranslation[];
  parentPolicy?: IPolicy | null;
  childPolicies?: IPolicy[];
}
