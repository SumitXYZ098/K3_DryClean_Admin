import type React from "react";
import { useForm } from "react-hook-form";
import Input from "../common/Input";

export interface AddCustomerFormInputs {
  name: string;
  email: string;
  phone: string;
  walletBalance: string;
}

export interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCustomerFormInputs) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCustomerFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      walletBalance: "0",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: AddCustomerFormInputs) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-md animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-xl max-w-150 w-full shadow-2xl space-y-lg animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">
              person_add
            </span>
            Add New Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-md cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-md">
          {/* Full Name */}
          <Input
            id="customer-name"
            label="Full Name *"
            placeholder="e.g. Jane Doe"
            leftIcon="person"
            error={errors.name?.message}
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
            })}
          />

          {/* Email Address */}
          <Input
            id="customer-email"
            type="email"
            label="Email Address *"
            placeholder="name@example.com"
            leftIcon="mail"
            error={errors.email?.message}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address format",
              },
            })}
          />

          {/* Phone Number */}
          <Input
            id="customer-phone"
            type="tel"
            label="Phone Number *"
            placeholder="9876543210"
            maxLength={10}
            leftIcon="call"
            error={errors.phone?.message}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              },
            })}
          />

          {/* Initial Wallet Balance */}
          <Input
            id="customer-balance"
            type="number"
            step="0.01"
            label="Initial Wallet Balance (₹)"
            placeholder="0.00"
            leftIcon="account_balance_wallet"
            error={errors.walletBalance?.message}
            {...register("walletBalance")}
          />

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-md pt-md">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-2 border border-outline-variant rounded-default text-secondary hover:bg-surface-container transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-lg py-2 bg-primary text-white font-title-md rounded-default hover:bg-primary-container transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
