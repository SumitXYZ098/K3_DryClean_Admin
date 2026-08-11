import type React from "react";
import type { Order } from "../../store/useOrderStore";

interface OrderStatsBentoProps {
  orders: Order[];
  isLoading?: boolean;
  onStatClick?: (status: string) => void;
}

interface StatConfig {
  id: string;
  label: string;
  count: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
  barWidth: string;
}

export const OrderStatsBento: React.FC<OrderStatsBentoProps> = ({
  orders,
  isLoading = false,
  onStatClick,
}) => {
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const processingCount = orders.filter(
    (o) => o.status === "processing",
  ).length;
  const readyCount = orders.filter(
    (o) => o.status === "delivery_assigned",
  ).length;
  const outForDeliveryCount = orders.filter(
    (o) => o.status === "out_for_delivery",
  ).length;

  const totalOrders = orders.length || 1;

  const stats: StatConfig[] = [
    {
      id: "pending",
      label: "Pending Orders",
      count: pendingCount,
      icon: "pending_actions",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
      barColor: "bg-yellow-500",
      barWidth: `${Math.min(100, Math.round((pendingCount / totalOrders) * 100))}%`,
    },
    {
      id: "processing",
      label: "Processing",
      count: processingCount,
      icon: "sync",
      iconBg: "bg-blue-100 ",
      iconColor: "text-blue-700",
      barColor: "bg-blue-500",
      barWidth: `${Math.min(100, Math.round((processingCount / totalOrders) * 100))}%`,
    },
    {
      id: "delivery_assigned",
      label: "Delivery Assigned",
      count: readyCount,
      icon: "check_circle",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
      barColor: "bg-teal-500",
      barWidth: `${Math.min(100, Math.round((readyCount / totalOrders) * 100))}%`,
    },
    {
      id: "out_for_delivery",
      label: "Out for Delivery",
      count: outForDeliveryCount,
      icon: "local_shipping",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      barColor: "bg-primary",
      barWidth: `${Math.min(100, Math.round((outForDeliveryCount / totalOrders) * 100))}%`,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`stat-skeleton-${idx}`}
            className="bg-surface-container-low p-md rounded-xl border border-outline-variant animate-pulse"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-outline-variant/40"></div>
            </div>
            <div className="h-3 w-28 bg-outline-variant/40 rounded-md mb-2"></div>
            <div className="h-7 w-16 bg-outline-variant/40 rounded-md"></div>
            <div className="mt-4 h-1 w-full bg-outline-variant/20 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => onStatClick?.(stat.id)}
          className="bg-surface-container-low p-md rounded-xl border border-outline-variant order-card-shadow transition-all duration-200 group hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
              <span className="material-symbols-outlined" data-icon={stat.icon}>
                {stat.icon}
              </span>
            </span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
            {stat.label}
          </p>
          <h3 className="text-headline-md font-bold text-on-surface mt-1">
            {stat.count < 10 ? `0${stat.count}` : stat.count}
          </h3>
          <div className="mt-4 h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
            <div
              className={`h-full ${stat.barColor}`}
              style={{ width: stat.barWidth }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatsBento;
