/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface ServiceCategoryPayload {
  name: string;
  description?: string;
  tag?: string;
  image?: string;
  isActive?: boolean;
  estimatedDuration?: number;
}

export interface ServiceItemPayload {
  name: string;
  service?: string; // Service category documentId
  serviceId?: string;
  category?: string;
  price?: number;
  normalPrice?: number;
  offerPrice?: number | null;
  expressDeliveryPrice?: number | null;
  expressPrice?: number | null;
  expressDeliveryAvailable?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  description?: string;
}

export interface ServiceCategoryData {
  id: number | string;
  documentId: string;
  name: string;
  description?: string;
  tag?: string;
  image?: string;
  isActive: boolean;
  itemCount?: number;
  estimatedDuration?: number;
}

export interface ServiceItemData {
  id: number | string;
  documentId: string;
  name: string;
  category?: string;
  serviceId?: string;
  service?: any;
  price: number;
  expressDeliveryPrice?: number | null;
  expressPrice?: number | null;
  offerPrice?: number | null;
  expressDeliveryAvailable: boolean;
  displayOrder?: number;
  isActive: boolean;
  description?: string;
}

export const serviceApi = {
  /**
   * Fetch services with variants
   */
  getServicesWithVariants: async () => {
    return await api.get<{ data: any[] }>(ENDPOINTS.getServicesWithVariants);
  },

  /**
   * Fetch all service categories
   */
  getAllCategories: async () => {
    return await api.get<{ data: ServiceCategoryData[] }>(ENDPOINTS.getAllServices);
  },

  /**
   * Create category
   */
  createCategory: async (payload: ServiceCategoryPayload) => {
    return await api.post<{ data: ServiceCategoryData }>(ENDPOINTS.createService, { data: payload });
  },

  /**
   * Update category
   */
  updateCategory: async (docId: string, payload: Partial<ServiceCategoryPayload>) => {
    return await api.put<{ data: ServiceCategoryData }>(ENDPOINTS.updateService(docId), { data: payload });
  },

  /**
   * Delete category
   */
  deleteCategory: async (docId: string) => {
    return await api.delete<{ message: string }>(ENDPOINTS.deleteService(docId));
  },

  /**
   * Fetch all service items (variants)
   */
  getAllItems: async () => {
    return await api.get<{ data: ServiceItemData[] }>(ENDPOINTS.getAllServiceVariants);
  },

  /**
   * Create service item (Service Variant)
   * Exact Payload format:
   * {
   *   "data": {
   *     "name": "Shirt - Dry Clean",
   *     "service": "xyz123serviceDocumentId",
   *     "price": 150.00,
   *     "offerPrice": 120.00,
   *     "expressDeliveryPrice": 50.00,
   *     "expressDeliveryAvailable": true,
   *     "displayOrder": 1,
   *     "isActive": true
   *   }
   * }
   */
  createItem: async (payload: ServiceItemPayload) => {
    const serviceDocumentId = payload.service || payload.serviceId || payload.category;
    const priceVal = payload.price ?? payload.normalPrice ?? 0;
    const expressDeliveryPriceVal = payload.expressDeliveryPrice ?? payload.expressPrice ?? null;

    return await api.post<{ data: ServiceItemData }>(ENDPOINTS.createServiceVariant, {
      data: {
        name: payload.name,
        service: serviceDocumentId,
        price: priceVal,
        offerPrice: payload.offerPrice ?? null,
        expressDeliveryPrice: expressDeliveryPriceVal,
        expressDeliveryAvailable: payload.expressDeliveryAvailable ?? true,
        displayOrder: payload.displayOrder ?? 1,
        isActive: payload.isActive ?? true,
      },
    });
  },

  /**
   * Update service item (Service Variant)
   * Exact Payload format:
   * {
   *   "data": {
   *     "name": "Shirt - Premium Dry Clean",
   *     "price": 180.00,
   *     "offerPrice": 140.00,
   *     "expressDeliveryPrice": 60.00,
   *     "expressDeliveryAvailable": true,
   *     "displayOrder": 2
   *   }
   * }
   */
  updateItem: async (docId: string, payload: Partial<ServiceItemPayload>) => {
    const priceVal = payload.price ?? payload.normalPrice;
    const expressDeliveryPriceVal = payload.expressDeliveryPrice ?? payload.expressPrice;
    const serviceDocumentId = payload.service || payload.serviceId;

    const dataPayload: Record<string, any> = {};

    if (payload.name !== undefined) dataPayload.name = payload.name;
    if (serviceDocumentId !== undefined) dataPayload.service = serviceDocumentId;
    if (priceVal !== undefined) dataPayload.price = priceVal;
    if (payload.offerPrice !== undefined) dataPayload.offerPrice = payload.offerPrice;
    if (expressDeliveryPriceVal !== undefined) dataPayload.expressDeliveryPrice = expressDeliveryPriceVal;
    if (payload.expressDeliveryAvailable !== undefined) dataPayload.expressDeliveryAvailable = payload.expressDeliveryAvailable;
    if (payload.displayOrder !== undefined) dataPayload.displayOrder = payload.displayOrder;
    if (payload.isActive !== undefined) dataPayload.isActive = payload.isActive;

    return await api.put<{ data: ServiceItemData }>(ENDPOINTS.updateServiceVariant(docId), {
      data: dataPayload,
    });
  },

  /**
   * Delete service item
   */
  deleteItem: async (docId: string) => {
    return await api.delete<{ message: string }>(ENDPOINTS.deleteServiceVariant(docId));
  },
};

export default serviceApi;
