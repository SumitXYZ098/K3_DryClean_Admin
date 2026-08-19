import type React from "react";

interface PaymentFilterBarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  methodFilter: string;
  onMethodChange: (method: string) => void;
  dateFilter: string;
  onDateChange: (range: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const PaymentFilterBar: React.FC<PaymentFilterBarProps> = ({
  statusFilter,
  onStatusChange,
  methodFilter,
  onMethodChange,
  dateFilter,
  onDateChange,
  onClearFilters,
  isFiltered,
}) => {
  const statuses = [
    { label: "All Status", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Failed", value: "Failed" },
    { label: "Refunded", value: "Refunded" },
  ];

  const methods = [
    "All Methods",
    "Online (UPI)",
    "Credit Card",
    "Cash (COD)",
    "Debit Card",
    "Net Banking",
  ];

  const dateRanges = [
    "All Dates",
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
  ];

  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-[#E5E5E5] shadow-sm mb-lg flex flex-wrap items-center justify-between gap-md">
      {/* Status Filter Buttons */}
      <div className="flex items-center flex-wrap gap-sm">
        <span className="text-on-surface-variant font-label-sm uppercase tracking-wider text-xs mr-1 hidden sm:inline">
          Filter:
        </span>
        {statuses.map((s) => {
          const isActive = statusFilter === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onStatusChange(s.value)}
              className={`px-md py-sm rounded-lg font-body-md text-body-md transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary-container/10 text-primary font-medium border border-primary shadow-xs"
                  : "bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Date & Payment Method Filters */}
      <div className="flex items-center flex-wrap gap-sm">
        {/* Date Range Dropdown / Selector */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-md py-sm pr-8 rounded-lg bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container border border-outline-variant transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {dateRanges.map((d) => (
              <option key={d} value={d}>
                📅 {d}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* Payment Method Selector */}
        <div className="relative">
          <select
            value={methodFilter}
            onChange={(e) => onMethodChange(e.target.value)}
            className="px-md py-sm pr-8 rounded-lg bg-surface text-on-surface-variant font-body-md text-body-md hover:bg-surface-container border border-outline-variant transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {methods.map((m) => (
              <option key={m} value={m}>
                💳 {m}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-sm py-sm text-error hover:bg-error-container/20 rounded-lg text-body-md transition-colors flex items-center gap-xs cursor-pointer"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-sm">
              restart_alt
            </span>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentFilterBar;
