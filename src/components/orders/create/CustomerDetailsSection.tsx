/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useEffect, useState, useRef } from "react";
import useCustomerStore, {
  type Customer,
} from "../../../store/useCustomerStore";
import type { CustomerAddress } from "../../../api/customerApi";

export interface CustomerDetailsData {
  isNewCustomer: boolean;
  fullName: string;
  phone: string;
  email: string;
  selectedCustomerId?: string;
  address?: string;
  selectedAddressObj?: CustomerAddress | null;
}

export interface CustomerDetailsSectionProps {
  data: CustomerDetailsData;
  onChange: (field: keyof CustomerDetailsData, value: any) => void;
  onSelectCustomer?: (customer: Customer) => void;
  onSelectAddress?: (addressObj: CustomerAddress, addressStr: string) => void;
}

export const CustomerDetailsSection: React.FC<CustomerDetailsSectionProps> = ({
  data,
  onChange,
  onSelectCustomer,
  onSelectAddress,
}) => {
  const { customers, fetchCustomers, hasFetched, isLoading } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState(data.fullName || "");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [availableAddresses, setAvailableAddresses] = useState<CustomerAddress[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-fetch customer list from API backend on mount if not fetched
  useEffect(() => {
    if (!hasFetched) {
      fetchCustomers().catch((err) => {
        console.warn("Failed to fetch customers for selection dropdown", err);
      });
    }
  }, [hasFetched, fetchCustomers]);

  // Click-outside listener for closing dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCustomerAddressStr = (c: Customer): string => {
    if (c.streetAddress) {
      return [c.streetAddress, c.city, c.state, c.zipCode]
        .filter(Boolean)
        .join(", ");
    }
    const firstAddr = c.customer_addresses?.[0];
    if (firstAddr?.fullAddress) return firstAddr.fullAddress;
    if (firstAddr?.streetAddress) {
      return [firstAddr.streetAddress, firstAddr.city, firstAddr.state]
        .filter(Boolean)
        .join(", ");
    }
    return "";
  };

  const handleSelect = (c: Customer) => {
    setSearchQuery(c.name);
    setShowSearchResults(false);
    onChange("fullName", c.name);
    onChange("phone", c.phone);
    onChange("email", c.email);
    onChange("selectedCustomerId", c.documentId || c.id);

    const addrs = c.customer_addresses || [];
    setAvailableAddresses(addrs);

    const defaultAddr =
      addrs.find((a) => a.isDefaultAddress) || addrs[0] || null;

    const addrStr = defaultAddr
      ? defaultAddr.fullAddress ||
        [
          defaultAddr.streetAddress,
          defaultAddr.city,
          defaultAddr.state,
          defaultAddr.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : getCustomerAddressStr(c);

    if (defaultAddr) {
      onChange("selectedAddressObj", defaultAddr);
    }
    if (addrStr) {
      onChange("address", addrStr);
    }

    if (defaultAddr) {
      onSelectAddress?.(defaultAddr, addrStr);
    }
    onSelectCustomer?.(c);
  };

  const handleClearSelection = () => {
    setSearchQuery("");
    setAvailableAddresses([]);
    onChange("fullName", "");
    onChange("phone", "");
    onChange("email", "");
    onChange("selectedCustomerId", "");
    onChange("address", "");
    onChange("selectedAddressObj", null);
  };

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          <h3 className="font-title-md text-title-md text-on-surface">
            Customer Details
          </h3>
          {isLoading && (
            <span className="text-xs text-secondary animate-pulse flex items-center gap-1">
              <span className="material-symbols-outlined text-xs animate-spin">
                sync
              </span>
              Fetching customers...
            </span>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Existing Customer Search Input */}
        <div className="md:col-span-2 relative" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-label-sm text-secondary font-semibold">
                Search Existing Customer
              </label>
              {data.selectedCustomerId && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="Search by name, phone (+1...), email or ID..."
                className="w-full border border-outline-variant rounded-lg p-2.5 pr-10 bg-surface text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
            </div>

            {/* Dropdown Results */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-outline-variant rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto divide-y divide-outline-variant">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => {
                    const addr = getCustomerAddressStr(cust);
                    const addressCount = cust.customer_addresses?.length || 0;
                    return (
                      <div
                        key={cust.id}
                        onClick={() => handleSelect(cust)}
                        className="p-3 hover:bg-surface-container-low cursor-pointer transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-on-surface truncate">
                              {cust.name}
                            </p>
                            <span className="text-[10px] text-secondary font-mono bg-surface-container-high px-1.5 py-0.5 rounded">
                              {cust.id}
                            </span>
                          </div>
                          <p className="text-xs text-secondary truncate">
                            {cust.phone} • {cust.email}
                          </p>
                          {addr && (
                            <p className="text-xs text-outline truncate flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-xs">
                                location_on
                              </span>
                              {addr}
                              {addressCount > 1 && (
                                <span className="text-[10px] text-primary font-bold ml-1">
                                  ({addressCount} addresses)
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          {cust.status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-xs text-secondary text-center">
                    {searchQuery.trim().length > 0
                      ? `No customers match "${searchQuery}"`
                      : "Start typing to search existing customers..."}
                  </div>
                )}
              </div>
            )}
          </div>

        <div>
          <label className="block text-label-sm text-secondary mb-1 font-semibold">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="e.g. Mark Thompson"
            className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface-container-low text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-label-sm text-secondary mb-1 font-semibold">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 012-3456"
            className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface-container-low text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-label-sm text-secondary mb-1 font-semibold">
            Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="m.thompson@enterprise.com"
            className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface-container-low text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Multiple Addresses Selector for Customer */}
        {availableAddresses.length > 0 && (
          <div className="md:col-span-2 space-y-2 pt-2 border-t border-outline-variant">
            <div className="flex items-center justify-between">
              <label className="text-label-sm text-secondary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-primary">
                  location_on
                </span>
                Select Customer Address ({availableAddresses.length} saved)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableAddresses.map((addr, idx) => {
                const formattedStr =
                  addr.fullAddress ||
                  [addr.streetAddress, addr.city, addr.state, addr.postalCode]
                    .filter(Boolean)
                    .join(", ");

                const isSelected =
                  data.selectedAddressObj?.id === addr.id ||
                  data.address === formattedStr ||
                  (!data.selectedAddressObj && idx === 0);

                return (
                  <div
                    key={addr.id || idx}
                    onClick={() => {
                      onChange("selectedAddressObj", addr);
                      onChange("address", formattedStr);
                      onSelectAddress?.(addr, formattedStr);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-1 ring-primary/30"
                        : "bg-surface border-outline-variant hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                        {addr.addressType || "Address"}
                      </span>
                      {addr.isDefaultAddress && (
                        <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface font-medium line-clamp-2">
                      {formattedStr}
                    </p>

                    {addr.landmark && (
                      <p className="text-[11px] text-secondary truncate">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerDetailsSection;
