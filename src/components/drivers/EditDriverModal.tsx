/* eslint-disable react-hooks/set-state-in-effect */
import type React from "react";
import { useState, useEffect } from "react";
import type { Driver } from "../../store/useDriverStore";
import type { UpdateDriverPayload } from "../../api/driverApi";

interface EditDriverModalProps {
  driver: Driver | null;
  onClose: () => void;
  onSave: (documentId: string, payload: UpdateDriverPayload) => Promise<void>;
}

export const EditDriverModal: React.FC<EditDriverModalProps> = ({
  driver,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (driver) {
      setFullName(driver.fullName || "");
      setEmail(driver.email || "");
      setPhoneNumber(driver.phoneNumber || "");
      setVehicleNumber(driver.vehicleNumber || "");
      setIsActive(driver.isActive);
    }
  }, [driver]);

  if (!driver) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    onClose();
    try {
      await onSave(driver.documentId, {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        vehicleNumber: vehicleNumber.trim(),
        isActive,
      });
    } catch {
      // Handled in parent/hook
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-2xl max-w-160 w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant flex items-center justify-between">
          <div>
            <h3 className="text-title-md font-headline-md text-on-surface">
              Edit Driver Details
            </h3>
            <p className="text-xs text-secondary">
              Update profile for {driver.fullName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFullName(onlyLetters);
              }}
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Phone Number <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phoneNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhoneNumber(onlyNums);
              }}
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Vehicle Number */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Vehicle License Plate / Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g., EV Van • HR12AB1234"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-xs uppercase placeholder:normal-case"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-xl">
            <div>
              <p className="text-sm font-bold text-on-surface">Active Status</p>
              <p className="text-xs text-secondary">
                {isActive
                  ? "Driver is available for assignments"
                  : "Driver is currently offline"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                isActive ? "bg-primary" : "bg-outline"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform block shadow-md ${
                  isActive ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="pt-md border-t border-outline-variant flex items-center justify-end gap-md">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-2 border border-outline-variant rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-md py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isSubmitting ? "animate-spin" : ""}`}
              >
                {isSubmitting ? "sync" : "save"}
              </span>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriverModal;
