export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export const ENDPOINTS = {
  // authentication endpoints
  login: `${BASE_URL}/api/auth/login`,
  forgotPassword: `${BASE_URL}/api/forgot-password`,
  resetPassword: `${BASE_URL}/api/reset-password`,
  verifyOtp: `${BASE_URL}/api/verify-otp`,
  resendOtp: `${BASE_URL}/api/resend-otp`,

  // customer endpoints
  createCustomer: `${BASE_URL}/api/create-user-manually`,
  getCustomer: `${BASE_URL}/api/user-profiles`,
};
