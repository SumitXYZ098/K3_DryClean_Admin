import type React from "react";
import type { Order } from "../../store/useOrderStore";

export interface OrderTableRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  onAssignDriver: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
}

export const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onViewDetails,
  onUpdateStatus,
  onAssignDriver,
  onDeleteOrder,
}) => {
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
      default:
        return null;
    }
  };

  // Render order status badge
  const renderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100  text-blue-700 text-xs font-bold">
            Processing
          </span>
        );
      case "Pending":
        return (
          <span className="px-2.5 py-1 rounded-full bg-yellow-100  text-yellow-700 text-xs font-bold">
            Pending
          </span>
        );
      case "Ready":
        return (
          <span className="px-2.5 py-1 rounded-full bg-green-100  text-green-700 text-xs font-bold">
            Ready
          </span>
        );
      case "Out for Delivery":
        return (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold whitespace-nowrap">
            Out for Delivery
          </span>
        );
      case "Delivered":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100  text-emerald-700 text-xs font-bold">
            Delivered
          </span>
        );
      case "Issues":
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-100  text-red-700 text-xs font-bold">
            Issues
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="hover:bg-primary-container/5 transition-colors group">
      {/* Order ID */}
      <td
        className="px-lg py-4 font-bold text-primary cursor-pointer hover:underline"
        onClick={() => onViewDetails(order)}
      >
        {order.id}
      </td>

      {/* Customer Info */}
      <td className="px-lg py-4">
        <div className="flex flex-col">
          <span className="font-title-md text-sm text-on-surface">
            {order.customerName}
          </span>
          <span className="text-xs text-on-surface-variant">
            {order.customerTier}
          </span>
        </div>
      </td>

      {/* Pickup Date */}
      <td className="px-lg py-4 text-body-md text-on-surface">
        {order.pickupDate}
      </td>

      {/* Delivery Date */}
      <td className="px-lg py-4 text-body-md text-on-surface">
        {order.deliveryDate}
      </td>

      {/* Driver Info or Assign Action */}
      <td className="px-lg py-4">
        {order.driver ? (
          <div className="flex items-center gap-2">
            <span className="w-fit h-fit p-2 rounded-full bg-slate-200 text-slate-800 overflow-hidden text-[10px] flex items-center justify-center font-bold">
              {order.driver.initials}
            </span>
            <span className="text-sm text-on-surface whitespace-nowrap">
              {order.driver.name}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAssignDriver(order)}
            className="text-primary text-xs font-bold border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            Assign Driver
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
          onClick={() => onViewDetails(order)}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
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
          onClick={() => onUpdateStatus(order)}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
          title="Update Status"
        >
          <span
            className="material-symbols-outlined text-xl"
            data-icon="edit_square"
          >
            edit_square
          </span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteOrder(order)}
          className="text-on-surface-variant hover:text-error transition-colors cursor-pointer p-1"
          title="Delete Order"
        >
          <span
            className="material-symbols-outlined text-xl"
            data-icon="delete"
          >
            delete
          </span>
        </button>
      </td>
    </tr>
  );
};

export default OrderTableRow;
