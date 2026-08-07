import type React from "react";

export interface DeliveryMapCardProps {
  address?: string;
}

export const DeliveryMapCard: React.FC<DeliveryMapCardProps> = ({
  address = "452 Broadway, NY",
}) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden h-40 group relative shadow-xs">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfp2s0T-YpfQaZ-GSIPDm32FwPqVAuYtmNyAYGg6tuABT-smvyBfKt9bQhohmHB2bVpUokSWtUG--pGNwODIoF1Yiq7Je_tjrHFCXfMn0plq3zd8WbsPibdi28smZHsfCUEEns3tfLVCLDMhViU09znnWOLxZFnzGAxZCZD6ImrBjEavDXNEzzXQAei4egT49X_UDRsXLl0Pa5l6uCpiOgO4VCuptm5eIYO-3W7-qpaOdH3m57ZvFuAA"
        alt="Delivery Route Map"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
        <p className="text-white text-xs font-bold flex items-center gap-1.5 truncate">
          <span className="material-symbols-outlined text-xs text-primary">
            location_on
          </span>
          Delivery: {address}
        </p>
      </div>
    </div>
  );
};

export default DeliveryMapCard;
