import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

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
}

export interface GetNotificationResponse {
  data: NotificationItem[];
}

export const notificationApi = {
  /**
   * Fetch all notifications for admin
   */
  getAllNotifications: async (): Promise<GetNotificationResponse> => {
    return await api.get<GetNotificationResponse>(ENDPOINTS.getAllNotification);
  },
};

export default notificationApi;
