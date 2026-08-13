export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export const ENDPOINTS = {
  // authentication endpoints
  login: `${BASE_URL}/api/auth/login`,
  forgotPassword: `${BASE_URL}/api/forgot-password`,
  resetPassword: `${BASE_URL}/api/reset-password`,
  verifyOtp: `${BASE_URL}/api/verify-otp`,
  resendOtp: `${BASE_URL}/api/resend-otp`,

  // dashboard endpoints
  getOrderServiceStats: `${BASE_URL}/api/admin/order-service-stats`,
  getRevenueTrends: `${BASE_URL}/api/admin/revenue-trends`,
  getAllDashboardStats: `${BASE_URL}/api/admin/all-dashboard-stats`,

  // customer endpoints
  createCustomer: `${BASE_URL}/api/create-user-manually`,
  getCustomer: `${BASE_URL}/api/user-profiles`,

  // order endpoints
  getStats: `${BASE_URL}/api/admin/order-stats`,
  getAllOrder: `${BASE_URL}/api/orders`,

  // notification endpoints
  getAllNotification: `${BASE_URL}/api/notifications`,

  // driver endpoints
  getAllDriver: `${BASE_URL}/api/driver-details`,
  getDriverDetialsById: (docId: string) =>
    `${BASE_URL}/api/driver-details/${docId}`,
  getDriverDetailsById: (docId: string) =>
    `${BASE_URL}/api/driver-details/${docId}`,
  createDriver: `${BASE_URL}/api/driver-details`,
  updateDriver: (docId: string) => `${BASE_URL}/api/driver-details/${docId}`,
  deleteDriver: (docId: string) => `${BASE_URL}/api/driver-details/${docId}`,

  // upload endpoints
  uploadDoc: `${BASE_URL}/api/upload`,
};
