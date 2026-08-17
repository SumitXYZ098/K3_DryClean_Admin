import type React from "react";
import type { Customer } from "../../store/useCustomerStore";
import CustomerTableRow from "./CustomerTableRow";
import Pagination from "../common/Pagination";

export interface CustomerTableProps {
  customers: Customer[];
  isLoading?: boolean;
  totalCount: number;
  selectedRowId: string | null;
  openActionMenuId: string | null;
  onSelectRow: (id: string) => void;
  onToggleMenu: (id: string | null) => void;
  onViewDetails: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading = false,
  totalCount,
  selectedRowId,
  openActionMenuId,
  onSelectRow,
  onToggleMenu,
  onViewDetails,
  onToggleStatus,
  onDeleteCustomer,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  return (
    <div className="bg-surface rounded-lg border border-outline-variant shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-190">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Customer
              </th>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Contact Details
              </th>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Total Orders
              </th>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Total Spend
              </th>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Status
              </th>
              <th className="px-lg py-4 capitalize text-secondary text-base whitespace-nowrap">
                Last Order
              </th>
              <th className="px-lg py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`customer-skeleton-${index}`} className="animate-pulse">
                  <td className="px-lg py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-outline-variant/40"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-outline-variant/40 rounded-md"></div>
                        <div className="h-3 w-16 bg-outline-variant/40 rounded-md"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-outline-variant/40 rounded-md"></div>
                      <div className="h-3 w-24 bg-outline-variant/40 rounded-md"></div>
                    </div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-12 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-16 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-6 w-16 bg-outline-variant/40 rounded-full"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-20 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4 text-center">
                    <div className="h-6 w-6 bg-outline-variant/40 rounded-full mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-lg py-xl text-center text-secondary"
                >
                  <span className="material-symbols-outlined text-4xl mb-sm block text-outline">
                    search_off
                  </span>
                  No customers match the selected filter criteria.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  isSelected={selectedRowId === customer.id}
                  isMenuOpen={openActionMenuId === customer.id}
                  onSelect={onSelectRow}
                  onToggleMenu={onToggleMenu}
                  onViewDetails={onViewDetails}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDeleteCustomer}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CustomerTable;
