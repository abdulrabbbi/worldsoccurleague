import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const continents = [
  { id: "north-america", name: "North America", flag: "🇺🇸" },
  { id: "europe", name: "Europe", flag: "🇪🇺" },
  { id: "south-america", name: "South America", flag: "🇧🇷" },
  { id: "africa", name: "Africa", flag: "🇿🇦" },
  { id: "asia", name: "Asia", flag: "🇯🇵" },
  { id: "oceania", name: "Oceania", flag: "🇦🇺" },
];

export default function Home() {
  const matches = api.getMatches();
  const liveMatches = matches.filter(m => m.status === "LIVE");
  const upcomingMatches = matches.filter(m => m.status !== "LIVE");
  const [selectedContinent, setSelectedContinent] = useState(continents[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <AppShell>
      {/* Continent Dropdown */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            data-testid="button-continent-dropdown"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedContinent.flag}</span>
              <span className="font-semibold text-[#1a2d5c]">{selectedContinent.name}</span>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
              {continents.map((continent) => (
                <button
                  key={continent.id}
                  onClick={() => {
                    setSelectedContinent(continent);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedContinent.id === continent.id ? 'bg-gray-50' : ''
                  }`}
                  data-testid={`button-continent-${continent.id}`}
                >
                  <span className="text-2xl">{continent.flag}</span>
                  <span className="font-medium text-gray-700">{continent.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Live Section */}
        {liveMatches.length > 0 && (
          <section className="space-y-3">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  Live Now
                </h2>
                <span className="text-xs font-medium text-accent uppercase tracking-wide cursor-pointer hover:underline">View All</span>
             </div>
             <div className="space-y-3">
               {liveMatches.map(match => (
                 <MatchCard key={match.id} match={match} />
               ))}
             </div>
          </section>
        )}

        {/* Following / For You Section */}
        <section className="space-y-3">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Your Matches</h2>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today</span>
           </div>
           <div className="space-y-3">
             {upcomingMatches.map(match => (
               <MatchCard key={match.id} match={match} />
             ))}
           </div>
        </section>

         {/* Browse Teaser */}
        <section className="pt-4">
           <Link href="/explore">
            <div className="bg-sidebar p-6 rounded-xl relative overflow-hidden group cursor-pointer">
               <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-accent/20 to-transparent" />
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                    <h3 className="text-white text-xl font-bold mb-1">Browse the World</h3>
                    <p className="text-sidebar-foreground/60 text-sm">From Premier League to Pickup.</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-sidebar transition-colors">
                   <ChevronRight size={20} />
                 </div>
               </div>
            </div>
           </Link>
        </section>
      </div>
    </AppShell>
  );
}
