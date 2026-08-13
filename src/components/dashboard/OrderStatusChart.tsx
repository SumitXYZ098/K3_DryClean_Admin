/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import dashboardApi, {
  type OrderServiceStatsResponse,
} from "../../api/dashboardApi";

const COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
];

export interface OrderStatusChartProps {
  data?: OrderServiceStatsResponse | null;
  isLoading?: boolean;
}

export const OrderStatusChart: React.FC<OrderStatusChartProps> = ({
  data: propData,
  isLoading: propIsLoading,
}) => {
  const [internalData, setInternalData] =
    useState<OrderServiceStatsResponse | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);

  const isControlled = propIsLoading !== undefined;
  const isLoading = isControlled ? propIsLoading : internalLoading;
  const data = propData !== undefined ? propData : internalData;

  useEffect(() => {
    if (isControlled) return;
    let isMounted = true;

    dashboardApi
      .getOrderServiceStats()
      .then((res) => {
        if (isMounted && res && Array.isArray(res.services)) {
          setInternalData(res);
        }
      })
      .catch((err) => {
        console.error("[OrderStatusChart] Failed to fetch service stats:", err);
      })
      .finally(() => {
        if (isMounted) setInternalLoading(false);
      });

    // Refetch silently every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      dashboardApi
        .getOrderServiceStats()
        .then((res) => {
          if (isMounted && res && Array.isArray(res.services)) {
            setInternalData(res);
          }
        })
        .catch(() => {});
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isControlled]);

  const formatName = (name: string) =>
    name.replace(/\b\w/g, (char) => char.toUpperCase());

  const services = data?.services || [];
  // const totalItems = data?.totalItems || 0;

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow flex flex-col h-full">
      <h3 className="font-headline-md text-lg text-on-surface mb-md">
        Order Service Breakdown
      </h3>

      {isLoading ? (
        <div className="flex-1 flex flex-col justify-between animate-pulse">
          <div className="flex-1 flex items-center justify-center relative my-auto min-h-60">
            <div className="w-44 h-44 rounded-full border-14 border-surface-container-high flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-10 border-surface-container flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-6 bg-surface-container-high rounded w-12" />
                  <div className="h-3 bg-surface-container-high rounded w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-sm mt-md pt-sm border-t border-outline-variant">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container-high shrink-0" />
                <div className="h-3 bg-surface-container-high rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-secondary text-sm font-medium">
            No service breakdown data available.
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-60 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={services}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  paddingAngle={3}
                  isAnimationActive={true}
                >
                  {services.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value ?? 0} orders`,
                    formatName(String(name ?? "")),
                  ]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    border: "none",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Breakdown */}
          <div className="grid grid-cols-2 gap-sm mt-md pt-sm border-t border-outline-variant">
            {services.map((item, i) => (
              <div key={i} className="flex items-center gap-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-label-sm text-secondary font-medium truncate">
                  {formatName(item.name)} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStatusChart;
