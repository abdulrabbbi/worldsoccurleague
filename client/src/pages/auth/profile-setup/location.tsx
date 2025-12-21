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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-lg p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/10 rounded-full">
          <MapPin className="w-12 h-12 text-accent" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Enable Location</h2>
          <p className="text-sm text-muted-foreground">
            Enable location to find nearby matches, leagues, events and local soccer communities.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAllow}
            className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors"
            data-testid="button-allow-location"
          >
            Allow
          </button>
          <button
            onClick={handleMayBeLater}
            className="w-full h-12 border-2 border-sidebar text-sidebar font-bold rounded-full hover:bg-sidebar/5 transition-colors"
            data-testid="button-maybe-later"
          >
            May be later
          </button>
        </div>
      </div>
    </div>
  );
}
