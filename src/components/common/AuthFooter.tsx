import type React from "react";

interface AuthFooterProps {
  versionText?: string;
  showLinks?: boolean;
  className?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  versionText = `© ${new Date().getFullYear()} K3 Dry Cleaning. Enterprise Edition v2.4.0`,
  showLinks = true,
  className = "",
}) => {
  return (
    <footer className={`mt-xl text-center space-y-sm ${className}`}>
      <p className="font-label-sm text-label-sm text-outline">{versionText}</p>
      {showLinks && (
        <div className="flex justify-center space-x-md">
          <a
            href="#status"
            className="font-label-sm text-label-sm text-outline hover:text-on-surface-variant transition-colors"
          >
            Status
          </a>
          <a
            href="#privacy"
            className="font-label-sm text-label-sm text-outline hover:text-on-surface-variant transition-colors"
          >
            Privacy
          </a>
          <a
            href="#support"
            className="font-label-sm text-label-sm text-outline hover:text-on-surface-variant transition-colors"
          >
            Support
          </a>
        </div>
      )}
    </footer>
  );
};

export default AuthFooter;
