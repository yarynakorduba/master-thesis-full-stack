import { useBoundStore } from '..';
import { TConfigurationMainInfo } from '../types';

export const useConfigsList = (): [
  TConfigurationMainInfo[],
  () => Promise<void>,
  boolean,
] => [
  useBoundStore((state) => state.configsList),
  useBoundStore((state) => state.fetchConfigs),
  useBoundStore((state) => state.areConfigurationsLoading),
];

export const useDeleteConfig = (): [(id: string) => Promise<void>, boolean] => [
  useBoundStore((state) => state.deleteConfig),
  useBoundStore((state) => state.isConfigurationDeleting),
];
