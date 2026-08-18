import type React from "react";

export interface ServiceCategorySkeletonProps {
  count?: number;
}

export const ServiceCategorySkeleton: React.FC<ServiceCategorySkeletonProps> = ({
  count = 6,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`category-skeleton-${idx}`}
          className="bg-surface border border-outline-variant rounded-xl shadow-xs overflow-hidden flex flex-col animate-pulse"
        >
          {/* Header Image Placeholder */}
          <div className="h-40 w-full bg-outline-variant/30 relative">
            <div className="absolute top-sm right-sm w-20 h-6 bg-outline-variant/50 rounded-full" />
          </div>

          {/* Card Body */}
          <div className="p-lg flex flex-col gap-md grow">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-outline-variant/50 rounded-md" />
                <div className="h-4 w-48 bg-outline-variant/30 rounded-md" />
              </div>
              <div className="h-5 w-16 bg-outline-variant/40 rounded-full shrink-0" />
            </div>

            {/* Footer Divider */}
            <div className="mt-auto pt-md border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-xs">
                <div className="w-4 h-4 bg-outline-variant/40 rounded" />
                <div className="h-4 w-28 bg-outline-variant/30 rounded-md" />
              </div>
              <div className="h-6 w-12 bg-outline-variant/40 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategorySkeleton;
