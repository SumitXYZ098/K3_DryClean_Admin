import type React from "react";
import { useState } from "react";

export interface BarData {
  week: string;
  dryCleaning: number;
  laundry: number;
  heightPercent: number;
  amount: string;
}

const defaultRevenueData: BarData[] = [
  {
    week: "Week 1",
    dryCleaning: 1120,
    laundry: 800,
    heightPercent: 40,
    amount: "₹1,120",
  },
  {
    week: "Week 2",
    dryCleaning: 1540,
    laundry: 950,
    heightPercent: 55,
    amount: "₹1,540",
  },
  {
    week: "Week 3",
    dryCleaning: 1280,
    laundry: 900,
    heightPercent: 45,
    amount: "₹1,280",
  },
  {
    week: "Week 4",
    dryCleaning: 1960,
    laundry: 1100,
    heightPercent: 70,
    amount: "₹1,960",
  },
  {
    week: "Week 5",
    dryCleaning: 1820,
    laundry: 1050,
    heightPercent: 65,
    amount: "₹1,820",
  },
  {
    week: "Week 6",
    dryCleaning: 2450,
    laundry: 1400,
    heightPercent: 85,
    amount: "₹2,450",
  },
  {
    week: "Week 7",
    dryCleaning: 1400,
    laundry: 890,
    heightPercent: 50,
    amount: "₹1,400",
  },
  {
    week: "Week 8",
    dryCleaning: 1680,
    laundry: 980,
    heightPercent: 60,
    amount: "₹1,680",
  },
  {
    week: "Week 9",
    dryCleaning: 1540,
    laundry: 920,
    heightPercent: 55,
    amount: "₹1,540",
  },
  {
    week: "Week 10",
    dryCleaning: 2100,
    laundry: 1200,
    heightPercent: 75,
    amount: "₹2,100",
  },
];

export const RevenueChart: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-lg text-on-surface">
          Revenue Trends
        </h3>
        <div className="flex gap-md">
          <div className="flex items-center gap-sm">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-label-sm text-secondary">Dry Cleaning</span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-label-sm text-secondary">Laundry</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 relative flex items-end justify-between px-md pb-xl min-h-55">
        <div className="absolute inset-0 revenue-gradient opacity-40 pointer-events-none" />

        {defaultRevenueData.map((item, index) => {
          const isFeatured = index === 5;
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredBar(item)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ height: `${item.heightPercent}%` }}
              className={`w-[8%] rounded-t-lg relative group transition-all duration-200 cursor-pointer ${
                isFeatured
                  ? "bg-primary brightness-105"
                  : "bg-primary/20 hover:bg-primary/40"
              }`}
            >
              {/* Tooltip */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-inverse-surface text-on-primary rounded px-2 py-1 text-xs whitespace-nowrap z-10 transition-opacity ${
                  hoveredBar?.week === item.week || isFeatured
                    ? "opacity-100 block"
                    : "opacity-0 hidden group-hover:block"
                }`}
              >
                {item.amount}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between mt-sm px-md border-t border-outline-variant pt-md">
        <span className="text-label-sm text-secondary">Week 1</span>
        <span className="text-label-sm text-secondary">Week 2</span>
        <span className="text-label-sm text-secondary">Week 3</span>
        <span className="text-label-sm text-secondary">Week 4</span>
      </div>
    </div>
  );
};

export default RevenueChart;
