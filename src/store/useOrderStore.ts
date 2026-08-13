/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import orderApi, { mapApiOrderToOrder } from "../api/orderApi";
import {
  updateOrderStatusSocket,
  markOrderPaidSocket,
} from "../services/socketService";

export type OrderStatus =
  | "pending"
  | "pickup_assigned"
  | "picked_up"
  | "processing"
  | "delivery_assigned"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "Paid"
  | "Unpaid"
  | "Refunded"
  | "cancelled"
  | "Cancelled"
  | "paid";

export type ServiceType =
  | "Wash & Fold"
  | "Dry Clean Only"
  | "Ironing"
  | "Household Items";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  initials: string;
  phone?: string;
}

export interface FleetActivity {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  status: "On Time" | "Delayed" | "Completed";
  type: "pickup" | "delivery" | "warning";
}

export interface Order {
  id: string;
  documentId?: string;
  customerName: string;
  customerTier:
    | "Premium Membership"
    | "Guest Order"
    | "Bulk/Commercial"
    | "Mobile User"
    | "VIP Client";
  customerEmail?: string;
  customerPhone?: string;
  pickupDate: string;
  deliveryDate: string;
  pickupPerson: DriverInfo | null;
  deliveryPerson: DriverInfo | null;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  serviceType: ServiceType;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress?: string;
  specialInstructions?: string;
  createdAt: string;
}

const initialFleetActivities: FleetActivity[] = [
  {
    id: "fa1",
    title: "Driver John Smith picked up 4 items",
    subtitle: "Zone A • 12 mins ago",
    timeAgo: "12 mins ago",
    status: "On Time",
    type: "pickup",
  },
  {
    id: "fa2",
    title: "Delayed Delivery: Order #K3-8201",
    subtitle: "Zone C • Traffic Delay • 45 mins ago",
    timeAgo: "45 mins ago",
    status: "Delayed",
    type: "warning",
  },
  {
    id: "fa3",
    title: "Driver Mike Wong completed delivery #K3-8276",
    subtitle: "Zone B • 1 hour ago",
    timeAgo: "1 hour ago",
    status: "Completed",
    type: "delivery",
  },
];

interface OrderStoreState {
  orders: Order[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fleetActivities: FleetActivity[];
  availableDrivers: DriverInfo[];

  fetchOrders: (force?: boolean) => Promise<Order[]>;
  setOrders: (orders: Order[]) => void;
  addOrder: (data: Omit<Order, "id" | "createdAt">) => Order;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  updateOrderPaymentStatus: (id: string, paymentStatus: PaymentStatus) => void;
  assignDriver: (id: string, driver: DriverInfo) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],
  isLoading: false,
  hasFetched: false,
  error: null,
  fleetActivities: initialFleetActivities,
  availableDrivers: [],

  setOrders: (orders) => set({ orders, hasFetched: true }),

  fetchOrders: async (force = false) => {
    if (get().hasFetched && !force && get().orders.length > 0) {
      return get().orders;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getAllOrders();
      const rawOrders = response.data || [];
      const mappedOrders = rawOrders.map(mapApiOrderToOrder);

      set({ orders: mappedOrders, hasFetched: true, isLoading: false });
      return mappedOrders;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || "Failed to fetch orders";
      set({ error: errMsg, isLoading: false });
      throw err;
    }
  },

  addOrder: (data) => {
    const randomId = `#K3-${Math.floor(8300 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...data,
      id: randomId,
      documentId: randomId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  updateOrderStatus: (idOrDocumentId, newStatus) => {
    // Find target order to get its documentId
    const currentOrders = get().orders;
    const targetOrder = currentOrders.find(
      (o) => o.id === idOrDocumentId || o.documentId === idOrDocumentId,
    );
    // Optimistically update local Zustand state
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === idOrDocumentId || o.documentId === idOrDocumentId
          ? { ...o, status: newStatus }
          : o,
      ),
    }));

    // Emit Socket event "update-order" with documentId
    const docId = targetOrder?.documentId?.toString() || "";
    updateOrderStatusSocket({ orderDocumentId: docId, orderStatus: newStatus });
  },

  updateOrderPaymentStatus: (id, paymentStatus) => {
    const currentOrders = get().orders;
    const targetOrder = currentOrders.find(
      (o) => o.id === id || o.documentId === id,
    );

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id || o.documentId === id ? { ...o, paymentStatus } : o,
      ),
    }));

    if (paymentStatus === "Paid" || paymentStatus === "paid") {
      const docId = targetOrder?.documentId?.toString() || id;
      if (docId) {
        markOrderPaidSocket(docId);
      }
    }
  },

  assignDriver: (id, driver) => {
    const currentOrders = get().orders;
    const targetOrder = currentOrders.find(
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

    // Optimistically update local Zustand state (pickupPerson/deliveryPerson and status)
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id || o.documentId === id
          ? { ...o, ...updatedPerson, status: newStatus || o.status }
          : o,
      ),
    }));

    // Emit Socket event "update-order" with documentId, status, and pickup/delivery driver ID
    const docId = targetOrder?.documentId?.toString() || id;

    if (isDeliveryPhase) {
      updateOrderStatusSocket({
        orderDocumentId: docId,
        orderStatus: newStatus,
        deliveryDriverDocumentId: driver.id,
      });
    } else {
      updateOrderStatusSocket({
        orderDocumentId: docId,
        orderStatus: newStatus,
        pickupDriverDocumentId: driver.id,
      });
    }
  },

  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id && o.documentId !== id),
    }));
  },
}));

export default useOrderStore;
