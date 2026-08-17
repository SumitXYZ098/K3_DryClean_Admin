import type React from "react";
import type { Driver } from "../../store/useDriverStore";
import Pagination from "../common/Pagination";

interface DriverTableProps {
  drivers: Driver[];
  isLoading?: boolean;
  totalCount: number;
  onViewDetails: (driver: Driver) => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (driver: Driver) => void;
  onToggleStatus: (driver: Driver) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  isLoading = false,
  totalCount,
  onViewDetails,
  onEditDriver,
  onDeleteDriver,
  onToggleStatus,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Helper to derive initials from driver name
  const getInitials = (name: string) => {
    if (!name) return "DR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-secondary uppercase tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Pickup Order</th>
              <th className="p-4">Delivery Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`driver-skeleton-${index}`} className="animate-pulse">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-outline-variant/40"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-outline-variant/40 rounded-md"></div>
                        <div className="h-3 w-20 bg-outline-variant/40 rounded-md"></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-24 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-16 bg-outline-variant/40 rounded-full"></div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-8 w-20 bg-outline-variant/40 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-outline">
                      local_shipping
                    </span>
                    <p className="font-bold text-on-surface">
                      No drivers found
                    </p>
                    <p className="text-sm">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              drivers.map((driver) => {
                const initials = getInitials(driver.fullName);
                const isActive = driver.isActive;

                return (
                  <tr
                    key={driver.documentId || driver.id}
                    className={`hover:bg-surface-container-lowest transition-colors ${
                      !isActive ? "bg-surface-container-low/30" : ""
                    }`}
                  >
                    {/* Name & Vehicle */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-secondary text-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-body-md">
                            {driver.fullName}
                          </p>
                          <p className="text-xs text-secondary">
                            {driver.vehicleNumber
                              ? driver.vehicleNumber
                              : "No Vehicle Assigned"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-sm font-medium text-on-surface">
                      {driver.phoneNumber || "N/A"}
                    </td>

                    {/* Pickup Order Count */}
                    <td className="p-4 text-sm font-medium text-on-surface">
                      {driver.pickupOrdersCount}
                    </td>

                    {/* Delivery Order Count */}
                    <td className="p-4 text-sm font-medium text-on-surface">
                      {driver.deliveryOrdersCount}
                    </td>

                    {/* Status Pill */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(driver)}
                        title="Click to toggle status"
                        className="cursor-pointer"
                      >
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                            Offline
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewDetails(driver)}
                          className="text-primary hover:bg-primary-container/10 p-1.5 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditDriver(driver)}
                          className="text-secondary hover:bg-surface-container p-1.5 rounded transition-colors cursor-pointer"
                          title="Edit Driver"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteDriver(driver)}
                          className="text-error hover:bg-error-container/20 p-1.5 rounded transition-colors cursor-pointer"
                          title="Remove Driver"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {totalCount > 0 && (
        <div className="border-t border-outline-variant bg-surface">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={10}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DriverTable;
