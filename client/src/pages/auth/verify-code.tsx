import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export default function VerifyCode() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      setVerified(true);
      // Wait a bit then redirect to profile setup
      setTimeout(() => setLocation("/auth/profile-setup/location"), 1500);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border-2 border-[#1a2d5c]">
            <CheckCircle2 className="w-10 h-10 text-[#1a2d5c]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-2 font-display">Account Created</h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Nice work! Your account's active — finish this last step to start your journey to better soccer!
          </p>
          <button
            onClick={() => setLocation("/auth/profile-setup/location")}
            className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-1 font-display">Verify with Code</h1>
          <p className="text-slate-500 text-sm">We have sent you a verification code on your email address. Check your mail</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Code Bubbles */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-full text-xl font-bold text-[#1a2d5c] bg-slate-50"
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
            autoFocus
            data-testid="input-verification-code"
          />

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCode(prev => (prev + num).slice(0, 6))}
                className="h-12 rounded-lg font-medium text-slate-900 hover:bg-slate-100 transition-colors text-lg"
              >
                {num}
              </button>
            ))}
             <div className="col-start-2">
              <button
                type="button"
                onClick={() => setCode(prev => (prev + "0").slice(0, 6))}
                className="w-full h-12 rounded-lg font-medium text-slate-900 hover:bg-slate-100 transition-colors text-lg"
              >
                0
              </button>
             </div>
             <div className="col-start-3">
              <button
                type="button"
                onClick={() => setCode(prev => prev.slice(0, -1))}
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
      </div>
    </div>
  );
}
