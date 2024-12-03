import { StateCreator } from 'zustand';
import type { TSettingsSlice, TStoreMiddlewares, TStoreType } from '../types';
import { SHOULD_CLEAR_STORE } from '../consts';

const SET_ARE_SIMPLIFIED_DESCRIPTIONS_SHOWN = 'SET_NOTIFICATION';

export const DEFAULT_NOTIFICATION_STATE = {
  areSimplifiedUIDescriptionsShown: true,
};

export const createSettingsSlice: StateCreator<
  TStoreType,
  TStoreMiddlewares,
  [],
  TSettingsSlice
> = (set, get) => {
  const settingsSlice: TSettingsSlice = {
    ...DEFAULT_NOTIFICATION_STATE,

    setAreSimplifiedDescriptionsShown: (areSimplified: boolean) => {
      set(
        () => ({ areSimplifiedUIDescriptionsShown: areSimplified }),
        SHOULD_CLEAR_STORE,
        SET_ARE_SIMPLIFIED_DESCRIPTIONS_SHOWN,
      );
    },
  };

  return settingsSlice;
};
