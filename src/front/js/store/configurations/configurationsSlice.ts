import { StateCreator } from 'zustand';
import { TConfigurationsSlice, TStoreMiddlewares, TStoreType } from '../types';
import actions from './actions';

export const createConfigurationsSlice: StateCreator<
  TStoreType,
  TStoreMiddlewares,
  [],
  TConfigurationsSlice
> = (set, get) => ({
  configsList: [],
  areConfigurationsLoading: false,
  isConfigurationDeleting: false,
  ...actions(set, get),
});
