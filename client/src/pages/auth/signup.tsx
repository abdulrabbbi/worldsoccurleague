import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import logoUrl from "@assets/generated_images/wsl_soccer_player_silhouette_split_red-navy_logo.png";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-24 mb-6">
            <img src={logoUrl} alt="World Soccer Leagues" className="w-full h-full object-contain" data-testid="img-logo" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">CREATE ACCOUNT</h1>
          <p className="text-slate-600 text-sm">Join the global soccer community</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              data-testid="input-fullname"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              data-testid="input-email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-rose-600 text-sm font-medium text-center">{error}</div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-lg transition-all duration-200 uppercase tracking-wider text-sm shadow-md hover:shadow-lg"
            data-testid="button-create-account"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => setLocation("/auth/login")}
            className="text-rose-600 font-bold hover:underline"
            data-testid="link-login"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
