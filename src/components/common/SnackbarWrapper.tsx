import type React from "react";
import useSnackbarStore, {
  type SnackbarType,
} from "../../store/useSnackbarStore";

interface SnackbarWrapperProps {
  children?: React.ReactNode;
}

const typeStyles: Record<
  SnackbarType,
  {
    bgClass: string;
    icon: string;
    iconColor: string;
  }
> = {
  success: {
    bgClass:
      "bg-emerald-950/95 text-emerald-100 border-emerald-800/60 shadow-emerald-950/30",
    icon: "check_circle",
    iconColor: "text-emerald-400",
  },
  error: {
    bgClass: "bg-red-950/95 text-red-100 border-red-800/60 shadow-red-950/30",
    icon: "error",
    iconColor: "text-red-400",
  },
  warning: {
    bgClass:
      "bg-amber-950/95 text-amber-100 border-amber-800/60 shadow-amber-950/30",
    icon: "warning",
    iconColor: "text-amber-400",
  },
  info: {
    bgClass: "bg-gray-900/95 text-gray-100 border-gray-700/60 shadow-black/30",
    icon: "info",
    iconColor: "text-sky-400",
  },
};

export const SnackbarWrapper: React.FC<SnackbarWrapperProps> = ({
  children,
}) => {
  const { isOpen, message, type, hideSnackbar } = useSnackbarStore();

  const currentStyle = typeStyles[type] || typeStyles.info;

  return (
    <>
      {children}
      {isOpen && (
        <div
          className="fixed top-5 right-5 z-50 max-w-fit w-full transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in-top pointer-events-auto"
          role="alert"
          aria-live="assertive"
        >
          <div
            className={`flex items-center gap-md px-md py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all ${currentStyle.bgClass}`}
          >
            {/* Status Icon */}
            <span
              className={`material-symbols-outlined text-[24px] shrink-0 ${currentStyle.iconColor}`}
              data-icon={currentStyle.icon}
            >
              {currentStyle.icon}
            </span>

            {/* Message Body */}
            <p className="font-body-md text-body-md font-medium flex-1 leading-snug">
              {message}
            </p>

            {/* Close Button */}
            <button
              type="button"
              onClick={hideSnackbar}
              className="p-xs hover:opacity-75 transition-opacity rounded-md focus:outline-none shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                data-icon="close"
              >
                close
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SnackbarWrapper;
