/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import notificationApi, {
  type NotificationItem,
  isNotificationReadForUser,
} from "../api/notificationApi";
import useAuthStore from "./useAuthStore";
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

const handleNotificationReceived = (newNotificationData: any) => {
  useNotificationStore.getState().addNotification(newNotificationData);
};

const handleStatusChange = (isConnected: boolean) => {
  useNotificationStore.setState({ socketConnected: isConnected });
};

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

      const currentUser = useAuthStore.getState().user;
      const userDocId = currentUser?.documentId;
      const userId = currentUser?.id;

      // Add default unread state if missing or match with notification_readers
      const formatted: NotificationItem[] = rawData
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((item) => {
          const isRead = isNotificationReadForUser(item, userDocId, userId);
          return {
            ...item,
            read: isRead,
            isRead,
          };
        });

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
    const payload = (newNotif as any)?.notification || (newNotif as any)?.data || newNotif;
    const newId = payload?.id;
    const newDocId = payload?.documentId;

    set((state) => {
      // Prevent duplicate notification entries with identical ID or documentId
      const isDuplicate = state.notifications.some(
        (n) =>
          (newId !== undefined && n.id === newId) ||
          (newDocId !== undefined && n.documentId === newDocId),
      );

      if (isDuplicate) {
        return state;
      }

      const formattedItem: NotificationItem = {
        id: payload?.id || Date.now(),
        documentId: payload?.documentId || `doc_${Date.now()}`,
        title: payload?.title || payload?.name || "New Notification",
        description: payload?.description || payload?.message || "",
        type: payload?.type || "system",
        createdAt: payload?.createdAt || new Date().toISOString(),
        read: false,
      };

      return {
        notifications: [formattedItem, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    notificationApi.markAllNotificationsAsRead().catch((err) => {
      console.error(
        "[Notification] Failed to mark all notifications as read:",
        err,
      );
    });
  },

  markAsRead: (id) => {
    const target = get().notifications.find(
      (n) => n.id === id || n.documentId === id,
    );
    const docId = target?.documentId || String(id);

    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id || n.documentId === id ? { ...n, read: true } : n,
      );
      const unread = updated.filter((n) => !n.read).length;
      return { notifications: updated, unreadCount: unread };
    });

    if (docId) {
      notificationApi.markNotificationAsRead(docId).catch((err) => {
        console.error(
          `[Notification] Failed to mark notification ${docId} as read:`,
          err,
        );
      });
    }
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
    connectSocketService(handleNotificationReceived, handleStatusChange);
  },

  disconnectSocket: () => {
    disconnectSocketService();
    set({ socketConnected: false });
  },
}));

export default useNotificationStore;
