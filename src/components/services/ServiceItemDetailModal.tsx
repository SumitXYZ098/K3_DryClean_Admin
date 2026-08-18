import type React from "react";
import type { ServiceItem } from "../../store/useServiceStore";

export interface ServiceItemDetailModalProps {
  item: ServiceItem | null;
  onClose: () => void;
  onEdit: (item: ServiceItem) => void;
}

export const ServiceItemDetailModal: React.FC<ServiceItemDetailModalProps> = ({
  item,
  onClose,
  onEdit,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-md">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-150 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              dry_cleaning
            </span>
            <div>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                {item.name}
              </h3>
              <p className="text-label-sm text-secondary">{item.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-lg space-y-md">
          {/* Status & Badges */}
          <div className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-lg border border-outline-variant">
            <span className="text-body-md text-secondary font-medium">
              Status
            </span>
            <span
              className={`px-3 py-1 rounded-full text-label-sm font-semibold border ${
                item.status === "Active"
                  ? "bg-surface-container-high text-primary border-primary/20"
                  : "bg-surface-container-low text-secondary border-outline-variant"
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-sm text-center">
            <div className="p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
              <p className="text-label-sm text-secondary uppercase font-semibold">
                Normal
              </p>
              <p className="text-title-md text-on-surface font-bold mt-1">
                ₹{Number(item.normalPrice).toFixed(2)}
              </p>
            </div>
            <div className="p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
              <p className="text-label-sm text-secondary uppercase font-semibold">
                Express
              </p>
              <p className="text-title-md text-on-surface font-bold mt-1">
                {item.expressPrice != null
                  ? `₹${Number(item.expressPrice).toFixed(2)}`
                  : "-"}
              </p>
            </div>
            <div className="p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
              <p className="text-label-sm text-secondary uppercase font-semibold">
                Offer
              </p>
              <p className="text-title-md text-primary font-bold mt-1">
                {item.offerPrice != null
                  ? `₹${Number(item.offerPrice).toFixed(2)}`
                  : "-"}
              </p>
            </div>
          </div>

          {/* Express Delivery Capability */}
          <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                airport_shuttle
              </span>
              <span className="text-body-md text-on-surface font-medium">
                Express 24h Turnaround
              </span>
            </div>
            <span className="text-body-md font-semibold text-on-surface">
              {item.expressDeliveryAvailable ? "Supported" : "Not Available"}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <p className="text-label-sm text-secondary uppercase font-semibold mb-1">
                Care Instructions & Notes
              </p>
              <div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md text-on-surface">
                {item.description}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-lg bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-outline text-secondary rounded-lg font-body-md font-medium hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-5 py-2 bg-primary text-on-primary rounded-lg font-body-md font-medium hover:bg-surface-tint shadow-sm transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemDetailModal;
