/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface VariantPricing {
  price: number;
  offerPrice?: number | null;
}

export interface ServiceVariant {
  documentId: string;
  name: string;
  expressDeliveryAvailable?: boolean;
  pricing?: VariantPricing | null;
}

export interface ServiceWithVariants {
  documentId: string;
  name: string;
  varients?: ServiceVariant[];
  variants?: ServiceVariant[];
}

export interface GetServicesWithVariantsResponse {
  data: ServiceWithVariants[];
}

export const DEFAULT_SERVICES_WITH_VARIANTS: ServiceWithVariants[] = [
  {
    documentId: "y8zwnm6c00epxcy2ho64dfpi",
    name: "shoe cleaning",
    varients: [
      {
        documentId: "bdqfkk62ysibppia3lipx0nh",
        name: "sports shoes",
        expressDeliveryAvailable: true,
        pricing: { price: 260, offerPrice: 249 },
      },
      {
        documentId: "rzx7dmu2n2it18e9yj9w8sl3",
        name: "canvas shoes",
        expressDeliveryAvailable: false,
        pricing: { price: 1, offerPrice: null },
      },
      {
        documentId: "i8gz8632rrzdd8j6gn5xn3h2",
        name: "boots",
        expressDeliveryAvailable: true,
        pricing: { price: 1, offerPrice: null },
      },
    ],
  },
  {
    documentId: "ptb3e65nn96gz70qz58r1jqs",
    name: "stream and iron",
    varients: [
      {
        documentId: "xmft2kitzed4k7te2h8xdlxo",
        name: "t-shirt",
        expressDeliveryAvailable: true,
        pricing: { price: 100, offerPrice: 99 },
      },
      {
        documentId: "rjjgukhh8zegv6ltfbj96kca",
        name: "blazer",
        expressDeliveryAvailable: true,
        pricing: { price: 260, offerPrice: 249 },
      },
      {
        documentId: "ljpzpp0qu7qunwkibh5widwd",
        name: "suit",
        expressDeliveryAvailable: true,
        pricing: { price: 249, offerPrice: null },
      },
    ],
  },
  {
    documentId: "wnbjkwjkhcq7p1xz1k7ukncm",
    name: "wash and fold",
    varients: [
      {
        documentId: "vsqn79o1wsq1h84hrnyk9530",
        name: "blanket",
        expressDeliveryAvailable: true,
        pricing: { price: 699, offerPrice: 549 },
      },
      {
        documentId: "p347sam547zt2f4lmqjjopne",
        name: "curtains",
        expressDeliveryAvailable: false,
        pricing: { price: 100, offerPrice: 99 },
      },
      {
        documentId: "gczllgpa7uvwnarhgn323a4v",
        name: "bedsheet",
        expressDeliveryAvailable: true,
        pricing: { price: 99, offerPrice: null },
      },
    ],
  },
  {
    documentId: "hubqzctmbiwbs7r2r1zcc62o",
    name: "carpet cleaning",
    varients: [
      {
        documentId: "u37ttrfimyebk1gi5npsixyi",
        name: "small carpet",
        expressDeliveryAvailable: true,
        pricing: { price: 450, offerPrice: 399 },
      },
      {
        documentId: "ck5ff94p032nwcr9p6ufwqvw",
        name: "medium carpet",
        expressDeliveryAvailable: false,
        pricing: { price: 500, offerPrice: 449 },
      },
      {
        documentId: "vhvb9roj1mvilmx6ipda55mh",
        name: "large carpet",
        expressDeliveryAvailable: false,
        pricing: { price: 649, offerPrice: null },
      },
    ],
  },
  {
    documentId: "bsugn5abrloodwvnymaow7yk",
    name: "dry cleaning",
    varients: [
      {
        documentId: "wo209qg83jrsvjjctn3btnq8",
        name: "T-shirt",
        expressDeliveryAvailable: true,
        pricing: { price: 100, offerPrice: 89 },
      },
      {
        documentId: "exjxmk9803v7cw6cxo5pt044",
        name: "jeans",
        expressDeliveryAvailable: true,
        pricing: { price: 110, offerPrice: 99 },
      },
      {
        documentId: "pzzw0zafyp5f4wutjro2zii9",
        name: "skirt",
        expressDeliveryAvailable: true,
        pricing: { price: 99, offerPrice: null },
      },
    ],
  },
];

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
  expressDelivery?: boolean;
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
    else if (pLower === "cancelled" || pLower === "canceled")
      paymentStatus = "cancelled";
    else paymentStatus = "Unpaid";
  }

  let orderStatusMapped: OrderStatus = "pending";
  if (apiOrder.orderStatus) {
    const sLower = apiOrder.orderStatus.toLowerCase();
    if (sLower === "cancelled" || sLower === "canceled")
      orderStatusMapped = "cancelled";
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
    expressDelivery: apiOrder.expressDelivery || false,
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

export interface CreateOrderItemPayload {
  service: string;
  service_varient: string;
  quantity: number;
  expressDelivery: boolean;
}

export interface CreateOrderApiPayload {
  userProfile: string;
  items: CreateOrderItemPayload[];
  pickup_address: string;
  delivery_address: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
}

export const orderApi = {
  /**
   * Fetch all orders from backend API
   */
  getAllOrders: async (): Promise<GetAllOrdersResponse> => {
    return await api.get<GetAllOrdersResponse>(ENDPOINTS.getAllOrder);
  },

  /**
   * Fetch services with variants and pricing from backend API
   */
  getServicesWithVariants:
    async (): Promise<GetServicesWithVariantsResponse> => {
      return await api.get<GetServicesWithVariantsResponse>(
        ENDPOINTS.getServicesWithVariants,
      );
    },

  /**
   * Create a new order via backend API
   */
  createOrder: async (payload: CreateOrderApiPayload): Promise<any> => {
    return await api.post(ENDPOINTS.createOrder, payload);
  },
};

export default orderApi;
