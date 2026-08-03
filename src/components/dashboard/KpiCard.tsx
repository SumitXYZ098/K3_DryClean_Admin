import type React from "react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType?: "positive" | "negative" | "neutral" | "info";
  icon: string;
  iconColorClass?: string;
  iconBgClass?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/5",
  onClick,
}) => {
  const getChangeStyles = () => {
    switch (changeType) {
      case "positive":
        return { color: "text-emerald-600", icon: "trending_up" };
      case "negative":
        return { color: "text-error", icon: "trending_down" };
      case "info":
        return { color: "text-blue-600", icon: "info" };
      default:
        return { color: "text-amber-600", icon: "person_add" };
    }
  };

  const changeStyle = getChangeStyles();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-outline-variant p-lg rounded-md kpi-card-shadow transition-all hover:scale-[1.02] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-sm">
        <span className="text-label-sm font-medium text-secondary uppercase tracking-wider">
          {title}
        </span>
        <span
          className={`material-symbols-outlined ${iconColorClass} ${iconBgClass} p-1 rounded`}
        >
          {icon}
        </span>
      </div>
      <div className="font-title-md text-2xl text-on-surface font-bold">
        {value}
      </div>
      <div className="flex items-center gap-xs mt-xs">
        <span
          className={`material-symbols-outlined text-xs ${changeStyle.color}`}
        >
          {changeStyle.icon}
        </span>
        <span className={`text-label-sm ${changeStyle.color}`}>{change}</span>
      </div>
    </div>
  );
};

export default KpiCard;
