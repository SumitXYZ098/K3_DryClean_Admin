import type React from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
        {...props}
      />
      <label
        htmlFor={id}
        className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
