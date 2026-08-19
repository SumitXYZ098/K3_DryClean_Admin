import type React from "react";
import type { PaymentTransaction } from "../../types/payment";
import PaymentTableRow from "./PaymentTableRow";
import Pagination from "../common/Pagination";

interface PaymentTableProps {
  payments: PaymentTransaction[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectPayment: (payment: PaymentTransaction) => void;
  onRefundPayment: (paymentId: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSelectPayment,
  onRefundPayment,
  onViewOrder,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-surface-container/30">
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Customer
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Amount
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Method
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-lg py-md"></th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#E5E5E5] animate-pulse"
                >
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-20"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-20"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-28"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-16"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-24"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-6 bg-surface-container rounded-full w-16"></div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="h-4 bg-surface-container rounded w-32"></div>
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="h-4 bg-surface-container rounded w-6 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-xl text-center text-on-surface-variant"
                >
                  <div className="flex flex-col items-center justify-center p-lg">
                    <span className="material-symbols-outlined text-4xl text-outline mb-sm">
                      payments
                    </span>
                    <p className="font-title-md text-on-surface">
                      No Payment Transactions Found
                    </p>
                    <p className="font-body-md text-on-surface-variant text-sm mt-xs">
                      Try adjusting your search query or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  onSelect={onSelectPayment}
                  onRefund={onRefundPayment}
                  onViewOrder={onViewOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={10}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default PaymentTable;
