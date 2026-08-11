/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface CustomerAddressPayload {
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "home" | "work" | "other" | string;
  streetAddress: string;
  landmark?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isDefaultAddress?: boolean;
}

export interface CreateCustomerPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: CustomerAddressPayload;
}

export interface CustomerAddress {
  id: number;
  documentId: string;
  fullAddress: string;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: string | null;
  longitude?: string | null;
  isDefaultAddress?: boolean;
  addressType: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
  streetAddress: string;
}

export interface UsersPermissionsUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider?: string | null;
  password?: string;
  resetPasswordToken?: string | null;
  confirmationToken?: string | null;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
  phoneNumber?: string | null;
}

export interface ProfileImageFormat {
  ext?: string;
  url: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: string | null;
  size?: number;
  width?: number;
  height?: number;
  sizeInBytes?: number;
}

export interface ProfileImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  focalPoint?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: ProfileImageFormat;
    medium?: ProfileImageFormat;
    small?: ProfileImageFormat;
    thumbnail?: ProfileImageFormat;
    [key: string]: ProfileImageFormat | undefined;
  };
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: any;
  folderPath?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
}

export interface CustomerProfileData {
  id: number;
  documentId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userType?: string;
  accountStatus?: string | null;
  fcmToken?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
  customerId?: string;
  totalOrders?: number;
  totalSpend?: number;
  users_permissions_user?: UsersPermissionsUser;
  profileImage?: ProfileImage | null;
  customer_addresses?: CustomerAddress[];
  [key: string]: any;
}

export interface CreateCustomerResponse {
  message: string;
  data: CustomerProfileData;
}

export interface GetCustomerResponse {
  success: boolean;
  data: CustomerProfileData[];
}

/**
 * Customer API Service
 */
export const customerApi = {
  /**
   * Create customer manually
   */
  createCustomer: async (
    payload: CreateCustomerPayload,
  ): Promise<CreateCustomerResponse> => {
    return await api.post<CreateCustomerResponse>(
      ENDPOINTS.createCustomer,
      payload,
    );
  },

  /**
   * Get all customer profiles
   */
  getCustomer: async (): Promise<GetCustomerResponse> => {
    return await api.get<GetCustomerResponse>(ENDPOINTS.getCustomer);
  },
};

export default customerApi;
