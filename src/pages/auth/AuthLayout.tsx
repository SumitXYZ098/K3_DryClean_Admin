import type React from "react";
import { useEffect, useRef } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  maxWidthClass = "max-w-[440px]",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const x = (e.clientX / window.innerWidth) * 20;
        const y = (e.clientY / window.innerHeight) * 20;
        containerRef.current.style.backgroundPosition = `${-x}px ${-y}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-surface min-h-screen flex items-center justify-center p-md sm:p-lg md:p-xl shimmer-bg font-body-md text-on-surface relative overflow-x-hidden"
    >
      {/* Foreground Container */}
      <main className={`w-full ${maxWidthClass} z-10 my-auto`}>
        {children}
      </main>

      {/* Background Decoration / Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary-fixed blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-surface-container-highest blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default AuthLayout;
