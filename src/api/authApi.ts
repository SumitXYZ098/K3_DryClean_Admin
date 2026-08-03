/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface UserRole {
  id: number;
  documentId?: string;
  name: string;
  description?: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
}

export interface User {
  id: number | string;
  documentId?: string;
  username?: string;
  email: string;
  provider?: string | null;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
  phoneNumber?: string | null;
  role?: UserRole;
  [key: string]: any;
}

// 1. Login
export interface LoginPayload {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  jwt: string;
  user: User;
  [key: string]: any;
}

// 2. Forgot Password
export interface ForgotPasswordPayload {
  identifier: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken: string;
  [key: string]: any;
}

// 3. Resend OTP
export interface ResendOtpPayload {
  identifier: string;
  resetToken: string;
}

export interface ResendOtpResponse {
  success?: boolean;
  message?: string;
  resetToken?: string;
  [key: string]: any;
}

// 4. Verify OTP
export interface VerifyOtpPayload {
  identifier: string;
  resetToken: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  resetToken: string;
  [key: string]: any;
}

// 5. Reset Password
export interface ResetPasswordPayload {
  identifier: string;
  resetToken: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login user with identifier and password
   */
  login: async (credentials: LoginPayload): Promise<LoginResponse> => {
    // Extract remember field if present so payload strictly sends identifier & password to API if needed, or pass full body
    const { remember, ...payload } = credentials;
    return await api.post<LoginResponse>(ENDPOINTS.login, payload);
  },

  /**
   * Send password reset OTP email
   */
  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse> => {
    return await api.post<ForgotPasswordResponse>(
      ENDPOINTS.forgotPassword,
      payload,
    );
  },

  /**
   * Resend password reset OTP code
   */
  resendOtp: async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
    return await api.post<ResendOtpResponse>(ENDPOINTS.resendOtp, payload);
  },

  /**
   * Verify password reset OTP
   */
  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    return await api.post<VerifyOtpResponse>(ENDPOINTS.verifyOtp, payload);
  },

  /**
   * Set/Reset new password
   */
  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> => {
    return await api.post<ResetPasswordResponse>(
      ENDPOINTS.resetPassword,
      payload,
    );
  },

  /**
   * Logout user and perform cleanup
   */
  logout: (): void => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
  },
};

export default authApi;
