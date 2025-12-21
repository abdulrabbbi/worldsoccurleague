import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, ArrowLeft } from "lucide-react";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep("otp");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) setStep("reset");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      // Mock reset
      setLocation("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24">
            <img src={logoUrl} alt="World Soccer Leagues" className="w-full h-full object-contain" data-testid="img-logo" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-1 font-display">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify with Code"}
            {step === "reset" && "Reset your password"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === "email" && "Please enter the email address you used while registration."}
            {step === "otp" && "We have sent you a verification code on your email address. Check your mail"}
            {step === "reset" && "Please create your new password."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                  data-testid="input-email"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm mt-4"
              data-testid="button-send-otp"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-full text-xl font-bold text-[#1a2d5c] bg-slate-50"
                >
                  {otp[i] || ""}
                </div>
              ))}
            </div>
            
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              className="sr-only"
              autoFocus
              data-testid="input-otp"
            />

            {/* Simulated Numpad for visual match, or just use input */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setOtp(prev => (prev + num).slice(0, 6))}
                  className="h-12 rounded-lg font-medium text-slate-900 hover:bg-slate-100 transition-colors text-lg"
                >
                  {num}
                </button>
              ))}
               <div className="col-start-2">
                <button
                  type="button"
                  onClick={() => setOtp(prev => (prev + "0").slice(0, 6))}
                  className="w-full h-12 rounded-lg font-medium text-slate-900 hover:bg-slate-100 transition-colors text-lg"
                >
                  0
                </button>
               </div>
               <div className="col-start-3">
                <button
                  type="button"
                  onClick={() => setOtp(prev => prev.slice(0, -1))}
                  className="w-full h-12 rounded-lg font-medium text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center"
                >
                  ⌫
                </button>
               </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm"
              data-testid="button-verify"
            >
              Verify
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Create new password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Test.19970"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-new-password"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Test.19970"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-confirm-password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm mt-4"
              data-testid="button-confirm"
            >
              Confirm
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
