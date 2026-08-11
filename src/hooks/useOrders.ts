import { useEffect } from "react";
import useOrderStore, { type OrderStatus } from "../store/useOrderStore";
import { connectSocket } from "../services/socketService";

export const useOrders = () => {
  const {
    orders,
    isLoading,
    hasFetched,
    error,
    fleetActivities,
    availableDrivers,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    assignDriver,
    deleteOrder,
  } = useOrderStore();

  useEffect(() => {
    // Fetch orders if not already fetched
    if (!hasFetched) {
      fetchOrders();
    }

    // Connect socket and listen for real-time order status updates
    connectSocket(
      undefined, // notifications handled by useNotification
      undefined, // socket status
      (statusData: {
        orderDocumentId?: string;
        statusUpdatedTo?: string;
        orderStatus?: string;
      }) => {
        const docId = statusData.orderDocumentId;
        const newStatus = (statusData.statusUpdatedTo ||
          statusData.orderStatus) as OrderStatus;

        if (docId && newStatus) {
          useOrderStore.setState((state) => ({
            orders: state.orders.map((o) =>
              o.id === docId || o.documentId === docId
                ? { ...o, status: newStatus }
                : o,
            ),
          }));
        }
      },
    );

    return () => {
      // Keep connection active for app lifetime
    };
  }, [fetchOrders, hasFetched]);

  return {
    orders,
    isLoading,
    error,
    fleetActivities,
    availableDrivers,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    assignDriver,
    deleteOrder,
  };
};

export default useOrders;
