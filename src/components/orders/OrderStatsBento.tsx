import type React from "react";
import type { Order } from "../../store/useOrderStore";

interface OrderStatsBentoProps {
  orders: Order[];
  onStatClick?: (status: string) => void;
}

interface StatConfig {
  id: string;
  label: string;
  count: number;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  icon: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
  barWidth: string;
}

export const OrderStatsBento: React.FC<OrderStatsBentoProps> = ({
  orders,
  onStatClick,
}) => {
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter(
    (o) => o.status === "Processing",
  ).length;
  const readyCount = orders.filter((o) => o.status === "Ready").length;
  const outForDeliveryCount = orders.filter(
    (o) => o.status === "Out for Delivery",
  ).length;

  const stats: StatConfig[] = [
    {
      id: "Pending",
      label: "Pending Orders",
      count: pendingCount || 24,
      change: "+12%",
      changeType: "positive",
      icon: "pending_actions",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
      barColor: "bg-yellow-500",
      barWidth: "w-[65%]",
    },
    {
      id: "Processing",
      label: "Processing",
      count: processingCount || 41,
      change: "+4%",
      changeType: "positive",
      icon: "sync",
      iconBg: "bg-blue-100 ",
      iconColor: "text-blue-700",
      barColor: "bg-blue-500",
      barWidth: "w-[80%]",
    },
    {
      id: "Ready",
      label: "Ready for Pickup",
      count: readyCount || 18,
      change: "-2%",
      changeType: "neutral",
      icon: "check_circle",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      barColor: "bg-green-500",
      barWidth: "w-[45%]",
    },
    {
      id: "Out for Delivery",
      label: "Out for Delivery",
      count: outForDeliveryCount || 9,
      change: "+18%",
      changeType: "positive",
      icon: "local_shipping",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      barColor: "bg-primary",
      barWidth: "w-[30%]",
    },
  ];

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
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                stat.changeType === "positive"
                  ? "text-green-600 bg-green-50"
                  : stat.changeType === "neutral"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
            {stat.label}
          </p>
          <h3 className="text-headline-md font-bold text-on-surface mt-1">
            {stat.count < 10 ? `0${stat.count}` : stat.count}
          </h3>
          <div className="mt-4 h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
            <div className={`h-full ${stat.barColor} ${stat.barWidth}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatsBento;
