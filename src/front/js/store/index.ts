import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createConfigurationSlice } from './configuration/configurationSlice';
import { TConfigurationSlice } from './types';

export const useBoundStore = create<TConfigurationSlice>()(
  devtools(
    persist(
      (...a) => ({
        ...createConfigurationSlice(...a),
      }),
      {
        name: 'timeInsights.predictionHistory',
        partialize: (state) => ({ predictionHistory: state.predictionHistory }),
      },
    ),
  ),
);
