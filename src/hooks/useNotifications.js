import { useState, useCallback, useMemo } from 'react';
import { notifications as mockNotifications } from '../data/mockData';

export function useNotifications(initialNotifications = mockNotifications) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const getByUser = useCallback(
    (userId) => notifications.filter((n) => n.userId === userId),
    [notifications]
  );

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: `n${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    getByUser,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
  };
}
