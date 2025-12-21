import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";
import logoUrl from "@assets/generated_images/world_soccer_leagues_logo_with_globe.png";

export default function VerifyCode() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      setVerified(true);
      setTimeout(() => setLocation("/auth/profile-setup/location"), 1500);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Account Created</h1>
          <p className="text-muted-foreground mb-8">
            Nice work! Your account's active — finish this last step to start your journey to better soccer!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src={logoUrl} alt="World Soccer Leagues" className="w-full h-full object-contain" data-testid="img-logo" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Verify with Code</h1>
          <p className="text-muted-foreground text-sm">We have sent you a verification code on your email address. Check your mail</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Code Input */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-14 h-14 flex items-center justify-center border-2 border-border rounded-full text-2xl font-bold text-foreground bg-card"
              >
                {code[i] || ""}
              </div>
            ))}
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.slice(0, 6))}
            maxLength={6}
            className="sr-only"
            data-testid="input-verification-code"
            autoFocus
          />

          {/* Virtual Keyboard */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCode(code + num)}
                  className="h-12 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCode(code + "0")}
                className="h-12 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors col-span-3"
              >
                0
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors uppercase tracking-wide text-sm"
            data-testid="button-verify"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
