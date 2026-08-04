import { create } from "zustand";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  walletBalance: number;
  status: "Active" | "Suspended";
  lastOrder: string;
  avatarUrl?: string;
  initials?: string;
  initialsBg?: string;
  addressType?: "home" | "work" | "other";
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notifications?: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  specialInstructions?: string;
  preferredPaymentMethod?: "credit" | "cash" | "terms" | "digital";
}

const initialCustomers: Customer[] = [
  {
    id: "#K3-4902",
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    totalOrders: 42,
    walletBalance: 124.5,
    status: "Active",
    lastOrder: "Oct 24, 2023",
    initials: "SM",
    initialsBg: "bg-primary-fixed text-primary font-bold",
  },
  {
    id: "#K3-4811",
    name: "David Chen",
    email: "d.chen@techmail.io",
    phone: "(555) 987-6543",
    totalOrders: 15,
    walletBalance: 0.0,
    status: "Active",
    lastOrder: "Nov 02, 2023",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  },
  {
    id: "#K3-3762",
    name: "Robert Lewis",
    email: "rlewis@provider.com",
    phone: "(555) 444-3322",
    totalOrders: 8,
    walletBalance: -12.4,
    status: "Suspended",
    lastOrder: "Aug 15, 2023",
    initials: "RL",
    initialsBg: "bg-secondary-container text-secondary font-bold",
  },
  {
    id: "#K3-5001",
    name: "Emily Knight",
    email: "em.knight@web.com",
    phone: "(555) 222-0000",
    totalOrders: 112,
    walletBalance: 560.0,
    status: "Active",
    lastOrder: "Nov 05, 2023",
    initials: "EK",
    initialsBg: "bg-primary-fixed text-primary font-bold",
  },
  {
    id: "#K3-2219",
    name: "Martha Stewart",
    email: "m.stewart@domain.net",
    phone: "(555) 777-8899",
    totalOrders: 24,
    walletBalance: 88.25,
    status: "Active",
    lastOrder: "Oct 28, 2023",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
  },
];

interface CustomerState {
  customers: Customer[];
  addCustomer: (newCustData: {
    name: string;
    email: string;
    phone: string;
    addressType?: "home" | "work" | "other";
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    notifications?: {
      sms: boolean;
      email: boolean;
      whatsapp: boolean;
    };
    specialInstructions?: string;
    walletBalance?: number;
    preferredPaymentMethod?: "credit" | "cash" | "terms" | "digital";
  }) => Customer;
  toggleCustomerStatus: (id: string) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: initialCustomers,
  addCustomer: (data) => {
    const initials = data.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CU";

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCustomer: Customer = {
      id: `#K3-${randomNum}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: 0,
      walletBalance: data.walletBalance ?? 0,
      status: "Active",
      lastOrder: "Just now",
      initials,
      initialsBg: "bg-primary-fixed text-primary font-bold",
      addressType: data.addressType,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      notifications: data.notifications,
      specialInstructions: data.specialInstructions,
      preferredPaymentMethod: data.preferredPaymentMethod,
    };

    set((state) => ({
      customers: [newCustomer, ...state.customers],
    }));

    return newCustomer;
  },
  toggleCustomerStatus: (id) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" }
          : c
      ),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
}));

export default useCustomerStore;
