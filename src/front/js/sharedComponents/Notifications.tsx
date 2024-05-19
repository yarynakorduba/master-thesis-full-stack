import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { map } from 'lodash';
import { useNotifications } from '../store/notifications/selectors';

const Notifications = () => {
  const [notifications, setNotification] = useNotifications();
  const handleClose = (notification) => () => {
    setNotification({ ...notification, isOpen: false });
  };
  return (
    <>
      {map(notifications, (notification) => {
        return (
          <Snackbar
            key={notification.id}
            open={notification.isOpen}
            autoHideDuration={5000}
            onClose={handleClose(notification)}
            message="This Snackbar will be dismissed in 5 seconds."
          >
            <Alert
              onClose={handleClose(notification)}
              severity={notification.severity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        );
      })}
    </>
  );
};

export default Notifications;
