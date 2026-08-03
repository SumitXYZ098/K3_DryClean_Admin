import type React from "react";

export interface CustomerFilterBarProps {
  spendFilter: string;
  onSpendFilterChange: (val: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
}

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  spendFilter,
  onSpendFilterChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  onExportCSV,
}) => {
  return (
    <div className="glass-panel rounded-md p-md flex flex-wrap items-center gap-md sm:gap-lg">
      {/* Filter Label */}
      <div className="flex items-center gap-sm">
        <span
          className="material-symbols-outlined text-secondary"
          data-icon="filter_list"
        >
          filter_list
        </span>
        <span className="font-title-md text-on-surface">Filter By:</span>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-md">
        {/* Spend Filter */}
        <select
          value={spendFilter}
          onChange={(e) => onSpendFilterChange(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant rounded-default py-2 px-md text-body-md focus:ring-primary focus:border-primary outline-none cursor-pointer font-body-md"
        >
          <option value="All">Total Spend (All)</option>
          <option value="High Value">High Value (&gt;₹500)</option>
          <option value="Mid Range">Mid Range (₹100-₹500)</option>
          <option value="New Customers">New Customers (&lt;₹100)</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant rounded-default py-2 px-md text-body-md focus:ring-primary focus:border-primary outline-none cursor-pointer font-body-md"
        >
          <option value="All">Last Order Date (All)</option>
          <option value="Past 7 Days">Past 7 Days</option>
          <option value="Past 30 Days">Past 30 Days</option>
          <option value="Inactive (>90 Days)">Inactive (&gt;90 Days)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant rounded-default py-2 px-md text-body-md focus:ring-primary focus:border-primary outline-none cursor-pointer font-body-md"
        >
          <option value="All">Status (All)</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Clear & Export Buttons */}
      <div className="ml-auto flex items-center gap-sm">
        <button
          type="button"
          onClick={onClearFilters}
          className="text-secondary hover:text-primary transition-colors text-body-md font-medium cursor-pointer"
        >
          Clear All Filters
        </button>

        <div className="h-6 w-px bg-outline-variant mx-sm" />

        <button
          type="button"
          onClick={onExportCSV}
          className="flex items-center gap-xs px-md py-2 border border-outline-variant rounded-default hover:bg-surface-container transition-colors text-body-md cursor-pointer font-medium"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="download"
          >
            download
          </span>
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default CustomerFilterBar;
