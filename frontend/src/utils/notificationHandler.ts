
declare global {
  interface Window {
    customerNotificationHandler?: (notification: any) => void;
  }
}

// This would be replaced with a real-time solution like WebSockets or Server-Sent Events
export const initializeNotificationHandler = (addNotification: (notification: any) => void) => {
  window.customerNotificationHandler = addNotification;
};

export const cleanupNotificationHandler = () => {
  delete window.customerNotificationHandler;
};
