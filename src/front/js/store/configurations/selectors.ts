import { useBoundStore } from '..';

export const useConfigsList = (): [any[], () => Promise<void>, boolean] => [
  useBoundStore((state) => state.configsList),
  useBoundStore((state) => state.fetchConfigs),
  useBoundStore((state) => state.isLoading),
];

export const useDeleteConfig = (): [(id: string) => Promise<void>, boolean] => [
  useBoundStore((state) => state.deleteConfig),
  useBoundStore((state) => state.isDeleting),
];
