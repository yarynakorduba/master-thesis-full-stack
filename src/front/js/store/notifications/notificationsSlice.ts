import { StateCreator } from 'zustand';
import type {
  TNotification,
  TNotificationsSlice,
  TStoreMiddlewares,
  TStoreType,
} from '../types';
import { SHOULD_CLEAR_STORE } from '../consts';

const SET_NOTIFICATION = 'SET_NOTIFICATION';

export const DEFAULT_NOTIFICATION_STATE = {
  notifications: [],
};

export const createNotificationsSlice: StateCreator<
  TStoreType,
  TStoreMiddlewares,
  [],
  TNotificationsSlice
> = (set, get) => {
  const notificationsSlice: TNotificationsSlice = {
    ...DEFAULT_NOTIFICATION_STATE,

    setNotification: (notification: TNotification) => {
      set(
        (state) => ({
          notifications: {
            ...state.notifications,
            [notification.id]: notification,
          },
        }),
        SHOULD_CLEAR_STORE,
        SET_NOTIFICATION,
      );
    },
    openErrorNotification: (id: string, message: string) => {
      get().setNotification({
        id,
        message,
        isOpen: true,
        severity: 'error',
        autoHideDuration: 5000,
      });
    },
  };

  return notificationsSlice;
};
