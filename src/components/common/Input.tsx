import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  leftIcon?: string;
  rightElement?: React.ReactNode;
  error?: string;
  topRightLabel?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      leftIcon,
      rightElement,
      error,
      topRightLabel,
      containerClassName = "",
      className = "",
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-sm ${containerClassName}`}>
        {(label || topRightLabel) && (
          <div className="flex justify-between items-center">
            {label && (
              <label
                htmlFor={id}
                className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider"
              >
                {label}
              </label>
            )}
            {topRightLabel}
          </div>
        )}
        <div className="relative group">
          {leftIcon && (
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]"
              data-icon={leftIcon}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            className={`w-full ${
              leftIcon ? "pl-10" : "pl-md"
            } ${rightElement ? "pr-12" : "pr-md"} py-3 bg-surface border border-outline-variant rounded-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 input-glow transition-all ${
              error ? "border-error focus:border-error" : ""
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error font-body-md mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
