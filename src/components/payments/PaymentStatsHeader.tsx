import type React from "react";
import type { PaymentStats } from "../../types/payment";

interface PaymentStatsHeaderProps {
  stats: PaymentStats;
  onExportCSV?: () => void;
}

export const PaymentStatsHeader: React.FC<PaymentStatsHeaderProps> = ({
  stats,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md mb-lg">
      {/* Title & Description */}
      <div>
        <h2 className="font-headline-lg text-headline-lg font-plus-jakarta text-on-surface mb-xs">
          Payment Transactions
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage and track all customer payments and refunds.
        </p>
      </div>

      {/* Stats Summary & Quick Actions */}
      <div className="flex flex-wrap items-center gap-md">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-[#E5E5E5] shadow-sm flex items-center gap-lg">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs tracking-wider">
              Today's Revenue
            </p>
            <p className="font-headline-md text-headline-md text-on-surface">
              ₹ {stats.todayRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="h-10 w-px bg-outline-variant"></div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs tracking-wider">
              Transactions
            </p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {stats.totalTransactions}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={onExportCSV}
            className="px-md py-md rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md text-body-md hover:bg-surface-container transition-colors flex items-center gap-xs cursor-pointer shadow-xs active:scale-95"
            title="Download Payment CSV"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentStatsHeader;
