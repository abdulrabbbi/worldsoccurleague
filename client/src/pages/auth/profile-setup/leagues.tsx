import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import LocationSelector from "@/components/ui/location-selector";
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
  icon?: string;
  teams?: { id: string; name: string; city: string; state: string }[];
}

interface Category {
  id: string;
  name: string;
  items: LeagueItem[];
  hasLocationFilter?: boolean;
}

const USA_SOCCER_HIERARCHY: Category[] = [
  {
    id: "national-teams",
    name: "National Teams",
    items: [
      { 
        id: "usmnt", 
        name: "Men's National Team", 
        icon: "🇺🇸",
        teams: nationalTeams.men.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "uswnt", 
        name: "Women's National Team", 
        icon: "🇺🇸",
        teams: nationalTeams.women.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
    ]
  },
  {
    id: "professional-leagues",
    name: "Professional Leagues",
    items: [
      { 
        id: "mls", 
        name: "MLS", 
        icon: "⚽",
        teams: mlsTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "nwsl", 
        name: "NWSL", 
        icon: "👩",
        teams: nwslTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "usl-championship", 
        name: "USL Championship", 
        icon: "⭐",
        teams: uslChampionshipTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "mls-next-pro", 
        name: "MLS Next Pro", 
        icon: "⏭️",
        teams: mlsNextProTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "usl-league-one", 
        name: "USL League One", 
        icon: "1️⃣",
        teams: uslLeagueOneTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
      { 
        id: "usl-league-two", 
        name: "USL League Two", 
        icon: "2️⃣",
        teams: uslLeagueTwoTeams.map(t => ({ id: t.id, name: t.name, city: t.city, state: t.state }))
      },
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
    hasLocationFilter: true,
    items: [
      { id: "supporters-groups", name: "Supporters Groups", icon: "📣" },
      { id: "local-watch-parties", name: "Local Watch Parties", icon: "📺" },
      { id: "national-team-fans", name: "National Team Fan Groups", icon: "🇺🇸" },
      { id: "international-fans", name: "International Club Fans", icon: "🌍" },
    ]
  },
];

export default function LeaguesSetup() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>(["mls"]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["national-teams", "professional-leagues"]);
  const [expandedLeagues, setExpandedLeagues] = useState<string[]>([]);
  const [locationSelections, setLocationSelections] = useState<Record<string, { state?: string; city?: string }>>({});

  const handleLocationSelect = (categoryId: string, state: string, city?: string) => {
    setLocationSelections(prev => ({
      ...prev,
      [categoryId]: { state, city }
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleLeague = (leagueId: string) => {
    setExpandedLeagues(prev =>
      prev.includes(leagueId)
        ? prev.filter(l => l !== leagueId)
        : [...prev, leagueId]
    );
  };

  const toggleItem = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setLocation("/auth/profile-setup/national-team");
  };

  const getSelectedCount = (category: Category) => {
    let count = category.items.filter(item => selected.includes(item.id)).length;
    category.items.forEach(item => {
      if (item.teams) {
        count += item.teams.filter(team => selected.includes(team.id)).length;
      }
    });
    return count;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setLocation("/auth/profile-setup/continent")}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 font-medium text-sm"
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
          USA Soccer Leagues
        </button>
        <button
          onClick={handleNext}
          className="bg-[#1a2d5c] hover:bg-[#152347] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm"
          data-testid="button-next"
        >
          Next
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4">Select your favorite teams and leagues</p>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search leagues and teams..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
          data-testid="input-search"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Categories with dropdowns */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {USA_SOCCER_HIERARCHY.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const selectedCount = getSelectedCount(category);
          
          return (
            <div key={category.id} className="border border-slate-200 rounded-2xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                data-testid={`category-${category.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#1a2d5c]">{category.name}</span>
                  {selectedCount > 0 && (
                    <span className="bg-[#C1153D] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {selectedCount}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  {/* Location Selector for geo-based categories */}
                  {category.hasLocationFilter && (
                    <div className="p-3">
                      <LocationSelector
                        selectedState={locationSelections[category.id]?.state}
                        selectedCity={locationSelections[category.id]?.city}
                        onLocationSelect={(state, city) => handleLocationSelect(category.id, state, city)}
                      />
                    </div>
                  )}
                  {category.items.map((item) => {
                    const hasTeams = item.teams && item.teams.length > 0;
                    const isLeagueExpanded = expandedLeagues.includes(item.id);
                    const teamSelectedCount = item.teams?.filter(t => selected.includes(t.id)).length || 0;
                    
                    return (
                      <div key={item.id}>
                        {/* League/Item Row */}
                        <div
                          className={`w-full flex items-center gap-3 p-3 pl-6 border-b border-slate-100 transition-all ${
                            selected.includes(item.id)
                              ? "bg-[#1a2d5c]/5"
                              : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center text-xl">
                            {item.icon}
                          </div>
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="font-medium text-slate-800 flex-1 text-sm text-left flex items-center gap-2"
                            data-testid={`item-${item.id}`}
                          >
                            {item.name}
                            {teamSelectedCount > 0 && (
                              <span className="bg-[#C1153D] text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                {teamSelectedCount}
                              </span>
                            )}
                          </button>
                          
                          {hasTeams && (
                            <button
                              onClick={() => toggleLeague(item.id)}
                              className="p-1 hover:bg-slate-200 rounded"
                              data-testid={`expand-${item.id}`}
                            >
                              {isLeagueExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                              selected.includes(item.id)
                                ? "bg-[#1a2d5c] border-[#1a2d5c]"
                                : "border-slate-300"
                            }`}
                          >
                            {selected.includes(item.id) && (
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                          </button>
                        </div>

                        {/* Teams under League */}
                        {hasTeams && isLeagueExpanded && (
                          <div className="bg-slate-50/50">
                            {item.teams!.map((team) => (
                              <button
                                key={team.id}
                                onClick={() => toggleItem(team.id)}
                                className={`w-full flex items-center gap-3 p-2.5 pl-14 border-b border-slate-100 last:border-b-0 transition-all text-left ${
                                  selected.includes(team.id)
                                    ? "bg-[#1a2d5c]/10"
                                    : "hover:bg-slate-100"
                                }`}
                                data-testid={`team-${team.id}`}
                              >
                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                  {team.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium text-slate-700 text-xs">{team.name}</span>
                                  <span className="text-slate-400 text-xs ml-2">{team.city}, {team.state}</span>
                                </div>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                  selected.includes(team.id)
                                    ? "bg-[#1a2d5c] border-[#1a2d5c]"
                                    : "border-slate-300"
                                }`}>
                                  {selected.includes(team.id) && (
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected count footer */}
      {selected.length > 0 && (
        <div className="pt-4 border-t border-slate-100 mt-4">
          <p className="text-center text-sm text-slate-600">
            <span className="font-bold text-[#1a2d5c]">{selected.length}</span> items selected
          </p>
        </div>
      )}
    </div>
  );
}
