/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  /**
   * Login user
   * Payload: { identifier: string, password: string, remember?: boolean }
   * Persists logged user & token for 30 days if remember is true
   */
  const login = useCallback(
    async (credentials: LoginPayload): Promise<LoginResponse> => {
      setIsLoading(true);
      setError(null);
      showLoading("Authenticating...");

      try {
        const response = await authApi.login(credentials);
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

        return response;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar, setAuth]
  );

  /**
   * Send forgot password OTP request
   * Payload: { identifier: string }
   */
  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      setIsLoading(true);
      setError(null);
      showLoading("Sending verification code...");

      try {
        const response = await authApi.forgotPassword(payload);
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }

        showSnackbar({
          message: response.message || `OTP sent successfully to ${payload.identifier}.`,
          type: "success",
        });
        return response;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to send reset OTP. Please try again.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar]
  );

  /**
   * Resend password reset OTP
   * Payload: { identifier: string, resetToken: string }
   */
  const resendOtp = useCallback(
    async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
      setIsLoading(true);
      setError(null);
      showLoading("Resending OTP code...");

      try {
        const response = await authApi.resendOtp(payload);
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }

        showSnackbar({
          message: response.message || "OTP resent successfully.",
          type: "success",
        });
        return response;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to resend OTP. Please try again.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar]
  );

  /**
   * Verify OTP code
   * Payload: { identifier: string, resetToken: string, otp: string }
   */
  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
      setIsLoading(true);
      setError(null);
      showLoading("Verifying OTP code...");

      try {
        const response = await authApi.verifyOtp(payload);
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }

        showSnackbar({
          message: response.message || "OTP verified successfully.",
          type: "success",
        });
        return response;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Invalid or expired OTP code.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar]
  );

  /**
   * Reset / Set new password
   * Payload: { identifier: string, resetToken: string, password: string }
   */
  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
      setIsLoading(true);
      setError(null);
      showLoading("Resetting password...");

      try {
        const response = await authApi.resetPassword(payload);

        showSnackbar({
          message: response.message || "Password reset successfully.",
          type: "success",
        });
        setResetToken(null);
        return response;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Password reset failed. Please try again.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuth();
    setResetToken(null);
    showSnackbar({
      message: "Logged out successfully.",
      type: "info",
    });
  }, [clearAuth, showSnackbar]);

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
  };
};

export type { User, UserRole };
export default useAuthHook;
