import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dashboardApi, {
  type DashboardStatsResponse,
  type RevenueTrendItem,
  type OrderServiceStatsResponse,
} from "../api/dashboardApi";
import useDashboardStore from "../store/useDashboardStore";

export const DASHBOARD_STATS_QUERY_KEY = ["dashboard", "stats"];
export const DASHBOARD_REVENUE_QUERY_KEY = ["dashboard", "revenue"];
export const DASHBOARD_SERVICES_QUERY_KEY = ["dashboard", "services"];

export const useDashboardHook = () => {
  const store = useDashboardStore();

  // TanStack React Query - Get Dashboard Stats
  const statsQuery = useQuery<DashboardStatsResponse>({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: async () => {
      const data = await dashboardApi.getAllDashboardStats();
      useDashboardStore.setState({ stats: data, hasFetched: true });
      return data;
    },
    refetchInterval: 300000, // Auto-refetch every 5 minutes
    initialData: store.stats || undefined,
    placeholderData: keepPreviousData,
  });

  // TanStack React Query - Get Revenue Trends
  const revenueQuery = useQuery<RevenueTrendItem[]>({
    queryKey: DASHBOARD_REVENUE_QUERY_KEY,
    queryFn: async () => {
      const res = await dashboardApi.getRevenueTrends();
      const trends = res?.revenueTrends || [];
      useDashboardStore.setState({ revenueData: trends });
      return trends;
    },
    refetchInterval: 300000,
    initialData: store.revenueData.length > 0 ? store.revenueData : undefined,
    placeholderData: keepPreviousData,
  });

  // TanStack React Query - Get Order Service Stats
  const servicesQuery = useQuery<OrderServiceStatsResponse>({
    queryKey: DASHBOARD_SERVICES_QUERY_KEY,
    queryFn: async () => {
      const data = await dashboardApi.getOrderServiceStats();
      useDashboardStore.setState({ serviceStatsData: data });
      return data;
    },
    refetchInterval: 300000,
    initialData: store.serviceStatsData || undefined,
    placeholderData: keepPreviousData,
  });

  const isLoading =
    statsQuery.isLoading || revenueQuery.isLoading || servicesQuery.isLoading;
  const isFetching =
    statsQuery.isFetching ||
    revenueQuery.isFetching ||
    servicesQuery.isFetching;

  const refetchDashboardData = async () => {
    await Promise.all([
      statsQuery.refetch(),
      revenueQuery.refetch(),
      servicesQuery.refetch(),
    ]);
  };

  return {
    stats: statsQuery.data || store.stats,
    revenueData: revenueQuery.data || store.revenueData,
    serviceStatsData: servicesQuery.data || store.serviceStatsData,
    isLoading,
    isFetching,
    error: statsQuery.error || revenueQuery.error || servicesQuery.error,
    refetchDashboardData,
    statsQuery,
    revenueQuery,
    servicesQuery,
  };
};

export default useDashboardHook;
