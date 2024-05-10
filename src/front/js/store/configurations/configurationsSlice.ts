import { StateCreator } from 'zustand';
import { TConfigurationsSlice, TStoreMiddlewares } from '../types';
import actions from './actions';

export const createConfigurationsSlice: StateCreator<
  TConfigurationsSlice,
  TStoreMiddlewares,
  [],
  TConfigurationsSlice
> = (set, get) => ({
  configsList: [],
  isLoading: false,
  ...actions(set, get),
});
