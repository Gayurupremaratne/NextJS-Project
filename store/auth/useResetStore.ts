import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IResetState {
  stage: number;
  email: string;
  code: string;
  otp: {
    emailOtpSentAt: string;
    emailOtpExpiresAt: string;
  };
  setStage: (stage: number) => void;
  setEmail: (email: string) => void;
  setCode: (code: string) => void;
  setOtp: (otp: { emailOtpSentAt: string; emailOtpExpiresAt: string }) => void;
  clear: () => void;
}

// stage 1: enter email
// stage 2: enter recovery code
// stage 3: enter new password
// stage 4: success
const initialState = {
  stage: 1,
  email: '',
  code: '',
  otp: {
    emailOtpSentAt: '',
    emailOtpExpiresAt: '',
  },
};

export const useResetStore = create<IResetState>()(
  devtools(
    set => ({
      ...initialState,
      setStage: stage => set({ stage }),
      setEmail: (email: string) => set(() => ({ email: email })),
      setCode: code => set({ code }),
      setOtp: otp => set({ otp }),
      clear: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'reset-storage',
    },
  ),
);
