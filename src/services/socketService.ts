/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import useAuthStore from "../store/useAuthStore";

const SERVER_URL =
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const connectSocket = (
  onNotificationReceived?: (data: any) => void,
  onStatusChange?: (isConnected: boolean) => void,
  onOrderStatusChange?: (data: any) => void,
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

  // If socket is already active and connected
  if (socket && socket.connected) {
    if (onStatusChange) onStatusChange(true);

    if (onNotificationReceived) {
      socket.off("new-notification");
      socket.on("new-notification", (notification) => {
        console.log("[Socket.IO] New notification received:", notification);
        onNotificationReceived(notification);
      });
    }

    if (onOrderStatusChange) {
      socket.off("order-status-success");
      socket.off("order-status-updated");
      socket.on("order-status-success", (data) => {
        console.log("[Socket.IO] Order status success:", data);
        onOrderStatusChange(data);
      });
      socket.on("order-status-updated", (data) => {
        console.log("[Socket.IO] Order status updated event received:", data);
        onOrderStatusChange(data);
      });
    }

    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  console.log("[Socket.IO] Connecting to server:", SERVER_URL);

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
    if (onStatusChange) onStatusChange(true);
  });

  socket.on("socket-authenticated", (data) => {
    console.log("[Socket.IO] Socket authenticated successfully:", data);
    if (onStatusChange) onStatusChange(true);
  });

  if (onNotificationReceived) {
    socket.on("new-notification", (notification) => {
      console.log("[Socket.IO] New notification received:", notification);
      onNotificationReceived(notification);
    });
  }

  socket.on("order-status-success", (data) => {
    console.log("[Socket.IO] Order status success:", data);
    if (onOrderStatusChange) {
      onOrderStatusChange(data);
    }
  });

  socket.on("order-status-updated", (data) => {
    console.log("[Socket.IO] Order status updated event received:", data);
    if (onOrderStatusChange) {
      onOrderStatusChange(data);
    }
  });

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
export const updateOrderStatusSocket = (
  orderDocumentId: string,
  orderStatus: string,
) => {
  let activeSocket = getSocket();
  if (!activeSocket || !activeSocket.connected) {
    activeSocket = connectSocket();
  }

  if (activeSocket) {
    const payload = {
      orderDocumentId,
      orderStatus,
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
