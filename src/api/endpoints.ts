export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export const ENDPOINTS = {
  // authentication endpoints
  login: `${BASE_URL}/auth/login`,
  forgotPassword: `${BASE_URL}/forgot-password`,
  resetPassword: `${BASE_URL}/reset-password`,
  verifyOtp: `${BASE_URL}/verify-otp`,
  resendOtp: `${BASE_URL}/resend-otp`,

  // banner endpoints
};
