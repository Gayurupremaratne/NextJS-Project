import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IDeleteRequestState {
  stage: number;
  email: string;
  setStage: (stage: number) => void;
  setEmail: (email: string) => void;
  clear: () => void;
}

// stage 1: enter email
// stage 2: email sent confirmation
const initialState = {
  stage: 1,
  email: '',
};

export const useDeleteAccountStore = create<IDeleteRequestState>()(
  devtools(
    set => ({
      ...initialState,
      setStage: stage => set({ stage }),
      setEmail: (email: string) => set(() => ({ email: email })),
      clear: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'delete-account-storage',
    },
  ),
);
