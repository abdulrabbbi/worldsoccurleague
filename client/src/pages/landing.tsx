import { Link } from "wouter";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2d5c] via-[#2a4a8c] to-[#C1153D] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-4">
            <img 
              src={logoUrl} 
              alt="World Soccer Leagues" 
              className="h-24 w-auto mx-auto drop-shadow-lg"
              data-testid="img-logo-landing"
            />
            <h1 className="text-3xl font-bold text-white font-display">
              World Soccer Leagues
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Your gateway to global soccer - from professional leagues to grassroots pickup games. Follow your favorite teams, discover local matches, and connect with fans worldwide.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/auth/signup">
              <button 
                className="w-full py-4 bg-white text-[#1a2d5c] font-bold rounded-full text-sm shadow-lg hover:bg-gray-100 transition-all"
                data-testid="button-get-started"
              >
                Get Started
              </button>
            </Link>
            
            <Link href="/auth/login">
              <button 
                className="w-full py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-sm hover:bg-white/10 transition-all"
                data-testid="button-login"
              >
                I already have an account
              </button>
            </Link>
          </div>

          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-white/50 text-xs">Featured Leagues</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">🏟️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-white/40 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
