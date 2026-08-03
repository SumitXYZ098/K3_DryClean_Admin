import type React from "react";

export interface OrderItem {
  id: string;
  customerName: string;
  initials: string;
  service: string;
  status: "Washing" | "Drying" | "Ready" | "Pickup";
  total: string;
}

const mockOrders: OrderItem[] = [
  {
    id: "#ORD-8921",
    customerName: "James Donovan",
    initials: "JD",
    service: "Dry Cleaning (5 items)",
    status: "Washing",
    total: "₹45.00",
  },
  {
    id: "#ORD-8922",
    customerName: "Sarah Lopez",
    initials: "SL",
    service: "Premium Wash & Fold",
    status: "Drying",
    total: "₹28.50",
  },
  {
    id: "#ORD-8923",
    customerName: "Michael King",
    initials: "MK",
    service: "Suit Steaming",
    status: "Ready",
    total: "₹15.00",
  },
  {
    id: "#ORD-8924",
    customerName: "Elena Torres",
    initials: "ET",
    service: "Leather Care",
    status: "Pickup",
    total: "₹112.00",
  },
];

export interface LatestOrdersTableProps {
  orders?: OrderItem[];
  onViewAll?: () => void;
}

export const LatestOrdersTable: React.FC<LatestOrdersTableProps> = ({
  orders = mockOrders,
  onViewAll,
}) => {
  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Washing":
        return "bg-primary/10 text-primary";
      case "Drying":
        return "bg-blue-100 text-blue-700";
      case "Ready":
        return "bg-green-100 text-green-700";
      case "Pickup":
        return "bg-surface-container text-secondary";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-lg text-on-surface">
          Latest Orders
        </h3>
        <button
          onClick={onViewAll}
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
                Order ID
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Customer
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Service
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Status
              </th>
              <th className="pb-md text-label-sm text-secondary uppercase font-semibold">
                Total
              </th>
              <th className="pb-md" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.map((order) => (
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
                    className={`px-sm py-1 rounded-full text-xs font-medium uppercase tracking-tight ${getStatusBadge(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-md font-medium text-on-surface">
                  {order.total}
                </td>
                <td className="py-md text-right">
                  <button className="material-symbols-outlined text-secondary hover:text-on-surface cursor-pointer p-1 rounded hover:bg-surface-container">
                    more_vert
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestOrdersTable;
