import type React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`login-card bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg sm:p-xl md:p-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default AuthCard;
