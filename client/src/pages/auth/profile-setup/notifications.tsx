import { useState } from "react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { useProfileSetup } from "@/lib/profile-setup-context";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsSetup() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { state: setupPrefs } = useProfileSetup();
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    matchesNearMe: true,
    scoreUpdates: true,
    communityPolls: true,
    weeklyDigest: true,
  });

  const handleComplete = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please log in first", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    // For demo users, skip saving to database and go directly to home
    if (user.id === "demo-user") {
      toast({ title: "Welcome!", description: "Profile setup complete!" });
      setLocation("/home");
      setLoading(false);
      return;
    }

    try {
      await api.preferences.save({
        userId: user.id,
        locationEnabled: setupPrefs.locationEnabled,
        selectedContinent: setupPrefs.selectedContinents[0] || null,
        favoriteLeagues: setupPrefs.selectedLeagues,
        favoriteTeams: setupPrefs.selectedTeams,
        notificationsEnabled: prefs.matchesNearMe,
        scoreUpdatesEnabled: prefs.scoreUpdates,
        communityPollsEnabled: prefs.communityPolls,
        weeklyDigestEnabled: prefs.weeklyDigest,
      });
      toast({ title: "Success", description: "Profile setup complete!" });
      setLocation("/home");
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save preferences", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2d5c] to-[#0f1d3d] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 font-display">Notifications</h1>
          <p className="text-sm text-white/70">Choose which notifications you'd like to receive.</p>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold text-white text-sm">New Matches near me</p>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, matchesNearMe: !p.matchesNearMe }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.matchesNearMe ? 'bg-green-500' : 'bg-white/30'}`}
              data-testid="toggle-matches"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.matchesNearMe ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold text-white text-sm">Score updates for my teams</p>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, scoreUpdates: !p.scoreUpdates }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.scoreUpdates ? 'bg-green-500' : 'bg-white/30'}`}
              data-testid="toggle-scores"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.scoreUpdates ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold text-white text-sm">Community polls & events</p>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, communityPolls: !p.communityPolls }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.communityPolls ? 'bg-green-500' : 'bg-white/30'}`}
              data-testid="toggle-community"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.communityPolls ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold text-white text-sm">Weekly Digest</p>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.weeklyDigest ? 'bg-green-500' : 'bg-white/30'}`}
              data-testid="toggle-digest"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.weeklyDigest ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="w-full py-4 bg-white text-[#1a2d5c] font-bold rounded-full transition-all duration-200 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-complete"
        >
          {loading ? "Saving..." : "Continue to App"}
        </button>
        <button
          onClick={() => setLocation("/home")}
          className="w-full py-3 text-white/70 font-medium text-sm hover:text-white transition-colors"
          data-testid="button-skip"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
