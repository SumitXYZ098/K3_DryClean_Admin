/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import notificationApi, {
  type NotificationItem,
} from "../api/notificationApi";
import {
  connectSocket as connectSocketService,
  disconnectSocket as disconnectSocketService,
} from "../services/socketService";

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  socketConnected: boolean;
  error: string | null;

  fetchNotifications: () => Promise<NotificationItem[]>;
  addNotification: (notification: Partial<NotificationItem>) => void;
  markAllAsRead: () => void;
  markAsRead: (id: number | string) => void;
  clearNotifications: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  initSocket: () => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isDrawerOpen: false,
  socketConnected: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationApi.getAllNotifications();
      const rawData = response.data || [];

      // Add default unread state if missing
      const formatted: NotificationItem[] = rawData.map((item) => ({
        ...item,
        read: item.read ?? false,
      }));

      const unread = formatted.filter((item) => !item.read).length;

      set({
        notifications: formatted,
        unreadCount: unread,
        isLoading: false,
      });

      return formatted;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch notifications";
      set({ error: errMsg, isLoading: false });
      return [];
    }
  },

  addNotification: (newNotif) => {
    const formattedItem: NotificationItem = {
      id: newNotif.id || Date.now(),
      documentId: newNotif.documentId || `doc_${Date.now()}`,
      title: newNotif.title || "New Notification",
      description: newNotif.description || "",
      type: newNotif.type || "system",
      createdAt: newNotif.createdAt || new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      notifications: [formattedItem, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id || n.documentId === id ? { ...n, read: true } : n,
      );
      const unread = updated.filter((n) => !n.read).length;
      return { notifications: updated, unreadCount: unread };
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  setDrawerOpen: (isOpen) => {
    set({ isDrawerOpen: isOpen });
  },

  toggleDrawer: () => {
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  initSocket: () => {
    connectSocketService(
      (newNotificationData) => {
        get().addNotification(newNotificationData);
      },
      (isConnected) => {
        set({ socketConnected: isConnected });
      },
    );
  },

  disconnectSocket: () => {
    disconnectSocketService();
    set({ socketConnected: false });
  },
}));

export default useNotificationStore;
