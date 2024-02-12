import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ISnackbarState {
  showSnackbar: boolean;
  setSnackbar: (showSnackbar: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  clear: () => void;
}

const initialState = {
  showSnackbar: false,
  message: '',
};

export const useSnackbarStore = create<ISnackbarState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setSnackbar: (showSnackbar: boolean) =>
          set(() => ({ showSnackbar: showSnackbar })),
        setMessage: (message: string) => set(() => ({ message: message })),
        clear: () =>
          set(() => ({
            ...initialState,
          })),
      }),
      {
        name: 'snackbar-store',
      },
    ),
  ),
);
