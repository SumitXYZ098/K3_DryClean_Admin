import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface ServiceStatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface OrderServiceStatsResponse {
  totalItems: number;
  services: ServiceStatItem[];
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface RevenueTrendsResponse {
  revenueTrends: RevenueTrendItem[];
}

export interface DashboardStatsResponse {
  todayOrders: {
    count: number;
    yesterdayCount: number;
    percentageChange: number;
    trend: "same" | "increased" | "decreased" | string;
  };
  activeOrders: {
    count: number;
  };
  todayRevenue: {
    amount: number;
    yesterdayAmount: number;
    percentageChange: number;
    trend: "same" | "increased" | "decreased" | string;
  };
  monthlyRevenue: {
    amount: number;
    previousPeriodAmount: number;
    percentageChange: number;
    trend: "same" | "increased" | "decreased" | string;
  };
  customers: {
    total: number;
    newCustomers: number;
  };
}

export const dashboardApi = {
  getOrderServiceStats: async (): Promise<OrderServiceStatsResponse> => {
    const res = await apiClient.get<OrderServiceStatsResponse>(
      ENDPOINTS.getOrderServiceStats
    );
    return res.data;
  },

  getRevenueTrends: async (): Promise<RevenueTrendsResponse> => {
    const res = await apiClient.get<RevenueTrendsResponse>(
      ENDPOINTS.getRevenueTrends
    );
    return res.data;
  },

  getAllDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const res = await apiClient.get<DashboardStatsResponse>(
      ENDPOINTS.getAllDashboardStats
    );
    return res.data;
  },
};

export default dashboardApi;
