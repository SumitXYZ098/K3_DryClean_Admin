import type React from "react";
import type { CustomerAddress } from "../../../api/customerApi";

export interface DeliveryMapCardProps {
  address?: string;
  selectedAddressObj?: CustomerAddress | null;
}

export const DeliveryMapCard: React.FC<DeliveryMapCardProps> = ({
  address = "",
  selectedAddressObj,
}) => {
  const fullAddress =
    selectedAddressObj?.fullAddress ||
    [
      selectedAddressObj?.streetAddress,
      selectedAddressObj?.city,
      selectedAddressObj?.state,
      selectedAddressObj?.postalCode,
      selectedAddressObj?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    address;

  const addressType = selectedAddressObj?.addressType || "Delivery";
  const landmark = selectedAddressObj?.landmark;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-sm border-b border-outline-variant">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <span className="material-symbols-outlined text-lg">
            location_on
          </span>
          <span>Delivery Address</span>
        </div>

        {fullAddress ? (
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {addressType}
          </span>
        ) : null}
      </div>

      {/* Address Content Box */}
      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/60 space-y-2">
        <p className="text-sm font-semibold text-on-surface leading-relaxed">
          {fullAddress || "No delivery address selected"}
        </p>

        {landmark && (
          <p className="text-xs text-secondary flex items-center gap-1.5 pt-1 border-t border-outline-variant/40">
            <span className="material-symbols-outlined text-xs text-primary">
              flag
            </span>
            <span className="font-semibold">Landmark:</span> {landmark}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryMapCard;
