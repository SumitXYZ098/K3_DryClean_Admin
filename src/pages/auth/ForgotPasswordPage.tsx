import type React from "react";
import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "./AuthLayout";
import AuthCard from "../../components/common/AuthCard";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [headingText, setHeadingText] = useState("Forgot Password?");
  const [subText, setSubText] = useState(
    "Enter your email address and we'll send you a link to reset your password.",
  );

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate password reset API request
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setHeadingText("Check your inbox");
      setSubText(
        `We've sent a password reset link to ${email}. Please check your spam folder if you don't see it.`,
      );
    }, 1500);
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
        <form
          className={`w-full space-y-lg ${
            isSent ? "opacity-60 pointer-events-none" : ""
          }`}
          onSubmit={handleResetRequest}
        >
          {/* Email Input */}
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="name@k3drycleaning.com"
            leftIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSent}
            autoFocus
          />

          {/* Primary Action Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Sending..."
            disabled={isSent}
            variant={isSent ? "success" : "primary"}
            rightIcon={!isSent && !isLoading ? "arrow_forward" : undefined}
            leftIcon={isSent ? "check_circle" : undefined}
            className={
              isSent ? "btn-k3-primary bg-emerald-600" : "btn-k3-primary"
            }
          >
            {isSent ? "Link Sent!" : "Send Reset Link"}
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
      <p className="mt-xl text-center font-label-sm text-label-sm text-on-surface-variant/60">
        © 2024 K3 Dry Cleaning. Enterprise Suite v4.2
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
