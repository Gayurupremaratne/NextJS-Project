import { Guideline } from '@/types/guidelines/guideline.type';
import { create } from 'zustand';

interface GuidelineState {
  data: Guideline; // You can replace 'any' with a specific type for your data
  setData: (data: Guideline) => void;
}

const useDataStore = create<GuidelineState>(set => ({
  data: { metaTranslations: [], onboardingGuidelines: [] },
  setData: data => set({ data }),
}));

export default useDataStore;
