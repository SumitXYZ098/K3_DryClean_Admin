import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import dayjs from "dayjs";
import type {
  PaymentTransaction,
  PaymentStatus,
  RawPaymentLogResponse,
  OrderItemSummary,
} from "../types/payment";

const formatPaymentMethod = (methodStr?: string): string => {
  if (!methodStr) return "Online";
  const lower = methodStr.toLowerCase();
  if (lower === "cod" || lower === "cash") return "Cash (COD)";
  if (lower === "upi" || lower === "online_upi") return "Online (UPI)";
  if (lower === "credit_card" || lower === "card") return "Credit Card";
  if (lower === "debit_card") return "Debit Card";
  if (lower === "net_banking" || lower === "netbanking") return "Net Banking";
  return methodStr.charAt(0).toUpperCase() + methodStr.slice(1);
};

const formatPaymentStatus = (statusStr?: string): PaymentStatus => {
  if (!statusStr) return "Pending";
  const lower = statusStr.toLowerCase();
  if (lower === "paid") return "Paid";
  if (lower === "refunded") return "Refunded";
  if (lower === "failed" || lower === "expired" || lower === "cancelled")
    return "Failed";
  return "Pending";
};

export const transformRawLogToTransaction = (
  raw: RawPaymentLogResponse,
): PaymentTransaction => {
  const items: OrderItemSummary[] =
    raw.orderItems && raw.orderItems.length > 0
      ? raw.orderItems.map((item) => {
          const serviceName = item.service?.name || "Service";
          const variantName = item.service_varient?.name
            ? ` (${item.service_varient.name})`
            : "";
          return {
            name: `${serviceName}${variantName} x${item.quantity}`,
            price: Number(item.totalPrice || 0),
            quantity: Number(item.quantity || 1),
          };
        })
      : [
          {
            name: `Order #${raw.order?.orderNo || raw.documentId}`,
            price: Number(raw.amount || 0),
            quantity: 1,
          },
        ];

  return {
    documentId: raw.documentId,
    id: raw.paymentId || `PAY-${raw.documentId.slice(-6).toUpperCase()}`,
    orderId: raw.order?.orderNo || "N/A",
    customerName: raw.customer?.fullName || "Walk-in Customer",
    customerPhone: raw.customer?.phoneNumber || "",
    amount: Number(raw.amount || 0),
    method: formatPaymentMethod(raw.order?.paymentMethod),
    status: formatPaymentStatus(raw.payment_status),
    date: raw.paymentDate
      ? dayjs(raw.paymentDate).format("DD MMM YYYY, hh:mm a")
      : "",
    transactionId:
      raw.transactionId ||
      raw.paymentId ||
      `TXN-${raw.documentId.slice(-8).toUpperCase()}`,
    createdAt: dayjs(raw.createdAt).format("DD MMM YYYY, hh:mm a"),
    items,
  };
};

export const paymentApi = {
  getAllPayments: async (): Promise<PaymentTransaction[]> => {
    try {
      const response = await apiClient.get(ENDPOINTS.getAllPayments);
      const rawLogs: RawPaymentLogResponse[] = Array.isArray(response.data)
        ? response.data
        : response.data?.data && Array.isArray(response.data.data)
          ? response.data.data
          : [];

      return rawLogs.map(transformRawLogToTransaction);
    } catch (error) {
      console.warn("Payment API error, using initial fallback data:", error);
      return [];
    }
  },

  refundPayment: async (
    documentId: string,
    reason?: string,
  ): Promise<boolean> => {
    try {
      await apiClient.post(ENDPOINTS.processRefund(documentId), {
        reason: reason || "Admin initiated refund from dashboard",
      });
      return true;
    } catch (error) {
      console.error(`Error refunding payment ${documentId}:`, error);
      throw error;
    }
  },

  updatePaymentStatus: async (
    paymentId: string,
    status: PaymentStatus,
  ): Promise<boolean> => {
    try {
      await apiClient.patch(`${ENDPOINTS.getAllPayments}/${paymentId}`, {
        status: status.toLowerCase(),
      });
      return true;
    } catch (error) {
      console.error(`Error updating payment ${paymentId} status:`, error);
      return false;
    }
  },
};

export default paymentApi;
