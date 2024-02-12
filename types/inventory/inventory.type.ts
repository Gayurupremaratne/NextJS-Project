export type InventoryType = {
  stage_id: string;
  date: string;
  inventoryQuantity: number;
  reservedQuantity: number;
  cancelledQuantity: number;
};

export type InventoryByMonthType = {
  stageId: string;
  month: string;
  year: string;
};

export interface InventoryResponse {
  data: InventoryType[];
  analytics: InventoryAnalytics;
}

export interface InventoryAnalytics {
  totalInventory: number;
  allocatedInventory: number;
  remainingInventory: number;
  cancelledInventory: number;
}

export interface InventoryPassAllocation {
  quantity: number;
  startDate?: string | null;
  endDate?: string | null;
  stageClosure: boolean;
  stageClosureReason?: string;
}

export type InventoryReservationType = {
  stageId: string;
  startDate: string;
  endDate: string;
};

export interface InventoryAllocationResponse {
  date: Date;
  inventoryQuantity: number;
  reservedQuantity: number;
  allocatedQuantity: number;
}

export interface UserPass {
  id?: string;
  number: number;
  trailHead: string;
  trailEnd: string;
  status: string;
  travelDate: Date;
  count: number;
}

export interface PassInventory {
  id: string;
  stageId: string;
  date: Date;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryReservationForDayType {
  count: number;
}

export interface PassOrder {
  orderId: string;
  stageData: {
    number: number;
    stagesTranslation: { stageHead: string; stageTail: string }[];
  };
  status: string;
  passCount: number;
  reservedFor: string;
}
