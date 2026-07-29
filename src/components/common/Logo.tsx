import type React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_LOGO_URL = "/favicon.png";
// "https://lh3.googleusercontent.com/aida-public/AB6AXuDSag0pqeLQ5wvIH74ICu63l-o0QERBF4lEcXN-gFZyeUz4x29w_8suq1q4qqQaYxCJYhNuCWZZqBgTdUIoB6GCOtWgiM0RAQSbGXksP0vIr_PnOv7KjpgRcpRaPrZWIbAlMzESOD86KeHfElhUxx4bjRLdK8a2IGgp_ZrTd2Odsp8tFBRzIVVRvfJ29ZJBhU9Fspkf7dKqYyBa7JENquUXcnaAulGa25S8ytQb1Z0rMjGwG2qZU0U8frzvl2Rv-9E";

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const heightClass = size === "sm" ? "h-16" : size === "lg" ? "h-28" : "h-24";

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img
        src={DEFAULT_LOGO_URL}
        alt="K3 Dry Cleaning Logo"
        className={`${heightClass} w-auto object-contain transition-all duration-300`}
        onError={(e) => {
          // Fallback text logo if URL fails to load
          const target = e.currentTarget;
          target.style.display = "none";
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="flex items-center space-x-2 font-display text-2xl font-bold text-primary">
                <span class="bg-primary text-white p-2 rounded-lg text-xl font-black">K3</span>
                <span class="text-on-surface">DRY CLEANING</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default Logo;
