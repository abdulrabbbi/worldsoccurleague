import { useState } from "react";
import { useLocation } from "wouter";
import logoUrl from "@assets/generated_images/wsl_soccer_player_silhouette_split_red-navy_logo.png";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      setStep("reset");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setLocation("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-24 mb-6">
            <img src={logoUrl} alt="World Soccer Leagues" className="w-full h-full object-contain" data-testid="img-logo" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify with Code"}
            {step === "reset" && "Reset your password"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === "email" && "Enter the email address you used while registration."}
            {step === "otp" && "We have sent you a verification code on your email address. Check your mail"}
            {step === "reset" && "Please create your new password."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-email"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors"
              data-testid="button-send-otp"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-center font-mono text-2xl tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-otp"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors"
              data-testid="button-verify-otp"
            >
              Verify
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Create new password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Test.19970"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-new-password"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Test.19970"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-confirm-password"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors"
              data-testid="button-confirm"
            >
              Confirm
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => setLocation("/auth/login")}
            className="text-muted-foreground text-sm hover:text-foreground"
            data-testid="link-back"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
