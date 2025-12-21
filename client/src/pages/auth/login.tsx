import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Mock login - go to profile setup
    setLocation("/auth/profile-setup/continent");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sidebar rounded-lg mb-4 shadow-lg">
            <div className="font-display font-bold text-2xl text-white">
              WSL
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Login to find the soccer near you.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email address"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="input-email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm font-medium text-center">{error}</div>
          )}

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setLocation("/auth/forgot-password")}
              className="text-destructive text-sm font-medium hover:underline"
              data-testid="link-forgot-password"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors duration-200 uppercase tracking-wide text-sm"
            data-testid="button-login"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an Account?{" "}
          <button
            onClick={() => setLocation("/auth/signup")}
            className="text-accent font-bold hover:underline"
            data-testid="link-signup"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
