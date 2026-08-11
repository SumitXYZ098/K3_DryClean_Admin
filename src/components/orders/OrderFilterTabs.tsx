import type React from "react";

export interface OrderFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalOrdersCount: number;
}

export const OrderFilterTabs: React.FC<OrderFilterTabsProps> = ({
  activeTab,
  onTabChange,
  totalOrdersCount,
}) => {
  const tabs = [
    { id: "All", label: `All Orders (${totalOrdersCount})` },
    { id: "pending", label: "Pending" },
    { id: "pickup_assigned", label: "Pickup Assigned" },
    { id: "picked_up", label: "Picked Up" },
    { id: "processing", label: "Processing" },
    { id: "delivery_assigned", label: "Delivery Assigned" },
    { id: "out_for_delivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="flex items-center px-lg border-b border-outline-variant overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default OrderFilterTabs;
