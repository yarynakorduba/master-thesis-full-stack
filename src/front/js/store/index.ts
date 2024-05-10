import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createConfigurationSlice } from './configuration/configurationSlice';
import { createConfigurationsSlice } from './configurations/configurationsSlice';
import { TConfigurationSlice, TConfigurationsSlice } from './types';

type TStoreType = TConfigurationSlice; // & TConfigurationsSlice;
export const useBoundStore = create<TStoreType>()(
  devtools(
    persist(
      (...a) => ({
        ...createConfigurationSlice(...a),
        // ...createConfigurationsSlice(...a),
      }),
      {
        name: 'timeInsights.predictionHistory',
        partialize: (state) => ({ predictionHistory: state.predictionHistory }),
      },
    ),
  ),
);
