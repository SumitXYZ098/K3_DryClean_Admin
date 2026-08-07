import type React from "react";

export interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  showingCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalPages,
  showingCount,
  totalCount,
  onPageChange,
}) => {
  const startItem = showingCount > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = Math.min(currentPage * 10, totalCount);

  return (
    <div className="px-lg py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-md">
      <p className="text-body-md text-on-surface-variant">
        Showing{" "}
        <span className="font-bold text-on-surface">
          {startItem}-{endItem || showingCount}
        </span>{" "}
        of {totalCount} orders
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Previous page"
        >
          <span className="material-symbols-outlined text-sm" data-icon="chevron_left">
            chevron_left
          </span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
              currentPage === pageNum
                ? "bg-primary text-on-primary"
                : "border border-outline-variant text-on-surface hover:bg-surface-container"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Next page"
        >
          <span className="material-symbols-outlined text-sm" data-icon="chevron_right">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
