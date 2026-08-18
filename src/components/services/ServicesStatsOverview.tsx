import type React from "react";
import type { ServiceCategory, ServiceItem } from "../../store/useServiceStore";

export interface ServicesStatsOverviewProps {
  categories: ServiceCategory[];
  items: ServiceItem[];
  isLoading?: boolean;
}

export const ServicesStatsOverview: React.FC<ServicesStatsOverviewProps> = ({
  categories,
  items,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-md">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`stats-skeleton-${idx}`}
            className="bg-surface border border-outline-variant rounded-xl p-md shadow-xs flex items-center gap-md animate-pulse"
          >
            <div className="w-12 h-12 rounded-lg bg-outline-variant/40 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-outline-variant/40 rounded-md" />
              <div className="h-6 w-16 bg-outline-variant/50 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalActiveItems = items.filter((i) => i.status === "Active").length;
  const expressEnabledCount = items.filter((i) => i.expressDeliveryAvailable && i.status === "Active").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-md">
      {/* Total Categories */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-xs flex items-center gap-md">
        <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[24px]">category</span>
        </div>
        <div>
          <p className="text-label-sm text-secondary uppercase font-semibold tracking-wider">
            Categories
          </p>
          <p className="text-headline-md text-headline-md font-bold text-on-surface">
            {totalCategories}
          </p>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-xs flex items-center gap-md">
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
        </div>
        <div>
          <p className="text-label-sm text-secondary uppercase font-semibold tracking-wider">
            Active Categories
          </p>
          <p className="text-headline-md text-headline-md font-bold text-on-surface">
            {activeCategories} / {totalCategories}
          </p>
        </div>
      </div>

      {/* Total Items Active */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-xs flex items-center gap-md">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-blue-600 text-[24px]">inventory_2</span>
        </div>
        <div>
          <p className="text-label-sm text-secondary uppercase font-semibold tracking-wider">
            Active Items
          </p>
          <p className="text-headline-md text-headline-md font-bold text-on-surface">
            {totalActiveItems}
          </p>
        </div>
      </div>

      {/* Express Delivery Enabled */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-xs flex items-center gap-md">
        <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-amber-600 text-[24px]">airport_shuttle</span>
        </div>
        <div>
          <p className="text-label-sm text-secondary uppercase font-semibold tracking-wider">
            Express Enabled
          </p>
          <p className="text-headline-md text-headline-md font-bold text-on-surface">
            {expressEnabledCount} Items
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesStatsOverview;
