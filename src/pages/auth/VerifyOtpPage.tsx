/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import useSnackbarStore from "../../store/useSnackbarStore";
import useAuthHook from "../../hooks/useAuthHook";

interface OtpFormInputs {
  digit0: string;
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
}

const OTP_LENGTH = 6;

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email & resetToken passed from previous screen
  const locationState = location.state as { email?: string; resetToken?: string } | undefined;
  const userEmail = locationState?.email || "";
  const initialResetToken = locationState?.resetToken || "";

  const [isVerified, setIsVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sent">("idle");
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOtp, resendOtp, isLoading, resetToken: hookResetToken } = useAuthHook();
  const { showSnackbar } = useSnackbarStore();

  const activeResetToken = initialResetToken || hookResetToken || "";

  const { register, handleSubmit, setValue, getValues, control } = useForm<OtpFormInputs>({
    defaultValues: {
      digit0: "",
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
    },
  });

  const formValues = useWatch({ control }) as OtpFormInputs;

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change & auto advance
  const handleDigitInput = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const fieldName = `digit${index}` as keyof OtpFormInputs;
    setValue(fieldName, digit);
    setErrorMessage("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard events (Backspace, Arrow keys)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const fieldName = `digit${index}` as keyof OtpFormInputs;
    const currentVal = formValues?.[fieldName] || getValues(fieldName);

    if (e.key === "Backspace") {
      if (!currentVal && index > 0) {
        const prevField = `digit${index - 1}` as keyof OtpFormInputs;
        setValue(prevField, "");
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, OTP_LENGTH);
    if (!pastedData) return;

    for (let i = 0; i < pastedData.length; i++) {
      const fieldName = `digit${i}` as keyof OtpFormInputs;
      setValue(fieldName, pastedData[i]);
    }
    setErrorMessage("");

    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  // Resend code logic
  const handleResendCode = async () => {
    if (resendStatus === "sent" || resendTimer > 0) return;

    try {
      await resendOtp({
        identifier: userEmail,
        resetToken: activeResetToken,
      });

      setResendStatus("sent");
      setResendTimer(30);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendStatus("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Error is alerted via snackbar
    }
  };

  // Form Submission
  const onSubmit = async (data: OtpFormInputs) => {
    const fullCode = Object.values(data).join("");
    if (fullCode.length < OTP_LENGTH) {
      const msg = "Please enter all 6 digits";
      setErrorMessage(msg);
      showSnackbar({ message: msg, type: "error" });
      return;
    }

    setErrorMessage("");

    try {
      const response = await verifyOtp({
        identifier: userEmail,
        resetToken: activeResetToken,
        otp: fullCode,
      });

      setIsVerified(true);

      // Navigate to Set New Password screen with updated resetToken
      setTimeout(() => {
        navigate("/set-new-password", {
          state: {
            email: userEmail,
            resetToken: response.resetToken || activeResetToken,
            verified: true,
          },
        });
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired OTP code."
      );
    }
  };

  return (
    <AuthLayout maxWidthClass="max-w-[480px]">
      {/* Verification Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-xl premium-card border border-outline-variant relative overflow-hidden">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-xl">
          <div className="mb-md">
            <Logo size="sm" />
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs tracking-tight">
            Verify OTP
          </h1>
          <p className="text-body-md text-on-surface-variant text-center max-w-70">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-on-surface">
              {userEmail || "your email address"}
            </span>.
          </p>
        </div>

        {/* OTP Input Section */}
        <form className="space-y-xl" onSubmit={handleSubmit(onSubmit)} id="otp-form">
          <div
            className="flex justify-between gap-xs sm:gap-sm"
            id="otp-container"
          >
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const fieldName = `digit${index}` as keyof OtpFormInputs;
              const { ref, onChange, ...restRegister } = register(fieldName, {
                required: true,
              });

              return (
                <Input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  disabled={isLoading || isVerified}
                  aria-label={`Digit ${index + 1} of 6`}
                  className="otp-input w-full h-16 text-center text-headline-md font-bold bg-surface rounded-lg border border-outline-variant transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  {...restRegister}
                  ref={(el) => {
                    ref(el);
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => {
                    onChange(e);
                    handleDigitInput(index, e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              );
            })}
          </div>

          {errorMessage && (
            <p className="text-error text-label-sm text-center font-medium animate-shake">
              {errorMessage}
            </p>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading || isVerified}
            className={`w-full text-on-primary py-md px-lg rounded-lg font-title-md transition-all duration-200 flex items-center justify-center gap-sm active:scale-[0.98] transform cursor-pointer ${
              isVerified
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
                Verifying...
              </>
            ) : isVerified ? (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                Verified
              </>
            ) : (
              <>
                Verify &amp; Proceed
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Secondary Actions */}
        <div className="mt-xl space-y-md text-center">
          <div className="flex items-center justify-center gap-xs">
            <span className="text-body-md text-on-surface-variant">
              Didn't receive code?
            </span>
            <button
              type="button"
              id="resend-btn"
              onClick={handleResendCode}
              disabled={resendStatus === "sent" || isLoading || isVerified}
              className={`font-title-md transition-all ${
                resendStatus === "sent"
                  ? "text-secondary cursor-not-allowed"
                  : "text-primary hover:underline decoration-2 underline-offset-4 cursor-pointer"
              }`}
            >
              {resendStatus === "sent"
                ? `Sent! (${resendTimer}s)`
                : "Resend Code"}
            </button>
          </div>

          <hr className="border-outline-variant mx-lg" />

          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary text-label-sm font-label-sm uppercase transition-colors duration-200 group"
          >
            <span
              className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform"
              data-icon="chevron_left"
            >
              chevron_left
            </span>
            Back to Forgot Password
          </Link>
        </div>

        {/* Visual Decorative Elements */}
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Footer Help */}
      <footer className="mt-xl text-center">
        <p className="text-label-sm text-on-surface-variant">
          Need help? Contact{" "}
          <a
            href="#"
            className="text-on-surface font-medium underline underline-offset-2 hover:text-primary transition-colors"
          >
            Support Team
          </a>
        </p>
      </footer>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
