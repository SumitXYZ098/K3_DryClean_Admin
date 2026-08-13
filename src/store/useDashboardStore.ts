import { create } from "zustand";
import dashboardApi, {
  type DashboardStatsResponse,
  type RevenueTrendItem,
  type OrderServiceStatsResponse,
} from "../api/dashboardApi";
import useOrderStore from "./useOrderStore";

interface DashboardState {
  stats: DashboardStatsResponse | null;
  revenueData: RevenueTrendItem[];
  serviceStatsData: OrderServiceStatsResponse | null;
  hasFetched: boolean;
  isLoading: boolean;
  fetchDashboardData: (force?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  revenueData: [],
  serviceStatsData: null,
  hasFetched: false,
  isLoading: false,

  fetchDashboardData: async (force = false) => {
    const { hasFetched } = get();

    // If data was already fetched and refetch is not forced, do nothing
    if (hasFetched && !force) {
      return;
    }

    // Only trigger skeleton loading overlay on initial fetch
    if (!hasFetched) {
      set({ isLoading: true });
    }

    try {
      const [statsRes, trendsRes, serviceStatsRes] = await Promise.allSettled([
        dashboardApi.getAllDashboardStats(),
        dashboardApi.getRevenueTrends(),
        dashboardApi.getOrderServiceStats(),
        useOrderStore.getState().fetchOrders(force),
      ]);

      const updates: Partial<DashboardState> = {
        hasFetched: true,
        isLoading: false,
      };

      if (statsRes.status === "fulfilled" && statsRes.value) {
        updates.stats = statsRes.value;
      }

      if (trendsRes.status === "fulfilled" && trendsRes.value?.revenueTrends) {
        updates.revenueData = trendsRes.value.revenueTrends;
      }

      if (
        serviceStatsRes.status === "fulfilled" &&
        serviceStatsRes.value?.services
      ) {
        updates.serviceStatsData = serviceStatsRes.value;
      }

      set(updates);
    } catch (err) {
      console.error("[useDashboardStore] Error fetching dashboard data:", err);
      set({ isLoading: false });
    }
  },
}));

export default useDashboardStore;
