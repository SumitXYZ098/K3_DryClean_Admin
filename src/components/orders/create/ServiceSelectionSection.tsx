/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import { useEffect, useState } from "react";
import orderApi, {
  DEFAULT_SERVICES_WITH_VARIANTS,
  type ServiceVariant,
  type ServiceWithVariants,
} from "../../../api/orderApi";

export interface SelectedServiceItem {
  id: string;
  serviceType: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  isExpressDelivery?: boolean;
  serviceDocumentId?: string;
  variantDocumentId?: string;
}

export interface ServiceSelectionSectionProps {
  items: SelectedServiceItem[];
  services?: ServiceWithVariants[];
  onAddItem: (
    defaultService?: string,
    defaultItem?: string,
    defaultPrice?: number,
  ) => void;
  onUpdateItem: (
    id: string,
    field: keyof SelectedServiceItem,
    value: string | number | boolean,
  ) => void;
  onDeleteItem: (id: string) => void;
}

// Fallback pricing map for legacy code compatibility
export const itemPrices: Record<string, number> =
  DEFAULT_SERVICES_WITH_VARIANTS.reduce(
    (acc, service) => {
      const vars = service.varients || service.variants || [];
      vars.forEach((v) => {
        const price = v.pricing?.offerPrice ?? v.pricing?.price ?? 10;
        acc[v.name] = price;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

export const ServiceSelectionSection: React.FC<
  ServiceSelectionSectionProps
> = ({
  items,
  services: propServices,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [fetchedServices, setFetchedServices] = useState<ServiceWithVariants[]>(
    DEFAULT_SERVICES_WITH_VARIANTS,
  );
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(
    !propServices || propServices.length === 0,
  );

  const services =
    propServices && propServices.length > 0 ? propServices : fetchedServices;

  useEffect(() => {
    if (propServices && propServices.length > 0) {
      return;
    }

    let isMounted = true;
    const fetchServices = async () => {
      try {
        const res = await orderApi.getServicesWithVariants();
        if (
          isMounted &&
          res?.data &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          setFetchedServices(res.data);
        }
      } catch (err) {
        console.warn(
          "Failed to load services from backend, using default services fallback",
          err,
        );
        if (isMounted) {
          setFetchedServices(DEFAULT_SERVICES_WITH_VARIANTS);
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, [propServices]);

  // Helper to retrieve variants array from service
  const getVariantsForService = (serviceName: string): ServiceVariant[] => {
    const sName = serviceName.trim().toLowerCase();
    const service = services.find(
      (s) =>
        s.name.trim().toLowerCase() === sName || s.documentId === serviceName,
    );

    if (!service) {
      // Fallback: match by substring or return first service's variants
      const match = services.find((s) => s.name.toLowerCase().includes(sName));
      if (match) return match.varients || match.variants || [];
      return services[0]?.varients || services[0]?.variants || [];
    }

    return service.varients || service.variants || [];
  };

  const getEffectivePrice = (variant?: ServiceVariant | null): number => {
    if (!variant || !variant.pricing) return 0;
    if (
      variant.pricing.offerPrice !== null &&
      variant.pricing.offerPrice !== undefined &&
      variant.pricing.offerPrice > 0
    ) {
      return variant.pricing.offerPrice;
    }
    return variant.pricing.price || 0;
  };

  const handleServiceTypeSelect = (id: string, selectedServiceName: string) => {
    onUpdateItem(id, "serviceType", selectedServiceName);
    const variants = getVariantsForService(selectedServiceName);
    const firstVariant = variants[0];

    if (firstVariant) {
      const price = getEffectivePrice(firstVariant);
      onUpdateItem(id, "itemName", firstVariant.name);
      onUpdateItem(id, "unitPrice", price);
      if (!firstVariant.expressDeliveryAvailable) {
        onUpdateItem(id, "isExpressDelivery", false);
      }
    }
  };

  const handleVariantSelect = (
    id: string,
    serviceName: string,
    variantName: string,
  ) => {
    const variants = getVariantsForService(serviceName);
    const variant = variants.find(
      (v) => v.name.trim().toLowerCase() === variantName.trim().toLowerCase(),
    );
    const price = getEffectivePrice(variant);

    onUpdateItem(id, "itemName", variantName);
    onUpdateItem(id, "unitPrice", price);

    if (variant && !variant.expressDeliveryAvailable) {
      onUpdateItem(id, "isExpressDelivery", false);
    }
  };

  const handleAddClick = () => {
    const defaultService = services[0]?.name || "dry cleaning";
    const defaultVariants = getVariantsForService(defaultService);
    const defaultVariant = defaultVariants[0];
    const defaultPrice = getEffectivePrice(defaultVariant);

    onAddItem(defaultService, defaultVariant?.name || "T-shirt", defaultPrice);
  };

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            local_laundry_service
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">
            Services &amp; Items
          </h3>
          {isLoadingServices && (
            <span className="text-xs text-secondary flex items-center gap-1 animate-pulse">
              <span className="material-symbols-outlined text-xs animate-spin">
                sync
              </span>
              Loading catalog...
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-1 text-primary text-sm font-bold hover:underline cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-sm"
            data-icon="add_circle"
          >
            add_circle
          </span>
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold">
                SERVICE TYPE
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold">
                ITEM (VARIANT)
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-center">
                EXPRESS (+₹50)
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-center">
                QTY
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-right">
                UNIT PRICE
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-right">
                TOTAL
              </th>
              <th className="w-10 pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-secondary text-sm">
                  No services added yet. Click{" "}
                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="text-primary font-bold hover:underline cursor-pointer"
                  >
                    + Add Service
                  </button>{" "}
                  to select services and items.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const variants = getVariantsForService(item.serviceType);
                const matchingVariant = variants.find(
                  (v) =>
                    v.name.trim().toLowerCase() ===
                    item.itemName.trim().toLowerCase(),
                );

                const isExpressAvailable = !!matchingVariant?.expressDeliveryAvailable;
                const expressFee = item.isExpressDelivery && isExpressAvailable ? 50 : 0;
                const effectiveUnitPrice = item.unitPrice + expressFee;
                const lineTotal = item.quantity * effectiveUnitPrice;

                const originalPrice = matchingVariant?.pricing?.price;
                const offerPrice = matchingVariant?.pricing?.offerPrice;
                const hasOffer =
                  offerPrice !== null &&
                  offerPrice !== undefined &&
                  originalPrice !== undefined &&
                  originalPrice > offerPrice;

                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/50">
                    {/* Service Type Select */}
                    <td className="py-4 px-2 align-middle">
                      <select
                        value={item.serviceType}
                        onChange={(e) =>
                          handleServiceTypeSelect(item.id, e.target.value)
                        }
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:border-primary capitalize font-medium"
                      >
                        {services.map((s) => (
                          <option key={s.documentId || s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Garment Item (Variant) Select */}
                    <td className="py-4 px-2 align-middle">
                      <select
                        value={item.itemName}
                        onChange={(e) =>
                          handleVariantSelect(
                            item.id,
                            item.serviceType,
                            e.target.value,
                          )
                        }
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:border-primary capitalize"
                      >
                        {variants.map((v) => {
                          const priceDisplay =
                            v.pricing?.offerPrice !== null &&
                            v.pricing?.offerPrice !== undefined
                              ? `₹${v.pricing.offerPrice}`
                              : `₹${v.pricing?.price ?? 0}`;

                          return (
                            <option key={v.documentId || v.name} value={v.name}>
                              {v.name} ({priceDisplay})
                            </option>
                          );
                        })}
                      </select>
                    </td>

                    {/* Express Delivery Column */}
                    <td className="py-4 px-2 text-center align-middle">
                      {isExpressAvailable ? (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateItem(
                              item.id,
                              "isExpressDelivery",
                              !item.isExpressDelivery,
                            )
                          }
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none border ${
                            item.isExpressDelivery
                              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                              : "bg-surface-container-high text-secondary border-outline-variant hover:border-amber-400 hover:text-amber-600"
                          }`}
                          title={
                            item.isExpressDelivery
                              ? "Express Delivery enabled (+₹50)"
                              : "Click to enable Express Delivery (+₹50)"
                          }
                        >
                          <span className="material-symbols-outlined text-sm">
                            bolt
                          </span>
                          <span>
                            {item.isExpressDelivery ? "Express" : "+₹50"}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-outline font-medium px-2.5 py-1 bg-surface-container-low rounded-md border border-outline-variant/40">
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Qty Input */}
                    <td className="py-4 px-2 w-20 align-middle">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateItem(
                            item.id,
                            "quantity",
                            Math.max(1, parseInt(e.target.value) || 1),
                          )
                        }
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-center font-bold text-on-surface outline-none focus:border-primary"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-4 px-2 text-right align-middle">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-on-surface">
                          ₹{effectiveUnitPrice.toFixed(2)}
                        </span>
                        {item.isExpressDelivery && isExpressAvailable && (
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                            (Base ₹{item.unitPrice} + ₹50 Express)
                          </span>
                        )}
                        {hasOffer && !item.isExpressDelivery && (
                          <span className="text-xs text-outline line-through">
                            ₹{originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-4 px-2 text-right font-bold text-on-surface align-middle">
                      ₹{lineTotal.toFixed(2)}
                    </td>

                    {/* Action Delete */}
                    <td className="py-4 px-2 text-right align-middle">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="text-outline hover:text-error transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-md">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServiceSelectionSection;
