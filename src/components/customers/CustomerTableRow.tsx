import type React from "react";
import type { Customer } from "../../store/useCustomerStore";

export interface CustomerTableRowProps {
  customer: Customer;
  isSelected: boolean;
  isMenuOpen: boolean;
  onSelect: (id: string) => void;
  onToggleMenu: (id: string | null) => void;
  onViewDetails: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  customer,
  isSelected,
  isMenuOpen,
  onSelect,
  onToggleMenu,
  onViewDetails,
  onToggleStatus,
  onDelete,
}) => {
  console.log(customer.avatarUrl);
  return (
    <tr
      onClick={() => onSelect(customer.id)}
      className={`table-row-hover transition-colors cursor-pointer group ${
        isSelected ? "bg-primary-container/10" : ""
      }`}
    >
      {/* Customer Info */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-md">
          {customer.avatarUrl ? (
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                customer.initialsBg || "bg-primary-fixed text-primary"
              }`}
            >
              {customer.initials || "K3"}
            </div>
          )}
          <div>
            <p className="font-title-md text-on-surface">{customer.name}</p>
            <p className="text-label-sm text-secondary">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
      </td>

      {/* Contact Details */}
      <td className="px-lg py-md">
        <div className="flex flex-col text-body-md space-y-0.5">
          <span className="flex items-center gap-xs">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              data-icon="mail"
            >
              mail
            </span>
            {customer.email}
          </span>
          <span className="flex items-center gap-xs">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              data-icon="call"
            >
              call
            </span>
            {customer.phone}
          </span>
        </div>
      </td>

      {/* Total Orders */}
      <td className="px-lg py-md">
        <span className="font-title-md">{customer.totalOrders} Orders</span>
      </td>

      {/* Wallet Balance */}
      <td className="px-lg py-md text-right">
        <span
          className={`font-title-md ${
            customer.walletBalance < 0 ? "text-error" : "text-on-surface"
          }`}
        >
          {customer.walletBalance < 0
            ? `-₹${Math.abs(customer.walletBalance).toFixed(2)}`
            : `₹${customer.walletBalance.toFixed(2)}`}
        </span>
      </td>

      {/* Status Badge */}
      <td className="px-lg py-md">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            customer.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {customer.status}
        </span>
      </td>

      {/* Last Order Date */}
      <td className="px-lg py-md">
        <p className="text-body-md">{customer.lastOrder}</p>
      </td>

      {/* Actions Dropdown Button */}
      <td className="px-lg py-md text-right relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(isMenuOpen ? null : customer.id);
          }}
          className="p-2 rounded-lg opacity-80 group-hover:opacity-100 hover:bg-surface-container transition-all cursor-pointer"
          aria-label="More actions"
        >
          <span
            className="material-symbols-outlined text-secondary"
            data-icon="more_vert"
          >
            more_vert
          </span>
        </button>

        {/* Action Menu Dropdown */}
        {isMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-6 top-12 w-48 bg-surface-container-lowest border border-outline-variant shadow-xl rounded-md py-2 z-9999 animate-fade-in text-left"
          >
            <button
              type="button"
              onClick={() => onViewDetails(customer)}
              className="w-full px-md py-2 text-body-md text-on-surface hover:bg-surface-container flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              View Details
            </button>

            <button
              type="button"
              onClick={() => onToggleStatus(customer)}
              className="w-full px-md py-2 text-body-md text-on-surface hover:bg-surface-container flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {customer.status === "Active" ? "block" : "check_circle"}
              </span>
              {customer.status === "Active"
                ? "Suspend Account"
                : "Activate Account"}
            </button>

            <hr className="my-1 border-outline-variant" />

            <button
              type="button"
              onClick={() => onDelete(customer)}
              className="w-full px-md py-2 text-body-md text-error hover:bg-error-container/20 flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
              Remove Customer
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default CustomerTableRow;
