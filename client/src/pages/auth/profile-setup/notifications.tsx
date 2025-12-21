import { useState } from "react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSetup() {
  const [, setLocation] = useLocation();
  const [prefs, setPrefs] = useState({
    matchesNearMe: true,
    scoreUpdates: true,
    communityPolls: true,
    weeklyDigest: true,
  });

  const handleComplete = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">Notifications</h1>
          <p className="text-sm text-muted-foreground">Choose which notifications you'd like to receive.</p>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">New Matches near me</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.matchesNearMe}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, matchesNearMe: e.target.checked }))
              }
              className="w-5 h-5 accent-primary cursor-pointer"
              data-testid="toggle-matches-near-me"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">Score updates for my teams</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.scoreUpdates}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, scoreUpdates: e.target.checked }))
              }
              className="w-5 h-5 accent-primary cursor-pointer"
              data-testid="toggle-score-updates"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">Community polls & fan events</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.communityPolls}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, communityPolls: e.target.checked }))
              }
              className="w-5 h-5 accent-primary cursor-pointer"
              data-testid="toggle-community-polls"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">Weekly Digest</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.weeklyDigest}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, weeklyDigest: e.target.checked }))
              }
              className="w-5 h-5 accent-primary cursor-pointer"
              data-testid="toggle-weekly-digest"
            />
          </div>
        </div>

        {/* Complete Button */}
        <button
          onClick={handleComplete}
          className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-white font-bold rounded-full transition-colors uppercase tracking-wide text-sm"
          data-testid="button-complete"
        >
          Complete
        </button>
      </div>
    </div>
  );
}
