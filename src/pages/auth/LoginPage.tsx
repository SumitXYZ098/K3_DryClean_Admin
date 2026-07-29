import type React from "react";
import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "./AuthLayout";
import AuthCard from "../../components/common/AuthCard";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import AuthFooter from "../../components/common/AuthFooter";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [btnText, setBtnText] = useState("Login to Dashboard");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setBtnText("Authenticating...");

    // Simulate API authentication call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setBtnText("Verification Sent");

      setTimeout(() => {
        setIsSuccess(false);
        setBtnText("Login to Dashboard");
        // Navigate or state change simulation
      }, 2000);
    }, 1500);
  };

  return (
    <AuthLayout maxWidthClass="max-w-[440px]">
      <AuthCard>
        <form className="space-y-xl" onSubmit={handleLogin}>
          {/* Logo Branding */}
          <div className="flex justify-center mb-xl">
            <Logo size="md" />
          </div>

          {/* Email Field */}
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="admin@k3laundry.com"
            leftIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            leftIcon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            topRightLabel={
              <Link
                to="/forgot-password"
                className="font-label-sm text-label-sm text-primary hover:underline transition-all"
              >
                Forgot password?
              </Link>
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-outline-variant hover:text-on-surface-variant transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            }
          />

          {/* Remember Device Checkbox */}
          <Checkbox
            id="remember"
            name="remember"
            label="Remember device for 30 days"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Authenticating..."
            rightIcon={!isLoading && !isSuccess ? "arrow_forward" : undefined}
            leftIcon={isSuccess ? "check_circle" : undefined}
            variant={isSuccess ? "secondary" : "primary"}
            className="mt-md"
          >
            {btnText}
          </Button>
        </form>

        {/* System Access Request Section */}
        <div className="mt-xl pt-xl border-t border-outline-variant flex flex-col items-center space-y-md">
          <p className="font-body-md text-body-md text-on-surface-variant">
            New operator location?
          </p>
          <button
            type="button"
            className="font-label-sm text-label-sm text-secondary hover:text-on-surface px-md py-2 border border-outline rounded-lg transition-colors cursor-pointer"
          >
            Request System Access
          </button>
        </div>
      </AuthCard>

      {/* Footer */}
      <AuthFooter />
    </AuthLayout>
  );
};

export default LoginPage;
