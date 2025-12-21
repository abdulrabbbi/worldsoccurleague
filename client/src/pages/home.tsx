import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const continents = [
  { id: "usa", name: "USA Soccer Leagues", flag: "🇺🇸", logo: "/attached_assets/USASL_Icon_1766299234835.jpeg" },
  { id: "euro", name: "Euro Soccer Leagues", flag: "🇪🇺" },
  { id: "africa", name: "Africa Soccer Leagues", flag: "🌍" },
  { id: "asia", name: "Asia Soccer Leagues", flag: "🌏" },
  { id: "latino", name: "Latino Soccer Leagues", flag: "🌎" },
  { id: "aussie", name: "Aussie Soccer Leagues", flag: "🇦🇺" },
];

const moreSports = [
  { id: "nfl", name: "NFL", icon: "🏈" },
  { id: "ncaa-football", name: "NCAA Football", icon: "🏈" },
  { id: "nba", name: "NBA", icon: "🏀" },
  { id: "nhl", name: "NHL", icon: "🏒" },
  { id: "ncaa-mens-basketball", name: "NCAA Men's Basketball", icon: "🏀" },
  { id: "ncaa-womens-basketball", name: "NCAA Women's Basketball", icon: "🏀" },
  { id: "mlb", name: "MLB", icon: "⚾" },
  { id: "wnba", name: "WNBA", icon: "🏀" },
  { id: "wwe", name: "WWE", icon: "🤼" },
  { id: "golf", name: "Golf", icon: "⛳" },
  { id: "pga-tour", name: "PGA Tour", icon: "⛳" },
  { id: "lpga-tour", name: "LPGA Tour", icon: "⛳" },
  { id: "liv-golf", name: "LIV Golf", icon: "⛳" },
  { id: "tgl", name: "TGL", icon: "⛳" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "mens-tennis", name: "Men's Tennis", icon: "🎾" },
  { id: "womens-tennis", name: "Women's Tennis", icon: "🎾" },
  { id: "mma", name: "MMA", icon: "🥊" },
  { id: "pfl", name: "Professional Fighters League", icon: "🥊" },
  { id: "ufl", name: "UFL", icon: "🏈" },
  { id: "ncaa-womens-volleyball", name: "NCAA Women's Volleyball", icon: "🏐" },
  { id: "nll", name: "National Lacrosse League", icon: "🥍" },
  { id: "pll", name: "Premier Lacrosse League", icon: "🥍" },
  { id: "racing", name: "Racing", icon: "🏁" },
  { id: "f1", name: "Formula One", icon: "🏎️" },
  { id: "nascar", name: "NASCAR Cup Series", icon: "🏎️" },
  { id: "indycar", name: "IndyCar Series", icon: "🏎️" },
];

const categories = [
  { 
    id: "national-teams", 
    name: "National Teams", 
    icon: "🏆",
    subItems: [
      { id: "mens", name: "Men's" },
      { id: "womens", name: "Women's" },
    ]
  },
  { 
    id: "professional", 
    name: "Professional Soccer", 
    icon: "⚽",
    subItems: [
      { id: "mls", name: "MLS", logo: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/19.png&w=80&h=80" },
      { id: "usl-championship", name: "USL Championship", logo: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/8702.png&w=80&h=80" },
      { id: "usl-league-one", name: "USL League One", logoIcon: "1", logoBg: "#00B4D8" },
      { id: "usl-league-two", name: "USL League Two", logoIcon: "2", logoBg: "#E63946" },
      { id: "nisa", name: "NISA", logo: "https://cdn.ssref.net/req/202312141/tlogo/fb/95d2b0ed.png" },
      { id: "npsl", name: "NPSL", logo: "https://cdn.ssref.net/req/202312141/tlogo/fb/8ef3de95.png" },
      { id: "upsl", name: "UPSL", logoIcon: "UPSL", logoBg: "#1E40AF" },
      { id: "mls-next-pro", name: "MLS Next Pro", logo: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/22485.png&w=80&h=80" },
      { id: "wpsl", name: "WPSL", logoIcon: "W", logoBg: "#C1153D" },
      { id: "uws", name: "UWS", logoIcon: "UWS", logoBg: "#E63946" },
      { id: "other-pro", name: "(all other pro and semi-pro leagues)", logoIcon: "1", logoBg: "#00B4D8" },
    ]
  },
  { id: "college", name: "College Soccer", icon: "🎓", subItems: [] },
  { id: "high-school", name: "High School Soccer", icon: "🏫", subItems: [] },
  { id: "youth", name: "Youth Soccer", icon: "👦", subItems: [] },
  { id: "sanctioned", name: "Sanctioned Leagues", icon: "✅", subItems: [] },
  { id: "pickup", name: "Pickup Soccer", icon: "🤝", subItems: [] },
  { id: "fan-clubs", name: "Fan Clubs", icon: "📣", subItems: [] },
];

export default function Home() {
  const matches = api.getMatches();
  const liveMatches = matches.filter(m => m.status === "LIVE");
  const upcomingMatches = matches.filter(m => m.status !== "LIVE");
  const [selectedContinent, setSelectedContinent] = useState(continents[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSubItem, setSelectedSubItem] = useState<{id: string, name: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubItemDropdownOpen, setIsSubItemDropdownOpen] = useState(false);

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
              {(selectedContinent as any).logo ? (
                <img src={(selectedContinent as any).logo} alt={selectedContinent.name} className="w-8 h-8 object-contain rounded" />
              ) : (
                <span className="text-2xl">{selectedContinent.flag}</span>
              )}
              <span className="font-semibold text-[#1a2d5c]">{selectedContinent.name}</span>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
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
                  {(continent as any).logo ? (
                    <img src={(continent as any).logo} alt={continent.name} className="w-8 h-8 object-contain rounded" />
                  ) : (
                    <span className="text-2xl">{continent.flag}</span>
                  )}
                  <span className="font-medium text-gray-700">{continent.name}</span>
                </button>
              ))}
              
              {/* Divider and More Sports Section */}
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-4 py-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">More Sports</span>
              </div>
              {moreSports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  data-testid={`button-sport-${sport.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sport.icon}</span>
                    <span className="font-medium text-gray-700">{sport.name}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Dropdown - shows ONLY for USA Soccer Leagues */}
        {selectedContinent.id === "usa" && (
          <div className="relative mt-3">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              data-testid="button-category-dropdown"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCategory.icon}</span>
                <span className="font-semibold text-[#1a2d5c]">{selectedCategory.name}</span>
              </div>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubItem(null);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedCategory.id === category.id ? 'bg-gray-50' : ''
                    }`}
                    data-testid={`button-category-${category.id}`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-Item Dropdown - shows when USA is selected AND category has sub-items */}
        {selectedContinent.id === "usa" && selectedCategory.subItems && selectedCategory.subItems.length > 0 && (
          <div className="relative mt-3">
            <button
              onClick={() => setIsSubItemDropdownOpen(!isSubItemDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              data-testid="button-subitem-dropdown"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1a2d5c]">
                  {selectedSubItem ? selectedSubItem.name : `Select ${selectedCategory.name}`}
                </span>
              </div>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isSubItemDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSubItemDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                {selectedCategory.subItems.map((subItem: any) => (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      setSelectedSubItem(subItem);
                      setIsSubItemDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedSubItem?.id === subItem.id ? 'bg-[#1a2d5c]/10 border-l-4 border-[#1a2d5c]' : ''
                    }`}
                    data-testid={`button-subitem-${subItem.id}`}
                  >
                    {subItem.logo ? (
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1.5">
                        <img src={subItem.logo} alt={subItem.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                        style={{ backgroundColor: subItem.logoBg || '#00B4D8' }}
                      >
                        <span className="text-sm">{subItem.logoIcon || '?'}</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-700">{subItem.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other continents - coming soon */}
        {selectedContinent.id !== "usa" && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 text-sm">Leagues for {selectedContinent.name} coming soon!</p>
          </div>
        )}
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
