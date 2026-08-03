/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-assignment */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import useSnackbarStore from "../store/useSnackbarStore";
import useAuthStore from "../store/useAuthStore";

export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

/**
 * Axios instance configured for K3 DryClean Admin API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * - Attaches Bearer authentication token from useAuthStore or localStorage/sessionStorage
 * - Handles FormData requests by removing hardcoded Content-Type header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve authentication token from useAuthStore (or fallback)
    const token =
      useAuthStore.getState().getToken() ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If payload is FormData, let browser set the correct multipart boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} => ${config.url}`,
        config.data || "",
      );
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * - Extracts response data on success
 * - Handles HTTP errors (401, 403, 404, 500, Network Errors)
 * - Triggers global snackbar alerts for user notifications
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} <= ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const { response, request } = error;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (response) {
      const status = response.status;
      const data = response.data;
      errorMessage = data?.message || data?.error || errorMessage;

      switch (status) {
        case 401:
          // Unauthorized: Clear tokens and auth state via useAuthStore
          useAuthStore.getState().clearAuth();

          errorMessage =
            data?.message || "Session expired. Please log in again.";

          // Avoid redirect loop if already on login page
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login";
          }
          break;

        case 403:
          errorMessage =
            data?.message || "Access denied. You do not have permission.";
          break;

        case 404:
          errorMessage = data?.message || "Requested resource not found.";
          break;

        case 422:
          errorMessage =
            data?.message || "Validation failed. Please check your inputs.";
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage =
            data?.message || "Server error. Please try again later.";
          break;

        default:
          errorMessage =
            data?.message || `Request failed with status ${status}`;
          break;
      }
    } else if (request) {
      // Network failure or no response received
      if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      } else {
        errorMessage = "Unable to connect to server. Please try again later.";
      }
    } else {
      errorMessage = error.message || errorMessage;
    }

    // Trigger global notification banner for error feedback
    showSnackbar({
      message: errorMessage,
      type: "error",
    });

    if (import.meta.env.DEV) {
      console.error(
        `[API Error ${response?.status || "Network"}]`,
        errorMessage,
        error,
      );
    }

    return Promise.reject(error);
  },
);

/**
 * Type-safe API Request Helpers
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
