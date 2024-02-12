import { PassCondition } from '@/types/pass-conditions/pass-condition.type';
import { create } from 'zustand';

interface PassConditionState {
  data: PassCondition; // You can replace 'any' with a specific type for your data
  setData: (data: PassCondition) => void;
}

const useDataStore = create<PassConditionState>(set => ({
  data: { metaTranslations: [], passConditions: [] },
  setData: data => set({ data }),
}));

export default useDataStore;
