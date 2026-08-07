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
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || "Pending",
  );

  if (!order) return null;

  const statuses: {
    value: OrderStatus;
    label: string;
    desc: string;
    icon: string;
  }[] = [
    {
      value: "Pending",
      label: "Pending",
      desc: "Order received, awaiting drop-off or pickup collection.",
      icon: "pending_actions",
    },
    {
      value: "Processing",
      label: "Processing",
      desc: "Garments currently in washing, dry cleaning, or pressing.",
      icon: "sync",
    },
    {
      value: "Ready",
      label: "Ready for Pickup",
      desc: "Cleaning finished, bagged and ready for store pickup or delivery dispatch.",
      icon: "check_circle",
    },
    {
      value: "Out for Delivery",
      label: "Out for Delivery",
      desc: "En route with assigned delivery driver to customer location.",
      icon: "local_shipping",
    },
    {
      value: "Delivered",
      label: "Delivered",
      desc: "Order successfully handed to customer.",
      icon: "task_alt",
    },
    {
      value: "Issues",
      label: "Issues / On Hold",
      desc: "Special attention needed (stain warning, customer query, payment block).",
      icon: "warning",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(order.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-fit w-full p-lg shadow-xl my-auto space-y-md">
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
          {statuses.map((st) => {
            const isSelected = selectedStatus === st.value;
            return (
              <label
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`flex items-start gap-md p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary/5 border-primary ring-1 ring-primary/30"
                    : "bg-surface-container-lowest border-outline-variant hover:border-outline"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={st.value}
                  checked={isSelected}
                  onChange={() => setSelectedStatus(st.value)}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-primary">
                      {st.icon}
                    </span>
                    <p className="font-bold text-sm text-on-surface">
                      {st.label}
                    </p>
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
