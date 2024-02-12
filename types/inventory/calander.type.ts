import { InventoryType } from '@/types/inventory/inventory.type';

export type BodyState = {
  day: Date;
  inventory: InventoryType[];
};
