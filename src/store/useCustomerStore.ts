/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import customerApi, {
  type CustomerProfileData,
  type CreateCustomerPayload,
  type CustomerAddress,
} from "../api/customerApi";

export interface Customer {
  id: string;
  numericId?: number;
  documentId?: string;
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
  addressType?: "home" | "work" | "other" | string;
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
  customer_addresses?: CustomerAddress[];
  rawProfile?: CustomerProfileData;
}

export const mapCustomerProfileToCustomer = (
  profile: CustomerProfileData
): Customer => {
  const initials =
    (profile.fullName || profile.email || "CU")
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CU";

  const defaultAddr =
    profile.customer_addresses?.find((a) => a.isDefaultAddress) ||
    profile.customer_addresses?.[0];

  const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || "";
  let avatarUrl: string | undefined = undefined;
  if (profile.profileImage?.url) {
    avatarUrl = profile.profileImage.url.startsWith("http")
      ? profile.profileImage.url
      : `${baseUrl}${profile.profileImage.url}`;
  }

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Just now";

  // Ensure id format starts with #K3- or retains provided customerId
  let formattedId = profile.customerId || `K3-${profile.id}`;
  if (!formattedId.startsWith("#")) {
    formattedId = `#${formattedId}`;
  }

  return {
    id: formattedId,
    numericId: profile.id,
    documentId: profile.documentId,
    name: profile.fullName || "Unnamed Customer",
    email: profile.email,
    phone: profile.phoneNumber,
    totalOrders: 0,
    walletBalance: 0,
    status:
      profile.accountStatus === "suspended" || profile.accountStatus === "Suspended"
        ? "Suspended"
        : "Active",
    lastOrder: formattedDate,
    avatarUrl,
    initials,
    initialsBg: "bg-primary-fixed text-primary font-bold",
    addressType: (defaultAddr?.addressType as "home" | "work" | "other") || "home",
    streetAddress: defaultAddr?.streetAddress || "",
    city: defaultAddr?.city || "",
    state: defaultAddr?.state || "",
    zipCode: defaultAddr?.postalCode || "",
    customer_addresses: profile.customer_addresses || [],
    rawProfile: profile,
  };
};

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;

  setCustomers: (customers: Customer[]) => void;
  fetchCustomers: (force?: boolean) => Promise<Customer[]>;
  createCustomer: (payload: CreateCustomerPayload) => Promise<Customer>;

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

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  hasFetched: false,
  error: null,

  setCustomers: (customers) => set({ customers, hasFetched: true }),

  fetchCustomers: async (force = false) => {
    // If already fetched and not forced, return cached state
    if (get().hasFetched && !force && get().customers.length > 0) {
      return get().customers;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.getCustomer();
      const mappedCustomers = (response.data || []).map(mapCustomerProfileToCustomer);
      set({ customers: mappedCustomers, hasFetched: true, isLoading: false });
      return mappedCustomers;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || "Failed to fetch customers";
      set({ error: errMsg, isLoading: false });
      throw err;
    }
  },

  createCustomer: async (payload: CreateCustomerPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.createCustomer(payload);
      const newCustomer = mapCustomerProfileToCustomer(response.data);
      set((state) => ({
        customers: [newCustomer, ...state.customers],
        hasFetched: true,
        isLoading: false,
      }));
      return newCustomer;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || "Failed to create customer";
      set({ error: errMsg, isLoading: false });
      throw err;
    }
  },

  addCustomer: (data) => {
    const initials =
      data.name
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
