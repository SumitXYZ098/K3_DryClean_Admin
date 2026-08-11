import type React from "react";
import type { Customer } from "../../store/useCustomerStore";
import type { CustomerAddress } from "../../api/customerApi";

export interface CustomerDetailModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
}) => {
  if (!customer) return null;

  console.log(customer);

  // Gather addresses array or fallback to top-level address fields
  const addresses: CustomerAddress[] =
    customer.customer_addresses && customer.customer_addresses.length > 0
      ? customer.customer_addresses
      : customer.streetAddress || customer.city
        ? [
            {
              id: 1,
              documentId: "default-addr",
              fullAddress: [
                customer.streetAddress,
                customer.city,
                customer.state,
                customer.zipCode,
              ]
                .filter(Boolean)
                .join(", "),
              streetAddress: customer.streetAddress || "",
              city: customer.city || "",
              state: customer.state || "",
              postalCode: customer.zipCode || "",
              country: "India",
              addressType: customer.addressType || "home",
              isDefaultAddress: true,
            },
          ]
        : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-md animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-xl max-w-150 w-full shadow-2xl space-y-lg animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <div className="flex items-center gap-md">
            {customer.avatarUrl ? (
              <img
                src={customer.avatarUrl}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover border border-outline-variant shrink-0"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                  customer.initialsBg || "bg-primary-fixed text-primary"
                }`}
              >
                {customer.initials || "K3"}
              </div>
            )}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface capitalize">
                {customer.name}
              </h3>
              <p className="text-label-sm text-primary">
                Customer ID: {customer.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-md cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 gap-md py-sm">
          <div className="p-md bg-surface-container-low rounded-md border border-outline-variant/40 space-y-1">
            <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
              Total Orders
            </span>
            <p className="font-headline-md text-on-surface font-bold">
              {customer.totalOrders}
            </p>
          </div>

          <div className="p-md bg-surface-container-low rounded-md border border-outline-variant/40 space-y-1">
            <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
              Total Spend
            </span>
            <p
              className={`font-headline-md font-bold ${
                customer.totalSpend < 0 ? "text-error" : "text-primary"
              }`}
            >
              {customer.totalSpend < 0
                ? `-₹${Math.abs(customer.totalSpend).toFixed(2)}`
                : `₹${customer.totalSpend.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Detail List */}
        <div className="space-y-sm text-body-md">
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/40">
            <span className="text-secondary font-medium">Email:</span>
            <span className="text-on-surface font-medium">
              {customer.email}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/40">
            <span className="text-secondary font-medium">Phone:</span>
            <span className="text-on-surface font-medium">
              {customer.phone}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/40">
            <span className="text-secondary font-medium">Account Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                customer.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {customer.status}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/40">
            <span className="text-secondary font-medium">Last Order Date:</span>
            <span className="text-on-surface font-medium">
              {customer.lastOrder}
            </span>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="space-y-md pt-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-label-sm text-secondary uppercase font-bold tracking-wider flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              Saved Addresses ({addresses.length})
            </h4>
          </div>

          {addresses.length === 0 ? (
            <p className="text-body-md text-secondary italic">
              No address details available.
            </p>
          ) : (
            <div className="space-y-sm max-h-60 overflow-y-auto pr-1">
              {addresses.map((addr, idx) => {
                const isDefault = addr.isDefaultAddress;
                const displayAddress =
                  addr.fullAddress ||
                  [
                    addr.streetAddress,
                    addr.city,
                    addr.state,
                    addr.postalCode,
                    addr.country,
                  ]
                    .filter(Boolean)
                    .join(", ");

                return (
                  <div
                    key={addr.id || addr.documentId || idx}
                    className={`p-md rounded-xl border transition-all ${
                      isDefault
                        ? "border-primary/40 bg-primary-container/10 shadow-xs"
                        : "border-outline-variant/60 bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface">
                        {addr.addressType || "Address"}
                      </span>
                      {isDefault && (
                        <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            check_circle
                          </span>
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-body-md text-on-surface font-medium mt-1">
                      {displayAddress}
                    </p>
                    {addr.landmark && (
                      <p className="text-label-sm text-secondary mt-1">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-md border-t border-outline-variant flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-2 bg-primary text-white font-title-md rounded-default hover:bg-primary-container transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
