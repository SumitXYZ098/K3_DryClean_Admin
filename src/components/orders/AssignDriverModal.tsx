import type React from "react";
import { useState } from "react";
import type { Order, DriverInfo } from "../../store/useOrderStore";
import useOrderStore from "../../store/useOrderStore";

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
  const { availableDrivers } = useOrderStore();
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    order?.driver?.id || availableDrivers[0]?.id || "",
  );

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = availableDrivers.find((d) => d.id === selectedDriverId);
    if (driver) {
      onAssign(order.id, driver);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-fit w-full p-lg shadow-xl my-auto space-y-md">
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              local_shipping
            </span>
            <h3 className="font-title-md text-on-surface">
              Assign Driver - Order {order.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <p className="text-xs text-secondary">
            Select an available delivery driver to handle pickup and dispatch
            for{" "}
            <span className="font-bold text-on-surface">
              {order.customerName}
            </span>
            .
          </p>

          <div className="space-y-2">
            {availableDrivers.map((driver) => {
              const isSelected = selectedDriverId === driver.id;
              return (
                <label
                  key={driver.id}
                  onClick={() => setSelectedDriverId(driver.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/5 border-primary ring-1 ring-primary/30"
                      : "bg-surface-container-lowest border-outline-variant hover:border-outline"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-200  text-slate-800  text-xs font-bold flex items-center justify-center">
                      {driver.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {driver.name}
                      </p>
                      <p className="text-xs text-secondary">{driver.phone}</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    checked={isSelected}
                    onChange={() => setSelectedDriverId(driver.id)}
                    className="accent-primary"
                  />
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-md border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant rounded-lg text-sm text-secondary hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
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
