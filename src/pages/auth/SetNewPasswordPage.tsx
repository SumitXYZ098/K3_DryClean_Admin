/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import AuthFooter from "../../components/common/AuthFooter";
import useSnackbarStore from "../../store/useSnackbarStore";
import useAuthHook from "../../hooks/useAuthHook";

interface SetNewPasswordInputs {
  newPassword: string;
  confirmPassword: string;
}

export const SetNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as
    | { email?: string; resetToken?: string }
    | undefined;
  const userEmail = locationState?.email || "";
  const initialResetToken = locationState?.resetToken || "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    resetPassword,
    isLoading,
    resetToken: hookResetToken,
  } = useAuthHook();
  const { showSnackbar } = useSnackbarStore();

  const activeResetToken = initialResetToken || hookResetToken || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SetNewPasswordInputs>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPasswordValue = useWatch({ control, name: "newPassword" }) || "";
  const confirmPasswordValue =
    useWatch({ control, name: "confirmPassword" }) || "";

  // Validation rules for security requirements display
  const isMinLength = newPasswordValue.length >= 8;
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPasswordValue);
  const hasUpperCase = /[A-Z]/.test(newPasswordValue);
  const hasLowerCase = /[a-z]/.test(newPasswordValue);
  const hasAlphabet = hasUpperCase || hasLowerCase;
  const isMatch =
    confirmPasswordValue.length > 0 &&
    confirmPasswordValue === newPasswordValue;

  const onSubmit = async (data: SetNewPasswordInputs) => {
    if (!isMinLength || !hasNumber || !hasSpecial || !hasAlphabet) {
      const msg = "Please fulfill all security requirements.";
      setErrorMessage(msg);
      showSnackbar({ message: msg, type: "error" });
      return;
    }

    if (newPasswordValue !== confirmPasswordValue) {
      const msg = "Passwords do not match. Please re-enter.";
      setErrorMessage(msg);
      showSnackbar({ message: msg, type: "error" });
      return;
    }

    setErrorMessage("");

    try {
      await resetPassword({
        identifier: userEmail,
        resetToken: activeResetToken,
        password: data.newPassword,
      });

      setIsSuccess(true);

      // Redirect to login after success state
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password updated successfully! Please log in with your new credentials.",
          },
        });
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    }
  };

  return (
    <AuthLayout maxWidthClass="max-w-[440px]">
      {/* Auth Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-100 h-100 rounded-full bg-surface-container opacity-40 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 rounded-full bg-surface-container-highest opacity-30 blur-3xl" />
      </div>

      {/* Main Card Container */}
      <div className="bg-surface-container-lowest auth-card rounded-xxl p-xl md:p-10 border border-outline-variant">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-xl">
          <div className="mb-md">
            <Logo size="sm" />
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">
            Set New Password
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant px-4">
            Your identity has been verified. Please choose a strong new
            password.
          </p>
        </div>

        {/* Form Section */}
        <form
          className="space-y-lg"
          id="passwordForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* New Password Field */}
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            placeholder="Min. 8 characters"
            disabled={isLoading || isSuccess}
            error={errors.newPassword?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-on-surface-variant hover:text-primary p-xs flex items-center focus:outline-none cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon={showNewPassword ? "visibility_off" : "visibility"}
                >
                  {showNewPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            }
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />

          {/* Password Security Rules Checklist */}
          <div className="bg-surface-container/60 p-md rounded-lg space-y-xs text-body-sm font-body-sm">
            <p className="text-on-surface-variant font-medium mb-xs">
              Password must contain:
            </p>
            <div className="flex items-center gap-xs">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isMinLength ? "text-emerald-600" : "text-outline"
                }`}
                data-icon={isMinLength ? "check_circle" : "circle"}
              >
                {isMinLength ? "check_circle" : "circle"}
              </span>
              <span
                className={
                  isMinLength ? "text-on-surface" : "text-on-surface-variant"
                }
              >
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-xs">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  hasAlphabet ? "text-emerald-600" : "text-outline"
                }`}
                data-icon={hasAlphabet ? "check_circle" : "circle"}
              >
                {hasAlphabet ? "check_circle" : "circle"}
              </span>
              <span
                className={
                  hasAlphabet ? "text-on-surface" : "text-on-surface-variant"
                }
              >
                At least one to four alphabet (A-Za-z)
              </span>
            </div>
            <div className="flex items-center gap-xs">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  hasNumber ? "text-emerald-600" : "text-outline"
                }`}
                data-icon={hasNumber ? "check_circle" : "circle"}
              >
                {hasNumber ? "check_circle" : "circle"}
              </span>
              <span
                className={
                  hasNumber ? "text-on-surface" : "text-on-surface-variant"
                }
              >
                At least 1 number (0-9)
              </span>
            </div>
            <div className="flex items-center gap-xs">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  hasSpecial ? "text-emerald-600" : "text-outline"
                }`}
                data-icon={hasSpecial ? "check_circle" : "circle"}
              >
                {hasSpecial ? "check_circle" : "circle"}
              </span>
              <span
                className={
                  hasSpecial ? "text-on-surface" : "text-on-surface-variant"
                }
              >
                At least 1 special character (!@#$)
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            placeholder="Re-enter password"
            disabled={isLoading || isSuccess}
            error={errors.confirmPassword?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-on-surface-variant hover:text-primary p-xs flex items-center focus:outline-none cursor-pointer"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon={
                    showConfirmPassword ? "visibility_off" : "visibility"
                  }
                >
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            }
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) =>
                val === newPasswordValue || "Passwords do not match",
            })}
          />

          {/* Match Status Indicator */}
          {confirmPasswordValue.length > 0 && (
            <div className="flex items-center gap-xs text-body-sm font-body-sm px-xs">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isMatch ? "text-emerald-600" : "text-error"
                }`}
              >
                {isMatch ? "check_circle" : "cancel"}
              </span>
              <span className={isMatch ? "text-emerald-700" : "text-error"}>
                {isMatch ? "Passwords match" : "Passwords do not match"}
              </span>
            </div>
          )}

          {errorMessage && (
            <p className="text-error text-label-sm font-medium text-center">
              {errorMessage}
            </p>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`w-full py-md px-lg rounded-lg font-title-md text-on-primary transition-all duration-200 flex items-center justify-center gap-sm cursor-pointer ${
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-primary hover:bg-primary-container"
            }`}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                Updating Password...
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  check_circle
                </span>
                Password Updated! Redirecting...
              </>
            ) : (
              <>
                Reset Password
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-xl text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary text-label-sm font-label-sm uppercase transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
            Back to Login
          </Link>
        </div>
      </div>

      {/* Footer Support Info */}
      <AuthFooter showLinks={false} />
    </AuthLayout>
  );
};

export default SetNewPasswordPage;
