import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IDeleteRequestState {
  stage: number;
  setStage: (stage: number) => void;
  clear: () => void;
}

// stage 1: confirm delete
// stage 2: delete request sent
const initialState = {
  stage: 1,
};

export const useDeleteAccountConfirmationStore = create<IDeleteRequestState>()(
  devtools(
    set => ({
      ...initialState,
      setStage: stage => set({ stage }),
      clear: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'delete-account-confirmation-storage',
    },
  ),
);
