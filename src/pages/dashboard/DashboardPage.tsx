import type React from "react";
import dayjs from "dayjs";
import KpiCard from "../../components/dashboard/KpiCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import OrderStatusChart from "../../components/dashboard/OrderStatusChart";
import LatestOrdersTable from "../../components/dashboard/LatestOrdersTable";
import DriverActivityList from "../../components/dashboard/DriverActivityList";
import useSnackbarStore from "../../store/useSnackbarStore";

export const DashboardPage: React.FC = () => {
  const { showSnackbar } = useSnackbarStore();

  const formattedDate = dayjs().format("dddd, MMM D, YYYY");

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
        <div className="flex gap-sm">
          <button
            onClick={() =>
              showSnackbar({
                message: "Filter changed to Last 30 Days",
                type: "info",
              })
            }
            className="bg-surface border border-outline-variant px-md py-2 rounded-default font-title-md text-sm text-secondary hover:bg-secondary-container/20 flex items-center gap-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-md">
              calendar_today
            </span>
            Last 30 Days
          </button>

          <button
            onClick={() =>
              showSnackbar({
                message: "Exporting PDF report...",
                type: "success",
              })
            }
            className="bg-surface border border-outline-variant px-md py-2 rounded-default font-title-md text-sm text-secondary hover:bg-secondary-container/20 flex items-center gap-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-md">download</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Grid (5 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-lg mb-xl">
        <KpiCard
          title="Today's Orders"
          value="42"
          change="+12%"
          changeType="positive"
          icon="shopping_bag"
          iconColorClass="text-primary"
          iconBgClass="bg-primary/5"
          onClick={() =>
            showSnackbar({
              message: "42 orders placed today",
              type: "info",
            })
          }
        />

        <KpiCard
          title="Active Orders"
          value="156"
          change="In Progress"
          changeType="info"
          icon="sync"
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
          onClick={() =>
            showSnackbar({
              message: "156 active orders in progress",
              type: "info",
            })
          }
        />

        <KpiCard
          title="Revenue Today"
          value="₹1,240"
          change="+8.4%"
          changeType="positive"
          icon="payments"
          iconColorClass="text-green-600"
          iconBgClass="bg-green-50"
        />

        <KpiCard
          title="Monthly Revenue"
          value="₹45.2k"
          change="+21%"
          changeType="positive"
          icon="monetization_on"
          iconColorClass="text-primary"
          iconBgClass="bg-primary/5"
        />

        <KpiCard
          title="Total Customers"
          value="2,450"
          change="+42 new"
          changeType="neutral"
          icon="group"
          iconColorClass="text-amber-600"
          iconBgClass="bg-amber-50"
        />
      </div>

      {/* Bento Grid Charts Section */}
      <div className="grid grid-cols-12 gap-lg mb-xl min-h-100">
        {/* Revenue Graph (8 cols) */}
        <div className="col-span-12 lg:col-span-8">
          <RevenueChart />
        </div>

        {/* Order Status Pie Chart (4 cols) */}
        <div className="col-span-12 lg:col-span-4">
          <OrderStatusChart totalOrders={156} />
        </div>
      </div>

      {/* Lower Section (Table + Activity) */}
      <div className="grid grid-cols-12 gap-lg min-h-120">
        {/* Latest Orders Table (9 cols) */}
        <div className="col-span-12 lg:col-span-9">
          <LatestOrdersTable
            onViewAll={() =>
              showSnackbar({
                message: "Navigating to all orders view...",
                type: "info",
              })
            }
          />
        </div>

        {/* Driver Activity (3 cols) */}
        <div className="col-span-12 lg:col-span-3">
          <DriverActivityList
            onManageFleet={() =>
              showSnackbar({
                message: "Opening fleet management console...",
                type: "info",
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
