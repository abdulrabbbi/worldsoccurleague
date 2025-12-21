import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

// Mock teams data for National Teams
const TEAMS_DATA = [
  { id: "t-charlotte", name: "Charlotte FC", icon: "👑" },
  { id: "t-dc", name: "D.C. United", icon: "🦅" },
  { id: "t-miami", name: "Inter Miami", icon: "🦩" },
  { id: "t-nashville", name: "Nashville SC", icon: "🎸" },
  { id: "t-ny", name: "NY Red Bulls", icon: "🐂" },
  { id: "t-orlando", name: "Orlando City", icon: "🦁" },
  { id: "t-toronto", name: "Toronto FC", icon: "🍁" },
  { id: "t-austin", name: "Austin FC", icon: "🌳" },
];

export default function NationalTeamSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTeam = (id: string) => {
    setSelected((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setLocation("/auth/profile-setup/notifications");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setLocation("/auth/profile-setup/leagues")}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 font-medium text-sm"
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
          Select favourite national Team
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

      {/* Sidebar + Grid Layout (Simulated for Mobile) */}
      <div className="flex gap-4 h-full">
        {/* Categories Sidebar */}
        <div className="w-16 flex flex-col gap-4 text-xs font-semibold text-slate-400 pt-2 border-r border-slate-100 pr-2">
          <div className="text-[#1a2d5c] border-l-2 border-[#1a2d5c] pl-2">MLS</div>
          <div className="pl-2">USL</div>
          <div className="pl-2">USL 1</div>
          <div className="pl-2">USL 2</div>
          <div className="pl-2">College</div>
          <div className="pl-2">MSL</div>
          <div className="pl-2">UPSL</div>
        </div>

        {/* Teams Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto content-start">
          {TEAMS_DATA.map((team) => (
            <div key={team.id} className="flex flex-col gap-2">
              <button
                onClick={() => toggleTeam(team.id)}
                className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 p-2 ${
                  selected.includes(team.id)
                    ? "bg-slate-100 border-[#1a2d5c]"
                    : "bg-white border-slate-100 hover:border-slate-300"
                }`}
                data-testid={`team-${team.id}`}
              >
                <span className="text-4xl">{team.icon}</span>
              </button>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900 block">{team.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleTeam(team.id); }}
                  className={`text-[10px] px-3 py-1 rounded-full border mt-1 ${
                    selected.includes(team.id)
                      ? "bg-[#1a2d5c] text-white border-[#1a2d5c]"
                      : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {selected.includes(team.id) ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
