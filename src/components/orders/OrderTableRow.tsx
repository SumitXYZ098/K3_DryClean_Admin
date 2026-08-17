import type React from "react";
import type { Order } from "../../store/useOrderStore";

export interface OrderTableRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  onAssignDriver: (order: Order) => void;
  // onDeleteOrder: (order: Order) => void;
}

export const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onViewDetails,
  onUpdateStatus,
  onAssignDriver,
  // onDeleteOrder,
}) => {
  const isCancelled =
    order.status === "cancelled" ||
    order.paymentStatus === "cancelled" ||
    order.paymentStatus === "Cancelled";

  // Render payment badge
  const renderPaymentBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            Paid
          </span>
        );
      case "Unpaid":
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
            Unpaid
          </span>
        );
      case "Refunded":
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
            Refunded
          </span>
        );
      case "cancelled":
      case "Cancelled":
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Render order status badge
  const renderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
            Pending
          </span>
        );
      case "pickup_assigned":
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold whitespace-nowrap">
            Pickup Assigned
          </span>
        );
      case "picked_up":
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold whitespace-nowrap">
            Picked Up
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            Processing
          </span>
        );
      case "delivery_assigned":
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold whitespace-nowrap">
            Delivery Assigned
          </span>
        );
      case "out_for_delivery":
        return (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold whitespace-nowrap">
            Out for Delivery
          </span>
        );
      case "delivered":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <tr
      className={`transition-colors group capitalize ${
        isCancelled
          ? "opacity-50 bg-gray-100/70 pointer-events-none select-none"
          : order.expressDelivery
            ? "bg-amber-500/5 hover:bg-amber-500/10 border-l-4 border-l-amber-500"
            : "hover:bg-primary-container/5"
      }`}
    >
      {/* Order ID & Express Badge */}
      <td
        className={`px-lg py-4 font-bold text-primary ${
          isCancelled ? " text-gray-500" : "cursor-pointer hover:underline"
        }`}
        onClick={() => !isCancelled && onViewDetails(order)}
      >
        <div className="flex items-center gap-2 ">
          <span className="text-xs">{order.id}</span>
          {/* {order.expressDelivery && (
            <span className="hover:no-underline inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
              <span className="material-symbols-outlined text-[12px]">
                bolt
              </span>
              Express
            </span>
          )} */}
        </div>
      </td>

      {/* Customer Info */}
      <td className="px-lg py-4">
        <div className="flex flex-col">
          <span className="font-title-md text-sm text-on-surface">
            {order.customerName}
          </span>
        </div>
      </td>

      {/* Pickup Date */}
      <td className="px-lg py-4 text-body-md text-on-surface">
        {order.pickupDate}
      </td>

      {/* Delivery Date */}
      {/* <td className="px-lg py-4 text-body-md text-on-surface">
        {order.deliveryDate}
      </td> */}

      {/* Driver Info or Assign Action */}
      <td className="px-lg py-4">
        {isCancelled ? (
          <span className="text-xs text-gray-400 italic">N/A (Cancelled)</span>
        ) : order.status === "pickup_assigned" ||
          order.status === "picked_up" ? (
          order.pickupPerson && (
            <div className="flex items-center gap-2 group">
              <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">
                {order.pickupPerson.initials}
              </span>
              <span className="text-sm text-on-surface whitespace-nowrap font-medium">
                {order.pickupPerson.name}
              </span>
            </div>
          )
        ) : order.status === "processing" ? (
          <button
            type="button"
            disabled={isCancelled}
            onClick={() => onAssignDriver(order)}
            className="text-primary text-[10px] font-bold border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            Assign Delivery Driver
          </button>
        ) : order.status === "delivery_assigned" ||
          order.status === "delivered" ||
          order.status === "out_for_delivery" ? (
          order.deliveryPerson && (
            <div className="flex items-center gap-2 group">
              <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">
                {order.deliveryPerson.initials}
              </span>
              <span className="text-sm text-on-surface whitespace-nowrap font-medium">
                {order.deliveryPerson.name}
              </span>{" "}
            </div>
          )
        ) : (
          <button
            type="button"
            disabled={isCancelled}
            onClick={() => onAssignDriver(order)}
            className="text-primary text-[10px] font-bold border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            Assign Pickup Driver
          </button>
        )}
      </td>

      {/* Payment Status */}
      <td className="px-lg py-4">{renderPaymentBadge(order.paymentStatus)}</td>

      {/* Order Status */}
      <td className="px-lg py-4">{renderStatusBadge(order.status)}</td>

      {/* Row Actions */}
      <td className="px-lg py-4 text-right space-x-2 whitespace-nowrap">
        <button
          type="button"
          disabled={isCancelled}
          onClick={() => !isCancelled && onViewDetails(order)}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 disabled:opacity-30 disabled:cursor-not-allowed"
          title="View Details"
        >
          <span
            className="material-symbols-outlined text-xl"
            data-icon="visibility"
          >
            visibility
          </span>
        </button>

        <button
          type="button"
          disabled={isCancelled}
          onClick={() => !isCancelled && onUpdateStatus(order)}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Update Status"
        >
          <span
            className="material-symbols-outlined text-xl"
            data-icon="edit_square"
          >
            edit_square
          </span>
        </button>
      </td>
    </tr>
  );
};

export default OrderTableRow;
