import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, ChevronDown, ChevronRight, Trophy, MapPin } from "lucide-react";
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
import { 
  INTERNATIONAL_TOURNAMENTS, 
  CLUB_TOURNAMENTS,
  type CompetitionSection,
  type CompetitionGroup,
  type Competition
} from "@/lib/data/competitions";

interface LeagueItem {
  id: string;
  name: string;
  icon: string;
  teams?: Team[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  hasLocationFilter?: boolean;
  items: LeagueItem[];
}

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

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "Washington D.C." },
];

const USA_SOCCER_HIERARCHY: Category[] = [
  {
    id: "national-teams",
    name: "National Teams",
    icon: "🇺🇸",
    items: [
      { id: "usmnt", name: "Men's National Team", icon: "🇺🇸", teams: nationalTeams.men },
      { id: "uswnt", name: "Women's National Team", icon: "🇺🇸", teams: nationalTeams.women },
    ]
  },
  {
    id: "professional-leagues",
    name: "Professional Leagues",
    icon: "⚽",
    items: [
      { id: "mls", name: "MLS", icon: "⚽", teams: mlsTeams },
      { id: "nwsl", name: "NWSL", icon: "👩", teams: nwslTeams },
      { id: "usl-championship", name: "USL Championship", icon: "⭐", teams: uslChampionshipTeams },
      { id: "mls-next-pro", name: "MLS Next Pro", icon: "⏭️", teams: mlsNextProTeams },
      { id: "usl-league-one", name: "USL League One", icon: "1️⃣", teams: uslLeagueOneTeams },
      { id: "usl-league-two", name: "USL League Two", icon: "2️⃣", teams: uslLeagueTwoTeams },
      { id: "nisa", name: "NISA", icon: "🏆" },
      { id: "npsl", name: "NPSL", icon: "🛡️" },
      { id: "upsl", name: "UPSL", icon: "📍" },
      { id: "wpsl", name: "WPSL", icon: "👟" },
      { id: "uws", name: "UWS", icon: "🌟" },
    ]
  },
  {
    id: "college-soccer",
    name: "College Soccer",
    icon: "🎓",
    hasLocationFilter: true,
    items: [
      { id: "ncaa-d1-men", name: "NCAA Division I Men's", icon: "🎓" },
      { id: "ncaa-d1-women", name: "NCAA Division I Women's", icon: "🎓" },
      { id: "ncaa-d2-men", name: "NCAA Division II Men's", icon: "📚" },
      { id: "ncaa-d2-women", name: "NCAA Division II Women's", icon: "📚" },
      { id: "ncaa-d3-men", name: "NCAA Division III Men's", icon: "📖" },
      { id: "ncaa-d3-women", name: "NCAA Division III Women's", icon: "📖" },
      { id: "naia-men", name: "NAIA Men's", icon: "🏫" },
      { id: "naia-women", name: "NAIA Women's", icon: "🏫" },
      { id: "njcaa", name: "NJCAA (Junior College)", icon: "📝" },
    ]
  },
  {
    id: "high-school-soccer",
    name: "High School Soccer",
    icon: "🏫",
    hasLocationFilter: true,
    items: [
      { id: "hs-varsity-boys", name: "Varsity Boys", icon: "🏫" },
      { id: "hs-varsity-girls", name: "Varsity Girls", icon: "🏫" },
      { id: "hs-jv-boys", name: "JV Boys", icon: "📚" },
      { id: "hs-jv-girls", name: "JV Girls", icon: "📚" },
    ]
  },
  {
    id: "youth-soccer",
    name: "Youth Soccer",
    icon: "👦",
    hasLocationFilter: true,
    items: [
      { id: "mls-next", name: "MLS NEXT", icon: "⚽" },
      { id: "ecnl-boys", name: "ECNL Boys", icon: "🔵" },
      { id: "ecnl-girls", name: "ECNL Girls", icon: "🔵" },
      { id: "ga-boys", name: "GA (Boys)", icon: "🟢" },
      { id: "ga-girls", name: "GA (Girls)", icon: "🟢" },
      { id: "usys", name: "US Youth Soccer", icon: "👦" },
      { id: "ayso", name: "AYSO", icon: "🟡" },
      { id: "club-soccer", name: "Club Soccer", icon: "⚽" },
    ]
  },
  {
    id: "adult-soccer",
    name: "Adult Soccer",
    icon: "🏃",
    hasLocationFilter: true,
    items: [
      { id: "sanctioned-leagues", name: "Sanctioned Leagues", icon: "✅" },
      { id: "adult-recreational", name: "Recreational Leagues", icon: "🌱" },
      { id: "adult-competitive", name: "Competitive Leagues", icon: "🏆" },
      { id: "adult-coed-leagues", name: "Co-ed Leagues", icon: "🤝" },
      { id: "adult-mens-leagues", name: "Men's Leagues", icon: "👨" },
      { id: "adult-womens-leagues", name: "Women's Leagues", icon: "👩" },
      { id: "over-30-leagues", name: "Over 30 Leagues", icon: "3️⃣0️⃣" },
      { id: "over-40-leagues", name: "Over 40 Leagues", icon: "4️⃣0️⃣" },
      { id: "over-50-leagues", name: "Over 50 Leagues", icon: "5️⃣0️⃣" },
    ]
  },
  {
    id: "pickup-soccer",
    name: "Pick-up Soccer",
    icon: "🥅",
    hasLocationFilter: true,
    items: [
      { id: "pickup-casual", name: "Casual Pick-up Games", icon: "⚽" },
      { id: "pickup-indoor", name: "Indoor Soccer", icon: "🏢" },
      { id: "pickup-futsal", name: "Futsal", icon: "🔴" },
      { id: "pickup-beach", name: "Beach Soccer", icon: "🏖️" },
      { id: "pickup-small-sided", name: "Small-Sided Games", icon: "🥅" },
    ]
  },
  {
    id: "fan-clubs",
    name: "Fan Clubs",
    icon: "📣",
    hasLocationFilter: true,
    items: [
      { id: "supporters-groups", name: "Supporters Groups", icon: "📣" },
      { id: "local-watch-parties", name: "Local Watch Parties", icon: "📺" },
      { id: "national-team-fans", name: "National Team Fan Groups", icon: "🇺🇸" },
      { id: "international-fans", name: "International Club Fans", icon: "🌍" },
    ]
  },
  {
    id: "usa-cups",
    name: "USA Cups & Trophies",
    icon: "🏆",
    items: USA_CUPS.map(cup => ({ id: cup.id, name: cup.name, icon: cup.icon })),
  },
  {
    id: "tournaments",
    name: "Tournaments",
    icon: "🏅",
    hasLocationFilter: true,
    items: [
      { id: "tournament-youth", name: "Youth Tournaments", icon: "👦" },
      { id: "tournament-adult", name: "Adult Tournaments", icon: "🏃" },
      { id: "tournament-college", name: "College Showcases", icon: "🎓" },
      { id: "tournament-charity", name: "Charity Tournaments", icon: "❤️" },
      { id: "tournament-corporate", name: "Corporate Tournaments", icon: "🏢" },
      { id: "tournament-pickup", name: "Pick-up Tournaments", icon: "⚽" },
    ]
  },
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
  { id: "aussie", name: "Aussie", icon: "🇦🇺" },
  { id: "cups", name: "Cups", icon: "🏆" },
  { id: "international", name: "International", icon: "🌍" },
  { id: "clubs", name: "Club Cups", icon: "🏟️" },
];

type ContinentId = "usa" | "europe" | "africa" | "asia" | "latino" | "aussie" | "cups" | "international" | "clubs";

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

function LeagueItemCard({
  item,
  isSelected,
  onToggle,
}: {
  item: LeagueItem;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-[#1a2d5c] to-[#0f1d3d] ring-2 ring-[#4a9eff]"
          : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
      }`}
      data-testid={`item-card-${item.id}`}
    >
      <span className="text-xl">{item.icon}</span>
      <span className={`text-sm font-medium flex-1 text-left ${isSelected ? "text-white" : "text-slate-200"}`}>
        {item.name}
      </span>
      {isSelected && (
        <div className="w-5 h-5 bg-[#4a9eff] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

function CategorySection({
  category,
  isExpanded,
  onToggle,
  selectedItems,
  onItemToggle,
  searchQuery,
  locationSelection,
  onLocationChange,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
  searchQuery: string;
  locationSelection: { state: string; city: string };
  onLocationChange: (field: "state" | "city", value: string) => void;
}) {
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return category.items;
    const query = searchQuery.toLowerCase();
    return category.items.filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }, [category.items, searchQuery]);

  const allTeams = useMemo(() => {
    return category.items.flatMap(item => item.teams || []);
  }, [category.items]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return allTeams;
    const query = searchQuery.toLowerCase();
    return allTeams.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.shortName.toLowerCase().includes(query) ||
      t.city.toLowerCase().includes(query)
    );
  }, [allTeams, searchQuery]);

  const hasTeams = allTeams.length > 0;
  const selectedCount = hasTeams 
    ? filteredTeams.filter(t => selectedItems.includes(t.id)).length
    : filteredItems.filter(item => selectedItems.includes(item.id)).length;

  if (filteredItems.length === 0 && filteredTeams.length === 0) return null;

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
        data-testid={`category-${category.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <span className="text-white font-medium">{category.name}</span>
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
          {category.hasLocationFilter && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                <MapPin className="w-4 h-4" />
                <span>Find in your area</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={locationSelection.state}
                  onChange={(e) => {
                    onLocationChange("state", e.target.value);
                    onLocationChange("city", "");
                  }}
                  className="p-2 rounded-lg bg-slate-700 text-white text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4a9eff]"
                  data-testid={`select-state-${category.id}`}
                >
                  <option value="">Select state...</option>
                  {US_STATES.map(state => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={locationSelection.city}
                  onChange={(e) => onLocationChange("city", e.target.value)}
                  placeholder="City..."
                  disabled={!locationSelection.state}
                  className="p-2 rounded-lg bg-slate-700 text-white text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] placeholder:text-slate-500 disabled:opacity-50"
                  data-testid={`input-city-${category.id}`}
                />
              </div>
            </div>
          )}

          {hasTeams ? (
            <div className="space-y-4">
              {category.items.map((leagueItem) => {
                if (!leagueItem.teams || leagueItem.teams.length === 0) {
                  return (
                    <LeagueItemCard
                      key={leagueItem.id}
                      item={leagueItem}
                      isSelected={selectedItems.includes(leagueItem.id)}
                      onToggle={() => onItemToggle(leagueItem.id)}
                    />
                  );
                }
                
                const teamsToShow = searchQuery.trim() 
                  ? leagueItem.teams.filter(t => 
                      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.city.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : leagueItem.teams;

                if (teamsToShow.length === 0) return null;

                return (
                  <div key={leagueItem.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{leagueItem.icon}</span>
                      <span className="text-slate-300 text-sm font-medium">{leagueItem.name}</span>
                      <span className="text-slate-500 text-xs">({teamsToShow.length} teams)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {teamsToShow.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          isSelected={selectedItems.includes(team.id)}
                          onToggle={() => onItemToggle(team.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredItems.map((item) => (
                <LeagueItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggle={() => onItemToggle(item.id)}
                />
              ))}
            </div>
          )}
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["national-teams", "professional-leagues"]));
  const [locationSelections, setLocationSelections] = useState<Record<string, { state: string; city: string }>>({});

  const selectedItems = state.selectedTeams;

  const toggleItem = (itemId: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(x => x !== itemId)
      : [...selectedItems, itemId];
    updateState({ selectedTeams: newSelected });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const updateLocationSelection = (categoryId: string, field: "state" | "city", value: string) => {
    setLocationSelections(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
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
            {USA_SOCCER_HIERARCHY.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                isExpanded={expandedCategories.has(category.id)}
                onToggle={() => toggleCategory(category.id)}
                selectedItems={selectedItems}
                onItemToggle={toggleItem}
                searchQuery={searchQuery}
                locationSelection={locationSelections[category.id] || { state: "", city: "" }}
                onLocationChange={(field, value) => updateLocationSelection(category.id, field, value)}
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

        {activeContinent === "aussie" && (
          <ContinentPlaceholder continent={CONTINENTS.find(c => c.id === "aussie")!} />
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

        {activeContinent === "international" && (
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              {INTERNATIONAL_TOURNAMENTS.name}
            </h3>
            <div className="space-y-4">
              {INTERNATIONAL_TOURNAMENTS.groups.map((group) => (
                <div key={group.id} className="border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(group.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
                    data-testid={`group-${group.id}`}
                  >
                    <span className="text-white font-medium">{group.name}</span>
                    <div className="flex items-center gap-2">
                      {group.competitions.filter(c => selectedItems.includes(c.id)).length > 0 && (
                        <span className="bg-[#4a9eff] text-white text-xs px-2 py-1 rounded-full">
                          {group.competitions.filter(c => selectedItems.includes(c.id)).length}
                        </span>
                      )}
                      {expandedCategories.has(group.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {expandedCategories.has(group.id) && (
                    <div className="p-4 bg-slate-900 grid grid-cols-1 gap-2">
                      {group.competitions.map((comp) => (
                        <button
                          key={comp.id}
                          onClick={() => toggleItem(comp.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                            selectedItems.includes(comp.id)
                              ? "bg-gradient-to-r from-[#1a2d5c] to-[#0f1d3d] ring-2 ring-[#4a9eff]"
                              : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                          }`}
                          data-testid={`comp-${comp.id}`}
                        >
                          <span className="text-xl">{comp.icon}</span>
                          <span className={`text-sm font-medium flex-1 text-left ${selectedItems.includes(comp.id) ? "text-white" : "text-slate-200"}`}>
                            {comp.name}
                          </span>
                          {selectedItems.includes(comp.id) && (
                            <div className="w-5 h-5 bg-[#4a9eff] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeContinent === "clubs" && (
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span className="text-2xl">🏟️</span>
              {CLUB_TOURNAMENTS.name}
            </h3>
            <div className="space-y-4">
              {CLUB_TOURNAMENTS.groups.map((group) => (
                <div key={group.id} className="border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(group.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
                    data-testid={`group-${group.id}`}
                  >
                    <span className="text-white font-medium">{group.name}</span>
                    <div className="flex items-center gap-2">
                      {group.competitions.filter(c => selectedItems.includes(c.id)).length > 0 && (
                        <span className="bg-[#4a9eff] text-white text-xs px-2 py-1 rounded-full">
                          {group.competitions.filter(c => selectedItems.includes(c.id)).length}
                        </span>
                      )}
                      {expandedCategories.has(group.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {expandedCategories.has(group.id) && (
                    <div className="p-4 bg-slate-900 grid grid-cols-1 gap-2">
                      {group.competitions.map((comp) => (
                        <button
                          key={comp.id}
                          onClick={() => toggleItem(comp.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                            selectedItems.includes(comp.id)
                              ? "bg-gradient-to-r from-[#1a2d5c] to-[#0f1d3d] ring-2 ring-[#4a9eff]"
                              : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                          }`}
                          data-testid={`comp-${comp.id}`}
                        >
                          <span className="text-xl">{comp.icon}</span>
                          <span className={`text-sm font-medium flex-1 text-left ${selectedItems.includes(comp.id) ? "text-white" : "text-slate-200"}`}>
                            {comp.name}
                          </span>
                          {selectedItems.includes(comp.id) && (
                            <div className="w-5 h-5 bg-[#4a9eff] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
