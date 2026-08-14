/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface NotificationReaderUser {
  documentId?: string;
  id?: number | string;
  [key: string]: any;
}

export interface NotificationReader {
  documentId?: string;
  users_permissions_user?: NotificationReaderUser | null;
  [key: string]: any;
}

export interface NotificationItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  type: "user" | "order" | string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  read?: boolean;
  isRead?: boolean;
  notification_readers?: NotificationReader[];
}

export interface GetNotificationResponse {
  data: NotificationItem[];
}

export interface MarkNotificationResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

/**
 * Checks whether a notification has been read by comparing the logged-in user's documentId/id
 * against the notification_readers array returned from the backend.
 */
export const isNotificationReadForUser = (
  item: Partial<NotificationItem>,
  userDocId?: string | null,
  userId?: number | string | null,
): boolean => {
  if (item.read === true || item.isRead === true) return true;
  if (!userDocId && !userId) return item.read ?? false;

  const readers = item.notification_readers || [];
  return readers.some((nr) => {
    const readerUserDocId = nr.users_permissions_user?.documentId;
    const readerUserId = nr.users_permissions_user?.id;
    if (userDocId && readerUserDocId && readerUserDocId === userDocId) {
      return true;
    }
    if (
      userId &&
      (readerUserId === userId || readerUserDocId === String(userId))
    ) {
      return true;
    }
    return false;
  });
};

export const notificationApi = {
  /**
   * Fetch all notifications for admin
   */
  getAllNotifications: async (): Promise<GetNotificationResponse> => {
    return await api.get<GetNotificationResponse>(ENDPOINTS.getAllNotification);
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async (): Promise<MarkNotificationResponse> => {
    return await api.put<MarkNotificationResponse>(
      ENDPOINTS.getMarkAllNotificationsAsRead,
    );
  },

  /**
   * Mark single notification as read by documentId/id
   */
  markNotificationAsRead: async (
    docId: string,
  ): Promise<MarkNotificationResponse> => {
    return await api.put<MarkNotificationResponse>(
      ENDPOINTS.getMarkNotificationAsRead(docId),
    );
  },
};

export default notificationApi;
