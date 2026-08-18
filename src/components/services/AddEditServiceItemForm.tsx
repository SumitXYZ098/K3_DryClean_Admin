import type React from "react";
import { useState } from "react";
import type { ServiceItem, ServiceCategory } from "../../store/useServiceStore";

export interface AddEditServiceItemFormProps {
  item?: ServiceItem | null;
  categories: ServiceCategory[];
  defaultCategoryId?: string | null;
  onSave: (payload: {
    id?: string;
    documentId?: string;
    name: string;
    category: string;
    categoryId: string;
    normalPrice: number;
    offerPrice?: number | null;
    expressPrice?: number | null;
    expressDeliveryAvailable: boolean;
    status: "Active" | "Inactive";
    description?: string;
  }) => void;
  onDiscard: () => void;
}

export const AddEditServiceItemForm: React.FC<AddEditServiceItemFormProps> = ({
  item,
  categories,
  defaultCategoryId,
  onSave,
  onDiscard,
}) => {
  const isEditing = Boolean(item);

  const [name, setName] = useState(item?.name || "");
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ||
      defaultCategoryId ||
      (categories[0]?.id ?? "dry-cleaning"),
  );
  const [normalPrice, setNormalPrice] = useState<string>(
    item?.normalPrice != null ? String(item.normalPrice) : "",
  );
  const [expressPrice, setExpressPrice] = useState<string>(
    item?.expressPrice != null ? String(item.expressPrice) : "",
  );
  const [offerPrice, setOfferPrice] = useState<string>(
    item?.offerPrice != null ? String(item.offerPrice) : "",
  );
  const [expressDeliveryAvailable, setExpressDeliveryAvailable] =
    useState<boolean>(item?.expressDeliveryAvailable ?? true);
  const [isActive, setIsActive] = useState<boolean>(
    item ? item.status === "Active" : true,
  );
  const [description, setDescription] = useState<string>(
    item?.description || "",
  );
  const [errors, setErrors] = useState<{
    name?: string;
    normalPrice?: string;
    categoryId?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      name?: string;
      normalPrice?: string;
      categoryId?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (
      !normalPrice ||
      isNaN(Number(normalPrice)) ||
      Number(normalPrice) <= 0
    ) {
      newErrors.normalPrice = "Please enter a valid positive normal price";
    }

    if (!categoryId) {
      newErrors.categoryId = "Category selection is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCatObj = categories.find(
      (c) => c.id === categoryId || c.documentId === categoryId,
    );
    const categoryName = selectedCatObj ? selectedCatObj.name : "Dry Cleaning";

    onSave({
      id: item?.id,
      documentId: item?.documentId,
      name: name.trim(),
      category: categoryName,
      categoryId,
      normalPrice: Number.parseFloat(normalPrice),
      expressPrice: expressPrice ? Number.parseFloat(expressPrice) : null,
      offerPrice: offerPrice ? Number.parseFloat(offerPrice) : null,
      expressDeliveryAvailable,
      status: isActive ? "Active" : "Inactive",
      description: description.trim(),
    });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full pb-xl">
      {/* Page Header */}
      <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold">
            {isEditing ? "Edit Service Item" : "Add Service Item"}
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">
            Configure a new garment or service type for the catalog.
          </p>
        </div>
        <div className="hidden sm:flex gap-sm">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 border border-outline text-secondary rounded-lg font-body-md font-medium hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-body-md font-medium hover:bg-surface-tint shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Item
          </button>
        </div>
      </div>

      {/* Form Card Layout */}
      <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="divide-y divide-outline-variant"
        >
          {/* Section 1: Basic Information */}
          <div className="p-lg md:p-xl grid grid-cols-1 md:grid-cols-12 gap-lg">
            <div className="md:col-span-4">
              <h3 className="font-title-md text-title-md text-on-surface">
                Basic Information
              </h3>
              <p className="font-body-md text-body-md text-secondary mt-sm">
                The primary details used to identify this service in the POS and
                customer app.
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col gap-lg">
              {/* Item Name */}
              <div>
                <label
                  htmlFor="item_name"
                  className="block font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider font-semibold"
                >
                  Item Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="item_name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g., Silk Saree, Winter Coat"
                  className={`w-full px-4 py-3 bg-surface-container-lowest border rounded-lg text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-secondary/50 ${
                    errors.name ? "border-error" : "border-[#D1D1D1]"
                  }`}
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="category"
                  className="block font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider font-semibold"
                >
                  Category <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    disabled
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-[#D1D1D1] rounded-lg text-body-lg appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary">
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Structure */}
          <div className="p-lg md:p-xl grid grid-cols-1 md:grid-cols-12 gap-lg bg-surface-bright">
            <div className="md:col-span-4">
              <h3 className="font-title-md text-title-md text-on-surface">
                Pricing Structure
              </h3>
              <p className="font-body-md text-body-md text-secondary mt-sm">
                Define the base cost and optional upcharges for expedited
                service or seasonal offers.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                {/* Normal Price */}
                <div>
                  <label
                    htmlFor="normal_price"
                    className="block font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider font-semibold"
                  >
                    Normal Price (₹) <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">
                        currency_rupee
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="normal_price"
                      value={normalPrice}
                      onChange={(e) => {
                        setNormalPrice(e.target.value);
                        if (errors.normalPrice)
                          setErrors({ ...errors, normalPrice: undefined });
                      }}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 py-3 bg-surface-container-lowest border rounded-lg text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium ${
                        errors.normalPrice ? "border-error" : "border-[#D1D1D1]"
                      }`}
                    />
                  </div>
                  {errors.normalPrice && (
                    <p className="text-error text-xs mt-1 font-medium">
                      {errors.normalPrice}
                    </p>
                  )}
                </div>

                {/* Express Price */}
                <div>
                  <label
                    htmlFor="express_price"
                    className="flex justify-between items-center mb-xs font-semibold"
                  >
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                      Express Price (₹)
                    </span>
                    <span className="font-label-sm text-label-sm text-primary bg-primary-container/10 px-2 py-0.5 rounded-full font-medium">
                      Optional
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">
                        bolt
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="express_price"
                      value={expressPrice}
                      onChange={(e) => setExpressPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-[#D1D1D1] rounded-lg text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    />
                  </div>
                </div>

                {/* Offer Price */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="offer_price"
                    className="block font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider font-semibold"
                  >
                    Promotional / Offer Price (₹)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">
                        local_offer
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="offer_price"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Leave blank if no offer"
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-[#D1D1D1] rounded-lg text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Configuration & Details */}
          <div className="p-lg md:p-xl grid grid-cols-1 md:grid-cols-12 gap-lg">
            <div className="md:col-span-4">
              <h3 className="font-title-md text-title-md text-on-surface">
                Configuration
              </h3>
              <p className="font-body-md text-body-md text-secondary mt-sm">
                Set availability toggles and specific handling instructions for
                staff.
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col gap-lg">
              {/* Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant/50">
                {/* Enable Express Delivery Toggle */}
                <div className="flex items-center justify-between p-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      airport_shuttle
                    </span>
                    <div>
                      <label
                        htmlFor="toggle_express"
                        className="font-body-md font-medium text-on-surface block cursor-pointer"
                      >
                        Express Delivery
                      </label>
                      <span className="font-label-sm text-secondary">
                        Allow 24h turnaround
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle_express"
                      checked={expressDeliveryAvailable}
                      onChange={(e) =>
                        setExpressDeliveryAvailable(e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-fixed peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                {/* Active Status Toggle */}
                <div className="flex items-center justify-between p-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      check_circle
                    </span>
                    <div>
                      <label
                        htmlFor="toggle_active"
                        className="font-body-md font-medium text-on-surface block cursor-pointer"
                      >
                        Active Status
                      </label>
                      <span className="font-label-sm text-secondary">
                        Visible to customers
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle_active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-fixed peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>

              {/* Description / Instructions */}
              <div>
                <label
                  htmlFor="description"
                  className="block font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider font-semibold"
                >
                  Care Instructions &amp; Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter specific care details, fabric warnings, or POS descriptions here..."
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-[#D1D1D1] rounded-lg text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface resize-y"
                />
                <p className="font-label-sm text-label-sm text-secondary mt-1 text-right">
                  {description.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-lg md:p-xl bg-surface-container-lowest flex items-center justify-end gap-sm">
            <button
              type="button"
              onClick={onDiscard}
              className="px-6 py-2.5 border border-outline text-secondary rounded-lg font-body-md font-medium hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-body-md font-medium hover:bg-surface-tint shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isEditing ? "save" : "add_circle"}
              </span>
              {isEditing ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditServiceItemForm;
