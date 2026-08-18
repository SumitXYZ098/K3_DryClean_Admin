import type React from "react";
import { useState } from "react";
import type { ServiceCategory } from "../../store/useServiceStore";

export interface AddEditCategoryModalProps {
  isOpen: boolean;
  category?: ServiceCategory | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    documentId?: string;
    name: string;
    description: string;
    tag: string;
    image: string;
    isActive: boolean;
  }) => void;
}

export const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [tag, setTag] = useState(category?.tag || "Apparel");
  const [image, setImage] = useState(category?.image || "");
  const [isActive, setIsActive] = useState(category ? category.isActive : true);
  const [errors, setErrors] = useState<{ name?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }

    onSave({
      id: category?.id,
      documentId: category?.documentId,
      name: name.trim(),
      description: description.trim(),
      tag,
      image:
        image.trim() ||
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=600",
      isActive,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-md">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              category
            </span>
            <h3 className="font-headline-md text-title-md text-on-surface font-semibold">
              {category ? "Edit Service Category" : "Add New Category"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div>
            <label className="block font-label-sm text-secondary uppercase tracking-wider mb-xs font-semibold">
              Category Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="e.g., Wedding & Luxury Care"
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:border-primary outline-none text-on-surface"
            />
            {errors.name && (
              <p className="text-error text-xs mt-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block font-label-sm text-secondary uppercase tracking-wider mb-xs font-semibold">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of garments handled under this category..."
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:border-primary outline-none text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block font-label-sm text-secondary uppercase tracking-wider mb-xs font-semibold">
                Tag / Classification
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:border-primary outline-none text-on-surface"
              >
                <option value="Apparel">Apparel</option>
                <option value="Household">Household</option>
                <option value="Specialty">Specialty</option>
                <option value="Alterations">Alterations</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase tracking-wider mb-xs font-semibold">
                Initial Status
              </label>
              <label className="flex items-center gap-sm mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="text-body-md text-on-surface font-medium">
                  {isActive ? "Active (Visible)" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-secondary uppercase tracking-wider mb-xs font-semibold">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:border-primary outline-none text-on-surface text-xs"
            />
          </div>

          <div className="pt-md border-t border-outline-variant flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline text-secondary rounded-lg font-body-md font-medium hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary rounded-lg font-body-md font-medium hover:bg-surface-tint shadow-sm transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
              {category ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;
