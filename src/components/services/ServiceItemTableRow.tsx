import type React from "react";
import type { ServiceItem } from "../../store/useServiceStore";

export interface ServiceItemTableRowProps {
  item: ServiceItem;
  onToggleStatus: (id: string) => void;
  onToggleExpressDelivery: (id: string) => void;
  onView: (item: ServiceItem) => void;
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string) => void;
}

export const ServiceItemTableRow: React.FC<ServiceItemTableRowProps> = ({
  item,
  onToggleStatus,
  onToggleExpressDelivery,
  onView,
  onEdit,
  onDelete,
}) => {
  const {
    id,
    name,
    normalPrice,
    offerPrice,
    expressPrice,
    expressDeliveryAvailable,
    status,
  } = item;

  const isActive = status === "Active";

  return (
    <tr className="hover:bg-surface-bright transition-colors group">
      {/* Item Name */}
      <td className="py-md px-lg whitespace-nowrap font-medium text-on-surface">
        <div className="flex flex-col">
          <span className="font-title-md text-body-md font-semibold">
            {name}
          </span>
          {item.description && (
            <span className="text-label-sm text-secondary truncate max-w-xs font-normal">
              {item.description}
            </span>
          )}
        </div>
      </td>

      {/* Normal Price */}
      <td className="py-md px-lg whitespace-nowrap font-medium text-on-surface">
        ₹{Number(normalPrice).toFixed(2)}
      </td>

      {/* Offer Price */}
      <td className="py-md px-lg whitespace-nowrap">
        {offerPrice != null && Number(offerPrice) > 0 ? (
          <span className="text-primary font-medium bg-primary-container/10 px-2 py-0.5 rounded text-body-md">
            ₹{Number(offerPrice).toFixed(2)}
          </span>
        ) : (
          <span className="text-secondary">-</span>
        )}
      </td>

      {/* Express Price */}
      <td className="py-md px-lg whitespace-nowrap">
        {expressPrice != null && Number(expressPrice) > 0 ? (
          <span className="font-medium text-on-surface">
            ₹{Number(expressPrice).toFixed(2)}
          </span>
        ) : (
          <span className="text-secondary">-</span>
        )}
      </td>

      {/* Express Delivery Toggle */}
      <td className="py-md px-lg whitespace-nowrap text-center">
        <label
          className={`relative inline-flex items-center cursor-pointer ${!isActive ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="checkbox"
            checked={expressDeliveryAvailable}
            disabled={!isActive}
            onChange={() => onToggleExpressDelivery(id)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
        </label>
      </td>

      {/* Status Badge */}
      <td className="py-md px-lg whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(id)}
          className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm border transition-colors cursor-pointer ${
            isActive
              ? "bg-surface-container-high text-primary border-primary/20 hover:bg-primary-container/20"
              : "bg-surface-container-low text-secondary border-outline-variant hover:bg-surface-container-high"
          }`}
          title="Click to toggle status"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              isActive ? "bg-primary" : "bg-secondary"
            }`}
          />
          {status}
        </button>
      </td>

      {/* Action Buttons */}
      <td className="py-md px-lg whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-sm">
          <button
            onClick={() => onView(item)}
            className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low cursor-pointer"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[20px]">
              visibility
            </span>
          </button>
          <button
            onClick={() => onEdit(item)}
            className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low cursor-pointer"
            title="Edit Item"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-secondary hover:text-error transition-colors p-1.5 rounded hover:bg-error-container/30 cursor-pointer"
            title="Delete Item"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ServiceItemTableRow;
