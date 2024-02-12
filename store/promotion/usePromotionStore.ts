import { Item } from '@/components/atomic';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
interface IPromotionState {
  englishFile: File | undefined;
  setEnglishFiletoStore: (englishFile: File) => void;
  franciasFile: File | undefined;
  setFranciasFiletoStore: (franciasFile: File) => void;
  deutshFile: File | undefined;
  setDeutshFiletoStore: (deutshFile: File) => void;
  stagesSelected: Item[] | [];
  setStagestoStore: (stages: Item[]) => void;
  clear: () => void;
}
const initialState = {
  englishFile: undefined,
  franciasFile: undefined,
  deutshFile: undefined,
  stagesSelected: [],
};
export const usePromotionStore = create<IPromotionState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setEnglishFiletoStore: (englishFile: File) =>
          set(() => ({ englishFile: englishFile })),
        setFranciasFiletoStore: (franciasFile: File) =>
          set(() => ({ franciasFile: franciasFile })),
        setDeutshFiletoStore: (deutshFile: File) =>
          set(() => ({ deutshFile: deutshFile })),
        setStagestoStore: (stagesSelected: Item[] | []) =>
          set(() => ({ stagesSelected: stagesSelected })),
        clear: () =>
          set(() => ({
            ...initialState,
          })),
      }),
      {
        name: 'promotion-storage',
      },
    ),
  ),
);
