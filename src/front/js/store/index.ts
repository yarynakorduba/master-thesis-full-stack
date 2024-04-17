import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createConfigurationSlice, IConfigurationSlice } from './configuration/configurationSlice';

export const useBoundStore = create<IConfigurationSlice>()(
  devtools((...a) => ({
    ...createConfigurationSlice(...a)
  }))
);
