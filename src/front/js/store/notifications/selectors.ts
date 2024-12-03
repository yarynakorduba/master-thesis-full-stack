import { useBoundStore } from '..';
import type { TNotification } from '../types';

export const useGetNotifications = (): TNotification[] =>
  useBoundStore((state) => state.notifications || []);

export const useSetNotification = (): ((notification: TNotification) => void) =>
  useBoundStore((state) => state.setNotification);

export const useNotifications = (): [
  TNotification[],
  (notification: TNotification) => void,
] => [useGetNotifications(), useSetNotification()];

export const useOpenErrorNotification = (): ((
  id: string,
  message: string,
) => void) => useBoundStore((state) => state.openErrorNotification);
