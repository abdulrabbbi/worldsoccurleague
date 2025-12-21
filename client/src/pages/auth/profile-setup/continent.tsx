import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Globe, Check } from "lucide-react";

const CONTINENTS = [
  { id: "usa", name: "USA Soccer Leagues", slug: "usa" },
  { id: "euro", name: "Euro Soccer Leagues", slug: "europe" },
  { id: "africa", name: "Africa Soccer Leagues", slug: "africa" },
  { id: "asia", name: "Asia Soccer Leagues", slug: "asia" },
  { id: "latino", name: "Latino Soccer Leagues", slug: "south-america" },
  { id: "aussie", name: "Aussie Soccer Leagues", slug: "oceania" },
];

export default function ContinentSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>(["usa"]);

  const toggleContinent = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setLocation("/auth/profile-setup/intro")}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 font-medium text-sm"
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
          Choose Continents
        </button>
        <button
          onClick={() => setLocation("/auth/profile-setup/leagues")}
          className="bg-[#1a2d5c] hover:bg-[#152347] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm"
          data-testid="button-next"
        >
          Next
        </button>
      </div>

      {/* Selection hint */}
      <p className="text-xs text-slate-500 mb-4">Select one or more regions to follow</p>

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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">World Soccer Leagues</h3>
          {selected.length > 0 && (
            <span className="text-xs text-[#1a2d5c] font-medium">{selected.length} selected</span>
          )}
        </div>
        <div className="space-y-3">
          {CONTINENTS.map((continent) => {
            const isSelected = selected.includes(continent.id);
            return (
              <button
                key={continent.id}
                onClick={() => toggleContinent(continent.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left shadow-sm ${
                  isSelected 
                    ? "bg-slate-200/60 border-[#1a2d5c]/20" 
                    : "bg-white border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50"
                }`}
                data-testid={`continent-${continent.id}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl text-[#1a2d5c]">
                  <Globe className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className={`flex-1 font-medium ${isSelected ? "text-[#1a2d5c]" : "text-slate-800"}`}>
                  {continent.name}
                </span>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected ? "border-[#1a2d5c] bg-[#1a2d5c]" : "border-slate-300"
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
