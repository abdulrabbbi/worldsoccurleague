import { useLocation } from "wouter";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export default function IntroSetup() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/auth/profile-setup/continent");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="w-32 h-32 mb-8">
          <img 
            src={logoUrl} 
            alt="World Soccer Leagues" 
            className="w-full h-full object-contain" 
            data-testid="img-logo" 
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[#1a2d5c] font-display mb-6">
          Let's Build Your<br />Soccer World
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-8 px-2">
          Select your favorite teams and leagues from national powerhouses to your local pick-up squads. This helps us tailor your feed with match updates, standings, events, and more, all based on your location and interests. Whether you're into National, International, MLS, USL, college, high school, youth, or pick up leagues, we've got you covered. Simply select your preferred leagues on the left, and then pick your favorite teams on the right.
        </p>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm"
          data-testid="button-next"
        >
          Next
        </button>
      </div>
    </div>
  );
}
