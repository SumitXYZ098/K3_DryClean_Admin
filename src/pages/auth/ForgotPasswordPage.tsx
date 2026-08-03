import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import AuthCard from "../../components/common/AuthCard";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthFooter from "../../components/common/AuthFooter";
import useAuthHook from "../../hooks/useAuthHook";

interface ForgotPasswordInputs {
  email: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const [headingText, setHeadingText] = useState("Forgot Password?");
  const [subText, setSubText] = useState(
    "Enter your email address and we'll send you a link to reset your password.",
  );

  const { forgotPassword, isLoading } = useAuthHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    const userEmail = data.email;

    try {
      const response = await forgotPassword({ identifier: userEmail });
      setIsSent(true);
      setHeadingText("Check your inbox");
      setSubText(
        `We've sent a 6-digit verification code to ${userEmail}. Please enter the code to proceed.`,
      );

      // Auto navigate to verify-otp page after short delay passing email & resetToken
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: userEmail, resetToken: response.resetToken },
        });
      }, 1200);
    } catch {
      // Handled in hook error handler
    }
  };

  return (
    <AuthLayout maxWidthClass="max-w-[440px]">
      <AuthCard className="flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-xl">
          <Logo size="sm" />
        </div>

        {/* Heading Section */}
        <div className="text-center mb-xl w-full">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">
            {headingText}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant px-sm">
            {subText}
          </p>
        </div>

        {/* Forgot Password Form */}
        <form className="w-full space-y-lg" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@k3drycleaning.com"
            leftIcon="mail"
            disabled={isSent || isLoading}
            autoFocus
            error={errors.email?.message}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
          />

          {/* Primary Action Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Sending Code..."
            disabled={isSent}
            variant={isSent ? "success" : "primary"}
            rightIcon={!isSent && !isLoading ? "arrow_forward" : undefined}
            leftIcon={isSent ? "check_circle" : undefined}
            className={
              isSent ? "btn-k3-primary bg-emerald-600" : "btn-k3-primary"
            }
          >
            {isSent ? "Code Sent! Redirecting..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Secondary Action / Back to Login */}
        <div className="mt-xl text-center w-full">
          <Link
            to="/login"
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary inline-flex items-center justify-center gap-xs transition-colors"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              data-icon="chevron_left"
            >
              chevron_left
            </span>
            Back to Login
          </Link>
        </div>
      </AuthCard>

      {/* Footer Support Info */}
      <AuthFooter showLinks={false} />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
