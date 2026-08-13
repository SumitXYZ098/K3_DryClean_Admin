import dayjs from "dayjs";
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  ServiceType,
  OrderItem,
  DriverInfo,
} from "../store/useOrderStore";

export interface ApiOrderItem {
  quantity: number;
  serviceName: string;
  serviceVarientName?: string | null;
  price: number;
  offerPrice?: number | null;
}

export interface ApiAddress {
  fullAddress?: string | null;
}

export interface ApiUser {
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  totalOrders?: number;
  totalSpend?: number;
}

export interface ApiPerson {
  fullName?: string | null;
}

export interface ApiOrder {
  id?: number | string;
  documentId?: string;
  orderNo: string;
  orderStatus: string;
  createdAt: string;
  paymentStatus: string;
  specialInstruction?: string | null;
  pickupDate?: string;
  pickupTime?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  grandTotal: number;
  pickupAddress?: ApiAddress | null;
  deliveryAddress?: ApiAddress | null;
  user?: ApiUser | null;
  orderItems?: ApiOrderItem[];
  deliveryPerson?: ApiPerson | null;
  pickupPerson?: ApiPerson | null;
}

export interface GetAllOrdersResponse {
  data: ApiOrder[];
}

export const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => {
  const customerName = apiOrder.user?.fullName || "Guest Customer";
  const customerPhone = apiOrder.user?.phone || "";
  const customerEmail = apiOrder.user?.email || "";

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "TBD";
    const combinedStr = timeStr ? `${dateStr} ${timeStr}` : dateStr;
    const parsed = dayjs(combinedStr);
    if (!parsed.isValid()) return combinedStr;
    return timeStr
      ? parsed.format("MMM D, YYYY h:mm A")
      : parsed.format("MMM D, YYYY");
  };

  const pickupDate = formatDateTime(apiOrder.pickupDate, apiOrder.pickupTime);
  const deliveryDate = formatDateTime(
    apiOrder.deliveryDate,
    apiOrder.deliveryTime,
  );

  const deliveryDriverName = apiOrder.deliveryPerson?.fullName || "";
  const deliveryPerson: DriverInfo | null = deliveryDriverName
    ? {
        id: "d1",
        name: deliveryDriverName,
        initials:
          deliveryDriverName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "DR",
      }
    : null;

  const pickupDriverName = apiOrder.pickupPerson?.fullName || "";
  const pickupPerson: DriverInfo | null = pickupDriverName
    ? {
        id: "d2",
        name: pickupDriverName,
        initials:
          pickupDriverName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "DR",
      }
    : null;

  let paymentStatus: PaymentStatus = "Unpaid";
  if (apiOrder.paymentStatus) {
    const pLower = apiOrder.paymentStatus.toLowerCase();
    if (pLower === "paid" || pLower === "completed") paymentStatus = "Paid";
    else if (pLower === "refunded") paymentStatus = "Refunded";
    else if (pLower === "cancelled" || pLower === "canceled") paymentStatus = "cancelled";
    else paymentStatus = "Unpaid";
  }

  let orderStatusMapped: OrderStatus = "pending";
  if (apiOrder.orderStatus) {
    const sLower = apiOrder.orderStatus.toLowerCase();
    if (sLower === "cancelled" || sLower === "canceled") orderStatusMapped = "cancelled";
    else orderStatusMapped = apiOrder.orderStatus as OrderStatus;
  }

  const items: OrderItem[] = (apiOrder.orderItems || []).map((it, idx) => ({
    id: `item_${idx}`,
    name: `${it.serviceName}${
      it.serviceVarientName ? ` (${it.serviceVarientName})` : ""
    }`,
    quantity: it.quantity,
    price: it.offerPrice ?? it.price,
  }));

  const firstService = apiOrder.orderItems?.[0]?.serviceName || "";
  let serviceType: ServiceType = "Dry Clean Only";
  const sLower = firstService.toLowerCase();
  if (sLower.includes("wash")) serviceType = "Wash & Fold";
  else if (sLower.includes("iron")) serviceType = "Ironing";
  else if (sLower.includes("carpet") || sLower.includes("house"))
    serviceType = "Household Items";

  return {
    id: apiOrder.orderNo || `#ORD-${apiOrder.id}`,
    documentId: apiOrder.documentId || apiOrder.orderNo,
    customerName,
    customerTier: "Guest Order",
    customerEmail,
    customerPhone,
    pickupDate,
    deliveryDate,
    deliveryPerson,
    pickupPerson,
    paymentStatus,
    status: orderStatusMapped,
    serviceType,
    totalAmount: apiOrder.grandTotal || 0,
    items,
    deliveryAddress:
      apiOrder.deliveryAddress?.fullAddress ||
      apiOrder.pickupAddress?.fullAddress ||
      "",
    specialInstructions: apiOrder.specialInstruction || "",
    createdAt: apiOrder.createdAt || new Date().toISOString(),
  };
};

export const orderApi = {
  /**
   * Fetch all orders from backend API
   */
  getAllOrders: async (): Promise<GetAllOrdersResponse> => {
    return await api.get<GetAllOrdersResponse>(ENDPOINTS.getAllOrder);
  },
};

export default orderApi;
