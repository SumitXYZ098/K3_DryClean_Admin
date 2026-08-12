/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface DriverDocumentInput {
  documentName: string;
  documentImage: number | string;
}

export interface DriverDocumentImage {
  id: number;
  url: string;
  name?: string;
  ext?: string;
  mime?: string;
  size?: number;
}

export interface DriverDocumentItem {
  id?: number;
  documentId?: string;
  documentName?: string;
  documentImage?: DriverDocumentImage | number | string | null;
}

export interface DriverOrderItem {
  documentId: string;
  orderNo: string;
  grandTotal: number;
}

export interface ApiDriver {
  id: number;
  documentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  locale?: string | null;
  vehicleNumber?: string | null;
  isActive?: boolean | null;
  pickupOrdersCount?: number;
  deliveryOrdersCount?: number;
  documentsCount?: number;
  driver_documents?: DriverDocumentItem[];
  documents?: DriverDocumentItem[];
  order_pickup?: DriverOrderItem[];
  order_deliver?: DriverOrderItem[];
  [key: string]: any;
}

export interface CreateDriverPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleNumber: string;
  isActive: boolean;
  documents?: DriverDocumentInput[];
}

export interface UpdateDriverPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  vehicleNumber?: string;
  isActive?: boolean;
  documents?: DriverDocumentInput[];
}

export interface GetAllDriverResponse {
  data: ApiDriver[];
}

export interface GetDriverByIdResponse {
  data: ApiDriver;
}

export interface CreateDriverResponse {
  data: ApiDriver;
  message?: string;
}

export interface UpdateDriverResponse {
  data: ApiDriver;
  message?: string;
}

export interface DeleteDriverResponse {
  data?: any;
  message?: string;
}

export interface UploadFileResponse {
  id: number;
  name: string;
  url: string;
  size?: number;
  mime?: string;
  [key: string]: any;
}

/**
 * Driver API Service
 * Handles CRUD operations and document uploads for Driver management
 */
export const driverApi = {
  /**
   * Fetch all drivers
   */
  getAllDrivers: async (): Promise<GetAllDriverResponse> => {
    return await api.get<GetAllDriverResponse>(ENDPOINTS.getAllDriver);
  },

  /**
   * Fetch individual driver details by documentId
   */
  getDriverById: async (docId: string): Promise<GetDriverByIdResponse> => {
    return await api.get<GetDriverByIdResponse>(
      ENDPOINTS.getDriverDetailsById(docId),
    );
  },

  /**
   * Create a new driver
   */
  createDriver: async (
    payload: CreateDriverPayload,
  ): Promise<CreateDriverResponse> => {
    return await api.post<CreateDriverResponse>(
      ENDPOINTS.createDriver,
      payload,
    );
  },

  /**
   * Update an existing driver by documentId
   */
  updateDriver: async (
    docId: string,
    payload: UpdateDriverPayload,
  ): Promise<UpdateDriverResponse> => {
    return await api.put<UpdateDriverResponse>(
      ENDPOINTS.updateDriver(docId),
      payload,
    );
  },

  /**
   * Delete a driver by documentId
   */
  deleteDriver: async (docId: string): Promise<DeleteDriverResponse> => {
    return await api.delete<DeleteDriverResponse>(
      ENDPOINTS.deleteDriver(docId),
    );
  },

  /**
   * Upload driver document file (PDF, PNG, JPG) to upload endpoint
   */
  uploadDocument: async (file: File): Promise<UploadFileResponse[]> => {
    const formData = new FormData();
    formData.append("files", file);
    const res = await api.post<UploadFileResponse[] | UploadFileResponse>(
      ENDPOINTS.uploadDoc,
      formData,
    );
    return Array.isArray(res) ? res : [res];
  },
};

export default driverApi;
