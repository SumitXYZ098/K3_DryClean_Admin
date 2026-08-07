import type React from "react";
import type { FleetActivity } from "../../store/useOrderStore";

export interface FleetActivityCardProps {
  activities: FleetActivity[];
  onViewFleetMap: () => void;
}

export const FleetActivityCard: React.FC<FleetActivityCardProps> = ({
  activities,
  onViewFleetMap,
}) => {
  return (
    <div className="lg:col-span-2 bg-surface-container-low p-lg rounded-xl border border-outline-variant order-card-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-lg">
          <h4 className="font-title-md text-on-surface">
            Recent Fleet Activity
          </h4>
          <button
            type="button"
            onClick={onViewFleetMap}
            className="text-primary text-sm font-bold hover:underline cursor-pointer"
          >
            View Fleet Map
          </button>
        </div>

        <div className="space-y-4">
          {activities.map((act) => {
            const isWarning = act.type === "warning";
            return (
              <div
                key={act.id}
                className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant transition-all hover:border-outline"
              >
                <div
                  className={`p-2 rounded-full ${
                    isWarning
                      ? "bg-primary/10 text-primary"
                      : "bg-blue-100  text-blue-600"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    data-icon={isWarning ? "priority_high" : "local_shipping"}
                  >
                    {isWarning ? "priority_high" : "local_shipping"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">
                    {act.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {act.subtitle}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    act.status === "On Time"
                      ? "text-green-600 bg-green-50"
                      : act.status === "Delayed"
                        ? "text-red-600 bg-red-50"
                        : "text-blue-600 bg-blue-50"
                  }`}
                >
                  {act.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FleetActivityCard;
