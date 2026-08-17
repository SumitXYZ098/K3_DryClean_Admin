/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import useNotificationStore, {
  type NotificationState,
} from "../store/useNotificationStore";
import notificationApi, {
  type NotificationItem,
  isNotificationReadForUser,
} from "../api/notificationApi";
import useAuthStore from "../store/useAuthStore";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export const useNotification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    notifications: storeNotifications,
    isDrawerOpen,
    socketConnected,
    addNotification: addNotificationStore,
    markAllAsRead: markAllAsReadStore,
    markAsRead: markAsReadStore,
    clearNotifications: clearNotificationsStore,
    setDrawerOpen,
    toggleDrawer,
    initSocket,
    disconnectSocket,
  } = useNotificationStore() as NotificationState;

  // TanStack React Query - Fetch Notifications
  const {
    data: queriedNotifications,
    isLoading: isQueryLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<NotificationItem[]>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await notificationApi.getAllNotifications();
      const rawData = response.data || [];

      const currentUser = useAuthStore.getState().user;
      const userDocId = currentUser?.documentId;
      const userId = currentUser?.id;

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

      useNotificationStore.setState({
        notifications: formatted,
        unreadCount: formatted.filter((n) => !n.read).length,
      });
      return formatted;
    },
    initialData: storeNotifications.length > 0 ? storeNotifications : undefined,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    // Initialize socket listener for real-time notification events
    initSocket();
  }, [initSocket]);

  // Keep React Query cache in sync when storeNotifications changes from Socket events
  useEffect(() => {
    if (storeNotifications && storeNotifications.length > 0) {
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        storeNotifications,
      );
    }
  }, [storeNotifications, queryClient]);

  const activeNotifications = queriedNotifications || storeNotifications;
  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  /**
   * Refetch wrapper for backwards compatibility
   */
  const fetchNotifications = useCallback(async (): Promise<
    NotificationItem[]
  > => {
    const result = await refetch();
    return result.data || activeNotifications;
  }, [refetch, activeNotifications]);

  /**
   * Add Notification
   */
  const addNotification = useCallback(
    (newNotif: Partial<NotificationItem>) => {
      addNotificationStore(newNotif);
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    [addNotificationStore, queryClient],
  );

  // TanStack React Query Mutations
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      markAllAsReadStore();
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        (old) => (old ? old.map((n) => ({ ...n, read: true })) : undefined),
      );
    },
  });

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number | string) => {
      markAsReadStore(id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        (old) =>
          old
            ? old.map((n) =>
                n.id === id || n.documentId === id ? { ...n, read: true } : n,
              )
            : undefined,
      );
    },
  });

  const markAsRead = useCallback(
    (id: number | string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const clearNotificationsMutation = useMutation({
    mutationFn: async () => {
      clearNotificationsStore();
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(NOTIFICATIONS_QUERY_KEY, []);
    },
  });

  const clearNotifications = useCallback(() => {
    clearNotificationsMutation.mutate();
  }, [clearNotificationsMutation]);

  /**
   * Handle notification item click
   */
  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id || item.documentId);
    setDrawerOpen(false);

    const type = item.type ? item.type.toLowerCase() : "";

    if (type === "order") {
      navigate("/orders");
    } else if (type === "user" || type === "customer") {
      navigate("/customers");
    }
  };

  const errorMessage = queryError
    ? (queryError as any).response?.data?.message ||
      (queryError as Error).message ||
      "Failed to fetch notifications"
    : null;

  return {
    notifications: activeNotifications,
    unreadCount,
    isLoading: isQueryLoading,
    isFetching,
    error: errorMessage,
    isDrawerOpen,
    socketConnected,
    refetch,
    fetchNotifications,
    addNotification,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    setDrawerOpen,
    toggleDrawer,
    handleNotificationClick,
    disconnectSocket,
  };
};

export default useNotification;
