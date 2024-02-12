// eslint-disable-next-line import/no-extraneous-dependencies
import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability';
import { defineAbilitiesFor } from '@/utils/casl/ability';
import { create } from 'zustand';

interface UserAbilityState {
  abilities: MongoAbility<AbilityTuple, MongoQuery>;
  setAbilities: (data: MongoAbility<AbilityTuple, MongoQuery>) => void;
}

export const useUserAbilityStore = create<UserAbilityState>(set => ({
  abilities: defineAbilitiesFor([]),
  setAbilities: newAbilitites => set({ abilities: newAbilitites }),
}));
