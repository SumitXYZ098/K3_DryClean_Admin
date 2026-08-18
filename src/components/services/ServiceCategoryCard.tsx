import type React from "react";
import type { ServiceCategory } from "../../store/useServiceStore";

export interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onSelectCategory: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
  onEditCategory: (category: ServiceCategory) => void;
}

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  category,
  onSelectCategory,
  onToggleStatus,
  onEditCategory,
}) => {
  const { id, name, description, tag, image, isActive, itemCount } = category;

  return (
    <div
      className={`bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 group ${
        !isActive ? "opacity-75" : ""
      }`}
    >
      {/* Category Image Header with Glassmorphism Active/Inactive Badge */}
      <div
        className={`h-40 w-full relative overflow-hidden ${!isActive ? "grayscale" : ""}`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Right Active Switch Badge */}
        <div
          className="absolute top-sm right-sm bg-surface/90 backdrop-blur-sm px-sm py-xs rounded-full border border-outline-variant shadow-sm z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="flex items-center cursor-pointer gap-2 select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggleStatus(id)}
                className="sr-only"
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary"
                    : "bg-secondary-fixed border border-outline-variant"
                }`}
              />
              <div
                className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                  isActive
                    ? "bg-white translate-x-4"
                    : "bg-secondary translate-x-0"
                }`}
              />
            </div>
            <span
              className={`font-label-sm text-label-sm ${
                isActive ? "text-on-surface font-semibold" : "text-secondary"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-lg flex flex-col gap-md grow">
        <div className="flex justify-between items-start">
          <div
            className="cursor-pointer"
            onClick={() => onSelectCategory(id, name)}
          >
            <h3 className="font-title-md text-title-md text-on-background group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="font-body-md text-body-md text-secondary mt-0.5 line-clamp-1">
              {description}
            </p>
          </div>
          <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-sm py-xs rounded-full shrink-0 font-medium">
            {tag || "Apparel"}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-md border-t border-outline-variant flex justify-between items-center">
          <div
            className="flex items-center gap-xs text-secondary cursor-pointer hover:text-on-surface transition-colors"
            onClick={() => onSelectCategory(id, name)}
          >
            <span className="material-symbols-outlined text-[18px]">
              inventory_2
            </span>
            <span className="font-body-md text-body-md font-medium">
              {itemCount} Items {isActive ? "Active" : "(Inactive)"}
            </span>
          </div>

          <div className="flex items-center gap-sm">
            <button
              onClick={() => onEditCategory(category)}
              className="text-primary hover:text-primary-container font-title-md text-title-md flex items-center gap-xs transition-colors px-2 py-1 rounded hover:bg-primary-container/10 cursor-pointer"
              title="Edit Category"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
              <span className="text-body-md">Edit</span>
            </button>
            <button
              onClick={() => onSelectCategory(id, name)}
              className="text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high"
              title="View Items"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;
