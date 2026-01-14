import { useState, useEffect, createContext, useContext } from "react";
import { Link } from "wouter";
import { 
  LayoutDashboard, 
  Globe, 
  Flag, 
  Trophy, 
  Layers, 
  Users, 
  FileCheck, 
  ClipboardList, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Puzzle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Sport {
  id: string;
  code: string;
  name: string;
  slug: string;
  icon: string | null;
}

const STORAGE_KEY = "wsl_admin_sport";
const DEFAULT_SPORT = "soccer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface AdminSportContextValue {
  selectedSportSlug: string;
  selectedSport: Sport | null;
  sports: Sport[];
}

const AdminSportContext = createContext<AdminSportContextValue | null>(null);

export function useAdminSport(): AdminSportContextValue {
  const context = useContext(AdminSportContext);
  if (!context) {
    return { selectedSportSlug: DEFAULT_SPORT, selectedSport: null, sports: [] };
  }
  return context;
}

const menuItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    path: "/admin" 
  },
  { 
    id: "hierarchy", 
    label: "Hierarchy", 
    icon: Globe,
    children: [
      { id: "continents", label: "Continents", path: "/admin/continents" },
      { id: "countries", label: "Countries", path: "/admin/countries" },
      { id: "leagues", label: "Leagues", path: "/admin/leagues" },
      { id: "divisions", label: "Divisions", path: "/admin/divisions" },
      { id: "teams", label: "Teams", path: "/admin/teams" },
    ]
  },
  { 
    id: "seasons", 
    label: "Seasons & Fixtures", 
    icon: Trophy,
    children: [
      { id: "seasons", label: "Seasons", path: "/admin/seasons" },
      { id: "fixtures", label: "Fixtures", path: "/admin/fixtures" },
      { id: "standings", label: "Standings", path: "/admin/standings" },
    ]
  },
  { 
    id: "grassroots", 
    label: "Grassroots Queue", 
    icon: FileCheck, 
    path: "/admin/grassroots" 
  },
  { 
    id: "api-mapping", 
    label: "API Mapping", 
    icon: Layers, 
    path: "/admin/api-mapping" 
  },
  { 
    id: "integrations", 
    label: "Integrations", 
    icon: Puzzle, 
    path: "/admin/integrations" 
  },
  { 
    id: "users", 
    label: "Users & Roles", 
    icon: Users, 
    path: "/admin/users" 
  },
  { 
    id: "audit-logs", 
    label: "Audit Logs", 
    icon: ClipboardList, 
    path: "/admin/audit-logs" 
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings, 
    path: "/admin/settings" 
  },
];

function useWindowLocation() {
  const [loc, setLoc] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setLoc({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };

    window.addEventListener("popstate", handleLocationChange);
    
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return loc;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const windowLocation = useWindowLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["hierarchy"]);
  const { user, setUser } = useAuth();
  
  const [sports, setSports] = useState<Sport[]>([]);
  
  const getSportFromUrl = (): string => {
    const urlParams = new URLSearchParams(windowLocation.search);
    const sportParam = urlParams.get("sport");
    if (sportParam) {
      return sportParam;
    }
    return DEFAULT_SPORT;
  };
  
  const selectedSportSlug = getSportFromUrl();

  useEffect(() => {
    if (selectedSportSlug !== DEFAULT_SPORT) {
      localStorage.setItem(STORAGE_KEY, selectedSportSlug);
    }
  }, [selectedSportSlug]);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const data = await response.json();
          setSports(data);
        }
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };
    loadSports();
  }, []);

  const handleSportChange = (slug: string) => {
    localStorage.setItem(STORAGE_KEY, slug);
    
    const url = new URL(window.location.href);
    if (slug === DEFAULT_SPORT) {
      url.searchParams.delete("sport");
    } else {
      url.searchParams.set("sport", slug);
    }
    window.history.pushState({}, "", url.pathname + url.search);
  };

  const selectedSport = sports.find(s => s.slug === selectedSportSlug) || null;

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wsl_user');
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path: string) => windowLocation.pathname === path;
  const isParentActive = (children: { path: string }[]) => 
    children.some(child => windowLocation.pathname === child.path);

  const getNavPath = (path: string) => {
    if (selectedSportSlug && selectedSportSlug !== DEFAULT_SPORT) {
      return `${path}?sport=${selectedSportSlug}`;
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside 
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1a2d5c] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C1153D] rounded-lg flex items-center justify-center font-bold text-lg">
                WSL
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-white/60">World Soccer Leagues</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#C1153D] rounded-lg flex items-center justify-center font-bold text-lg mx-auto">
              W
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg"
            data-testid="toggle-sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isParentActive(item.children) 
                        ? "bg-white/20 text-white" 
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    data-testid={`menu-${item.id}`}
                  >
                    <item.icon size={20} />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {expandedMenus.includes(item.id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </>
                    )}
                  </button>
                  {sidebarOpen && expandedMenus.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/20 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={getNavPath(child.path)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.path)
                              ? "bg-[#C1153D] text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                          data-testid={`menu-${child.id}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={getNavPath(item.path!)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path!)
                      ? "bg-[#C1153D] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`menu-${item.id}`}
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {sidebarOpen && user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name || "Admin"}</p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Sport:</span>
              <div className="flex gap-1">
                {sports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => handleSportChange(sport.slug)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      selectedSportSlug === sport.slug
                        ? "bg-[#1a2d5c] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    data-testid={`sport-filter-${sport.code}`}
                  >
                    <span>{sport.icon}</span>
                    <span className="hidden sm:inline">{sport.code === "soccer" ? "Soccer" : sport.code.toUpperCase()}</span>
                  </button>
                ))}
                <button
                  onClick={() => handleSportChange("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedSportSlug === "all"
                      ? "bg-[#1a2d5c] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid="sport-filter-all"
                >
                  All
                </button>
              </div>
            </div>
            {selectedSport && (
              <div className="text-sm text-gray-500">
                Viewing: <span className="font-medium text-gray-900">{selectedSport.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <AdminSportContext.Provider value={{ selectedSportSlug, selectedSport, sports }}>
            {children}
          </AdminSportContext.Provider>
        </div>
      </main>
    </div>
  );
}
