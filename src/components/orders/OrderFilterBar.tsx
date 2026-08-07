import type React from "react";

export interface OrderFilterBarProps {
  serviceTypeFilter: string;
  onServiceTypeChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  serviceTypeFilter,
  onServiceTypeChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <div className="p-lg grid grid-cols-1 md:grid-cols-4 gap-md bg-surface-container-low/50">
      {/* Service Type Select */}
      <div className="flex flex-col gap-1">
        <label className="text-label-sm uppercase text-on-surface-variant font-bold">
          Service Type
        </label>
        <select
          value={serviceTypeFilter}
          onChange={(e) => onServiceTypeChange(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary text-on-surface"
        >
          <option value="All">All Services</option>
          <option value="Wash & Fold">Wash & Fold</option>
          <option value="Dry Clean Only">Dry Clean Only</option>
          <option value="Ironing">Ironing</option>
          <option value="Household Items">Household Items</option>
        </select>
      </div>

      {/* Status Filter Select */}
      <div className="flex flex-col gap-1">
        <label className="text-label-sm uppercase text-on-surface-variant font-bold">
          Status Filter
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary text-on-surface"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Ready">Ready</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Issues">Issues</option>
        </select>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-col gap-1">
        <label className="text-label-sm uppercase text-on-surface-variant font-bold">
          Date Range
        </label>
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base"
            data-icon="calendar_month"
          >
            calendar_month
          </span>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            placeholder="Oct 20 - Oct 27, 2023"
            className="w-full pl-8 pr-2 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm outline-none text-on-surface focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Apply and Clear Filter Buttons */}
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={onApplyFilters}
          className="flex-1 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-sm rounded-lg hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer shadow-xs"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={onClearFilters}
          title="Reset filters"
          className="p-2.5 border border-outline-variant text-secondary rounded-lg hover:bg-surface-container transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
        </button>
      </div>
    </div>
  );
};

export default OrderFilterBar;
