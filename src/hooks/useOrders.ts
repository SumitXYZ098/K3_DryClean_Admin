/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import useOrderStore, {
  type Order,
  type OrderStatus,
  type PaymentStatus,
  type DriverInfo,
} from "../store/useOrderStore";
import orderApi, { mapApiOrderToOrder } from "../api/orderApi";
import {
  connectSocket,
  joinOrderRoomSocket,
  unsubscribeSocketCallbacks,
} from "../services/socketService";

export const ORDERS_QUERY_KEY = ["orders"];

export const useOrders = () => {
  const queryClient = useQueryClient();
  const {
    orders: storeOrders,
    fleetActivities,
    availableDrivers,
    setOrders: setStoreOrders,
    addOrder: addOrderStore,
    updateOrderStatus: updateOrderStatusStore,
    updateOrderPaymentStatus: updateOrderPaymentStatusStore,
    assignDriver: assignDriverStore,
    deleteOrder: deleteOrderStore,
  } = useOrderStore();

  // TanStack React Query - Get Orders Data
  const {
    data: queriedOrders,
    isLoading: isOrdersLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const response = await orderApi.getAllOrders();
      const rawOrders = response.data || [];
      const mappedOrders = rawOrders.map(mapApiOrderToOrder);
      setStoreOrders(mappedOrders);
      mappedOrders.forEach((o) => {
        if (o.documentId) {
          joinOrderRoomSocket(o.documentId);
        }
      });
      return mappedOrders;
    },
    initialData: storeOrders.length > 0 ? storeOrders : undefined,
    placeholderData: keepPreviousData,
  });

  // Keep Zustand store in sync when queriedOrders changes
  useEffect(() => {
    if (queriedOrders && queriedOrders.length > 0) {
      setStoreOrders(queriedOrders);
    }
  }, [queriedOrders, setStoreOrders]);

  // Connect socket and listen for real-time order updates
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleOrderStatusChange = (_statusData: any) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      }, 300);
    };

    connectSocket(
      undefined, // notifications handled by useNotification
      undefined, // socket status
      handleOrderStatusChange,
    );

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribeSocketCallbacks({
        onOrderStatusChange: handleOrderStatusChange,
      });
    };
  }, [queryClient]);

  /**
   * Fetch orders wrapper (Backwards compatible)
   */
  const fetchOrders = useCallback(
    async (force = false): Promise<Order[]> => {
      const state = useOrderStore.getState();
      if (state.hasFetched && !force && state.orders.length > 0) {
        return state.orders;
      }
      const result = await refetch();
      return result.data || state.orders;
    },
    [refetch],
  );

  // Add Order Mutation with instant cache update
  const addOrderMutation = useMutation<
    Order,
    Error,
    Omit<Order, "id" | "createdAt">
  >({
    mutationFn: async (data) => {
      return addOrderStore(data);
    },
    onMutate: (data) => {
      const randomId = `#K3-${Math.floor(8300 + Math.random() * 900)}`;
      const newOrder: Order = {
        ...data,
        id: randomId,
        documentId: randomId,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old ? [newOrder, ...old] : [newOrder],
      );
      return { newOrder };
    },
    onSuccess: (newOrder) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) => {
        if (!old) return [newOrder];
        const exists = old.some((o) => o.id === newOrder.id);
        return exists ? old : [newOrder, ...old];
      });
    },
  });

  const addOrder = useCallback(
    (data: Omit<Order, "id" | "createdAt">) => {
      return addOrderMutation.mutate(data);
    },
    [addOrderMutation],
  );

  // Update order status mutation with instant cache update
  const updateOrderStatusMutation = useMutation<
    void,
    Error,
    { id: string; newStatus: OrderStatus }
  >({
    onMutate: async ({ id, newStatus }) => {
      // Instant query cache update
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old
          ? old.map((o) =>
              o.id === id || o.documentId === id
                ? { ...o, status: newStatus }
                : o,
            )
          : undefined,
      );
      // Instant Zustand store update
      updateOrderStatusStore(id, newStatus);
    },
    mutationFn: async () => {
      // Async socket update executed inside updateOrderStatusStore
    },
  });

  const updateOrderStatus = useCallback(
    (id: string, newStatus: OrderStatus) => {
      updateOrderStatusMutation.mutate({ id, newStatus });
    },
    [updateOrderStatusMutation],
  );

  // Update order payment status mutation with instant cache update
  const updateOrderPaymentStatusMutation = useMutation<
    void,
    Error,
    { id: string; paymentStatus: PaymentStatus }
  >({
    onMutate: async ({ id, paymentStatus }) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old
          ? old.map((o) =>
              o.id === id || o.documentId === id ? { ...o, paymentStatus } : o,
            )
          : undefined,
      );
      updateOrderPaymentStatusStore(id, paymentStatus);
    },
    mutationFn: async () => {},
  });

  const updateOrderPaymentStatus = useCallback(
    (id: string, paymentStatus: PaymentStatus) => {
      updateOrderPaymentStatusMutation.mutate({ id, paymentStatus });
    },
    [updateOrderPaymentStatusMutation],
  );

  // Assign driver mutation with INSTANT UI cache update
  const assignDriverMutation = useMutation<
    void,
    Error,
    { id: string; driver: DriverInfo }
  >({
    onMutate: async ({ id, driver }) => {
      const currentList =
        queryClient.getQueryData<Order[]>(ORDERS_QUERY_KEY) || storeOrders;
      const targetOrder = currentList.find(
        (o) => o.id === id || o.documentId === id,
      );

      const currentStatus = targetOrder?.status;
      let newStatus: OrderStatus | undefined = currentStatus;
      let isDeliveryPhase = false;

      if (currentStatus === "pending" || currentStatus === "pickup_assigned") {
        newStatus = "pickup_assigned";
        isDeliveryPhase = false;
      } else if (
        currentStatus === "processing" ||
        currentStatus === "delivery_assigned" ||
        currentStatus === "out_for_delivery"
      ) {
        newStatus = "delivery_assigned";
        isDeliveryPhase = true;
      }

      const updatedPerson = isDeliveryPhase
        ? { deliveryPerson: driver }
        : { pickupPerson: driver };

      // Instant query cache update
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old
          ? old.map((o) =>
              o.id === id || o.documentId === id
                ? { ...o, ...updatedPerson, status: newStatus || o.status }
                : o,
            )
          : undefined,
      );

      // Instant Zustand store update
      assignDriverStore(id, driver);
    },
    mutationFn: async () => {},
  });

  const assignDriver = useCallback(
    (id: string, driver: DriverInfo) => {
      assignDriverMutation.mutate({ id, driver });
    },
    [assignDriverMutation],
  );

  // Delete order mutation with instant cache update
  const deleteOrderMutation = useMutation<void, Error, string>({
    onMutate: async (id) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old ? old.filter((o) => o.id !== id && o.documentId !== id) : undefined,
      );
      deleteOrderStore(id);
    },
    mutationFn: async () => {},
  });

  const deleteOrder = useCallback(
    (id: string) => {
      deleteOrderMutation.mutate(id);
    },
    [deleteOrderMutation],
  );

  const activeOrders = queriedOrders || storeOrders;
  const errorMessage = queryError
    ? (queryError as any).response?.data?.message ||
      (queryError as Error).message ||
      "Failed to fetch orders"
    : null;

  return {
    orders: activeOrders,
    isLoading: isOrdersLoading,
    isFetching,
    error: errorMessage,
    fleetActivities,
    availableDrivers,
    refetch,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    assignDriver,
    deleteOrder,
  };
};

export default useOrders;
