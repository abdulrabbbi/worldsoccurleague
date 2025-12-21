import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Mock signup - go to OTP verification
    setLocation("/auth/verify-code");
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
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-1 font-display">Login to your account</h1>
          <p className="text-slate-500 text-sm">Login to find the soccer near you.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="enter your full name"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-fullname"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Email address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email address"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-email"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
            </div>
          </div>

          {/* Phone Number (Added based on IMG_4793 second screen) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Phone number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="enter your phone number"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-phone"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={18} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Create password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-[#C1153D] text-sm font-medium text-center">{error}</div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm mt-4"
            data-testid="button-create-account"
          >
            Create account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 text-sm text-slate-500 font-medium">
          Already a user?{" "}
          <button
            onClick={() => setLocation("/auth/login")}
            className="text-[#C1153D] font-bold hover:underline"
            data-testid="link-login"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
