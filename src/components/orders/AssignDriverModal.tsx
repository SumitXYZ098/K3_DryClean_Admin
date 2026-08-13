import type React from "react";
import { useState, useEffect, useMemo } from "react";
import type { Order, DriverInfo } from "../../store/useOrderStore";
import useDriverHook from "../../hooks/useDriverHook";
import type { Driver } from "../../store/useDriverStore";

export interface AssignDriverModalProps {
  order: Order | null;
  onClose: () => void;
  onAssign: (orderId: string, driver: DriverInfo) => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  order,
  onClose,
  onAssign,
}) => {
  const { drivers: liveDrivers, fetchDrivers, isLoading } = useDriverHook();

  // Fetch live drivers from API when modal opens
  useEffect(() => {
    fetchDrivers().catch(() => {});
  }, [fetchDrivers]);

  // Helper to derive initials from driver name
  const getInitials = (name: string) => {
    if (!name) return "DR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Convert live drivers from store/API to option list
  const driverOptions = useMemo(() => {
    return (liveDrivers || []).map((d: Driver) => ({
      id: d.documentId || String(d.id),
      name: d.fullName,
      initials: getInitials(d.fullName),
      phone: d.phoneNumber,
      vehicleNumber: d.vehicleNumber,
      isActive: d.isActive,
      pickupOrdersCount: d.pickupOrdersCount,
      deliveryOrdersCount: d.deliveryOrdersCount,
      rawDriver: d,
    }));
  }, [liveDrivers]);

  const [userSelectedDriverId, setUserSelectedDriverId] = useState<string>("");

  // Derived active selection: fallback to order driver or first available live driver
  const selectedDriverId = userSelectedDriverId || driverOptions[0]?.id || "";

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOption = driverOptions.find((d) => d.id === selectedDriverId);

    if (selectedOption) {
      const driverInfo: DriverInfo = {
        id: selectedOption.id,
        name: selectedOption.name,
        initials: selectedOption.initials,
        phone: selectedOption.phone,
      };
      onAssign(order.id, driverInfo);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-140 w-full p-lg shadow-xl my-auto space-y-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              local_shipping
            </span>
            <div>
              <h3 className="font-title-md text-on-surface">
                {order.status === "processing" ||
                order.status === "delivery_assigned" ||
                order.status === "out_for_delivery"
                  ? "Assign Delivery Driver"
                  : "Assign Pickup Driver"}
              </h3>
              <p className="text-xs text-secondary">
                Order {order.id} • {order.customerName}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Driver List */}
        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-medium">
              Select an available driver from live roster:
            </span>
            {isLoading && (
              <span className="text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs animate-spin">
                  sync
                </span>
                Refreshing...
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {driverOptions.length === 0 ? (
              <p className="text-xs text-secondary italic p-4 text-center border border-outline-variant rounded-lg bg-surface-container-low">
                No active drivers available in system.
              </p>
            ) : (
              driverOptions.map((driver) => {
                const isSelected = selectedDriverId === driver.id;

                return (
                  <label
                    key={driver.id}
                    onClick={() => setUserSelectedDriverId(driver.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-1 ring-primary/30"
                        : "bg-surface-container-lowest border-outline-variant hover:border-outline"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container/20 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center">
                        {driver.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-on-surface">
                            {driver.name}
                          </p>
                          {driver.isActive ? (
                            <span
                              className="w-2 h-2 rounded-full bg-green-500"
                              title="Active Online"
                            ></span>
                          ) : (
                            <span
                              className="w-2 h-2 rounded-full bg-gray-400"
                              title="Offline"
                            ></span>
                          )}
                        </div>
                        <p className="text-xs text-secondary">
                          {driver.vehicleNumber
                            ? `${driver.vehicleNumber} • ${driver.phone}`
                            : driver.phone || "No vehicle info"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {(driver.pickupOrdersCount > 0 ||
                        driver.deliveryOrdersCount > 0) && (
                        <span className="text-[10px] bg-surface-container border border-outline-variant px-2 py-0.5 rounded font-semibold text-secondary">
                          {driver.pickupOrdersCount +
                            driver.deliveryOrdersCount}{" "}
                          Active
                        </span>
                      )}
                      <input
                        type="radio"
                        name="driver"
                        value={driver.id}
                        checked={isSelected}
                        onChange={() => setUserSelectedDriverId(driver.id)}
                        className="accent-primary"
                      />
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-md border-t border-outline-variant">
            <button
              type="submit"
              disabled={!selectedDriverId}
              className="px-5 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Driver Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignDriverModal;
