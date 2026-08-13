/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import useAuthStore from "../store/useAuthStore";
import useOrderStore from "../store/useOrderStore";
import useNotificationStore from "../store/useNotificationStore";
import useCustomerStore from "../store/useCustomerStore";

const SERVER_URL =
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

let socket: Socket | null = null;
let notificationCallback: ((data: any) => void) | null = null;
let orderStatusCallback: ((data: any) => void) | null = null;
let statusChangeCallback: ((isConnected: boolean) => void) | null = null;

export const getSocket = (): Socket | null => socket;

const attachListeners = (s: Socket) => {
  // --- NOTIFICATION EVENT LISTENERS ---
  const handleNotification = (data: any) => {
    // console.log("[Socket.IO] Notification event received:", data);
    const payload = data?.notification || data?.data || data;
    if (notificationCallback) {
      notificationCallback(payload);
    } else if (payload && typeof payload === "object") {
      useNotificationStore.getState().addNotification(payload);
    } else {
      useNotificationStore
        .getState()
        .fetchNotifications()
        .catch((err) => {
          console.error(
            "[Socket.IO] Failed to auto-refresh notifications:",
            err,
          );
        });
    }
  };

  s.off("admin-notifications");
  s.off("new-notification");
  s.off("notification");
  s.on("admin-notifications", handleNotification);
  s.on("new-notification", handleNotification);
  s.on("notification", handleNotification);

  // --- ORDER EVENT LISTENERS ---
  const handleOrderChange = (data: any) => {
    // console.log("[Socket.IO] Order change event received:", data);
    useOrderStore
      .getState()
      .fetchOrders(true)
      .then((orders) => {
        (orders || []).forEach((o) => {
          if (o.documentId) {
            joinOrderRoomSocket(o.documentId);
          }
        });
      })
      .catch((err) => {
        console.error("[Socket.IO] Failed to auto-refresh orders:", err);
      });
    if (orderStatusCallback) {
      orderStatusCallback(data);
    }
  };

  s.off("admin-orders");
  s.off("order-created");
  s.off("order-updated");
  s.off("order-update-success");
  s.off("order-status-success");
  s.off("order-status-updated");
  s.off("order-update");

  s.on("admin-orders", handleOrderChange);
  s.on("order-created", handleOrderChange);
  s.on("order-updated", handleOrderChange);
  s.on("order-update-success", handleOrderChange);
  s.on("order-status-success", handleOrderChange);
  s.on("order-status-updated", handleOrderChange);
  s.on("order-update", handleOrderChange);

  // --- USER PROFILE EVENT LISTENERS ---
  const handleUserProfileChange = (data: any) => {
    console.log("[Socket.IO] User profile event received:", data);
    const profile = data?.profile || data?.data || data;
    if (profile && (profile.id || profile.documentId)) {
      useCustomerStore.getState().addCustomerProfileFromSocket(profile);
    }
    useCustomerStore
      .getState()
      .fetchCustomers(true)
      .catch((err) => {
        console.error("[Socket.IO] Failed to auto-refresh customers:", err);
      });
  };

  s.off("user-profile-created");
  s.on("user-profile-created", handleUserProfileChange);
};

export const connectSocket = (
  onNotificationReceived?: (data: any) => void,
  onStatusChange?: (isConnected: boolean) => void,
  onOrderStatusChange?: (data: any) => void,
) => {
  if (onNotificationReceived) notificationCallback = onNotificationReceived;
  if (onStatusChange) statusChangeCallback = onStatusChange;
  if (onOrderStatusChange) orderStatusCallback = onOrderStatusChange;

  const token =
    useAuthStore.getState().getToken() ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("jwt") ||
    sessionStorage.getItem("token");

  if (!token) {
    console.warn("[Socket.IO] Cannot connect: Authentication token missing.");
    if (statusChangeCallback) statusChangeCallback(false);
    return null;
  }

  // If socket is already active and connected
  if (socket && socket.connected) {
    if (statusChangeCallback) statusChangeCallback(true);
    attachListeners(socket);
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SERVER_URL, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    // console.log("[Socket.IO] Connected. Socket ID:", socket?.id);
    if (socket) {
      attachListeners(socket);
    }
    if (statusChangeCallback) statusChangeCallback(true);
  });

  socket.on("socket-authenticated", (data) => {
    console.log("[Socket.IO] Socket authenticated successfully:", data);
    if (statusChangeCallback) statusChangeCallback(true);
  });

  attachListeners(socket);

  socket.on("order-status-error", (data) => {
    console.error("[Socket.IO] Order status update error:", data);
  });

  socket.on("socket-error", (err) => {
    console.error("[Socket.IO] Authentication or server error:", err);
    if (statusChangeCallback) statusChangeCallback(false);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[Socket.IO] Disconnected. Reason:", reason);
    if (statusChangeCallback) statusChangeCallback(false);
  });

  return socket;
};

/**
 * Emit update-order-status event over Socket.IO by order documentId
 */
export const updateOrderStatusSocket = ({
  orderDocumentId,
  orderStatus,
  pickupDriverDocumentId,
  deliveryDriverDocumentId,
}: {
  orderDocumentId: string;
  orderStatus?: string;
  pickupDriverDocumentId?: string;
  deliveryDriverDocumentId?: string;
}) => {
  let activeSocket = getSocket();
  if (!activeSocket || !activeSocket.connected) {
    activeSocket = connectSocket();
  }

  if (activeSocket) {
    const payload = {
      orderDocumentId,
      orderStatus,
      pickupDriverDocumentId,
      deliveryDriverDocumentId,
    };
    // console.log("[Socket.IO] Emitting update-order", payload);
    activeSocket.emit("update-order", payload);
  } else {
    console.error(
      "[Socket.IO] Unable to emit update-order: Socket unavailable.",
    );
  }
};

/**
 * Emit join-order event over Socket.IO to join an order room
 */
export const joinOrderRoomSocket = (orderDocumentId: string) => {
  const activeSocket = getSocket();
  if (activeSocket && activeSocket.connected && orderDocumentId) {
    activeSocket.emit("join-order", orderDocumentId);
  }
};

/**
 * Emit mark-order-paid event over Socket.IO for COD orders
 */
export const markOrderPaidSocket = (orderDocumentId: string) => {
  let activeSocket = getSocket();
  if (!activeSocket || !activeSocket.connected) {
    activeSocket = connectSocket();
  }

  if (activeSocket) {
    // console.log("[Socket.IO] Emitting mark-order-paid for:", orderDocumentId);
    activeSocket.emit("mark-order-paid", { orderDocumentId });
  } else {
    console.error(
      "[Socket.IO] Unable to emit mark-order-paid: Socket unavailable.",
    );
  }
};

export const disconnectSocket = () => {
  if (socket) {
    // console.log("[Socket.IO] Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};
