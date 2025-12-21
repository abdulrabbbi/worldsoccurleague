import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";

// Mock league data based on screenshots
const LEAGUES_DATA = [
  { id: "l-mls", name: "MLS", icon: "⚽" },
  { id: "l-usl-c", name: "USL Championship", icon: "⭐" },
  { id: "l-usl-1", name: "USL League One", icon: "1️⃣" },
  { id: "l-usl-2", name: "USL League Two", icon: "2️⃣" },
  { id: "l-nisa", name: "NISA", icon: "🏆" },
  { id: "l-npsl", name: "NPSL", icon: "🛡️" },
  { id: "l-upsl", name: "UPSL", icon: "📍" },
  { id: "l-mls-next", name: "MLS Next Pro", icon: "⏭️" },
  { id: "l-wpsl", name: "WPSL", icon: "👩" },
  { id: "l-uws", name: "UWS", icon: "👟" },
];

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>(["l-mls"]); 

  const toggleLeague = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setLocation("/auth/profile-setup/national-team");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setLocation("/auth/profile-setup/continent")}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 font-medium text-sm"
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
          Select favourite leagues
        </button>
        <button
          onClick={handleNext}
          className="bg-[#1a2d5c] hover:bg-[#152347] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm"
          data-testid="button-next"
        >
          Next
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
          data-testid="input-search"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Leagues List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {LEAGUES_DATA.map((league) => (
          <button
            key={league.id}
            onClick={() => toggleLeague(league.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left shadow-sm ${
              selected.includes(league.id)
                ? "bg-[#1a2d5c]/5 border-[#1a2d5c]"
                : "bg-white border-slate-100 hover:border-slate-300"
            }`}
            data-testid={`league-${league.id}`}
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              {league.icon}
            </div>
            <span className="font-semibold text-slate-900 flex-1">{league.name}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected.includes(league.id)
                ? "bg-[#1a2d5c] border-[#1a2d5c]"
                : "border-slate-300"
            }`}>
              {selected.includes(league.id) && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
          </button>
        ))}
        
        {/* Placeholder for "all other pro and semi-pro leagues" */}
        <button
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white text-left shadow-sm text-slate-500"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 font-bold text-sm">
              1
            </div>
            <span className="font-medium flex-1">(all other pro and semi-pro leagues)</span>
        </button>
      </div>
    </div>
  );
}
