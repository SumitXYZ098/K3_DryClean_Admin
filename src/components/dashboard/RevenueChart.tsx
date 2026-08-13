/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import dashboardApi, { type RevenueTrendItem } from "../../api/dashboardApi";

export interface RevenueChartProps {
  data?: RevenueTrendItem[];
  isLoading?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data: propData,
  isLoading: propIsLoading,
}) => {
  const [internalData, setInternalData] = useState<RevenueTrendItem[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);

  const isControlled = propIsLoading !== undefined;
  const isLoading = isControlled ? propIsLoading : internalLoading;
  const data = propData !== undefined ? propData : internalData;

  useEffect(() => {
    if (isControlled) return;
    let isMounted = true;

    dashboardApi
      .getRevenueTrends()
      .then((res) => {
        if (isMounted && res && Array.isArray(res.revenueTrends)) {
          setInternalData(res.revenueTrends);
        }
      })
      .catch((err) => {
        console.error("[RevenueChart] Failed to fetch revenue trends:", err);
      })
      .finally(() => {
        if (isMounted) setInternalLoading(false);
      });

    // Refetch silently every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      dashboardApi
        .getRevenueTrends()
        .then((res) => {
          if (isMounted && res && Array.isArray(res.revenueTrends)) {
            setInternalData(res.revenueTrends);
          }
        })
        .catch(() => {});
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isControlled]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("MMM D");
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h3 className="font-headline-md text-lg text-on-surface">
            Revenue Trends
          </h3>
          <p className="text-xs text-secondary">Daily revenue performance</p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-label-sm text-secondary font-medium">
            Daily Revenue
          </span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 min-h-64 relative">
        {isLoading ? (
          <div className="w-full h-64 flex flex-col justify-between p-sm animate-pulse">
            <div className="flex items-end justify-between h-52 px-sm border-b border-outline-variant gap-xs">
              {[35, 55, 25, 75, 45, 85, 40, 65, 30, 80].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-[8%] bg-surface-container-high rounded-t-md"
                />
              ))}
            </div>
            <div className="flex justify-between mt-sm px-sm">
              <div className="h-3 bg-surface-container-high rounded w-10" />
              <div className="h-3 bg-surface-container-high rounded w-10" />
              <div className="h-3 bg-surface-container-high rounded w-10" />
              <div className="h-3 bg-surface-container-high rounded w-10" />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center">
            <p className="text-secondary text-sm font-medium">
              No revenue trend data available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => `₹${val}`}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any) => [
                  formatCurrency(Number(val || 0)),
                  "Revenue",
                ]}
                labelFormatter={(label: any) =>
                  label ? dayjs(String(label)).format("MMMM D, YYYY") : ""
                }
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  border: "none",
                }}
                itemStyle={{ color: "#3B82F6" }}
              />
              <Bar
                dataKey="revenue"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
