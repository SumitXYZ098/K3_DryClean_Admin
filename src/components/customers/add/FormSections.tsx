import type React from "react";

export interface BasicInfoData {
  fullName: string;
  email: string;
  phone: string;
}

export interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (field: keyof BasicInfoData, value: string) => void;
  errors?: Partial<Record<keyof BasicInfoData, string>>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center gap-md">
        <span className="material-symbols-outlined text-primary">person_add</span>
        <h3 className="font-title-md text-title-md text-on-surface">
          Basic Information
        </h3>
      </div>
      <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            className={`w-full h-11 px-md rounded-lg border ${
              errors.fullName ? "border-error" : "border-outline-variant"
            } bg-white text-body-md form-input-focus transition-all`}
            placeholder="e.g. Jonathan Wick"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
          {errors.fullName && (
            <p className="text-label-sm text-error mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            className={`w-full h-11 px-md rounded-lg border ${
              errors.email ? "border-error" : "border-outline-variant"
            } bg-white text-body-md form-input-focus transition-all`}
            placeholder="jonathan@example.com"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-label-sm text-error mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Phone Number <span className="text-primary">*</span>
          </label>
          <input
            className={`w-full h-11 px-md rounded-lg border ${
              errors.phone ? "border-error" : "border-outline-variant"
            } bg-white text-body-md form-input-focus transition-all`}
            placeholder="+1 (555) 000-0000"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-label-sm text-error mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export interface AddressDetailsData {
  addressType: "home" | "work" | "other";
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressDetailsSectionProps {
  data: AddressDetailsData;
  onChange: (field: keyof AddressDetailsData, value: string) => void;
}

export const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center gap-md">
        <span className="material-symbols-outlined text-primary">location_on</span>
        <h3 className="font-title-md text-title-md text-on-surface">
          Address Details
        </h3>
      </div>
      <div className="p-lg grid grid-cols-1 md:grid-cols-4 gap-lg">
        {/* Address Type Radio Group */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Address Type
          </label>
          <div className="flex gap-md">
            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                name="address_type"
                value="home"
                checked={data.addressType === "home"}
                onChange={() => onChange("addressType", "home")}
                className="w-5 h-5 rounded-full border-outline-variant text-primary focus:ring-primary accent-primary"
                type="radio"
              />
              <span className="text-body-md font-medium text-on-surface">Home</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                name="address_type"
                value="work"
                checked={data.addressType === "work"}
                onChange={() => onChange("addressType", "work")}
                className="w-5 h-5 rounded-full border-outline-variant text-primary focus:ring-primary accent-primary"
                type="radio"
              />
              <span className="text-body-md font-medium text-on-surface">Work</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                name="address_type"
                value="other"
                checked={data.addressType === "other"}
                onChange={() => onChange("addressType", "other")}
                className="w-5 h-5 rounded-full border-outline-variant text-primary focus:ring-primary accent-primary"
                type="radio"
              />
              <span className="text-body-md font-medium text-on-surface">Other</span>
            </label>
          </div>
        </div>

        {/* Street Address */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Street Address
          </label>
          <input
            className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md form-input-focus transition-all"
            placeholder="123 Industrial Way, Suite 400"
            type="text"
            value={data.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
          />
        </div>

        {/* City */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            City
          </label>
          <input
            className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md form-input-focus transition-all"
            placeholder="New York"
            type="text"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            State
          </label>
          <input
            className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md form-input-focus transition-all"
            placeholder="NY"
            type="text"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
          />
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Zip Code
          </label>
          <input
            className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md form-input-focus transition-all"
            placeholder="10001"
            type="text"
            value={data.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export interface PreferencesData {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  specialInstructions: string;
}

export interface PreferencesSectionProps {
  data: PreferencesData;
  onChange: (field: keyof PreferencesData, value: boolean | string) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center gap-md">
        <span className="material-symbols-outlined text-primary">tune</span>
        <h3 className="font-title-md text-title-md text-on-surface">Preferences</h3>
      </div>
      <div className="p-lg space-y-lg flex-1">
        {/* Notification Channels */}
        <div className="space-y-sm">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Notification Channels
          </label>
          <div className="flex flex-wrap gap-md">
            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                checked={data.sms}
                onChange={(e) => onChange("sms", e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-body-md text-on-surface">SMS Notifications</span>
            </label>

            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                checked={data.email}
                onChange={(e) => onChange("email", e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-body-md text-on-surface">Email Alerts</span>
            </label>

            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                checked={data.whatsapp}
                onChange={(e) => onChange("whatsapp", e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-body-md text-on-surface">WhatsApp</span>
            </label>
          </div>
        </div>

        {/* Special Handling Instructions */}
        <div className="space-y-2">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Special Handling Instructions
          </label>
          <textarea
            className="w-full p-md rounded-lg border border-outline-variant bg-white text-body-md form-input-focus transition-all resize-none"
            placeholder="e.g. Allergic to citrus-based detergents, prefer heavy starch on shirt collars..."
            rows={4}
            value={data.specialInstructions}
            onChange={(e) => onChange("specialInstructions", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export type PaymentMethod = "credit" | "cash" | "terms" | "digital";

export interface BillingWalletData {
  initialBalance: string;
  preferredPaymentMethod: PaymentMethod;
}

export interface BillingWalletSectionProps {
  data: BillingWalletData;
  onChange: (field: keyof BillingWalletData, value: string) => void;
}

export const BillingWalletSection: React.FC<BillingWalletSectionProps> = ({
  data,
  onChange,
}) => {
  const paymentMethods: {
    id: PaymentMethod;
    label: string;
    icon: string;
  }[] = [
    { id: "credit", label: "Credit/Debit", icon: "credit_card" },
    { id: "cash", label: "Cash", icon: "payments" },
    { id: "terms", label: "Net Terms", icon: "account_balance" },
    { id: "digital", label: "Digital Pay", icon: "qr_code" },
  ];

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center gap-md">
        <span className="material-symbols-outlined text-primary">
          account_balance_wallet
        </span>
        <h3 className="font-title-md text-title-md text-on-surface">
          Billing & Wallet
        </h3>
      </div>
      <div className="p-lg space-y-lg flex-1">
        {/* Initial Wallet Balance */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-md flex items-center gap-lg">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
          </div>
          <div>
            <p className="text-label-sm text-secondary font-medium">
              Initial Wallet Balance
            </p>
            <div className="flex items-baseline gap-xs">
              <span className="text-body-md text-primary font-bold">$</span>
              <input
                className="bg-transparent border-none p-0 text-headline-md font-bold text-primary focus:ring-0 w-32 focus:outline-none"
                step="0.01"
                type="number"
                value={data.initialBalance}
                onChange={(e) => onChange("initialBalance", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferred Payment Method */}
        <div className="space-y-sm">
          <label className="text-label-sm font-bold text-secondary-fixed-dim uppercase tracking-wider block">
            Preferred Payment Method
          </label>
          <div className="grid grid-cols-2 gap-sm">
            {paymentMethods.map((method) => {
              const isSelected = data.preferredPaymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onChange("preferredPaymentMethod", method.id)}
                  className={`flex items-center gap-sm p-sm rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-outline-variant hover:border-primary text-secondary hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined">{method.icon}</span>
                  <span className="text-label-sm font-bold">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
