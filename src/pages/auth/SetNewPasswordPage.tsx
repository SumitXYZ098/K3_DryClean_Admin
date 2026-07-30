import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import AuthFooter from "../../components/common/AuthFooter";
import useLoadingStore from "../../store/useLoadingStore";
import useSnackbarStore from "../../store/useSnackbarStore";

interface SetNewPasswordInputs {
  newPassword: string;
  confirmPassword: string;
}

export const SetNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

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
  const confirmPasswordValue = useWatch({ control, name: "confirmPassword" }) || "";

  // Validation rules for security requirements display
  const isMinLength = newPasswordValue.length >= 8;
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPasswordValue);
  const isMatch =
    confirmPasswordValue.length > 0 && confirmPasswordValue === newPasswordValue;

  const onSubmit = (data: SetNewPasswordInputs) => {
    console.log("Password reset data:", data);
    if (!isMinLength || !hasNumber || !hasSpecial) {
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

    setIsLoading(true);
    setErrorMessage("");
    showLoading("Updating your password...");

    // Simulate password reset API request
    setTimeout(() => {
      hideLoading();
      setIsLoading(false);
      setIsSuccess(true);

      showSnackbar({
        message: "Password updated successfully! Redirecting to login...",
        type: "success",
      });

      // Redirect to login after success state
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password updated successfully! Please log in with your new credentials.",
          },
        });
      }, 1500);
    }, 1500);
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
        <form className="space-y-lg" id="passwordForm" onSubmit={handleSubmit(onSubmit)}>
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
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              validate: {
                hasNumber: (val) =>
                  /[0-9]/.test(val) || "Password must contain at least one number",
                hasSpecial: (val) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
                  "Password must contain at least one special character",
              },
            })}
          />

          {/* Re-enter Password Field */}
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            label="Re-enter Password"
            placeholder="Repeat password"
            disabled={isLoading || isSuccess}
            error={
              errors.confirmPassword?.message ||
              (confirmPasswordValue && !isMatch ? "Passwords do not match" : undefined)
            }
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

          {/* Security Requirements Checklist */}
          <div className="bg-surface p-md rounded-lg border border-outline-variant/30">
            <p className="text-label-sm font-label-sm text-secondary mb-sm uppercase tracking-tight">
              Security Requirements
            </p>
            <ul className="space-y-xs">
              <li
                id="req-length"
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  isMinLength
                    ? "text-primary font-medium"
                    : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-all"
                  style={{
                    fontVariationSettings: isMinLength
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="font-label-sm text-label-sm">
                  8+ characters
                </span>
              </li>

              <li
                id="req-number"
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  hasNumber
                    ? "text-primary font-medium"
                    : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-all"
                  style={{
                    fontVariationSettings: hasNumber ? "'FILL' 1" : "'FILL' 0",
                  }}
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="font-label-sm text-label-sm">
                  At least one number
                </span>
              </li>

              <li
                id="req-special"
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  hasSpecial
                    ? "text-primary font-medium"
                    : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-all"
                  style={{
                    fontVariationSettings: hasSpecial ? "'FILL' 1" : "'FILL' 0",
                  }}
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="font-label-sm text-label-sm">
                  One special character
                </span>
              </li>
            </ul>
          </div>

          {errorMessage && (
            <p className="text-error text-label-sm text-center font-medium">
              {errorMessage}
            </p>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`w-full text-on-primary font-title-md text-title-md py-md rounded-lg shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary-container"
            }`}
          >
            {isLoading ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin text-[20px]"
                  data-icon="progress_activity"
                >
                  progress_activity
                </span>
                Resetting Password...
              </>
            ) : isSuccess ? (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                Password Reset!
              </>
            ) : (
              <>
                Reset Password
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </>
            )}
          </button>

          <div className="pt-sm text-center">
            <Link
              to="/login"
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 decoration-1 decoration-outline-variant hover:underline"
            >
              Need help? Contact system administrator
            </Link>
          </div>
        </form>
      </div>

      {/* Secondary Footer Links */}
      <AuthFooter showLinks={false} />
    </AuthLayout>
  );
};

export default SetNewPasswordPage;
