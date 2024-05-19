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
  isLoading: false,
  isDeleting: false,
  ...actions(set, get),
});
