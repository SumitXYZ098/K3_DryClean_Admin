/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import useAuthStore from "../store/useAuthStore";
import useCustomerStore from "../store/useCustomerStore";
import useOrderStore from "../store/useOrderStore";
import useNotificationStore from "../store/useNotificationStore";

const SERVER_URL =
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

/**
 * Emits room join events to the backend socket for admin rooms
 */
export const joinAdminRooms = (targetSocket: Socket | null = socket) => {
  if (!targetSocket || !targetSocket.connected) return;
  const rooms = ["admin-users", "admin-orders", "admin-notifications"];
  rooms.forEach((room) => {
    // console.log(`[Socket.IO] Joining room: ${room}`);
    targetSocket.emit("join-room", room);
    targetSocket.emit("join", room);
    targetSocket.emit("subscribe", room);
  });
};

export const connectSocket = (
  onNotificationReceived?: (data: any) => void,
  onStatusChange?: (isConnected: boolean) => void,
  onOrderStatusChange?: (data: any) => void,
  onCustomerUpdate?: (data: any) => void,
) => {
  const token =
    useAuthStore.getState().getToken() ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("jwt") ||
    sessionStorage.getItem("token");

  if (!token) {
    console.warn("[Socket.IO] Cannot connect: Authentication token missing.");
    if (onStatusChange) onStatusChange(false);
    return null;
  }

  // Helper to attach event listeners to socket instance
  const attachRoomListeners = (s: Socket) => {
    // 1. Customer updates (admin-users room)
    s.off("admin-users");
    s.on("admin-users", (data) => {
      console.log("[Socket.IO] admin-users update event received:", data);
      useCustomerStore
        .getState()
        .fetchCustomers(true)
        .catch((err) => {
          console.error("[Socket.IO] Failed to auto-refresh customers:", err);
        });
      if (onCustomerUpdate) onCustomerUpdate(data);
    });

    // 2. Order updates (admin-orders room)
    s.off("admin-orders");
    s.on("admin-orders", (data) => {
      console.log("[Socket.IO] admin-orders update event received:", data);
      useOrderStore
        .getState()
        .fetchOrders(true)
        .catch((err) => {
          console.error("[Socket.IO] Failed to auto-refresh orders:", err);
        });
      if (onOrderStatusChange) onOrderStatusChange(data);
    });

    // 3. Notification updates (admin-notifications room)
    s.off("admin-notifications");
    s.on("admin-notifications", (data) => {
      console.log(
        "[Socket.IO] admin-notifications update event received:",
        data,
      );
      if (
        data &&
        typeof data === "object" &&
        (data.title || data.id || data.documentId)
      ) {
        useNotificationStore.getState().addNotification(data);
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
      if (onNotificationReceived) onNotificationReceived(data);
    });

    // Legacy / Specific event listeners
    if (onNotificationReceived) {
      s.off("new-notification");
      s.on("new-notification", (notification) => {
        console.log("[Socket.IO] New notification received:", notification);
        onNotificationReceived(notification);
      });
    }

    s.off("order-status-success");
    s.off("order-status-updated");
    s.off("order-update");
    s.on("order-status-success", (data) => {
      console.log("[Socket.IO] Order status success:", data);
      if (onOrderStatusChange) onOrderStatusChange(data);
    });
    s.on("order-status-updated", (data) => {
      console.log("[Socket.IO] Order status updated event received:", data);
      if (onOrderStatusChange) onOrderStatusChange(data);
    });
    s.on("order-update", (data) => {
      console.log("[Socket.IO] order-update event received:", data);
      useOrderStore
        .getState()
        .fetchOrders(true)
        .catch((err) => {
          console.error(
            "[Socket.IO] Failed to auto-refresh orders on order-update:",
            err
          );
        });
      if (onOrderStatusChange) onOrderStatusChange(data);
    });
  };

  // If socket is already active and connected
  if (socket && socket.connected) {
    if (onStatusChange) onStatusChange(true);
    joinAdminRooms(socket);
    attachRoomListeners(socket);
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // console.log("[Socket.IO] Connecting to server:", SERVER_URL);

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
    console.log("[Socket.IO] Connected. Socket ID:", socket?.id);
    if (socket) {
      joinAdminRooms(socket);
      attachRoomListeners(socket);
    }
    if (onStatusChange) onStatusChange(true);
  });

  socket.on("socket-authenticated", (data) => {
    console.log("[Socket.IO] Socket authenticated successfully:", data);
    if (socket) {
      joinAdminRooms(socket);
    }
    if (onStatusChange) onStatusChange(true);
  });

  attachRoomListeners(socket);

  socket.on("order-status-error", (data) => {
    console.error("[Socket.IO] Order status update error:", data);
  });

  socket.on("socket-error", (err) => {
    console.error("[Socket.IO] Authentication or server error:", err);
    if (onStatusChange) onStatusChange(false);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[Socket.IO] Disconnected. Reason:", reason);
    if (onStatusChange) onStatusChange(false);
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
    console.log("[Socket.IO] Emitting update-order", payload);
    activeSocket.emit("update-order", payload);
  } else {
    console.error(
      "[Socket.IO] Unable to emit update-order: Socket unavailable.",
    );
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("[Socket.IO] Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};
