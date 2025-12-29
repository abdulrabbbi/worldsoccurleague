import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, Trophy, Loader2 } from "lucide-react";
import { useProfileSetup } from "@/lib/profile-setup-context";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { League, Country, ContinentalCup } from "@/lib/types";
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

interface LeagueItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  type: "league" | "cup" | "team";
}

interface LeagueFilter {
  id: string;
  name: string;
  shortName: string;
  items: LeagueItem[];
  isCup?: boolean;
  region?: string;
}

function leagueToItem(league: League, countryCode: string): LeagueItem {
  const flags: Record<string, string> = {
    "c-eng": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "c-esp": "🇪🇸", "c-ger": "🇩🇪", "c-fra": "🇫🇷", "c-ita": "🇮🇹",
    "c-por": "🇵🇹", "c-ned": "🇳🇱", "c-bel": "🇧🇪", "c-sco": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "c-tur": "🇹🇷",
    "c-gre": "🇬🇷", "c-aut": "🇦🇹", "c-sui": "🇨🇭", "c-ukr": "🇺🇦", "c-pol": "🇵🇱",
    "c-cze": "🇨🇿", "c-den": "🇩🇰", "c-nor": "🇳🇴", "c-swe": "🇸🇪", "c-rus": "🇷🇺",
    "c-cro": "🇭🇷", "c-srb": "🇷🇸",
  };
  const isCup = league.category === "Domestic Cups";
  return {
    id: league.id,
    name: league.name,
    shortName: league.name.length > 20 ? league.slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ").substring(0, 18) + "..." : league.name,
    icon: isCup ? "🏆" : (flags[countryCode] || "⚽"),
    type: isCup ? "cup" : "league",
  };
}

function cupToItem(cup: ContinentalCup): LeagueItem {
  return {
    id: cup.id,
    name: cup.name,
    shortName: cup.shortName,
    icon: cup.type === "national" ? "🏆" : "🏆",
    type: "cup",
  };
}

function teamToItem(team: Team): LeagueItem {
  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    icon: team.icon || "⚽",
    type: "team",
  };
}

function ItemCard({ 
  item, 
  isSelected, 
  onToggle 
}: { 
  item: LeagueItem; 
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
      data-testid={`item-card-${item.id}`}
    >
      <div className={`w-16 h-16 flex items-center justify-center text-4xl mb-2 rounded-lg ${
        isSelected ? "bg-white/10" : "bg-slate-700/50"
      }`}>
        {item.icon}
      </div>
      <span className={`text-xs font-medium text-center leading-tight ${
        isSelected ? "text-white" : "text-slate-200"
      }`}>
        {item.shortName}
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

const EUROPEAN_COUNTRY_IDS = [
  "c-eng", "c-esp", "c-ger", "c-fra", "c-ita", "c-por", "c-ned", "c-bel", 
  "c-sco", "c-tur", "c-gre", "c-aut", "c-sui", "c-ukr", "c-pol", "c-cze", 
  "c-den", "c-nor", "c-swe", "c-rus", "c-cro", "c-srb"
];

const COUNTRY_SHORT_NAMES: Record<string, string> = {
  "c-eng": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", "c-esp": "🇪🇸 ESP", "c-ger": "🇩🇪 GER", "c-fra": "🇫🇷 FRA", 
  "c-ita": "🇮🇹 ITA", "c-por": "🇵🇹 POR", "c-ned": "🇳🇱 NED", "c-bel": "🇧🇪 BEL",
  "c-sco": "🏴󠁧󠁢󠁳󠁣󠁴󠁿 SCO", "c-tur": "🇹🇷 TUR", "c-gre": "🇬🇷 GRE", "c-aut": "🇦🇹 AUT",
  "c-sui": "🇨🇭 SUI", "c-ukr": "🇺🇦 UKR", "c-pol": "🇵🇱 POL", "c-cze": "🇨🇿 CZE",
  "c-den": "🇩🇰 DEN", "c-nor": "🇳🇴 NOR", "c-swe": "🇸🇪 SWE", "c-rus": "🇷🇺 RUS",
  "c-cro": "🇭🇷 CRO", "c-srb": "🇷🇸 SRB",
};

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useProfileSetup();
  const [activeFilter, setActiveFilter] = useState("cups");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<"all" | "europe" | "usa">("all");
  const [loading, setLoading] = useState(true);
  const [leagueFilters, setLeagueFilters] = useState<LeagueFilter[]>([]);

  const selectedItems = state.selectedTeams;

  useEffect(() => {
    const loadData = async () => {
      try {
        const filters: LeagueFilter[] = [];
        
        // Suggested
        filters.push({ id: "suggested", name: "Suggested", shortName: "Suggested", items: [], region: "all" });
        
        // Continental Cups
        const europeCups = await sportsDataProvider.getContinentalCups("cont-eu");
        const saCups = await sportsDataProvider.getContinentalCups("cont-sa");
        const naCups = await sportsDataProvider.getContinentalCups("cont-na");
        const asiaCups = await sportsDataProvider.getContinentalCups("cont-as");
        const africaCups = await sportsDataProvider.getContinentalCups("cont-af");
        
        const allCups = [...europeCups, ...saCups, ...naCups, ...asiaCups, ...africaCups];
        filters.push({
          id: "cups",
          name: "Cups & Tournaments",
          shortName: "Cups",
          items: allCups.map(cupToItem),
          isCup: true,
          region: "all"
        });
        
        // European countries - load leagues dynamically
        for (const countryId of EUROPEAN_COUNTRY_IDS) {
          const leagues = await sportsDataProvider.getLeaguesByCountry(countryId);
          if (leagues.length > 0) {
            const country = await sportsDataProvider.getCountry(countryId.replace("c-", ""));
            filters.push({
              id: countryId,
              name: country?.name || countryId,
              shortName: COUNTRY_SHORT_NAMES[countryId] || countryId,
              items: leagues.map(l => leagueToItem(l, countryId)),
              region: "europe"
            });
          }
        }
        
        // National Teams
        filters.push({
          id: "national",
          name: "National Teams",
          shortName: "National",
          items: [...nationalTeams.men, ...nationalTeams.women].map(teamToItem),
          region: "all"
        });
        
        // USA leagues
        filters.push({ id: "mls", name: "MLS", shortName: "🇺🇸 MLS", items: mlsTeams.map(teamToItem), region: "usa" });
        filters.push({ id: "nwsl", name: "NWSL", shortName: "🇺🇸 NWSL", items: nwslTeams.map(teamToItem), region: "usa" });
        filters.push({ id: "usl-c", name: "USL Championship", shortName: "USL", items: uslChampionshipTeams.map(teamToItem), region: "usa" });
        filters.push({ id: "usl1", name: "USL League One", shortName: "USL 1", items: uslLeagueOneTeams.map(teamToItem), region: "usa" });
        filters.push({ id: "usl2", name: "USL League Two", shortName: "USL 2", items: uslLeagueTwoTeams.map(teamToItem), region: "usa" });
        filters.push({ id: "mls-np", name: "MLS Next Pro", shortName: "MLS NP", items: mlsNextProTeams.map(teamToItem), region: "usa" });
        
        setLeagueFilters(filters);
      } catch (error) {
        console.error("Failed to load leagues:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleItem = (itemId: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(x => x !== itemId)
      : [...selectedItems, itemId];
    updateState({ selectedTeams: newSelected });
  };

  const handleFinish = () => {
    setLocation("/auth/profile-setup/favorites");
  };

  const filteredFilters = useMemo(() => {
    if (activeRegion === "all") return leagueFilters.filter(l => l.region === "all");
    return leagueFilters.filter(l => l.region === activeRegion || l.region === "all");
  }, [activeRegion, leagueFilters]);

  const currentFilter = leagueFilters.find(l => l.id === activeFilter);
  
  const displayItems = useMemo(() => {
    if (activeFilter === "suggested") {
      const cupsFilter = leagueFilters.find(f => f.id === "cups");
      const engFilter = leagueFilters.find(f => f.id === "c-eng");
      const espFilter = leagueFilters.find(f => f.id === "c-esp");
      const gerFilter = leagueFilters.find(f => f.id === "c-ger");
      const mlsFilter = leagueFilters.find(f => f.id === "mls");
      
      const popularItems = [
        ...(cupsFilter?.items.slice(0, 4) || []),
        ...(engFilter?.items.slice(0, 3) || []),
        ...(espFilter?.items.slice(0, 2) || []),
        ...(gerFilter?.items.slice(0, 2) || []),
        ...(mlsFilter?.items.slice(0, 3) || []),
      ];
      return popularItems;
    }
    
    let items = currentFilter?.items || [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(query) || 
        i.shortName.toLowerCase().includes(query)
      );
    }
    
    return items;
  }, [activeFilter, currentFilter, searchQuery, leagueFilters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4a9eff] animate-spin" />
      </div>
    );
  }

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
            placeholder="Search for leagues or cups"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] text-sm"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="px-4 py-2 flex gap-2">
        {(["all", "europe", "usa"] as const).map((region) => (
          <button
            key={region}
            onClick={() => {
              setActiveRegion(region);
              setActiveFilter(region === "europe" ? "c-eng" : region === "usa" ? "mls" : "cups");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeRegion === region
                ? "bg-[#C1153D] text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            data-testid={`region-${region}`}
          >
            {region === "all" ? "All" : region === "europe" ? "🌍 Europe" : "🇺🇸 USA"}
          </button>
        ))}
      </div>

      <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
          {filteredFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-[#1a2d5c] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
              data-testid={`filter-${filter.id}`}
            >
              {filter.isCup && <Trophy className="w-3 h-3 inline mr-1" />}
              {filter.shortName}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <p>No results found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {displayItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
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
