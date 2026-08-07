import { create } from "zustand";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Issues";

export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

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
  driver: DriverInfo | null;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  serviceType: ServiceType;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress?: string;
  specialInstructions?: string;
  createdAt: string;
}

const initialOrders: Order[] = [
  {
    id: "#K3-8291",
    customerName: "Elena Rodriguez",
    customerTier: "Premium Membership",
    customerEmail: "elena.r@example.com",
    customerPhone: "(555) 234-5678",
    pickupDate: "Oct 24, 09:00 AM",
    deliveryDate: "Oct 26, 05:00 PM",
    driver: { id: "d1", name: "John Smith", initials: "JS", phone: "(555) 111-2233" },
    paymentStatus: "Paid",
    status: "Processing",
    serviceType: "Dry Clean Only",
    totalAmount: 64.5,
    items: [
      { id: "i1", name: "Silk Evening Dress", quantity: 1, price: 35.0 },
      { id: "i2", name: "Wool Blazer", quantity: 1, price: 29.5 },
    ],
    deliveryAddress: "742 Evergreen Terrace, Sector 4",
    specialInstructions: "Handle silk dress with extreme care. No harsh scents.",
    createdAt: "2023-10-24T09:00:00Z",
  },
  {
    id: "#K3-8288",
    customerName: "Julian Alcaraz",
    customerTier: "Guest Order",
    customerEmail: "julian.a@webmail.com",
    customerPhone: "(555) 876-5432",
    pickupDate: "Oct 24, 11:30 AM",
    deliveryDate: "Oct 26, 12:00 PM",
    driver: null,
    paymentStatus: "Unpaid",
    status: "Pending",
    serviceType: "Wash & Fold",
    totalAmount: 28.0,
    items: [
      { id: "i3", name: "Mixed Laundry Bag (10 lbs)", quantity: 1, price: 28.0 },
    ],
    deliveryAddress: "128 Maple Ave, Suite 3B",
    specialInstructions: "Ring bell upon arrival.",
    createdAt: "2023-10-24T11:30:00Z",
  },
  {
    id: "#K3-8285",
    customerName: "Sarah Jenkins",
    customerTier: "Bulk/Commercial",
    customerEmail: "s.jenkins@grandhotel.com",
    customerPhone: "(555) 444-9988",
    pickupDate: "Oct 23, 02:00 PM",
    deliveryDate: "Oct 25, 10:00 AM",
    driver: { id: "d2", name: "Mike Wong", initials: "MW", phone: "(555) 333-4455" },
    paymentStatus: "Paid",
    status: "Ready",
    serviceType: "Household Items",
    totalAmount: 185.0,
    items: [
      { id: "i4", name: "King Size Duvet", quantity: 3, price: 45.0 },
      { id: "i5", name: "Tablecloths Set", quantity: 5, price: 10.0 },
    ],
    deliveryAddress: "100 Grand Hotel Plaza",
    specialInstructions: "Deliver to Loading Dock B.",
    createdAt: "2023-10-23T14:00:00Z",
  },
  {
    id: "#K3-8281",
    customerName: "Liam O'Connell",
    customerTier: "Mobile User",
    customerEmail: "liam.oc@mobile.org",
    customerPhone: "(555) 777-6655",
    pickupDate: "Oct 23, 04:30 PM",
    deliveryDate: "Oct 25, 04:30 PM",
    driver: { id: "d1", name: "John Smith", initials: "JS", phone: "(555) 111-2233" },
    paymentStatus: "Paid",
    status: "Out for Delivery",
    serviceType: "Ironing",
    totalAmount: 42.0,
    items: [
      { id: "i6", name: "Dress Shirts (Pressed)", quantity: 6, price: 7.0 },
    ],
    deliveryAddress: "45 West 12th Street, Apt 8A",
    specialInstructions: "Leave on doorknob if absent.",
    createdAt: "2023-10-23T16:30:00Z",
  },
  {
    id: "#K3-8276",
    customerName: "Amara Patel",
    customerTier: "Premium Membership",
    customerEmail: "amara.p@techfirm.co",
    customerPhone: "(555) 901-2345",
    pickupDate: "Oct 22, 10:00 AM",
    deliveryDate: "Oct 24, 03:00 PM",
    driver: { id: "d3", name: "David Miller", initials: "DM", phone: "(555) 222-7788" },
    paymentStatus: "Paid",
    status: "Delivered",
    serviceType: "Dry Clean Only",
    totalAmount: 95.0,
    items: [
      { id: "i7", name: "Winter Trench Coat", quantity: 1, price: 45.0 },
      { id: "i8", name: "Cashmere Sweater", quantity: 2, price: 25.0 },
    ],
    deliveryAddress: "88 Ocean Parkway, Penthouse B",
    specialInstructions: "Customer requested eco-friendly packaging.",
    createdAt: "2023-10-22T10:00:00Z",
  },
  {
    id: "#K3-8270",
    customerName: "Carlos Santana",
    customerTier: "VIP Client",
    customerEmail: "carlos.s@studio.net",
    customerPhone: "(555) 654-3210",
    pickupDate: "Oct 22, 01:15 PM",
    deliveryDate: "Oct 24, 06:00 PM",
    driver: null,
    paymentStatus: "Unpaid",
    status: "Issues",
    serviceType: "Wash & Fold",
    totalAmount: 38.5,
    items: [
      { id: "i9", name: "Special Fabric Uniforms", quantity: 2, price: 19.25 },
    ],
    deliveryAddress: "310 Sunset Blvd",
    specialInstructions: "Stain removal on collar required.",
    createdAt: "2023-10-22T13:15:00Z",
  },
];

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
  fleetActivities: FleetActivity[];
  availableDrivers: DriverInfo[];
  addOrder: (data: Omit<Order, "id" | "createdAt">) => Order;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  updateOrderPaymentStatus: (id: string, paymentStatus: PaymentStatus) => void;
  assignDriver: (id: string, driver: DriverInfo) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStoreState>((set) => ({
  orders: initialOrders,
  fleetActivities: initialFleetActivities,
  availableDrivers: [
    { id: "d1", name: "John Smith", initials: "JS", phone: "(555) 111-2233" },
    { id: "d2", name: "Mike Wong", initials: "MW", phone: "(555) 333-4455" },
    { id: "d3", name: "David Miller", initials: "DM", phone: "(555) 222-7788" },
    { id: "d4", name: "Sarah Vance", initials: "SV", phone: "(555) 444-1122" },
  ],

  addOrder: (data) => {
    const randomId = `#K3-${Math.floor(8300 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...data,
      id: randomId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  updateOrderStatus: (id, newStatus) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      ),
    }));
  },

  updateOrderPaymentStatus: (id, paymentStatus) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus } : o
      ),
    }));
  },

  assignDriver: (id, driver) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, driver } : o
      ),
    }));
  },

  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    }));
  },
}));

export default useOrderStore;
