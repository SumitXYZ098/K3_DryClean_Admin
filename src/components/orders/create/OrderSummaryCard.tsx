import type React from "react";

export interface OrderSummaryCardProps {
  itemCount: number;
  subtotal: number;
  tax?: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  isConfirming: boolean;
  onConfirmOrder: () => void;
  onChangePaymentMethod?: () => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  itemCount,
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  isConfirming,
  onConfirmOrder,
  onChangePaymentMethod,
}) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-lg overflow-hidden relative shadow-xs">
      {/* Background Visual Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <h3 className="font-title-md text-title-md text-on-surface mb-md">
        Order Summary
      </h3>

      {/* Summary Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-body-md text-secondary">
          <span>Items Subtotal ({itemCount})</span>
          <span className="font-medium text-on-surface">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-body-md text-secondary">
          <span>Delivery Fee</span>
          <span className="text-primary font-bold uppercase text-xs tracking-wider">
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Total Amount & Action Buttons */}
      <div className="pt-4 border-t border-outline-variant border-dashed">
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-primary">
            ₹{total.toFixed(2)}
          </span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirmOrder}
            className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isConfirming ? (
              <>
                <span className="material-symbols-outlined animate-spin text-md">
                  sync
                </span>
                Processing Order...
              </>
            ) : (
              <>
                Confirm Order
                <span className="material-symbols-outlined text-md">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Method Info Box */}
      <div className="mt-6 p-3 bg-surface-container-low rounded-lg border border-outline-variant flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary">
          credit_card
        </span>
        <div className="flex-1 truncate">
          <p className="text-xs font-bold text-on-surface">Payment Method</p>
          <p className="text-xs text-secondary truncate">{paymentMethod}</p>
        </div>
        {onChangePaymentMethod && (
          <button
            type="button"
            onClick={onChangePaymentMethod}
            className="text-primary text-xs font-bold hover:underline cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryCard;
