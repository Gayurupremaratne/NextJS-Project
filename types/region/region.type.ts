export interface Region {
  id: number;
  regionTranslation: RegionTranslation[];
}

export interface RegionTranslation {
  id: number;
  regionId: number;
  localeId: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
