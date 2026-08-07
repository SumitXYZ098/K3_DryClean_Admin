import type React from "react";

export interface StaffInstructionsCardProps {
  value: string;
  onChange: (val: string) => void;
}

export const StaffInstructionsCard: React.FC<StaffInstructionsCardProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm">
          sticky_note_2
        </span>
        <h4 className="text-sm font-bold text-on-surface">Staff Instructions</h4>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Handle silk items with care, extra starch for white shirts..."
        className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface resize-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
};

export default StaffInstructionsCard;
