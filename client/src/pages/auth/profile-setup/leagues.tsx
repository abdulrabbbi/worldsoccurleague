import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, Trophy } from "lucide-react";
import { useProfileSetup } from "@/lib/profile-setup-context";
import { 
  nationalTeams, 
  mlsTeams, 
  nwslTeams, 
  uslChampionshipTeams, 
  uslLeagueOneTeams, 
  uslLeagueTwoTeams, 
  mlsNextProTeams,
  Team
} from "@/lib/data/us-soccer-teams";

interface LeagueFilter {
  id: string;
  name: string;
  shortName: string;
  teams: Team[];
  isCup?: boolean;
}

const CONTINENTAL_CUPS: Team[] = [
  { id: "cup-ucl", name: "UEFA Champions League", shortName: "UCL", city: "Europe", state: "", icon: "🏆" },
  { id: "cup-uel", name: "UEFA Europa League", shortName: "Europa", city: "Europe", state: "", icon: "🏆" },
  { id: "cup-uecl", name: "Conference League", shortName: "UECL", city: "Europe", state: "", icon: "🏆" },
  { id: "cup-euro", name: "UEFA EURO", shortName: "EURO", city: "Europe", state: "", icon: "🇪🇺" },
  { id: "cup-unl", name: "Nations League", shortName: "UNL", city: "Europe", state: "", icon: "🏆" },
  { id: "cup-libertadores", name: "Copa Libertadores", shortName: "Libertadores", city: "South America", state: "", icon: "🏆" },
  { id: "cup-sudamericana", name: "Copa Sudamericana", shortName: "Sudamericana", city: "South America", state: "", icon: "🏆" },
  { id: "cup-copaamerica", name: "Copa América", shortName: "Copa América", city: "South America", state: "", icon: "🌎" },
  { id: "cup-ccl", name: "CONCACAF Champions Cup", shortName: "CCL", city: "North America", state: "", icon: "🏆" },
  { id: "cup-goldcup", name: "Gold Cup", shortName: "Gold Cup", city: "North America", state: "", icon: "🏆" },
  { id: "cup-leaguescup", name: "Leagues Cup", shortName: "Leagues Cup", city: "North America", state: "", icon: "🏆" },
  { id: "cup-usopen", name: "U.S. Open Cup", shortName: "US Open", city: "USA", state: "", icon: "🏆" },
  { id: "cup-acl", name: "AFC Champions League", shortName: "ACL", city: "Asia", state: "", icon: "🏆" },
  { id: "cup-asiancup", name: "AFC Asian Cup", shortName: "Asian Cup", city: "Asia", state: "", icon: "🌏" },
  { id: "cup-cafcl", name: "CAF Champions League", shortName: "CAF CL", city: "Africa", state: "", icon: "🏆" },
  { id: "cup-afcon", name: "Africa Cup of Nations", shortName: "AFCON", city: "Africa", state: "", icon: "🌍" },
  { id: "cup-ofcnc", name: "OFC Nations Cup", shortName: "OFC", city: "Oceania", state: "", icon: "🏆" },
  { id: "cup-worldcup", name: "FIFA World Cup", shortName: "World Cup", city: "World", state: "", icon: "🏆" },
  { id: "cup-cwc", name: "FIFA Club World Cup", shortName: "Club WC", city: "World", state: "", icon: "🌐" },
];

const LEAGUE_FILTERS: LeagueFilter[] = [
  { id: "suggested", name: "Suggested", shortName: "Suggested", teams: [] },
  { id: "cups", name: "Cups & Tournaments", shortName: "Cups", teams: CONTINENTAL_CUPS, isCup: true },
  { id: "national", name: "National Teams", shortName: "National", teams: [...nationalTeams.men, ...nationalTeams.women] },
  { id: "mls", name: "Major League Soccer", shortName: "MLS", teams: mlsTeams },
  { id: "nwsl", name: "National Women's Soccer League", shortName: "NWSL", teams: nwslTeams },
  { id: "usl-c", name: "USL Championship", shortName: "USL", teams: uslChampionshipTeams },
  { id: "usl1", name: "USL League One", shortName: "USL 1", teams: uslLeagueOneTeams },
  { id: "usl2", name: "USL League Two", shortName: "USL 2", teams: uslLeagueTwoTeams },
  { id: "mls-np", name: "MLS Next Pro", shortName: "MLS NP", teams: mlsNextProTeams },
];

function TeamCard({ 
  team, 
  isSelected, 
  onToggle 
}: { 
  team: Team; 
  isSelected: boolean; 
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-b from-[#1a2d5c] to-[#0f1d3d] ring-2 ring-[#4a9eff] shadow-[0_0_20px_rgba(74,158,255,0.4)]"
          : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
      }`}
      data-testid={`team-card-${team.id}`}
    >
      <div className={`w-16 h-16 flex items-center justify-center text-4xl mb-2 rounded-lg ${
        isSelected ? "bg-white/10" : "bg-slate-700/50"
      }`}>
        {team.icon || team.shortName.charAt(0)}
      </div>
      <span className={`text-xs font-medium text-center leading-tight ${
        isSelected ? "text-white" : "text-slate-200"
      }`}>
        {team.shortName}
      </span>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4a9eff] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useProfileSetup();
  const [activeLeague, setActiveLeague] = useState("cups");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTeams = state.selectedTeams;

  const toggleTeam = (teamId: string) => {
    const newSelectedTeams = selectedTeams.includes(teamId)
      ? selectedTeams.filter(x => x !== teamId)
      : [...selectedTeams, teamId];
    updateState({ selectedTeams: newSelectedTeams });
  };

  const handleFinish = () => {
    setLocation("/auth/profile-setup/favorites");
  };

  const currentLeague = LEAGUE_FILTERS.find(l => l.id === activeLeague);
  
  const displayTeams = useMemo(() => {
    if (activeLeague === "suggested") {
      const popularTeams = [
        ...CONTINENTAL_CUPS.filter(t => ["cup-ucl", "cup-worldcup", "cup-goldcup", "cup-copaamerica"].includes(t.id)),
        ...mlsTeams.filter(t => ["inter-miami", "la-galaxy", "lafc", "atl-utd", "ny-red-bulls", "sea-sounders"].includes(t.id)),
        ...nwslTeams.filter(t => ["ang-city", "por-thorns", "chi-red-stars"].includes(t.id)),
      ];
      return popularTeams;
    }
    
    let teams = currentLeague?.teams || [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      teams = teams.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.shortName.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query)
      );
    }
    
    return teams;
  }, [activeLeague, currentLeague, searchQuery]);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button
          onClick={() => setLocation("/auth/profile-setup/continent")}
          className="text-slate-400 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white font-semibold text-lg">Tap your favorites</h1>
        <button
          onClick={handleFinish}
          className="text-[#4a9eff] font-semibold text-sm"
          data-testid="button-finish"
        >
          Finish
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search for teams or cups"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] text-sm"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-24 flex-shrink-0 border-r border-slate-800 overflow-y-auto">
          {LEAGUE_FILTERS.map((league) => {
            const isActive = activeLeague === league.id;
            const selectedInLeague = league.teams.filter(t => selectedTeams.includes(t.id)).length;
            
            return (
              <button
                key={league.id}
                onClick={() => setActiveLeague(league.id)}
                className={`w-full px-2 py-4 text-left transition-colors relative ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50"
                }`}
                data-testid={`league-filter-${league.id}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                )}
                <span className="text-xs font-medium leading-tight block flex items-center gap-1">
                  {league.isCup && <Trophy className="w-3 h-3" />}
                  {league.shortName}
                </span>
                {selectedInLeague > 0 && (
                  <span className="text-[10px] text-[#4a9eff] mt-1 block">
                    {selectedInLeague} selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {displayTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isSelected={selectedTeams.includes(team.id)}
                onToggle={() => toggleTeam(team.id)}
              />
            ))}
          </div>
          
          {displayTeams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <p className="text-sm">No teams found</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-[#4a9eff] text-sm mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedTeams.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-800 bg-[#121212]">
          <p className="text-center text-sm text-slate-400">
            <span className="font-bold text-white">{selectedTeams.length}</span> favorites selected
          </p>
        </div>
      )}
    </div>
  );
}
