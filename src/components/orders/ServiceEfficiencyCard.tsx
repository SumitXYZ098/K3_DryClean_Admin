import type React from "react";

export interface ServiceEfficiencyCardProps {
  onOpenReport: () => void;
}

export const ServiceEfficiencyCard: React.FC<ServiceEfficiencyCardProps> = ({
  onOpenReport,
}) => {
  return (
    <div className="bg-primary p-lg rounded-xl flex flex-col justify-between text-on-primary shadow-md h-fit">
      <div>
        <h4 className="font-headline-md font-bold mb-2">Service Efficiency</h4>
        <p className="text-sm opacity-80 mb-6">
          Average turnaround time has decreased by 18% this month.
        </p>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">2.4</p>
            <p className="text-[10px] uppercase font-bold opacity-70">
              Days avg
            </p>
          </div>
          <div className="h-10 w-px bg-on-primary/20" />
          <div className="text-center">
            <p className="text-2xl font-bold">98%</p>
            <p className="text-[10px] uppercase font-bold opacity-70">
              Quality Score
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenReport}
        className="mt-8 w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
      >
        <span
          className="material-symbols-outlined text-xl"
          data-icon="analytics"
        >
          analytics
        </span>
        Full Operations Report
      </button>
    </div>
  );
};

export default ServiceEfficiencyCard;
