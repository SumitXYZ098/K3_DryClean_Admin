import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useCustomerStore from "../../store/useCustomerStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import {
  BasicInfoSection,
  AddressDetailsSection,
  PreferencesSection,
  BillingWalletSection,
  type BasicInfoData,
  type AddressDetailsData,
  type PreferencesData,
  type BillingWalletData,
  type PaymentMethod,
} from "../../components/customers/add/FormSections";

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomerStore();
  const { showSnackbar } = useSnackbarStore();

  // Basic Info Form State
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BasicInfoData, string>>
  >({});

  // Address Form State
  const [addressDetails, setAddressDetails] = useState<AddressDetailsData>({
    addressType: "home",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Preferences Form State
  const [preferences, setPreferences] = useState<PreferencesData>({
    sms: true,
    email: true,
    whatsapp: false,
    specialInstructions: "",
  });

  // Billing & Wallet Form State
  const [billingWallet, setBillingWallet] = useState<BillingWalletData>({
    initialBalance: "0.00",
    preferredPaymentMethod: "credit",
  });

  // Submit button interaction state
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleBasicInfoChange = (
    field: keyof BasicInfoData,
    value: string,
  ) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (
    field: keyof AddressDetailsData,
    value: string,
  ) => {
    setAddressDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (
    field: keyof PreferencesData,
    value: boolean | string,
  ) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingWalletChange = (
    field: keyof BillingWalletData,
    value: string,
  ) => {
    setBillingWallet((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BasicInfoData, string>> = {};

    if (!basicInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!basicInfo.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(basicInfo.email.trim())
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!basicInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCustomer = () => {
    if (!validateForm()) {
      showSnackbar({
        message: "Please fix required fields before saving.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const createdCustomer = addCustomer({
        name: basicInfo.fullName.trim(),
        email: basicInfo.email.trim(),
        phone: basicInfo.phone.trim(),
        addressType: addressDetails.addressType,
        streetAddress: addressDetails.streetAddress.trim(),
        city: addressDetails.city.trim(),
        state: addressDetails.state.trim(),
        zipCode: addressDetails.zipCode.trim(),
        notifications: {
          sms: preferences.sms,
          email: preferences.email,
          whatsapp: preferences.whatsapp,
        },
        specialInstructions: preferences.specialInstructions.trim(),
        walletBalance: parseFloat(billingWallet.initialBalance) || 0,
        preferredPaymentMethod:
          billingWallet.preferredPaymentMethod as PaymentMethod,
      });

      setIsSaving(false);
      setIsSaved(true);

      showSnackbar({
        message: `Customer ${createdCustomer.name} created successfully!`,
        type: "success",
      });

      setTimeout(() => {
        navigate("/customers");
      }, 1000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-32 space-y-lg animate-fade-in">
      {/* Breadcrumbs & Header */}
      <div className="mb-lg">
        <nav className="flex items-center gap-xs text-label-sm text-secondary mb-xs">
          <Link to="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <Link to="/customers" className="hover:text-primary transition-colors">
            Customers
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-primary font-medium">Add New Customer</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Add New Customer
            </h2>
            <p className="text-body-md text-secondary mt-1">
              Register a new client into the K3 enterprise network.
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections Grid */}
      <div className="space-y-lg">
        {/* Section 1: Basic Information */}
        <BasicInfoSection
          data={basicInfo}
          onChange={handleBasicInfoChange}
          errors={errors}
        />

        {/* Section 2: Address Details */}
        <AddressDetailsSection
          data={addressDetails}
          onChange={handleAddressChange}
        />

        {/* Grid Container for Preferences and Billing & Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          {/* Section 3: Preferences */}
          <PreferencesSection
            data={preferences}
            onChange={handlePreferencesChange}
          />

          {/* Section 4: Billing & Wallet */}
          <BillingWalletSection
            data={billingWallet}
            onChange={handleBillingWalletChange}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 right-0 w-full sm:w-[calc(100%-280px)] bg-surface/90 backdrop-blur-md border-t border-outline-variant px-lg py-md flex items-center justify-between z-40 shadow-xl">
        <div className="flex items-center gap-sm text-secondary">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="text-body-md hidden sm:inline">
            Required fields are marked by a subtle border intensity.
          </span>
        </div>
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="px-xl h-11 rounded-lg border border-outline-variant text-body-md font-bold text-secondary hover:bg-secondary-container/20 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveCustomer}
            className={`px-xl h-11 rounded-lg bg-primary text-white text-body-md font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-sm cursor-pointer disabled:opacity-75`}
          >
            <span
              className={`material-symbols-outlined ${
                isSaving ? "animate-spin" : ""
              }`}
            >
              {isSaving ? "sync" : isSaved ? "check_circle" : "save"}
            </span>
            <span>
              {isSaving
                ? "Processing..."
                : isSaved
                ? "Customer Created!"
                : "Save Customer"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;
