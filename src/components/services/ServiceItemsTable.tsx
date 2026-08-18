import type React from "react";
import ServiceItemTableRow from "./ServiceItemTableRow";
import type { ServiceItem } from "../../store/useServiceStore";

export interface ServiceItemsTableProps {
  items: ServiceItem[];
  isLoading?: boolean;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string) => void;
  onToggleExpressDelivery: (id: string) => void;
  onViewItem: (item: ServiceItem) => void;
  onEditItem: (item: ServiceItem) => void;
  onDeleteItem: (id: string) => void;
  onAddNewItem: () => void;
}

export const ServiceItemsTable: React.FC<ServiceItemsTableProps> = ({
  items,
  isLoading = false,
  totalCount,
  currentPage,
  itemsPerPage,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onToggleStatus,
  onToggleExpressDelivery,
  onViewItem,
  onEditItem,
  onDeleteItem,
}) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex flex-col gap-0">
      {/* Table Controls (Search, Filters) */}
      <div className="bg-surface border border-outline-variant rounded-t-xl p-md flex flex-col md:flex-row gap-md items-center justify-between shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border-b-0">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-on-surface"
          />
        </div>

        <div className="flex items-center gap-md w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as "all" | "active" | "inactive")
              }
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-md pr-xl text-body-md appearance-none focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-on-surface cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          <button
            onClick={() => onStatusFilterChange(statusFilter === "all" ? "active" : "all")}
            className="p-sm border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-low transition-colors hidden md:block cursor-pointer"
            title="Filter List"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-outline-variant rounded-b-xl shadow-[0px_2px_4px_rgba(0,0,0,0.05)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap">
                Item Name
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap">
                Normal Price
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap">
                Offer Price
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap">
                Express Price
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap text-center">
                Express Delivery
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap">
                Status
              </th>
              <th className="py-md px-lg font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-body-md text-on-surface divide-y divide-outline-variant">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`item-row-skeleton-${idx}`} className="animate-pulse">
                  <td className="py-md px-lg">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-outline-variant/40 rounded-md" />
                      <div className="h-3 w-48 bg-outline-variant/30 rounded-md" />
                    </div>
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 w-16 bg-outline-variant/40 rounded-md" />
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 w-12 bg-outline-variant/30 rounded-md" />
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-4 w-16 bg-outline-variant/30 rounded-md" />
                  </td>
                  <td className="py-md px-lg text-center">
                    <div className="w-9 h-5 bg-outline-variant/40 rounded-full mx-auto" />
                  </td>
                  <td className="py-md px-lg">
                    <div className="h-6 w-16 bg-outline-variant/40 rounded-full" />
                  </td>
                  <td className="py-md px-lg text-right">
                    <div className="h-6 w-20 bg-outline-variant/40 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : items.length > 0 ? (
              items.map((item) => (
                <ServiceItemTableRow
                  key={item.id}
                  item={item}
                  onToggleStatus={onToggleStatus}
                  onToggleExpressDelivery={onToggleExpressDelivery}
                  onView={onViewItem}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-xl text-center text-secondary">
                  <div className="flex flex-col items-center gap-xs py-lg">
                    <span className="material-symbols-outlined text-[40px] text-outline">
                      inventory_2
                    </span>
                    <p className="font-title-md text-on-surface mt-sm">No items found</p>
                    <p className="font-body-md text-secondary">
                      Try adjusting your search or filter parameters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-md border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between text-body-md text-secondary gap-md">
          <div>
            Showing {startItem} to {endItem} of {totalCount} entries
          </div>
          <div className="flex gap-xs items-center">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="px-sm py-xs border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-sm py-xs border rounded transition-colors cursor-pointer ${
                    isCurrent
                      ? "border-primary bg-primary text-on-primary font-medium"
                      : "border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="px-sm py-xs border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemsTable;
