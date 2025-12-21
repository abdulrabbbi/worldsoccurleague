import { useState } from "react";
import { useLocation } from "wouter";

// Mock teams data
const TEAMS_DATA = [
  { id: "t-usa", name: "USA National Team", icon: "🇺🇸" },
  { id: "t-mex", name: "Mexico National Team", icon: "🇲🇽" },
  { id: "t-can", name: "Canada National Team", icon: "🇨🇦" },
];

export default function NationalTeamSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string>("");

  const handleNext = () => {
    setLocation("/auth/profile-setup/notifications");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setLocation("/auth/profile-setup/leagues")}
            className="text-muted-foreground hover:text-foreground text-sm"
            data-testid="button-back"
          >
            ← Select favourite national Team
          </button>
          <button
            onClick={handleNext}
            className="bg-sidebar hover:bg-sidebar/90 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
            data-testid="button-next"
          >
            Next
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-search"
          />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {TEAMS_DATA.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelected(team.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selected === team.id
                  ? "bg-primary/5 border-primary"
                  : "bg-background border-border hover:border-primary/30"
              }`}
              data-testid={`team-${team.id}`}
            >
              <span className="text-3xl">{team.icon}</span>
              <span className="text-xs font-medium text-foreground text-center">{team.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
