import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createConfigurationSlice } from './configuration/configurationSlice';
import { IConfigurationSlice } from './types';

export const useBoundStore = create<IConfigurationSlice>()(
  devtools((...a) => ({
    ...createConfigurationSlice(...a)
  }))
);
