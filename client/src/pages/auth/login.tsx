import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail } from "lucide-react";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ 
        title: "Error", 
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { user } = await api.auth.login(email, password);
      setUser(user);
      toast({ title: "Success", description: "Logged in successfully!" });
      setLocation("/home");
    } catch (error) {
      toast({ 
        title: "Login failed", 
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-1 font-display">Login to your account</h1>
          <p className="text-slate-500 text-sm">Login to find the soccer near you.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
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
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setLocation("/auth/forgot-password")}
                className="text-[#C1153D] text-xs font-medium hover:underline"
                data-testid="link-forgot-password"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8 text-sm text-slate-500 font-medium">
          Don't have an Account?{" "}
          <button
            onClick={() => setLocation("/auth/signup")}
            className="text-[#C1153D] font-bold hover:underline"
            data-testid="link-signup"
          >
            Register
          </button>
        </div>

        {/* Dev Mode Skip */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setUser({ id: "test-user-1", email: "test@test.com", name: "Test User", createdAt: new Date() } as any);
              setLocation("/home");
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
            data-testid="button-skip-dev"
          >
            [Dev] Skip to Home
          </button>
        </div>
      </div>
    </div>
  );
}
