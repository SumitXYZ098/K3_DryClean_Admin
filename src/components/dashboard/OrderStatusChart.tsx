import type React from "react";

export interface StatusItem {
  label: string;
  count: number;
  percentage: string;
  colorClass: string;
}

const orderStatusBreakdown: StatusItem[] = [
  {
    label: "Washing (45%)",
    count: 70,
    percentage: "45%",
    colorClass: "bg-primary",
  },
  {
    label: "Drying (30%)",
    count: 47,
    percentage: "30%",
    colorClass: "bg-blue-500",
  },
  {
    label: "Ready (15%)",
    count: 23,
    percentage: "15%",
    colorClass: "bg-amber-400",
  },
  {
    label: "Other (10%)",
    count: 16,
    percentage: "10%",
    colorClass: "bg-on-secondary-container",
  },
];

export interface OrderStatusChartProps {
  totalOrders?: number;
}

export const OrderStatusChart: React.FC<OrderStatusChartProps> = ({
  totalOrders = 156,
}) => {
  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow flex flex-col h-full">
      <h3 className="font-headline-md text-lg text-on-surface mb-lg">
        Order Status
      </h3>

      {/* Concentric Donut Visual Representation */}
      <div className="flex-1 flex items-center justify-center relative my-auto">
        <div className="w-48 h-48 rounded-full border-16 border-primary flex items-center justify-center transition-transform hover:scale-105">
          <div className="w-32 h-32 rounded-full border-12 border-blue-500 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-8 border-amber-400" />
          </div>
        </div>
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-bold text-on-surface">
            {totalOrders}
          </span>
          <span className="text-xs text-secondary uppercase font-semibold">
            Total
          </span>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="grid grid-cols-2 gap-sm mt-md pt-sm border-t border-outline-variant">
        {orderStatusBreakdown.map((item, i) => (
          <div key={i} className="flex items-center gap-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`} />
            <span className="text-label-sm text-secondary font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusChart;
