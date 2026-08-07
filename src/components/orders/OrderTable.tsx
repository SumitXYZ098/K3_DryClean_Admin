import type React from "react";
import type { Order } from "../../store/useOrderStore";
import OrderTableRow from "./OrderTableRow";
import OrderPagination from "./OrderPagination";

export interface OrderTableProps {
  orders: Order[];
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
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Customer Name
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Pickup Date
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Delivery Date
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Driver
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Payment
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold">
                Status
              </th>
              <th className="px-lg py-4 text-label-sm uppercase text-on-surface-variant font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.length > 0 ? (
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
