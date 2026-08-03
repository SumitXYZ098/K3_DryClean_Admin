import type React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-lg py-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-md border-t border-outline-variant">
      <p className="text-body-md text-secondary">
        Showing{" "}
        <span className="font-bold text-on-surface">
          {startItem} - {endItem}
        </span>{" "}
        of{" "}
        <span className="font-bold text-on-surface">
          {totalItems.toLocaleString()}
        </span>{" "}
        items
      </p>

      <div className="flex items-center gap-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-md py-1.5 border border-outline-variant rounded-default bg-surface hover:bg-surface-container transition-colors text-secondary flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="chevron_left"
          >
            chevron_left
          </span>
          Previous
        </button>

        <div className="flex items-center gap-xs">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-default font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="px-2 text-secondary">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-9 h-9 flex items-center justify-center rounded-default font-medium transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-md py-1.5 border border-outline-variant rounded-default bg-surface hover:bg-surface-container transition-colors text-on-surface flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
        >
          Next
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="chevron_right"
          >
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
