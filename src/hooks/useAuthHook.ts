/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authApi, {
  type User,
  type UserRole,
  type LoginPayload,
  type LoginResponse,
  type ForgotPasswordPayload,
  type ForgotPasswordResponse,
  type VerifyOtpPayload,
  type VerifyOtpResponse,
  type ResendOtpPayload,
  type ResendOtpResponse,
  type ResetPasswordPayload,
  type ResetPasswordResponse,
} from "../api/authApi";
import useLoadingStore from "../store/useLoadingStore";
import useSnackbarStore from "../store/useSnackbarStore";
import useAuthStore from "../store/useAuthStore";

export const useAuthHook = () => {
  const queryClient = useQueryClient();
  const {
    user,
    token,
    remember,
    expiresAt,
    isAuthenticated,
    setAuth,
    clearAuth,
    checkAuthExpiry,
  } = useAuthStore();

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  // React Query - Login Mutation
  const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      showLoading("Authenticating...");
      setError(null);
      try {
        const response = await authApi.login(credentials);
        return response;
      } finally {
        hideLoading();
      }
    },
    onSuccess: (response, credentials) => {
      const jwtToken = response.jwt;
      const userData = response.user;

      if (jwtToken && userData) {
        setAuth({
          user: userData,
          token: jwtToken,
          remember: credentials.remember ?? false,
        });
      }

      showSnackbar({
        message: "Login successful! Welcome back.",
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errMsg);
    },
  });

  const login = useCallback(
    async (credentials: LoginPayload): Promise<LoginResponse> => {
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  // React Query - Forgot Password Mutation
  const forgotPasswordMutation = useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordPayload
  >({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      showLoading("Sending verification code...");
      setError(null);
      try {
        return await authApi.forgotPassword(payload);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (response, payload) => {
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      showSnackbar({
        message:
          response.message || `OTP sent successfully to ${payload.identifier}.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset OTP. Please try again.";
      setError(errMsg);
    },
  });

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      return forgotPasswordMutation.mutateAsync(payload);
    },
    [forgotPasswordMutation]
  );

  // React Query - Resend OTP Mutation
  const resendOtpMutation = useMutation<
    ResendOtpResponse,
    Error,
    ResendOtpPayload
  >({
    mutationFn: async (payload: ResendOtpPayload) => {
      showLoading("Resending OTP code...");
      setError(null);
      try {
        return await authApi.resendOtp(payload);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (response) => {
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      showSnackbar({
        message: response.message || "OTP resent successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to resend OTP. Please try again.";
      setError(errMsg);
    },
  });

  const resendOtp = useCallback(
    async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
      return resendOtpMutation.mutateAsync(payload);
    },
    [resendOtpMutation]
  );

  // React Query - Verify OTP Mutation
  const verifyOtpMutation = useMutation<
    VerifyOtpResponse,
    Error,
    VerifyOtpPayload
  >({
    mutationFn: async (payload: VerifyOtpPayload) => {
      showLoading("Verifying OTP code...");
      setError(null);
      try {
        return await authApi.verifyOtp(payload);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (response) => {
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      showSnackbar({
        message: response.message || "OTP verified successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired OTP code.";
      setError(errMsg);
    },
  });

  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
      return verifyOtpMutation.mutateAsync(payload);
    },
    [verifyOtpMutation]
  );

  // React Query - Reset Password Mutation
  const resetPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordPayload
  >({
    mutationFn: async (payload: ResetPasswordPayload) => {
      showLoading("Resetting password...");
      setError(null);
      try {
        return await authApi.resetPassword(payload);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (response) => {
      showSnackbar({
        message: response.message || "Password reset successfully.",
        type: "success",
      });
      setResetToken(null);
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Password reset failed. Please try again.";
      setError(errMsg);
    },
  });

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
      return resetPasswordMutation.mutateAsync(payload);
    },
    [resetPasswordMutation]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuth();
    setResetToken(null);
    queryClient.clear();
    showSnackbar({
      message: "Logged out successfully.",
      type: "info",
    });
  }, [clearAuth, showSnackbar, queryClient]);

  const isLoading =
    loginMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    resetPasswordMutation.isPending;

  return {
    user,
    token,
    remember,
    expiresAt,
    resetToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    forgotPassword,
    resendOtp,
    verifyOtp,
    resetPassword,
    logout,
    checkAuthExpiry,
    loginMutation,
    forgotPasswordMutation,
    resendOtpMutation,
    verifyOtpMutation,
    resetPasswordMutation,
  };
};

export type { User, UserRole };
export default useAuthHook;
