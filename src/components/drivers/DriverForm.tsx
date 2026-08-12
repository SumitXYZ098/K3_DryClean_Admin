import type React from "react";
import { useState } from "react";
import type {
  CreateDriverPayload,
  DriverDocumentInput,
} from "../../api/driverApi";

export interface UploadedDocState {
  documentName: string;
  file?: File;
  documentImageId?: number;
  uploading?: boolean;
  status?: "pending" | "uploading" | "uploaded" | "error";
}

interface DriverFormProps {
  onCancel: () => void;
  onSubmit: (payload: CreateDriverPayload) => Promise<void>;
  onUploadFile?: (file: File) => Promise<number>;
  isSubmitting?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  onCancel,
  onSubmit,
  onUploadFile,
  isSubmitting = false,
}) => {
  const [fullName, setFullName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Document attachments state
  const [documents, setDocuments] = useState<UploadedDocState[]>([
    { documentName: "Driving License", status: "pending" },
    { documentName: "Aadhaar Card", status: "pending" },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      newErrors.fullName = "Full name must contain only alphabets";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.trim().length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (!vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle license plate is required";
    }

    if (
      email.trim() &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())
    ) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (index: number, file: File) => {
    const updatedDocs = [...documents];

    updatedDocs[index] = {
      ...updatedDocs[index],
      file,
      uploading: true,
      status: "uploading",
    };
    setDocuments(updatedDocs);

    try {
      let imageId = 60 + index;
      if (onUploadFile) {
        imageId = await onUploadFile(file);
      }
      const successDocs = [...documents];
      successDocs[index] = {
        ...successDocs[index],
        file,
        documentImageId: imageId,
        uploading: false,
        status: "uploaded",
      };
      setDocuments(successDocs);
    } catch {
      const errorDocs = [...documents];
      errorDocs[index] = {
        ...errorDocs[index],
        uploading: false,
        status: "error",
      };
      setDocuments(errorDocs);
    }
  };

  const [customDocTitle, setCustomDocTitle] = useState("");

  const handleAddCustomDoc = (name: string) => {
    if (!name.trim()) return;
    setDocuments((prev) => [
      ...prev,
      { documentName: name.trim(), status: "pending" },
    ]);
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Combine phone prefix and phone number
    const fullPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `${phonePrefix} ${phoneNumber}`.trim();

    // Map documents payload
    const docPayload: DriverDocumentInput[] = documents.map((doc, idx) => ({
      documentName: doc.documentName,
      documentImage: doc.documentImageId ?? 60 + idx,
    }));

    const payload: CreateDriverPayload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: fullPhone,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      isActive,
      documents: docPayload,
    };

    await onSubmit(payload);
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
      <form onSubmit={handleFormSubmit} className="p-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Personal Information Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-title-md font-title-md text-on-surface border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">
                person
              </span>
              Personal Information
            </h3>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFullName(onlyLetters);
                if (errors.fullName)
                  setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              placeholder="e.g., John Doe"
              className={`w-full px-3 py-2 bg-surface border rounded-lg text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${
                errors.fullName ? "border-error" : "border-outline-variant"
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-error mt-0.5">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Phone Number <span className="text-primary">*</span>
            </label>
            <div className="flex">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-low text-on-surface-variant text-sm focus:outline-none"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  const onlyNums = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setPhoneNumber(onlyNums);
                  if (errors.phoneNumber)
                    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                }}
                placeholder="9876543210"
                className={`flex-1 w-full px-3 py-2 bg-surface border rounded-r-lg text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${
                  errors.phoneNumber ? "border-error" : "border-outline-variant"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-error mt-0.5">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="john.doe@example.com"
              className={`w-full px-3 py-2 bg-surface border rounded-lg text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${
                errors.email ? "border-error" : "border-outline-variant"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-error mt-0.5">{errors.email}</p>
            )}
          </div>

          {/* Vehicle Information Section */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-title-md font-title-md text-on-surface border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">
                directions_car
              </span>
              Vehicle Information
            </h3>
          </div>

          {/* Vehicle License Plate */}
          <div className="space-y-1">
            <label className="text-label-sm font-label-sm text-on-surface block">
              Vehicle License Plate <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
                if (errors.vehicleNumber)
                  setErrors((prev) => ({ ...prev, vehicleNumber: "" }));
              }}
              placeholder="e.g., HR12AB1234"
              className={`w-full px-3 py-2 bg-surface border rounded-lg text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm uppercase placeholder:normal-case ${
                errors.vehicleNumber ? "border-error" : "border-outline-variant"
              }`}
            />
            {errors.vehicleNumber && (
              <p className="text-xs text-error mt-0.5">
                {errors.vehicleNumber}
              </p>
            )}
          </div>

          {/* Status Switch */}
          <div className="space-y-1 flex flex-col justify-center">
            <label className="text-label-sm font-label-sm text-on-surface block mb-1">
              Driver Status
            </label>
            <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-lg border border-outline-variant">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                  isActive ? "bg-primary" : "bg-outline"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white transition-transform block shadow-md ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </button>
              <span className="text-sm font-semibold text-on-surface">
                {isActive ? "Active (Online)" : "Offline (Inactive)"}
              </span>
            </div>
          </div>

          {/* Documentation Section */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-title-md font-title-md text-on-surface border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">
                description
              </span>
              Documentation
            </h3>
          </div>

          {/* Documents Upload Section */}
          <div className="col-span-1 md:col-span-2 space-y-md">
            {/* Enter Custom Document Title Input Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
                  post_add
                </span>
                <input
                  type="text"
                  value={customDocTitle}
                  onChange={(e) => setCustomDocTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (customDocTitle.trim()) {
                        handleAddCustomDoc(customDocTitle.trim());
                        setCustomDocTitle("");
                      }
                    }
                  }}
                  placeholder="Enter Document Title (e.g., PAN Card, Police Verification, Vehicle Registration...)"
                  className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (customDocTitle.trim()) {
                    handleAddCustomDoc(customDocTitle.trim());
                    setCustomDocTitle("");
                  }
                }}
                disabled={!customDocTitle.trim()}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                Add Document Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border border-outline-variant rounded-xl p-md bg-surface-container-low flex flex-col justify-between space-y-2 hover:bg-surface-container transition-colors relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-on-surface truncate">
                      {doc.documentName}
                    </span>
                    <div className="flex items-center gap-1">
                      {doc.status === "uploaded" ? (
                        <span className="material-symbols-outlined text-green-600 text-sm">
                          check_circle
                        </span>
                      ) : doc.status === "uploading" ? (
                        <span className="material-symbols-outlined text-primary text-sm animate-spin">
                          sync
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-secondary text-sm">
                          upload_file
                        </span>
                      )}

                      {/* Remove custom document button */}
                      {index >= 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(index)}
                          className="text-secondary hover:text-error p-0.5 rounded transition-colors cursor-pointer"
                          title="Remove document slot"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {doc.file ? (
                    <p className="text-xs text-secondary truncate">
                      {doc.file.name}
                    </p>
                  ) : (
                    <p className="text-xs text-secondary opacity-75">
                      PDF, PNG, JPG, DOC, DOCX (max 10MB)
                    </p>
                  )}

                  <label className="cursor-pointer bg-surface border border-outline-variant hover:bg-surface-container text-xs font-semibold text-primary px-3 py-1.5 rounded-lg text-center transition-colors block mt-2">
                    {doc.file ? "Change File" : "Choose File"}
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(index, file);
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Custom File Drag and Drop Box */}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="mt-xl pt-lg border-t border-outline-variant flex justify-end gap-md">
          <button
            type="button"
            onClick={onCancel}
            className="px-lg py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm text-on-surface hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-lg py-2 bg-primary rounded-lg text-label-sm font-label-sm text-on-primary hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <span
              className={`material-symbols-outlined text-sm ${
                isSubmitting ? "animate-spin" : ""
              }`}
            >
              {isSubmitting ? "sync" : "save"}
            </span>
            {isSubmitting ? "Saving Driver..." : "Save Driver"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
