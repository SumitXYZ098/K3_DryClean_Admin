import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import AuthCard from "../../components/common/AuthCard";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import AuthFooter from "../../components/common/AuthFooter";
import useLoadingStore from "../../store/useLoadingStore";
import useSnackbarStore from "../../store/useSnackbarStore";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [btnText, setBtnText] = useState("Login to Dashboard");
  const [isSuccess, setIsSuccess] = useState(false);

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    setIsLoading(true);
    setBtnText("Authenticating...");
    showLoading("Authenticating user credentials...");

    // Simulate API authentication call
    setTimeout(() => {
      hideLoading();
      setIsLoading(false);
      setIsSuccess(true);
      setBtnText("Verification Sent");

      showSnackbar({
        message: `Welcome back, ${data.email.split("@")[0]}! Logging in...`,
        type: "success",
      });

      setTimeout(() => {
        setIsSuccess(false);
        setBtnText("Login to Dashboard");
      }, 2000);
    }, 1500);
  };

  return (
    <AuthLayout maxWidthClass="max-w-[440px]">
      <AuthCard>
        {successMessage && (
          <div className="mb-md p-md bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-body-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              check_circle
            </span>
            <span>{successMessage}</span>
          </div>
        )}

        <form className="space-y-xl" onSubmit={handleSubmit(onSubmit)}>
          {/* Logo Branding */}
          <div className="flex justify-center mb-xl">
            <Logo size="md" />
          </div>

          {/* Email Field */}
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="admin@k3laundry.com"
            leftIcon="mail"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />

          {/* Password Field */}
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            leftIcon="lock"
            error={errors.password?.message}
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
                className="text-outline-variant hover:text-on-surface-variant transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            }
            {...register("password", {
              required: "Password is required",
            })}
          />

          {/* Remember Device Checkbox */}
          <Checkbox
            id="remember"
            label="Remember device for 30 days"
            {...register("remember")}
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
            onClick={() =>
              showSnackbar({
                message: "Please contact support@k3drycleaning.com to request access.",
                type: "info",
              })
            }
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
