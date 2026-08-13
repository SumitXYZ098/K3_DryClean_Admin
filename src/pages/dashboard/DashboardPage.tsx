import React, { useEffect } from "react";
import dayjs from "dayjs";
import KpiCard from "../../components/dashboard/KpiCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import OrderStatusChart from "../../components/dashboard/OrderStatusChart";
import LatestOrdersTable from "../../components/dashboard/LatestOrdersTable";
import useSnackbarStore from "../../store/useSnackbarStore";
import useHeaderStore from "../../store/useHeaderStore";
import useDashboardHook from "../../hooks/useDashboardHook";
import { useNavigate } from "react-router";

export const DashboardPage: React.FC = () => {
  const { showSnackbar } = useSnackbarStore();
  const { setCustomActionHandler } = useHeaderStore();
  const navigate = useNavigate();

  const {
    stats,
    revenueData,
    serviceStatsData,
    isLoading: isDashboardLoading,
  } = useDashboardHook();

  const formattedDate = dayjs().format("dddd, MMM D, YYYY");

  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/orders/create");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  const getTrendType = (trend: string): "positive" | "negative" | "neutral" => {
    if (trend === "increased") return "positive";
    if (trend === "decreased") return "negative";
    return "neutral";
  };

  const formatPercentChange = (val: number) => {
    if (val > 0) return `+${val}%`;
    return `${val}%`;
  };

  return (
    <div className="space-y-xl pb-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Overview
          </h2>
          <p className="text-secondary font-body-md">
            Operational summary for {formattedDate}
          </p>
        </div>
      </div>

      {/* KPI Grid (5 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-lg mb-xl">
        {isDashboardLoading || !stats
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`kpi-skeleton-${index}`}
                className="bg-white border border-outline-variant p-lg rounded-md kpi-card-shadow animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-sm">
                  <div className="h-3 bg-surface-container-high rounded w-24"></div>
                  <div className="w-7 h-7 bg-surface-container-high rounded"></div>
                </div>
                <div className="h-8 bg-surface-container-high rounded w-20 mb-xs"></div>
                <div className="flex items-center gap-xs">
                  <div className="w-3 h-3 bg-surface-container-high rounded-full"></div>
                  <div className="h-3 bg-surface-container-high rounded w-14"></div>
                </div>
              </div>
            ))
          : [
              <KpiCard
                key="kpi-1"
                title="Today's Orders"
                value={stats.todayOrders.count}
                change={formatPercentChange(stats.todayOrders.percentageChange)}
                changeType={getTrendType(stats.todayOrders.trend)}
                icon="shopping_bag"
                iconColorClass="text-primary"
                iconBgClass="bg-primary/5"
                onClick={() =>
                  showSnackbar({
                    message: `${stats.todayOrders.count} orders placed today`,
                    type: "info",
                  })
                }
              />,
              <KpiCard
                key="kpi-2"
                title="Active Orders"
                value={stats.activeOrders.count}
                change="In Progress"
                changeType="info"
                icon="sync"
                iconColorClass="text-blue-600"
                iconBgClass="bg-blue-50"
                onClick={() =>
                  showSnackbar({
                    message: `${stats.activeOrders.count} active orders in progress`,
                    type: "info",
                  })
                }
              />,
              <KpiCard
                key="kpi-3"
                title="Revenue Today"
                value={`₹${stats.todayRevenue.amount.toLocaleString("en-IN")}`}
                change={formatPercentChange(
                  stats.todayRevenue.percentageChange,
                )}
                changeType={getTrendType(stats.todayRevenue.trend)}
                icon="payments"
                iconColorClass="text-green-600"
                iconBgClass="bg-green-50"
              />,
              <KpiCard
                key="kpi-4"
                title="Monthly Revenue"
                value={`₹${stats.monthlyRevenue.amount.toLocaleString("en-IN")}`}
                change={formatPercentChange(
                  stats.monthlyRevenue.percentageChange,
                )}
                changeType={getTrendType(stats.monthlyRevenue.trend)}
                icon="monetization_on"
                iconColorClass="text-primary"
                iconBgClass="bg-primary/5"
              />,
              <KpiCard
                key="kpi-5"
                title="Total Customers"
                value={stats.customers.total.toLocaleString("en-IN")}
                change={`+${stats.customers.newCustomers} new`}
                changeType="neutral"
                icon="group"
                iconColorClass="text-amber-600"
                iconBgClass="bg-amber-50"
              />,
            ]}
      </div>

      {/* Bento Grid Charts Section */}
      <div className="grid grid-cols-12 gap-lg mb-xl min-h-100">
        {/* Revenue Graph (7 cols) */}
        <div className="col-span-12 lg:col-span-7">
          <RevenueChart data={revenueData} isLoading={isDashboardLoading} />
        </div>

        {/* Order Status Pie Chart (5 cols) */}
        <div className="col-span-12 lg:col-span-5">
          <OrderStatusChart
            data={serviceStatsData}
            isLoading={isDashboardLoading}
          />
        </div>
      </div>

      {/* Lower Section (Table) */}
      <div className="min-h-120">
        <LatestOrdersTable isLoading={isDashboardLoading} />
      </div>
    </div>
  );
};

export default DashboardPage;
