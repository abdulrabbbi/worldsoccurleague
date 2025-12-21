import { useLocation } from "wouter";
import { MapPin } from "lucide-react";

export default function LocationSetup() {
  const [, setLocation] = useLocation();

  const handleAllow = () => {
    setLocation("/auth/profile-setup/continent");
  };

  const handleMayBeLater = () => {
    setLocation("/auth/profile-setup/continent");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <div className="w-32 h-32 relative">
             {/* Map Icon Graphic Placeholder */}
             <div className="absolute inset-0 bg-slate-100 rounded-full animate-pulse opacity-20"></div>
             <div className="absolute inset-4 bg-slate-100 rounded-full animate-pulse opacity-40"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-[#C1153D]" fill="#C1153D" />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1a2d5c] font-display">Enable Location</h2>
          <p className="text-sm text-slate-500 leading-relaxed px-4">
            Enable location to find nearby matches, leagues, events and local soccer communities.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <button
            onClick={handleAllow}
            className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-md"
            data-testid="button-allow-location"
          >
            Allow
          </button>
          <button
            onClick={handleMayBeLater}
            className="w-full py-4 bg-white text-[#1a2d5c] font-bold rounded-full hover:bg-slate-50 transition-colors text-sm"
            data-testid="button-maybe-later"
          >
            May be later
          </button>
        </div>
      </div>
    </div>
  );
}
