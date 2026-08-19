import type React from "react";
// import { useState, useRef, useEffect } from "react";
import type { PaymentTransaction } from "../../types/payment";
import PaymentStatusBadge from "./PaymentStatusBadge";
// import useSnackbarStore from "../../store/useSnackbarStore";

interface PaymentTableRowProps {
  payment: PaymentTransaction;
  onSelect: (payment: PaymentTransaction) => void;
  onRefund: (paymentId: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  onSelect,
  // onRefund,
  onViewOrder,
}) => {
  // const [showMenu, setShowMenu] = useState(false);
  // const menuRef = useRef<HTMLDivElement>(null);
  // const { showSnackbar } = useSnackbarStore();

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setShowMenu(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // const handleCopyTxn = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setShowMenu(false);
  //   navigator.clipboard.writeText(payment.transactionId);
  //   showSnackbar({
  //     message: `Copied Transaction ID ${payment.transactionId}`,
  //     type: "info",
  //   });
  // };

  return (
    <tr
      onClick={() => onSelect(payment)}
      className="border-b border-[#E5E5E5] hover:bg-surface-container/20 transition-colors cursor-pointer group"
    >
      <td className="px-lg py-md font-medium text-on-surface">{payment.id}</td>
      <td
        className="px-lg py-md text-primary font-medium hover:underline"
        onClick={(e) => {
          if (onViewOrder) {
            e.stopPropagation();
            onViewOrder(payment.orderId);
          }
        }}
      >
        {payment.orderId}
      </td>
      <td className="px-lg py-md text-on-surface">{payment.customerName}</td>
      <td className="px-lg py-md font-medium text-on-surface">
        ₹ {payment.amount.toLocaleString("en-IN")}
      </td>
      <td className="px-lg py-md text-on-surface-variant">{payment.method}</td>
      <td className="px-lg py-md">
        <PaymentStatusBadge status={payment.status} />
      </td>
      <td className="px-lg py-md text-on-surface-variant whitespace-nowrap">
        {payment.createdAt}
      </td>
      <td className="px-lg py-md text-right relative">
        <div className="inline-block text-left">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(payment);
            }}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container/50 transition-colors cursor-pointer"
            title="More Options"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>

          {/* {showMenu && (
            <div className="absolute right-4 top-10 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant py-1 z-30 animate-fade-in text-left">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onSelect(payment);
                }}
                className="w-full px-4 py-2 text-left font-body-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  visibility
                </span>
                View Details
              </button>

              <button
                type="button"
                onClick={handleCopyTxn}
                className="w-full px-4 py-2 text-left font-body-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  content_copy
                </span>
                Copy TXN ID
              </button>

              {onViewOrder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onViewOrder(payment.orderId);
                  }}
                  className="w-full px-4 py-2 text-left font-body-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    receipt_long
                  </span>
                  View Order
                </button>
              )}

              {payment.status !== "Refunded" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onRefund(payment.id);
                  }}
                  className="w-full px-4 py-2 text-left font-body-md text-error hover:bg-error-container/20 flex items-center gap-2 cursor-pointer border-t border-outline-variant/30 mt-1 pt-2"
                >
                  <span className="material-symbols-outlined text-base">
                    undo
                  </span>
                  Process Refund
                </button>
              )}
            </div>
          )} */}
        </div>
      </td>
    </tr>
  );
};

export default PaymentTableRow;
