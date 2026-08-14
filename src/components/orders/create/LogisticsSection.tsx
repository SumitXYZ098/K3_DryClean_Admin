/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import { useEffect } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

export const TIME_SLOTS = [
  { label: "09:00 - 11:00", startHour: 9 },
  { label: "11:00 - 13:00", startHour: 11 },
  { label: "13:00 - 15:00", startHour: 13 },
  { label: "15:00 - 17:00", startHour: 15 },
  { label: "16:00 - 18:00", startHour: 16 },
];

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  data,
  onChange,
}) => {
  const currentHour = dayjs().hour();
  // If current hour is 16 (4 PM) or later, all slots for today have passed
  const allSlotsPassedToday = currentHour >= 16;

  const minPickupDate = allSlotsPassedToday
    ? dayjs().add(1, "day").startOf("day")
    : dayjs().startOf("day");

  const isSlotDisabled = (startHour: number, dateStr: string): boolean => {
    if (!dateStr) return false;
    const selectedDate = dayjs(dateStr);
    const today = dayjs();

    if (selectedDate.isSame(today, "day")) {
      return currentHour >= startHour;
    }
    return false;
  };

  // Auto-correct pickup date to tomorrow if all slots passed today
  useEffect(() => {
    const tomorrowStr = dayjs().add(1, "day").format("YYYY-MM-DD");

    if (allSlotsPassedToday) {
      if (
        !data.pickupDate ||
        dayjs(data.pickupDate).isSame(dayjs(), "day") ||
        dayjs(data.pickupDate).isBefore(dayjs().add(1, "day"), "day")
      ) {
        onChange("pickupDate", tomorrowStr);
        const minDeliv = dayjs(tomorrowStr).add(2, "day").format("YYYY-MM-DD");
        if (
          !data.deliveryDate ||
          dayjs(data.deliveryDate).isBefore(dayjs(minDeliv), "day")
        ) {
          onChange("deliveryDate", minDeliv);
        }
      }
    } else if (
      data.pickupDate &&
      dayjs(data.pickupDate).isSame(dayjs(), "day")
    ) {
      const currentSelected = TIME_SLOTS.find(
        (s) => s.label === data.pickupTimeSlot,
      );
      if (!currentSelected || currentHour >= currentSelected.startHour) {
        const firstAvailable = TIME_SLOTS.find(
          (s) => currentHour < s.startHour,
        );
        if (firstAvailable) {
          onChange("pickupTimeSlot", firstAvailable.label);
        }
      }
    }
  }, [data.pickupDate]);

  // Minimum delivery date is 2 days after pickup date
  const minDeliveryDate = data.pickupDate
    ? dayjs(data.pickupDate).add(2, "day").startOf("day")
    : minPickupDate.add(2, "day").startOf("day");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
        <div className="flex items-center gap-2 pb-sm border-b border-outline-variant">
          <span className="material-symbols-outlined text-primary">
            schedule
          </span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-start">
              <div>
                <label className="block text-label-sm text-secondary mb-1.5 font-semibold">
                  Date
                </label>
                <DatePicker
                  value={
                    data.pickupDate ? dayjs(data.pickupDate) : minPickupDate
                  }
                  format="DD/MM/YYYY"
                  minDate={minPickupDate}
                  onChange={(newValue: Dayjs | null) => {
                    if (!newValue || !newValue.isValid()) return;
                    const formatted = newValue.format("YYYY-MM-DD");
                    onChange("pickupDate", formatted);

                    // Auto-adjust delivery date if it violates 2-day minimum
                    const minDelivery = newValue.add(2, "day");
                    if (
                      !data.deliveryDate ||
                      dayjs(data.deliveryDate).isBefore(minDelivery, "day")
                    ) {
                      onChange(
                        "deliveryDate",
                        minDelivery.format("YYYY-MM-DD"),
                      );
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.5rem",
                          backgroundColor: "var(--color-surface, #fff)",
                          fontSize: "0.875rem",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div>
                <label className="block text-label-sm text-secondary mb-1.5 font-semibold">
                  Time Slot
                </label>
                <select
                  value={data.pickupTimeSlot}
                  onChange={(e) => onChange("pickupTimeSlot", e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary font-medium"
                >
                  {TIME_SLOTS.map((slot) => {
                    const disabled = isSlotDisabled(
                      slot.startHour,
                      data.pickupDate,
                    );
                    return (
                      <option
                        key={slot.label}
                        value={slot.label}
                        disabled={disabled}
                      >
                        {slot.label} {disabled ? "(Passed)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="space-y-md">
            <h4 className="text-sm font-bold flex items-center gap-2 text-on-surface">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Expected Delivery (Min 2 Days)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-start">
              <div>
                <label className="block text-label-sm text-secondary mb-1.5 font-semibold">
                  Date
                </label>
                <DatePicker
                  value={
                    data.deliveryDate
                      ? dayjs(data.deliveryDate)
                      : minDeliveryDate
                  }
                  format="DD/MM/YYYY"
                  minDate={minDeliveryDate}
                  onChange={(newValue: Dayjs | null) => {
                    if (!newValue || !newValue.isValid()) return;
                    onChange("deliveryDate", newValue.format("YYYY-MM-DD"));
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.5rem",
                          backgroundColor: "var(--color-surface, #fff)",
                          fontSize: "0.875rem",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div>
                <label className="block text-label-sm text-secondary mb-1.5 font-semibold">
                  Time Slot
                </label>
                <select
                  value={data.deliveryTimeSlot}
                  onChange={(e) => onChange("deliveryTimeSlot", e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary font-medium"
                >
                  {TIME_SLOTS.map((slot) => {
                    const disabled = isSlotDisabled(
                      slot.startHour,
                      data.deliveryDate,
                    );
                    return (
                      <option
                        key={slot.label}
                        value={slot.label}
                        disabled={disabled}
                      >
                        {slot.label} {disabled ? "(Passed)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LocalizationProvider>
  );
};

export default LogisticsSection;
