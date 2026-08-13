import type React from "react";
import dayjs from "dayjs";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../store/useOrderStore";

export interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
  onUpdatePayment: (id: string, payment: PaymentStatus) => void;
  onAssignDriverClick: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePayment,
  onAssignDriverClick,
}) => {
  if (!order) return null;

  const statuses: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "pickup_assigned", label: "Pickup Assigned" },
    { value: "picked_up", label: "Picked Up" },
    { value: "processing", label: "Processing" },
    { value: "delivery_assigned", label: "Ready" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
  ];

  const currentStatusIndex = statuses.findIndex(
    (s) => s.value === order.status,
  );

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-2xl w-full p-lg shadow-xl max-h-[90vh] overflow-y-auto my-auto space-y-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-md">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">
                Order {order.id}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {order.serviceType}
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Created on {dayjs(order.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Status Stepper Progress Bar */}
        <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
          <p className="text-label-sm uppercase font-bold text-on-surface-variant mb-3">
            Order Status Progress
          </p>
          <div className="flex items-center justify-between relative gap-1">
            {statuses.map((stObj, idx) => {
              const st = stObj.value;
              const isPassed =
                currentStatusIndex >= idx && currentStatusIndex !== -1;
              const isPast =
                currentStatusIndex !== -1 && idx < currentStatusIndex;
              const isCurrent = order.status === st;

              return (
                <div
                  key={st}
                  className="flex flex-col items-center z-10 flex-1"
                >
                  <button
                    type="button"
                    disabled={isPast}
                    onClick={() => !isPast && onUpdateStatus(order.id, st)}
                    title={
                      isPast
                        ? `${stObj.label} (Completed)`
                        : `Click to set status to ${stObj.label}`
                    }
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-110 cursor-pointer"
                        : isPast
                          ? "bg-green-600/70 text-white cursor-not-allowed opacity-80"
                          : isPassed
                            ? "bg-green-600 text-white cursor-pointer"
                            : "bg-outline-variant text-secondary cursor-pointer hover:bg-outline"
                    }`}
                  >
                    {isPassed ? "✓" : idx + 1}
                  </button>
                  <span
                    className={`text-[10px] sm:text-[11px] mt-1 font-medium text-center leading-tight ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isPast
                          ? "text-on-surface-variant/70"
                          : isPassed
                            ? "text-on-surface"
                            : "text-secondary"
                    }`}
                  >
                    {stObj.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer & Logistics Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {/* Customer Card */}
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant">
            <p className="text-label-sm uppercase font-bold text-on-surface-variant mb-2">
              Customer Information
            </p>
            <p className="font-title-md text-sm text-on-surface font-bold capitalize">
              {order.customerName}
            </p>
            <p className="text-xs text-secondary mt-2">
              Phone:{" "}
              <span className="text-on-surface">
                {order.customerPhone || "N/A"}
              </span>
            </p>
            <p className="text-xs text-secondary">
              Email:{" "}
              <span className="text-on-surface">
                {order.customerEmail || "N/A"}
              </span>
            </p>
          </div>

          {/* Delivery & Driver Card */}
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant space-y-2">
            <p className="text-label-sm uppercase font-bold text-on-surface-variant">
              Driver & Schedule
            </p>

            {/* Pickup Driver */}
            <div className="flex items-center justify-between text-xs border-b border-outline-variant/60 pb-1.5">
              <span className="text-secondary font-medium">Pickup Driver:</span>
              {order.pickupPerson ? (
                <span className="font-bold text-on-surface">
                  {order.pickupPerson.name}
                </span>
              ) : order.status === "pending" ? (
                <button
                  type="button"
                  onClick={() => onAssignDriverClick(order)}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  + Assign Pickup Driver
                </button>
              ) : (
                <span className="text-secondary italic">Unassigned</span>
              )}
            </div>

            {/* Delivery Driver */}
            <div className="flex items-center justify-between text-xs border-b border-outline-variant/60 pb-1.5">
              <span className="text-secondary font-medium">
                Delivery Driver:
              </span>
              {order.deliveryPerson ? (
                <span className="font-bold text-on-surface">
                  {order.deliveryPerson.name}
                </span>
              ) : order.status === "processing" ? (
                <button
                  type="button"
                  onClick={() => onAssignDriverClick(order)}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  + Assign Delivery Driver
                </button>
              ) : (
                <span className="text-secondary italic">Unassigned</span>
              )}
            </div>

            {/* Schedule Dates */}
            <div className="pt-0.5 space-y-0.5">
              <p className="text-xs text-secondary flex justify-between">
                <span>Pickup Schedule:</span>
                <span className="text-on-surface font-medium">
                  {order.pickupDate}
                </span>
              </p>
              <p className="text-xs text-secondary flex justify-between">
                <span>Delivery Schedule:</span>
                <span className="text-on-surface font-medium">
                  {order.deliveryDate}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Address & Instructions */}
        <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant space-y-2">
          <div>
            <p className="text-label-sm uppercase font-bold text-on-surface-variant">
              Delivery Address
            </p>
            <p className="text-xs text-on-surface mt-0.5">
              {order.deliveryAddress || "Standard store pickup"}
            </p>
          </div>
          {order.specialInstructions && (
            <div className="pt-2 border-t border-outline-variant">
              <p className="text-label-sm uppercase font-bold text-on-surface-variant">
                Special Cleaning Instructions
              </p>
              <p className="text-xs text-amber-700 mt-0.5 bg-amber-50  p-2 rounded border border-amber-200 ">
                {order.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Garment Items Table */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
          <div className="p-md border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
            <h4 className="font-title-md text-sm text-on-surface">
              Garments Breakdown ({order.items.length} items)
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Payment:</span>
              <select
                value={order.paymentStatus}
                onChange={(e) =>
                  onUpdatePayment(order.id, e.target.value as PaymentStatus)
                }
                className="bg-surface-container-lowest border border-outline-variant text-xs rounded px-2 py-1 text-on-surface font-bold"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container/50 border-b border-outline-variant text-on-surface-variant font-bold uppercase">
              <tr>
                <th className="px-md py-2">Item Description</th>
                <th className="px-md py-2">Qty</th>
                <th className="px-md py-2">Unit Price</th>
                <th className="px-md py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-md py-2.5 font-medium text-on-surface capitalize">
                    {item.name}
                  </td>
                  <td className="px-md py-2.5 text-secondary">
                    {item.quantity}
                  </td>
                  <td className="px-md py-2.5 text-secondary">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-md py-2.5 text-right font-bold text-on-surface">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-between items-center font-bold text-sm">
            <span className="text-on-surface">Total Order Amount</span>
            <span className="text-primary text-base">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold text-secondary hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Invoice / Tag
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:opacity-90 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
