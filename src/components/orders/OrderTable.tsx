import type React from "react";
import type { Order } from "../../store/useOrderStore";
import OrderTableRow from "./OrderTableRow";
import OrderPagination from "./OrderPagination";

export interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  totalOrdersCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  onAssignDriver: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading = false,
  totalOrdersCount,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onUpdateStatus,
  onAssignDriver,
  onDeleteOrder,
}) => {
  return (
    <div className="bg-surface-container-lowest border-t border-outline-variant">
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant">
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Order #
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Customer Name
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Pickup Date
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Delivery Date
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Driver
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Payment
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-nowrap">
                Status
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-row-${index}`} className="animate-pulse">
                  <td className="px-lg py-4">
                    <div className="h-4 w-20 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-32 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-24 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-24 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-28 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-4 w-16 bg-outline-variant/40 rounded-md"></div>
                  </td>
                  <td className="px-lg py-4">
                    <div className="h-6 w-24 bg-outline-variant/40 rounded-full"></div>
                  </td>
                  <td className="px-lg py-4 text-right">
                    <div className="h-8 w-8 bg-outline-variant/40 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onViewDetails={onViewDetails}
                  onUpdateStatus={onUpdateStatus}
                  onAssignDriver={onAssignDriver}
                  onDeleteOrder={onDeleteOrder}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-lg py-12 text-center text-secondary"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-outline">
                      inbox
                    </span>
                    <p className="font-title-md text-on-surface">
                      No orders found
                    </p>
                    <p className="text-sm text-secondary">
                      Try adjusting your search queries or filter dropdowns.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        showingCount={orders.length}
        totalCount={totalOrdersCount}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderTable;
