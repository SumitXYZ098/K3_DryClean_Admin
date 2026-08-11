/* eslint-disable react-hooks/rules-of-hooks */
import type React from "react";
import { useState } from "react";
import type { Order, OrderStatus } from "../../store/useOrderStore";

export interface UpdateOrderStatusModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: (id: string, newStatus: OrderStatus) => void;
}

export const UpdateOrderStatusModal: React.FC<UpdateOrderStatusModalProps> = ({
  order,
  onClose,
  onUpdate,
}) => {
  if (!order) return null;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );

  const statuses: {
    value: OrderStatus;
    label: string;
    desc: string;
    icon: string;
  }[] = [
    {
      value: "pending",
      label: "Pending",
      desc: "Order received, awaiting pickup assignment.",
      icon: "pending_actions",
    },
    {
      value: "pickup_assigned",
      label: "Pickup Assigned",
      desc: "Driver assigned for order pickup.",
      icon: "assignment_ind",
    },
    {
      value: "picked_up",
      label: "Picked Up",
      desc: "Items collected by driver and en route to facility.",
      icon: "local_shipping",
    },
    {
      value: "processing",
      label: "Processing",
      desc: "Garments currently in washing, dry cleaning, or pressing.",
      icon: "sync",
    },
    {
      value: "delivery_assigned",
      label: "Delivery Assigned",
      desc: "Cleaning finished, bagged and Delivery Assigned dispatch.",
      icon: "check_circle",
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
      desc: "En route with assigned delivery driver to customer location.",
      icon: "moped",
    },
    {
      value: "delivered",
      label: "Delivered",
      desc: "Order successfully handed to customer.",
      icon: "task_alt",
    },
  ];

  const currentStatusIndex = statuses.findIndex(
    (s) => s.value === order.status,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(order.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-150 w-full p-lg shadow-xl my-auto space-y-md">
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              edit_square
            </span>
            <h3 className="font-title-md text-on-surface">
              Update Status - Order {order.id}
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

        <form onSubmit={handleSubmit} className="space-y-sm">
          {statuses.map((st, index) => {
            const isDisabled =
              currentStatusIndex !== -1 && index < currentStatusIndex;
            const isSelected = selectedStatus === st.value;
            return (
              <label
                key={st.value}
                onClick={() => !isDisabled && setSelectedStatus(st.value)}
                className={`flex items-start gap-md p-3 rounded-lg border transition-all ${
                  isDisabled
                    ? "bg-surface-container-low/50 border-outline-variant/30 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "bg-primary/5 border-primary ring-1 ring-primary/30 cursor-pointer"
                    : "bg-surface-container-lowest border-outline-variant hover:border-outline cursor-pointer"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={st.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => !isDisabled && setSelectedStatus(st.value)}
                  className="mt-1 accent-primary disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-base ${
                          isDisabled ? "text-secondary" : "text-primary"
                        }`}
                      >
                        {st.icon}
                      </span>
                      <p
                        className={`font-bold text-sm ${
                          isDisabled
                            ? "text-on-surface-variant/70"
                            : "text-on-surface"
                        }`}
                      >
                        {st.label}
                      </p>
                    </div>
                    {isDisabled && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary mt-0.5">{st.desc}</p>
                </div>
              </label>
            );
          })}

          <div className="flex items-center justify-end gap-3 pt-md border-t border-outline-variant mt-md">
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
              Save Status Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderStatusModal;
