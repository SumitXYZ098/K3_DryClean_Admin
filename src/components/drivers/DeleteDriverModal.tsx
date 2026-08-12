import type React from "react";
import { useState } from "react";
import type { Driver } from "../../store/useDriverStore";

interface DeleteDriverModalProps {
  driver: Driver | null;
  onClose: () => void;
  onConfirmDelete: (documentId: string) => Promise<void>;
}

export const DeleteDriverModal: React.FC<DeleteDriverModalProps> = ({
  driver,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!driver) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(driver.documentId);
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-2xl max-w-100 w-full overflow-hidden flex flex-col p-lg text-center space-y-md">
        <div className="w-14 h-14 bg-error-container/40 text-error rounded-full flex items-center justify-center mx-auto border border-error/20">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>

        <div>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Remove Driver?
          </h3>
          <p className="text-body-md text-secondary mt-1">
            Are you sure you want to remove{" "}
            <span className="font-bold text-on-surface">{driver.fullName}</span>{" "}
            from the roster? This action cannot be undone.
          </p>
        </div>

        <div className="pt-md border-t border-outline-variant flex items-center justify-center gap-md">
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-2 border border-outline-variant rounded-lg text-body-md font-bold text-secondary hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-lg py-2 bg-error text-on-error rounded-lg text-body-md font-bold hover:bg-error/90 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${isDeleting ? "animate-spin" : ""}`}
            >
              {isDeleting ? "sync" : "delete"}
            </span>
            {isDeleting ? "Removing..." : "Remove Driver"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDriverModal;
