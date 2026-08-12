import type React from "react";

interface DriverFilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onlineCount: number;
  totalCount: number;
  onClearFilters: () => void;
  onExportCSV: () => void;
}

export const DriverFilterBar: React.FC<DriverFilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  onlineCount,
  totalCount,
  onClearFilters,
  onExportCSV,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Driver Roster
        </h2>
        <p className="text-secondary text-body-md">
          Manage fleet personnel and real-time status.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-md">
        {/* Status Pill Indicator */}
        <div className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-2 shadow-xs">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-on-surface">
            {onlineCount} {onlineCount === 1 ? "Driver" : "Drivers"} Online
          </span>
          <span className="text-xs text-secondary opacity-70">
            ({totalCount} total)
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-1 flex items-center gap-1">
          {["All", "Active", "Offline"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onStatusFilterChange(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-secondary hover:text-on-surface hover:bg-surface-container/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Clear Filters & Export CSV */}
        {statusFilter !== "All" && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}

        <button
          type="button"
          onClick={onExportCSV}
          className="bg-surface border border-outline-variant hover:bg-surface-container-low text-on-surface px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Roster
        </button>
      </div>
    </div>
  );
};

export default DriverFilterBar;
