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
    <div className="min-h-screen bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm fixed inset-0 z-50">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a2d5c] mb-2 font-display">Notifications</h1>
          <p className="text-sm text-slate-500">Choose which notifications you'd like to receive.</p>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 text-sm">New Matches near me</p>
            </div>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, matchesNearMe: !p.matchesNearMe }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.matchesNearMe ? 'bg-[#1a2d5c]' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.matchesNearMe ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 text-sm">Score updates for my teams</p>
            </div>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, scoreUpdates: !p.scoreUpdates }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.scoreUpdates ? 'bg-[#1a2d5c]' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.scoreUpdates ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 text-sm">Community polls & fan events</p>
            </div>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, communityPolls: !p.communityPolls }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.communityPolls ? 'bg-[#1a2d5c]' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.communityPolls ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 text-sm">Weekly Digest</p>
            </div>
            <div 
              onClick={() => setPrefs((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${prefs.weeklyDigest ? 'bg-[#1a2d5c]' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${prefs.weeklyDigest ? 'left-[26px]' : 'left-0.5'}`} />
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleComplete}
          disabled={loading}
          className="w-full py-4 bg-[#1a2d5c] hover:bg-[#152347] text-white font-bold rounded-full transition-all duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-complete"
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
