import type React from "react";
import useLoadingStore from "../../store/useLoadingStore";

interface LoadingWrapperProps {
  children?: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const { isLoading, message } = useLoadingStore();

  return (
    <>
      {children}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-on-surface/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-2xl shadow-2xl flex flex-col items-center max-w-80 w-full text-center space-y-md animate-scale-up">
            {/* Spinning Indicator with K3 Brand Styling */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-outline-variant/30" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <span
                className="material-symbols-outlined text-primary text-[24px]"
                data-icon="autorenew"
              >
                autorenew
              </span>
            </div>

            {/* Loading Message */}
            <div className="space-y-xs">
              <p className="font-title-md text-title-md text-on-surface font-semibold">
                {message || "Please wait..."}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                K3 Management Suite
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingWrapper;
