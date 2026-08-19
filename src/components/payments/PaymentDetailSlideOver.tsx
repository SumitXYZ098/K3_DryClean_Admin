import type React from "react";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import type { PaymentTransaction } from "../../types/payment";
import PaymentStatusBadge from "./PaymentStatusBadge";
import useSnackbarStore from "../../store/useSnackbarStore";

interface PaymentDetailSlideOverProps {
  payment: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund: (paymentId: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export const PaymentDetailSlideOver: React.FC<PaymentDetailSlideOverProps> = ({
  payment,
  isOpen,
  onClose,
  onRefund,
  onViewOrder,
}) => {
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  if (!payment) return null;

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(payment.transactionId);
    showSnackbar({
      message: `Copied Transaction ID: ${payment.transactionId}`,
      type: "info",
    });
  };

  const handleConfirmRefund = () => {
    onRefund(payment.id);
    setShowRefundConfirm(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            style: {
              width: "400px",
              maxWidth: "100vw",
              backgroundColor: "var(--surface-container-lowest, #ffffff)",
              color: "var(--on-surface, #2a1614)",
              boxShadow: "0 0 24px rgba(0,0,0,0.15)",
            },
          },
        }}
      >
        <div className="flex flex-col h-full bg-surface-container-lowest text-on-surface">
          {/* Panel Header */}
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between bg-surface">
            <h3 className="font-title-md text-title-md text-on-surface">
              Payment Details
            </h3>
            <button
              type="button"
              className="text-on-surface-variant hover:bg-secondary-container/50 p-xs rounded-full transition-colors cursor-pointer"
              onClick={onClose}
              title="Close Panel"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-lg space-y-xl">
            {/* Top Amount & Status Section */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  ₹ {payment.amount.toLocaleString("en-IN")}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  {payment.method}
                </p>
              </div>
              <PaymentStatusBadge status={payment.status} />
            </div>

            {/* Key-Value Detail Grid */}
            <div className="space-y-md">
              <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Payment ID
                </span>
                <span className="font-body-md text-body-md text-on-surface font-medium text-right">
                  {payment.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Order ID
                </span>
                <button
                  type="button"
                  className="font-body-md text-body-md text-primary hover:underline text-right cursor-pointer"
                  onClick={() => {
                    if (onViewOrder) {
                      onViewOrder(payment.orderId);
                    }
                  }}
                >
                  {payment.orderId}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Customer
                </span>
                <span className="font-body-md text-body-md text-on-surface text-right">
                  {payment.customerName}
                </span>
              </div>

              {payment.method === "Online (UPI)" && (
                <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Transaction ID
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-body-md text-body-md text-on-surface font-mono text-sm">
                      {payment.transactionId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTxn}
                      className="text-on-surface-variant hover:text-primary p-0.5 rounded cursor-pointer"
                      title="Copy Transaction ID"
                    >
                      <span className="material-symbols-outlined text-xs">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Created Date
                </span>
                <span className="font-body-md text-body-md text-on-surface text-right">
                  {payment.createdAt}
                </span>
              </div>
              {payment.status === "Paid" && (
                <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Paid Date
                  </span>
                  <span className="font-body-md text-body-md text-on-surface text-right">
                    {payment.date}
                  </span>
                </div>
              )}

              {payment.notes && (
                <div className="grid grid-cols-2 gap-md py-sm border-b border-[#E5E5E5]">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Notes
                  </span>
                  <span className="font-body-md text-body-md text-on-surface text-right">
                    {payment.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="bg-surface-container rounded-lg p-md">
              <h5 className="font-title-md text-title-md text-on-surface mb-sm">
                Order Summary
              </h5>
              <ul className="space-y-xs capitalize">
                {payment.items && payment.items.length > 0 ? (
                  payment.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between font-body-md text-body-md"
                    >
                      <span className="text-on-surface-variant">{item.name}</span>
                      <span className="text-on-surface font-medium">
                        ₹ {item.price.toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Dry Clean Order #{payment.orderId}</span>
                    <span>₹ {payment.amount.toLocaleString("en-IN")}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Panel Action Footer */}
          <div className="px-lg py-md border-t border-outline-variant bg-surface flex gap-md mt-auto">
            <button
              type="button"
              className="flex-1 px-md py-sm rounded-lg border border-primary text-primary font-body-md text-body-md font-medium hover:bg-primary-container/10 transition-colors cursor-pointer text-center"
              onClick={() => {
                if (onViewOrder) {
                  onViewOrder(payment.orderId);
                }
              }}
            >
              View Order
            </button>

            {payment.status !== "Refunded" ? (
              <button
                type="button"
                className="flex-1 px-md py-sm rounded-lg border border-error text-error font-body-md text-body-md font-medium hover:bg-error-container/20 transition-colors cursor-pointer text-center"
                onClick={() => setShowRefundConfirm(true)}
              >
                Refund
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-body-md text-body-md font-medium bg-surface-container opacity-60 cursor-not-allowed text-center"
              >
                Refunded
              </button>
            )}
          </div>
        </div>
      </Drawer>

      {/* Confirmation Modal for Refund */}
      {showRefundConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-lg border border-outline-variant shadow-xl space-y-md animate-scale-in">
            <div className="flex items-center gap-md text-error">
              <span className="material-symbols-outlined text-3xl">
                warning
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface">
                Confirm Refund
              </h4>
            </div>
            <p className="font-body-md text-on-surface-variant">
              Are you sure you want to issue a refund of{" "}
              <strong className="text-on-surface font-semibold">
                ₹ {payment.amount.toLocaleString("en-IN")}
              </strong>{" "}
              for Payment ID{" "}
              <strong className="text-primary">{payment.id}</strong> (Order #
              {payment.orderId})?
            </p>
            <div className="flex justify-end gap-sm pt-sm">
              <button
                type="button"
                onClick={() => setShowRefundConfirm(false)}
                className="px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRefund}
                className="px-md py-sm rounded-lg bg-error text-on-error font-medium hover:bg-error-container/90 transition-colors cursor-pointer shadow-xs"
              >
                Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentDetailSlideOver;
