import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, ChevronDown, ChevronRight, Trophy } from "lucide-react";
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

interface USACup {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

const USA_CUPS: USACup[] = [
  { id: "cup-usopen", name: "U.S. Open Cup", shortName: "US Open Cup", icon: "🏆" },
  { id: "cup-mlscup", name: "MLS Cup", shortName: "MLS Cup", icon: "🏆" },
  { id: "cup-shields", name: "Supporters' Shield", shortName: "Shield", icon: "🛡️" },
  { id: "cup-leaguescup", name: "Leagues Cup", shortName: "Leagues Cup", icon: "🏆" },
  { id: "cup-campeonescup", name: "Campeones Cup", shortName: "Campeones", icon: "🏆" },
  { id: "cup-nwslchamp", name: "NWSL Championship", shortName: "NWSL Champ", icon: "🏆" },
  { id: "cup-nwslshield", name: "NWSL Shield", shortName: "NWSL Shield", icon: "🛡️" },
];

const CONTINENTAL_CUPS: USACup[] = [
  { id: "cup-ucl", name: "UEFA Champions League", shortName: "UCL", icon: "🏆" },
  { id: "cup-uel", name: "UEFA Europa League", shortName: "Europa", icon: "🏆" },
  { id: "cup-uecl", name: "Conference League", shortName: "UECL", icon: "🏆" },
  { id: "cup-euro", name: "UEFA EURO", shortName: "EURO", icon: "🇪🇺" },
  { id: "cup-unl", name: "Nations League", shortName: "UNL", icon: "🏆" },
  { id: "cup-libertadores", name: "Copa Libertadores", shortName: "Libertadores", icon: "🏆" },
  { id: "cup-sudamericana", name: "Copa Sudamericana", shortName: "Sudamericana", icon: "🏆" },
  { id: "cup-copaamerica", name: "Copa América", shortName: "Copa América", icon: "🌎" },
  { id: "cup-ccl", name: "CONCACAF Champions Cup", shortName: "CCL", icon: "🏆" },
  { id: "cup-goldcup", name: "Gold Cup", shortName: "Gold Cup", icon: "🏆" },
  { id: "cup-acl", name: "AFC Champions League", shortName: "ACL", icon: "🏆" },
  { id: "cup-asiancup", name: "AFC Asian Cup", shortName: "Asian Cup", icon: "🌏" },
  { id: "cup-cafcl", name: "CAF Champions League", shortName: "CAF CL", icon: "🏆" },
  { id: "cup-afcon", name: "Africa Cup of Nations", shortName: "AFCON", icon: "🌍" },
  { id: "cup-worldcup", name: "FIFA World Cup", shortName: "World Cup", icon: "🏆" },
  { id: "cup-cwc", name: "FIFA Club World Cup", shortName: "Club WC", icon: "🌐" },
];

interface Section {
  id: string;
  name: string;
  icon: string;
  type: "teams" | "cups";
  teams?: Team[];
  cups?: USACup[];
}

const USA_SECTIONS: Section[] = [
  { id: "usa-national", name: "National Teams", icon: "🇺🇸", type: "teams", teams: [...nationalTeams.men, ...nationalTeams.women] },
  { id: "usa-mls", name: "MLS", icon: "⚽", type: "teams", teams: mlsTeams },
  { id: "usa-nwsl", name: "NWSL", icon: "⚽", type: "teams", teams: nwslTeams },
  { id: "usa-uslc", name: "USL Championship", icon: "⚽", type: "teams", teams: uslChampionshipTeams },
  { id: "usa-usl1", name: "USL League One", icon: "⚽", type: "teams", teams: uslLeagueOneTeams },
  { id: "usa-usl2", name: "USL League Two", icon: "⚽", type: "teams", teams: uslLeagueTwoTeams },
  { id: "usa-mlsnp", name: "MLS Next Pro", icon: "⚽", type: "teams", teams: mlsNextProTeams },
  { id: "usa-cups", name: "USA Cups & Trophies", icon: "🏆", type: "cups", cups: USA_CUPS },
];

interface Continent {
  id: string;
  name: string;
  icon: string;
}

const CONTINENTS: Continent[] = [
  { id: "usa", name: "USA", icon: "🇺🇸" },
  { id: "europe", name: "Europe", icon: "🇪🇺" },
  { id: "africa", name: "Africa", icon: "🌍" },
  { id: "asia", name: "Asia", icon: "🌏" },
  { id: "latino", name: "Latino", icon: "🌎" },
  { id: "oceania", name: "Oceania", icon: "🇦🇺" },
  { id: "cups", name: "Cups", icon: "🏆" },
];

type ContinentId = "usa" | "europe" | "africa" | "asia" | "latino" | "oceania" | "cups";

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
      <div className={`w-14 h-14 flex items-center justify-center text-3xl mb-2 rounded-lg ${
        isSelected ? "bg-white/10" : "bg-slate-700/50"
      }`}>
        {team.icon || team.shortName.charAt(0)}
      </div>
      <span className={`text-xs font-medium text-center leading-tight line-clamp-2 ${
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

function CupCard({ 
  cup, 
  isSelected, 
  onToggle 
}: { 
  cup: USACup; 
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
      data-testid={`cup-card-${cup.id}`}
    >
      <div className={`w-14 h-14 flex items-center justify-center text-3xl mb-2 rounded-lg ${
        isSelected ? "bg-white/10" : "bg-slate-700/50"
      }`}>
        {cup.icon}
      </div>
      <span className={`text-xs font-medium text-center leading-tight line-clamp-2 ${
        isSelected ? "text-white" : "text-slate-200"
      }`}>
        {cup.shortName}
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

function CollapsibleSection({
  section,
  isExpanded,
  onToggle,
  selectedItems,
  onItemToggle,
  searchQuery,
}: {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
  searchQuery: string;
}) {
  const filteredTeams = useMemo(() => {
    if (!section.teams) return [];
    if (!searchQuery.trim()) return section.teams;
    const query = searchQuery.toLowerCase();
    return section.teams.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.shortName.toLowerCase().includes(query) ||
      t.city.toLowerCase().includes(query)
    );
  }, [section.teams, searchQuery]);

  const filteredCups = useMemo(() => {
    if (!section.cups) return [];
    if (!searchQuery.trim()) return section.cups;
    const query = searchQuery.toLowerCase();
    return section.cups.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.shortName.toLowerCase().includes(query)
    );
  }, [section.cups, searchQuery]);

  const itemCount = section.type === "teams" ? filteredTeams.length : filteredCups.length;
  const selectedCount = section.type === "teams" 
    ? filteredTeams.filter(t => selectedItems.includes(t.id)).length
    : filteredCups.filter(c => selectedItems.includes(c.id)).length;

  if (itemCount === 0) return null;

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
        data-testid={`section-${section.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div className="text-left">
            <span className="text-white font-medium">{section.name}</span>
            <span className="text-slate-400 text-sm ml-2">
              ({itemCount} {section.type === "teams" ? "teams" : "cups"})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="bg-[#4a9eff] text-white text-xs px-2 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-slate-900">
          <div className="grid grid-cols-4 gap-2">
            {section.type === "teams" && filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isSelected={selectedItems.includes(team.id)}
                onToggle={() => onItemToggle(team.id)}
              />
            ))}
            {section.type === "cups" && filteredCups.map((cup) => (
              <CupCard
                key={cup.id}
                cup={cup}
                isSelected={selectedItems.includes(cup.id)}
                onToggle={() => onItemToggle(cup.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContinentPlaceholder({ continent }: { continent: Continent }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">{continent.icon}</span>
      <h3 className="text-white text-xl font-semibold mb-2">{continent.name}</h3>
      <p className="text-slate-400 text-sm max-w-xs">
        Countries, leagues, and teams coming soon
      </p>
    </div>
  );
}

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useProfileSetup();
  const [activeContinent, setActiveContinent] = useState<ContinentId>("usa");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["usa-national", "usa-mls"]));

  const selectedItems = state.selectedTeams;

  const toggleItem = (itemId: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(x => x !== itemId)
      : [...selectedItems, itemId];
    updateState({ selectedTeams: newSelected });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleFinish = () => {
    setLocation("/auth/profile-setup/favorites");
  };

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
        <h1 className="text-white font-semibold text-lg uppercase tracking-wide">Tap Your Favorites</h1>
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
            placeholder="Search teams, leagues, or cups"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] text-sm"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {CONTINENTS.map((continent) => (
            <button
              key={continent.id}
              onClick={() => setActiveContinent(continent.id as ContinentId)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeContinent === continent.id
                  ? "bg-[#C1153D] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
              data-testid={`continent-${continent.id}`}
            >
              <span>{continent.icon}</span>
              <span>{continent.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {activeContinent === "usa" && (
          <div>
            {USA_SECTIONS.map((section) => (
              <CollapsibleSection
                key={section.id}
                section={section}
                isExpanded={expandedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
                selectedItems={selectedItems}
                onItemToggle={toggleItem}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}

        {activeContinent === "europe" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "europe")!} />
        )}

        {activeContinent === "africa" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "africa")!} />
        )}

        {activeContinent === "asia" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "asia")!} />
        )}

        {activeContinent === "latino" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "latino")!} />
        )}

        {activeContinent === "oceania" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "oceania")!} />
        )}

        {activeContinent === "cups" && (
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Continental & International Cups
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {CONTINENTAL_CUPS.map((cup) => (
                <CupCard
                  key={cup.id}
                  cup={cup}
                  isSelected={selectedItems.includes(cup.id)}
                  onToggle={() => toggleItem(cup.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 border-t border-slate-800 bg-[#121212]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">
            {selectedItems.length} selected
          </span>
        </div>
        <button
          onClick={handleFinish}
          className="w-full py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#C1153D] to-[#1a2d5c] hover:opacity-90 transition-opacity"
          data-testid="button-continue"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
