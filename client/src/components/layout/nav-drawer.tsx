import { ChevronDown, ChevronUp, X, Check, MapPin, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

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
  { id: "nba", name: "NBA", icon: "🏀" },
  { id: "mlb", name: "MLB", icon: "⚾" },
  { id: "nhl", name: "NHL", icon: "🏒" },
  { id: "ncaa-football", name: "NCAA Football", icon: "🏈" },
  { id: "ufl", name: "UFL", icon: "🏈" },
  { id: "ncaa-mens-basketball", name: "NCAA Men's Basketball", icon: "🏀" },
  { id: "ncaa-womens-basketball", name: "NCAA Women's Basketball", icon: "🏀" },
  { id: "wnba", name: "WNBA", icon: "🏀" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "chess", name: "Chess", icon: "♟️" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "mma", name: "MMA", icon: "🥊" },
  { id: "golf", name: "Golf", icon: "⛳" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "olympics", name: "Olympics", icon: "🏅" },
  { id: "f1", name: "Formula One", icon: "🏎️" },
  { id: "nascar", name: "NASCAR", icon: "🏎️" },
];

interface LeagueItem {
  id: string;
  name: string;
  icon?: string;
}

interface Category {
  id: string;
  name: string;
  hasLocationFilter?: boolean;
  items: LeagueItem[];
}

const USA_SOCCER_HIERARCHY: Category[] = [
  {
    id: "national-teams",
    name: "National Teams",
    items: [
      { id: "usmnt", name: "Men's National Team", icon: "🇺🇸" },
      { id: "uswnt", name: "Women's National Team", icon: "🇺🇸" },
    ]
  },
  {
    id: "professional-leagues",
    name: "Professional Leagues",
    items: [
      { id: "mls", name: "MLS", icon: "⚽" },
      { id: "mls-next-pro", name: "MLS Next Pro", icon: "⏭️" },
      { id: "usl-championship", name: "USL Championship", icon: "⭐" },
      { id: "usl-league-one", name: "USL League One", icon: "1️⃣" },
      { id: "usl-league-two", name: "USL League Two", icon: "2️⃣" },
      { id: "nisa", name: "NISA", icon: "🏆" },
      { id: "npsl", name: "NPSL", icon: "🛡️" },
      { id: "upsl", name: "UPSL", icon: "📍" },
      { id: "nwsl", name: "NWSL", icon: "👩" },
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

const US_STATES = [
  { id: "AL", name: "Alabama" }, { id: "AK", name: "Alaska" }, { id: "AZ", name: "Arizona" },
  { id: "AR", name: "Arkansas" }, { id: "CA", name: "California" }, { id: "CO", name: "Colorado" },
  { id: "CT", name: "Connecticut" }, { id: "DE", name: "Delaware" }, { id: "FL", name: "Florida" },
  { id: "GA", name: "Georgia" }, { id: "HI", name: "Hawaii" }, { id: "ID", name: "Idaho" },
  { id: "IL", name: "Illinois" }, { id: "IN", name: "Indiana" }, { id: "IA", name: "Iowa" },
  { id: "KS", name: "Kansas" }, { id: "KY", name: "Kentucky" }, { id: "LA", name: "Louisiana" },
  { id: "ME", name: "Maine" }, { id: "MD", name: "Maryland" }, { id: "MA", name: "Massachusetts" },
  { id: "MI", name: "Michigan" }, { id: "MN", name: "Minnesota" }, { id: "MS", name: "Mississippi" },
  { id: "MO", name: "Missouri" }, { id: "MT", name: "Montana" }, { id: "NE", name: "Nebraska" },
  { id: "NV", name: "Nevada" }, { id: "NH", name: "New Hampshire" }, { id: "NJ", name: "New Jersey" },
  { id: "NM", name: "New Mexico" }, { id: "NY", name: "New York" }, { id: "NC", name: "North Carolina" },
  { id: "ND", name: "North Dakota" }, { id: "OH", name: "Ohio" }, { id: "OK", name: "Oklahoma" },
  { id: "OR", name: "Oregon" }, { id: "PA", name: "Pennsylvania" }, { id: "RI", name: "Rhode Island" },
  { id: "SC", name: "South Carolina" }, { id: "SD", name: "South Dakota" }, { id: "TN", name: "Tennessee" },
  { id: "TX", name: "Texas" }, { id: "UT", name: "Utah" }, { id: "VT", name: "Vermont" },
  { id: "VA", name: "Virginia" }, { id: "WA", name: "Washington" }, { id: "WV", name: "West Virginia" },
  { id: "WI", name: "Wisconsin" }, { id: "WY", name: "Wyoming" }, { id: "DC", name: "Washington D.C." },
];

const MAJOR_CITIES: Record<string, string[]> = {
  "CA": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
  "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
  "FL": ["Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale"],
  "NY": ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"],
  "IL": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
  "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie"],
  "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  "GA": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah"],
  "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "MI": ["Detroit", "Grand Rapids", "Warren", "Ann Arbor", "Lansing"],
};

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const [selectedContinent, setSelectedContinent] = useState(continents[0]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>("continents");
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [locationSelections, setLocationSelections] = useState<Record<string, { state?: string; city?: string }>>({});
  const [activeLocationPicker, setActiveLocationPicker] = useState<{ categoryId: string; type: 'state' | 'city' } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleLocationSelect = (categoryId: string, state: string, city?: string) => {
    setLocationSelections(prev => ({
      ...prev,
      [categoryId]: { state, city }
    }));
    setActiveLocationPicker(null);
  };

  const filteredStates = useMemo(() => {
    if (!searchQuery) return US_STATES;
    return US_STATES.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!shouldRender) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        data-testid="drawer-overlay"
      />
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-[#1a2d5c]">Navigation</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            data-testid="button-close-drawer"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {/* Continent Selector */}
          <div className="mb-4">
            <button
              onClick={() => setExpandedSection(expandedSection === "continents" ? null : "continents")}
              className="w-full flex items-center justify-between py-3 border-b border-gray-100"
              data-testid="button-expand-continents"
            >
              <div className="flex items-center gap-3">
                {(selectedContinent as any).logo ? (
                  <img src={(selectedContinent as any).logo} alt={selectedContinent.name} className="w-8 h-8 object-contain rounded" />
                ) : (
                  <span className="text-2xl">{selectedContinent.flag}</span>
                )}
                <span className="font-semibold text-[#1a2d5c]">{selectedContinent.name}</span>
              </div>
              {expandedSection === "continents" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "continents" && (
              <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden">
                {continents.map((continent) => (
                  <button
                    key={continent.id}
                    onClick={() => {
                      setSelectedContinent(continent);
                      setExpandedSection("usa-hierarchy");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                      selectedContinent.id === continent.id ? 'bg-[#1a2d5c]/10' : ''
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

                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">More Sports</span>
                </div>
                {moreSports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={onClose}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                    data-testid={`button-sport-${sport.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sport.icon}</span>
                      <span className="font-medium text-gray-700">{sport.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* USA Soccer Hierarchy - Categories with Dropdowns */}
          {selectedContinent.id === "usa" && expandedSection === "usa-hierarchy" && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide mb-3">USA Soccer Leagues</h3>
              
              {USA_SOCCER_HIERARCHY.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);
                const locationData = locationSelections[category.id];
                
                return (
                  <div key={category.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                      data-testid={`nav-category-${category.id}`}
                    >
                      <span className="font-semibold text-[#1a2d5c] text-sm">{category.name}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="border-t border-slate-200">
                        {/* Location Filter */}
                        {category.hasLocationFilter && (
                          <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-xs font-medium text-[#1a2d5c] mb-2">
                              <MapPin className="w-3 h-3" />
                              <span>Find in your area</span>
                            </div>
                            
                            {/* State Selector */}
                            <div className="relative mb-2">
                              <button
                                onClick={() => setActiveLocationPicker(
                                  activeLocationPicker?.categoryId === category.id && activeLocationPicker.type === 'state' 
                                    ? null 
                                    : { categoryId: category.id, type: 'state' }
                                )}
                                className="w-full flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-left text-sm"
                              >
                                <span className={locationData?.state ? "text-slate-900" : "text-slate-400"}>
                                  {locationData?.state ? US_STATES.find(s => s.id === locationData.state)?.name : "Select State"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              </button>
                              
                              {activeLocationPicker?.categoryId === category.id && activeLocationPicker.type === 'state' && (
                                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-hidden">
                                  <div className="p-2 border-b border-slate-100">
                                    <div className="relative">
                                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                      <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1a2d5c]"
                                      />
                                    </div>
                                  </div>
                                  <div className="overflow-y-auto max-h-32">
                                    {filteredStates.map(state => (
                                      <button
                                        key={state.id}
                                        onClick={() => {
                                          handleLocationSelect(category.id, state.id);
                                          setSearchQuery("");
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50"
                                      >
                                        {state.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* City Selector */}
                            {locationData?.state && (
                              <div className="relative">
                                <button
                                  onClick={() => setActiveLocationPicker(
                                    activeLocationPicker?.categoryId === category.id && activeLocationPicker.type === 'city' 
                                      ? null 
                                      : { categoryId: category.id, type: 'city' }
                                  )}
                                  className="w-full flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-left text-sm"
                                >
                                  <span className={locationData?.city ? "text-slate-900" : "text-slate-400"}>
                                    {locationData?.city || "Select City (optional)"}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                
                                {activeLocationPicker?.categoryId === category.id && activeLocationPicker.type === 'city' && (
                                  <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {(MAJOR_CITIES[locationData.state] || ["Other"]).map(city => (
                                      <button
                                        key={city}
                                        onClick={() => handleLocationSelect(category.id, locationData.state!, city)}
                                        className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50"
                                      >
                                        {city}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* League/Team Items */}
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={onClose}
                            className="w-full flex items-center gap-3 p-3 pl-4 border-b border-slate-100 last:border-b-0 bg-white hover:bg-slate-50 transition-all text-left"
                            data-testid={`nav-item-${item.id}`}
                          >
                            <div className="w-7 h-7 flex items-center justify-center text-lg">
                              {item.icon}
                            </div>
                            <span className="font-medium text-slate-800 text-sm">{item.name}</span>
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
      </div>
    </>
  );
}
