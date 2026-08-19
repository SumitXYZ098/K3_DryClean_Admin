import type React from "react";
import type { PaymentStatus } from "../../types/payment";

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
  className?: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  switch (status) {
    case "Paid":
      return (
        <span
          className={`inline-flex items-center px-sm py-xs rounded-full bg-green-100 text-green-800 font-label-sm text-label-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 mr-xs"></span>
          Paid
        </span>
      );
    case "Pending":
      return (
        <span
          className={`inline-flex items-center px-sm py-xs rounded-full bg-yellow-100 text-yellow-800 font-label-sm text-label-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-xs"></span>
          Pending
        </span>
      );
    case "Failed":
      return (
        <span
          className={`inline-flex items-center px-sm py-xs rounded-full bg-red-100 text-red-800 font-label-sm text-label-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 mr-xs"></span>
          Failed
        </span>
      );
    case "Refunded":
      return (
        <span
          className={`inline-flex items-center px-sm py-xs rounded-full bg-purple-100 text-purple-800 font-label-sm text-label-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 mr-xs"></span>
          Refunded
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center px-sm py-xs rounded-full bg-gray-100 text-gray-800 font-label-sm text-label-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-gray-400 mr-xs"></span>
          {status}
        </span>
      );
  }
};

export default PaymentStatusBadge;
