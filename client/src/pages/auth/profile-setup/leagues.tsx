import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/mock-data";
import { Check } from "lucide-react";

// Mock league data with logos (in real app this comes from API)
const LEAGUES_WITH_LOGOS = [
  { id: "l-pl", name: "MLS", icon: "⚽" },
  { id: "l-ll", name: "USL Championship", icon: "⭐" },
  { id: "l-bl", name: "USL League One", icon: "1️⃣" },
  { id: "l-mls", name: "USL League Two", icon: "2️⃣" },
  { id: "l-usl", name: "NISA", icon: "🏆" },
  { id: "l-ncaa", name: "NPSL", icon: "🎓" },
  { id: "l-upsl", name: "UPSL", icon: "📍" },
];

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>(["l-pl"]); // MLS pre-selected

  const toggleLeague = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setLocation("/auth/profile-setup/national-team");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setLocation("/auth/profile-setup/continent")}
            className="text-muted-foreground hover:text-foreground text-sm"
            data-testid="button-back"
          >
            ← Select favourite leagues
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

        {/* Leagues List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {LEAGUES_WITH_LOGOS.map((league) => (
            <button
              key={league.id}
              onClick={() => toggleLeague(league.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all border-2 ${
                selected.includes(league.id)
                  ? "bg-primary/5 border-primary"
                  : "bg-background border-border hover:border-primary/30"
              }`}
              data-testid={`league-${league.id}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selected.includes(league.id)
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}>
                {selected.includes(league.id) && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <span className="text-lg">{league.icon}</span>
              <span className="font-medium text-foreground flex-1 text-left">{league.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
