import type React from "react";
import type { Customer } from "../../pages/customers/CustomersPage";
import CustomerTableRow from "./CustomerTableRow";
import Pagination from "../common/Pagination";

export interface CustomerTableProps {
  customers: Customer[];
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
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider">
                Customer
              </th>
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider">
                Contact Details
              </th>
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider">
                Total Orders
              </th>
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider text-right">
                Wallet Balance
              </th>
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider">
                Status
              </th>
              <th className="px-lg py-4 font-label-sm uppercase text-secondary tracking-wider">
                Last Order
              </th>
              <th className="px-lg py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {customers.length === 0 ? (
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
