import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createConfigurationSlice } from './currentConfiguration/currentConfigurationSlice';
import { createConfigurationsSlice } from './configurations/configurationsSlice';
import { TStoreType } from './types';

export const useBoundStore = create<TStoreType>()(
  devtools(
    immer(
      persist(
        subscribeWithSelector((...a) => ({
          ...createConfigurationSlice(...a),
          ...createConfigurationsSlice(...a),
        })),
        {
          name: 'timeInsights.predictionHistory',
          partialize: (state) => ({
            // predictionHistory: state.predictionHistory,
          }),
        },
      ),
    ),
  ),
);
