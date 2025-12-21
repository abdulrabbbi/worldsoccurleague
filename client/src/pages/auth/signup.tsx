import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sidebar rounded-lg mb-4 shadow-lg">
            <div className="font-display font-bold text-2xl text-white">
              WSL
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm">Join the global soccer community.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="input-fullname"
            />
          </div>

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
            <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wide">Create password</label>
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

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors duration-200 uppercase tracking-wide text-sm"
            data-testid="button-create-account"
          >
            Create account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Already a user?{" "}
          <button
            onClick={() => setLocation("/auth/login")}
            className="text-accent font-bold hover:underline"
            data-testid="link-login"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
