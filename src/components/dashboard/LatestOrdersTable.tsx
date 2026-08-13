import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useOrderStore from "../../store/useOrderStore";

export interface OrderItem {
  id: string;
  customerName: string;
  initials: string;
  service: string;
  status: string;
  total: string;
}

export interface LatestOrdersTableProps {
  orders?: OrderItem[];
  isLoading?: boolean;
}

export const LatestOrdersTable: React.FC<LatestOrdersTableProps> = ({
  orders,
  isLoading: propIsLoading,
}) => {
  const navigate = useNavigate();
  const { orders: storeOrders, isLoading: storeLoading } = useOrderStore();
  const isLoading = propIsLoading !== undefined ? propIsLoading : storeLoading;

  // Refetch orders on page load/reload
  useEffect(() => {
    let isMounted = true;
    useOrderStore
      .getState()
      .fetchOrders()
      .catch((err) => {
        if (isMounted) {
          console.error(
            "[LatestOrdersTable] Failed to fetch orders on reload:",
            err,
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Map store orders or props, strictly limited to latest 6 items
  const mappedStoreOrders: OrderItem[] = (storeOrders || []).map((o) => ({
    id: o.id
      ? o.id.toString().startsWith("#")
        ? o.id.toString()
        : `#${o.id}`
      : `#${o.documentId || "ORD"}`,
    customerName: o.customerName || "Customer",
    initials: o.customerName
      ? o.customerName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "CU",
    service: o.serviceType || "Dry Clean",
    status: o.status || "pending",
    total:
      typeof o.totalAmount === "number"
        ? `₹${o.totalAmount.toFixed(2)}`
        : o.totalAmount || "₹0.00",
  }));

  const displayOrders = (orders || mappedStoreOrders).slice(0, 6);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase().replace(/_/g, " ");
    switch (s) {
      case "pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "pickup assigned":
      case "pickup_assigned":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "picked up":
      case "picked_up":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "processing":
      case "washing":
      case "drying":
        return "bg-primary/10 text-primary border border-primary/20";
      case "delivery assigned":
      case "delivery_assigned":
        return "bg-cyan-100 text-cyan-800 border border-cyan-200";
      case "out for delivery":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "delivered":
      case "ready":
      case "pickup":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-lg text-on-surface">
          Latest Orders
        </h3>
        <button
          onClick={() => navigate("/orders")}
          className="text-primary font-title-md text-sm hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Order No
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Customer Name
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Service Type
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Order Status
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading && displayOrders.length === 0 ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="py-md">
                    <div className="h-4 bg-surface-container-high rounded w-20"></div>
                  </td>
                  <td className="py-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high"></div>
                      <div className="h-4 bg-surface-container-high rounded w-28"></div>
                    </div>
                  </td>
                  <td className="py-md">
                    <div className="h-4 bg-surface-container-high rounded w-24"></div>
                  </td>
                  <td className="py-md">
                    <div className="h-6 bg-surface-container-high rounded-full w-24"></div>
                  </td>
                  <td className="py-md">
                    <div className="h-4 bg-surface-container-high rounded w-16"></div>
                  </td>
                </tr>
              ))
            ) : displayOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-lg text-center text-secondary font-body-md"
                >
                  No recent orders found.
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-md font-body-md text-primary font-medium">
                    {order.id}
                  </td>
                  <td className="py-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary">
                        {order.initials}
                      </div>
                      <span className="font-body-md text-on-surface">
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="py-md text-body-md text-secondary">
                    {order.service}
                  </td>
                  <td className="py-md">
                    <span
                      className={`px-sm py-1 rounded-full text-xs font-medium tracking-tight ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {formatStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-md font-medium text-on-surface">
                    {order.total}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestOrdersTable;
