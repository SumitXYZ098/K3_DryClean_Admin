import { create } from "zustand";
import type { ApiDriver, DriverDocumentItem, DriverOrderItem } from "../api/driverApi";

export type { DriverOrderItem };

export interface Driver {
  id: number;
  documentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleNumber: string;
  isActive: boolean;
  pickupOrdersCount: number;
  deliveryOrdersCount: number;
  documentsCount: number;
  createdAt: string;
  updatedAt: string;
  documents?: DriverDocumentItem[];
  order_pickup?: DriverOrderItem[];
  order_deliver?: DriverOrderItem[];
}

export const mapApiDriverToDriver = (apiDriver: ApiDriver): Driver => {
  const pickupOrders = apiDriver.order_pickup || [];
  const deliverOrders = apiDriver.order_deliver || [];
  const docs = apiDriver.driver_documents || apiDriver.documents || [];

  return {
    id: apiDriver.id,
    documentId: apiDriver.documentId || String(apiDriver.id),
    fullName: apiDriver.fullName || "Unnamed Driver",
    email: apiDriver.email || "",
    phoneNumber: apiDriver.phoneNumber || "",
    vehicleNumber: apiDriver.vehicleNumber || "Unassigned",
    isActive:
      apiDriver.isActive === null || apiDriver.isActive === undefined
        ? true
        : Boolean(apiDriver.isActive),
    pickupOrdersCount: apiDriver.pickupOrdersCount ?? pickupOrders.length,
    deliveryOrdersCount: apiDriver.deliveryOrdersCount ?? deliverOrders.length,
    documentsCount: apiDriver.documentsCount ?? docs.length,
    createdAt: apiDriver.createdAt || new Date().toISOString(),
    updatedAt: apiDriver.updatedAt || new Date().toISOString(),
    documents: docs,
    order_pickup: pickupOrders,
    order_deliver: deliverOrders,
  };
};

interface DriverStore {
  drivers: Driver[];
  selectedDriver: Driver | null;
  hasFetched: boolean;
  setDrivers: (drivers: Driver[]) => void;
  addDriver: (driver: Driver) => void;
  updateDriverInStore: (documentId: string, updated: Partial<Driver>) => void;
  deleteDriverFromStore: (documentId: string) => void;
  setSelectedDriver: (driver: Driver | null) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  selectedDriver: null,
  hasFetched: false,

  setDrivers: (drivers) =>
    set({
      drivers,
      hasFetched: true,
    }),

  addDriver: (driver) =>
    set((state) => ({
      drivers: [driver, ...state.drivers],
    })),

  updateDriverInStore: (documentId, updated) =>
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.documentId === documentId ? { ...d, ...updated } : d,
      ),
      selectedDriver:
        state.selectedDriver?.documentId === documentId
          ? { ...state.selectedDriver, ...updated }
          : state.selectedDriver,
    })),

  deleteDriverFromStore: (documentId) =>
    set((state) => ({
      drivers: state.drivers.filter((d) => d.documentId !== documentId),
      selectedDriver:
        state.selectedDriver?.documentId === documentId
          ? null
          : state.selectedDriver,
    })),

  setSelectedDriver: (driver) => set({ selectedDriver: driver }),
}));

export default useDriverStore;
