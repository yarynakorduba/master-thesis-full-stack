import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createConfigurationSlice } from './currentConfiguration/currentConfigurationSlice';
import { createConfigurationsSlice } from './configurations/configurationsSlice';
import { createNotificationsSlice } from './notifications/notificationsSlice';

import { TStoreType } from './types';

export const useBoundStore = create<TStoreType>()(
  devtools(
    immer(
      subscribeWithSelector((...a) => ({
        ...createConfigurationSlice(...a),
        ...createConfigurationsSlice(...a),
        ...createNotificationsSlice(...a),
      })),
    ),
  ),
);
