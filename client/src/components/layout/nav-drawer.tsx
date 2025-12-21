import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";

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

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const [selectedContinent, setSelectedContinent] = useState(continents[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSubItem, setSelectedSubItem] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("continents");
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
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
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedSection === "continents" ? 'rotate-180' : ''}`} />
            </button>

            {expandedSection === "continents" && (
              <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden">
                {continents.map((continent) => (
                  <button
                    key={continent.id}
                    onClick={() => {
                      setSelectedContinent(continent);
                      setExpandedSection("categories");
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
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedContinent.id === "usa" && (
            <div className="mb-4">
              <button
                onClick={() => setExpandedSection(expandedSection === "categories" ? null : "categories")}
                className="w-full flex items-center justify-between py-3 border-b border-gray-100"
                data-testid="button-expand-categories"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{selectedCategory.icon}</span>
                  <span className="font-semibold text-[#1a2d5c]">{selectedCategory.name}</span>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedSection === "categories" ? 'rotate-180' : ''}`} />
              </button>

              {expandedSection === "categories" && (
                <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                        if (category.subItems.length > 0) {
                          setExpandedSection("subitems");
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                        selectedCategory.id === category.id ? 'bg-[#1a2d5c]/10' : ''
                      }`}
                      data-testid={`button-category-${category.id}`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-700">{category.name}</span>
                      {category.subItems.length > 0 && (
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedContinent.id === "usa" && selectedCategory.subItems.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setExpandedSection(expandedSection === "subitems" ? null : "subitems")}
                className="w-full flex items-center justify-between py-3 border-b border-gray-100"
                data-testid="button-expand-subitems"
              >
                <span className="font-semibold text-[#1a2d5c]">{selectedSubItem?.name || "Select League"}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedSection === "subitems" ? 'rotate-180' : ''}`} />
              </button>

              {expandedSection === "subitems" && (
                <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {selectedCategory.subItems.map((subItem: any) => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        setSelectedSubItem(subItem);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                        selectedSubItem?.id === subItem.id ? 'bg-[#1a2d5c]/10' : ''
                      }`}
                      data-testid={`button-subitem-${subItem.id}`}
                    >
                      {subItem.logo ? (
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1">
                          <img src={subItem.logo} alt={subItem.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                          style={{ backgroundColor: subItem.logoBg || '#00B4D8' }}
                        >
                          <span className="text-xs">{subItem.logoIcon || '?'}</span>
                        </div>
                      )}
                      <span className="font-medium text-gray-700">{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
