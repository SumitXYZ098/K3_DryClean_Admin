import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "success";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "font-title-md text-title-md py-3.5 px-lg rounded-lg flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-container text-white border border-transparent shadow-sm",
    secondary:
      "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary",
    outline:
      "bg-transparent text-secondary hover:text-on-surface border border-outline hover:border-on-surface",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";
  const disabledStyle =
    disabled || isLoading ? "opacity-75 cursor-not-allowed transform-none" : "";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="animate-spin material-symbols-outlined text-[20px]"
            data-icon="refresh"
          >
            refresh
          </span>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon={leftIcon}
            >
              {leftIcon}
            </span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon={rightIcon}
            >
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
