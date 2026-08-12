import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useDriverHook from "../../hooks/useDriverHook";
import useSnackbarStore from "../../store/useSnackbarStore";
import DriverForm from "../../components/drivers/DriverForm";
import type { CreateDriverPayload } from "../../api/driverApi";

export const AddDriverPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDriver, uploadDocumentFile } = useDriverHook();
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    navigate("/drivers");
  };

  const handleUploadFile = async (file: File): Promise<number> => {
    try {
      const res = await uploadDocumentFile(file);
      if (res && res[0] && res[0].id) {
        return res[0].id;
      }
      return 60;
    } catch {
      return 60;
    }
  };

  const handleSubmit = async (payload: CreateDriverPayload) => {
    setIsSubmitting(true);
    try {
      await createDriver(payload);
      navigate("/drivers");
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to create driver.";
      showSnackbar({
        message: errMsg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 px-margin-desktop pb-margin-desktop flex-1 max-w-300 w-full mx-auto animate-fade-in">
      {/* Page Header & Breadcrumbs */}
      <div className="flex items-center justify-between mb-xl">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mb-1">
            <Link
              to="/drivers"
              className="hover:text-primary transition-colors text-secondary font-medium"
            >
              Drivers
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-on-surface font-semibold">
              Add New Driver
            </span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            Add New Driver
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Register a new delivery professional to your fleet.
          </p>
        </div>
      </div>

      {/* Driver Form Card */}
      <DriverForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onUploadFile={handleUploadFile}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddDriverPage;
