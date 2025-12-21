import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const continents = [
  { id: "usa", name: "USA Soccer Leagues", flag: "🇺🇸" },
  { id: "euro", name: "Euro Soccer Leagues", flag: "🇪🇺" },
  { id: "africa", name: "Africa Soccer Leagues", flag: "🌍" },
  { id: "asia", name: "Asia Soccer Leagues", flag: "🌏" },
  { id: "latino", name: "Latino Soccer Leagues", flag: "🌎" },
  { id: "aussie", name: "Aussie Soccer Leagues", flag: "🇦🇺" },
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
      { id: "mls", name: "MLS" },
      { id: "usl-championship", name: "USL Championship" },
      { id: "usl-league-one", name: "USL League One" },
      { id: "usl-league-two", name: "USL League Two" },
      { id: "nisa", name: "NISA" },
      { id: "npsl", name: "NPSL" },
      { id: "upsl", name: "UPSL" },
      { id: "mls-next-pro", name: "MLS Next Pro" },
      { id: "wpsl", name: "WPSL" },
      { id: "uws", name: "UWS" },
      { id: "other-pro", name: "(all other pro and semi-pro leagues)" },
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
                {selectedCategory.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      setSelectedSubItem(subItem);
                      setIsSubItemDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedSubItem?.id === subItem.id ? 'bg-gray-50' : ''
                    }`}
                    data-testid={`button-subitem-${subItem.id}`}
                  >
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
