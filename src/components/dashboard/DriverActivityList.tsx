import type React from "react";

export interface DriverItem {
  id: string;
  name: string;
  route: string;
  activeOrders: number;
  isOnline: boolean;
  avatar: string;
}

const mockDrivers: DriverItem[] = [
  {
    id: "1",
    name: "Carlos Ruiz",
    route: "Route 4 - North Zone",
    activeOrders: 3,
    isOnline: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128",
  },
  {
    id: "2",
    name: "Linda Wu",
    route: "Route 12 - Downtown",
    activeOrders: 5,
    isOnline: true,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128",
  },
  {
    id: "3",
    name: "David Smith",
    route: "Shift ends at 17:00",
    activeOrders: 0,
    isOnline: false,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128",
  },
  {
    id: "4",
    name: "Marco Polo",
    route: "Express Delivery",
    activeOrders: 1,
    isOnline: true,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128",
  },
];

export interface DriverActivityListProps {
  drivers?: DriverItem[];
  onManageFleet?: () => void;
}

export const DriverActivityList: React.FC<DriverActivityListProps> = ({
  drivers = mockDrivers,
  onManageFleet,
}) => {
  const onlineCount = drivers.filter((d) => d.isOnline).length;

  return (
    <div className="bg-white border border-outline-variant rounded-md p-lg kpi-card-shadow flex flex-col h-full">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-lg text-on-surface">
          Driver Activity
        </h3>
        <span className="text-label-sm text-green-600 font-bold">
          {onlineCount} Online
        </span>
      </div>

      <div className="flex-1 space-y-lg overflow-y-auto pr-1 hide-scrollbar">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="flex items-center justify-between group transition-colors p-1 rounded-lg hover:bg-surface-container-low/50"
          >
            <div className="flex items-center gap-md">
              <div
                className={`relative ${!driver.isOnline ? "opacity-60" : ""}`}
              >
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    driver.isOnline ? "bg-green-500" : "bg-secondary-fixed-dim"
                  }`}
                />
              </div>
              <div className={!driver.isOnline ? "opacity-60" : ""}>
                <p className="font-body-md font-medium text-on-surface">
                  {driver.name}
                </p>
                <p className="text-xs text-secondary">{driver.route}</p>
              </div>
            </div>

            <div
              className={`text-right ${!driver.isOnline ? "opacity-60" : ""}`}
            >
              {driver.isOnline ? (
                <>
                  <p className="text-xs font-bold text-primary">
                    {driver.activeOrders} Orders
                  </p>
                  <p className="text-[10px] text-secondary uppercase">Active</p>
                </>
              ) : (
                <p className="text-xs font-bold text-secondary">Offline</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onManageFleet}
        className="mt-lg w-full py-2 bg-surface-container border border-outline-variant rounded-lg text-label-sm font-bold text-on-surface-variant hover:bg-secondary-container/50 transition-colors cursor-pointer"
      >
        MANAGE FLEET
      </button>
    </div>
  );
};

export default DriverActivityList;
