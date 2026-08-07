import type React from "react";

export interface LogisticsData {
  pickupDate: string;
  pickupTimeSlot: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  isExpress: boolean;
}

export interface LogisticsSectionProps {
  data: LogisticsData;
  onChange: (field: keyof LogisticsData, value: boolean | string) => void;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
      <div className="flex items-center gap-2 pb-sm border-b border-outline-variant">
        <span className="material-symbols-outlined text-primary">schedule</span>
        <h3 className="font-title-md text-title-md text-on-surface">
          Pickup &amp; Delivery
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Pickup Schedule */}
        <div className="space-y-md">
          <h4 className="text-sm font-bold flex items-center gap-2 text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            Pickup Schedule
          </h4>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-secondary mb-1 font-semibold">
                Date
              </label>
              <input
                type="date"
                value={data.pickupDate}
                onChange={(e) => onChange("pickupDate", e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-label-sm text-secondary mb-1 font-semibold">
                Time Slot
              </label>
              <select
                value={data.pickupTimeSlot}
                onChange={(e) => onChange("pickupTimeSlot", e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary"
              >
                <option value="09:00 - 11:00">09:00 - 11:00</option>
                <option value="14:00 - 16:00">14:00 - 16:00</option>
                <option value="18:00 - 20:00">18:00 - 20:00</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expected Delivery */}
        <div className="space-y-md">
          <h4 className="text-sm font-bold flex items-center gap-2 text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Expected Delivery
          </h4>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-secondary mb-1 font-semibold">
                Date
              </label>
              <input
                type="date"
                value={data.deliveryDate}
                onChange={(e) => onChange("deliveryDate", e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-2.5 bg-surface text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-label-sm text-secondary mb-1 font-semibold">
                Time Slot
              </label>
              <select
                value={data.deliveryTimeSlot}
                onChange={(e) => onChange("deliveryTimeSlot", e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary"
              >
                <option value="09:00 - 11:00">09:00 - 11:00</option>
                <option value="14:00 - 16:00">14:00 - 16:00</option>
                <option value="18:00 - 20:00">18:00 - 20:00</option>
              </select>
            </div>
          </div>
        </div>

        {/* Express Toggle Card */}
        <div className="md:col-span-2 p-md bg-surface-container-high rounded-xl border border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">
                Express Service
              </p>
              <p className="text-xs text-secondary">
                Guaranteed delivery within 24 hours. (+$15.00 Surcharge)
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={data.isExpress}
              onChange={(e) => onChange("isExpress", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
      </div>
    </section>
  );
};

export default LogisticsSection;
