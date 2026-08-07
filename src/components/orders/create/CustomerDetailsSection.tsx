import type React from "react";
import { useState } from "react";
import useCustomerStore, {
  type Customer,
} from "../../../store/useCustomerStore";

export interface CustomerDetailsData {
  isNewCustomer: boolean;
  fullName: string;
  phone: string;
  email: string;
  selectedCustomerId?: string;
}

export interface CustomerDetailsSectionProps {
  data: CustomerDetailsData;
  onChange: (field: keyof CustomerDetailsData, value: boolean | string) => void;
  onSelectCustomer?: (customer: Customer) => void;
}

export const CustomerDetailsSection: React.FC<CustomerDetailsSectionProps> = ({
  data,
  onChange,
  onSelectCustomer,
}) => {
  const { customers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (c: Customer) => {
    setSearchQuery(c.name);
    setShowSearchResults(false);
    onChange("fullName", c.name);
    onChange("phone", c.phone);
    onChange("email", c.email);
    onChange("selectedCustomerId", c.id);
    onSelectCustomer?.(c);
  };

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          <h3 className="font-title-md text-title-md text-on-surface">
            Customer Details
          </h3>
        </div>

        {/* Add New Customer Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group select-none">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.isNewCustomer}
              onChange={(e) => onChange("isNewCustomer", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </div>
          <span className="text-sm font-medium text-on-surface">
            Add New Customer
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Existing Customer Search Input */}
        {!data.isNewCustomer && (
          <div className="md:col-span-2 relative">
            <label className="block text-label-sm text-secondary mb-1 font-semibold">
              Search Existing Customer
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="Enter name, phone, or email..."
                className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
            </div>

            {/* Dropdown Results */}
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-outline-variant rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-outline-variant">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => handleSelect(cust)}
                      className="p-3 hover:bg-surface-container-low cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-on-surface">
                          {cust.name}
                        </p>
                        <p className="text-xs text-secondary">
                          {cust.phone} • {cust.email}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {cust.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-secondary text-center">
                    No customers match "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
      </div>
    </section>
  );
};

export default CustomerDetailsSection;
