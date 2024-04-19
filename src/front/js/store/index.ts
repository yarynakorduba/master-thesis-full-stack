import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createConfigurationSlice } from './configuration/configurationSlice';
import { TConfigurationSlice } from './types';

export const useBoundStore = create<TConfigurationSlice>()(
  devtools((...a) => ({
    ...createConfigurationSlice(...a)
  }))
);
