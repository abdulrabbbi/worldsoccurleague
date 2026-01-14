import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  X,
  Check,
  Trophy
} from "lucide-react";
import AdminLayout from "./layout";

interface League {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  countryName: string;
  countryFlag: string;
  tier: number;
  logo: string;
  isActive: boolean;
  externalApiIds: string[];
  teamCount: number;
  currentSeason: string;
}

const mockLeagues: League[] = [
  { id: "1", name: "Premier League", slug: "premier-league", countryId: "2", countryName: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["39", "EPL"], teamCount: 20, currentSeason: "2025-26" },
  { id: "2", name: "La Liga", slug: "la-liga", countryId: "3", countryName: "Spain", countryFlag: "🇪🇸", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["140", "ESP1"], teamCount: 20, currentSeason: "2025-26" },
  { id: "3", name: "Bundesliga", slug: "bundesliga", countryId: "4", countryName: "Germany", countryFlag: "🇩🇪", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["78", "GER1"], teamCount: 18, currentSeason: "2025-26" },
  { id: "4", name: "Serie A", slug: "serie-a", countryId: "5", countryName: "Italy", countryFlag: "🇮🇹", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["135", "ITA1"], teamCount: 20, currentSeason: "2025-26" },
  { id: "5", name: "Ligue 1", slug: "ligue-1", countryId: "6", countryName: "France", countryFlag: "🇫🇷", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["61", "FRA1"], teamCount: 18, currentSeason: "2025-26" },
  { id: "6", name: "MLS", slug: "mls", countryId: "1", countryName: "United States", countryFlag: "🇺🇸", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["253", "MLS"], teamCount: 29, currentSeason: "2026" },
  { id: "7", name: "Championship", slug: "championship", countryId: "2", countryName: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2, logo: "⚽", isActive: true, externalApiIds: ["40", "ENG2"], teamCount: 24, currentSeason: "2025-26" },
  { id: "8", name: "Liga MX", slug: "liga-mx", countryId: "9", countryName: "Mexico", countryFlag: "🇲🇽", tier: 1, logo: "⚽", isActive: true, externalApiIds: ["262", "LIGAMX"], teamCount: 18, currentSeason: "2026" },
];

const mockCountries = [
  { id: "1", name: "United States", flag: "🇺🇸" },
  { id: "2", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "3", name: "Spain", flag: "🇪🇸" },
  { id: "4", name: "Germany", flag: "🇩🇪" },
  { id: "5", name: "Italy", flag: "🇮🇹" },
  { id: "6", name: "France", flag: "🇫🇷" },
  { id: "9", name: "Mexico", flag: "🇲🇽" },
];

function LeagueFormModal({ 
  league, 
  onClose, 
  onSave 
}: { 
  league: League | null; 
  onClose: () => void;
  onSave: (data: Partial<League>) => void;
}) {
  const [formData, setFormData] = useState({
    name: league?.name || "",
    slug: league?.slug || "",
    countryId: league?.countryId || "",
    tier: league?.tier || 1,
    logo: league?.logo || "",
    isActive: league?.isActive ?? true,
    externalApiIds: league?.externalApiIds?.join(", ") || "",
    currentSeason: league?.currentSeason || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      externalApiIds: formData.externalApiIds.split(",").map(id => id.trim()).filter(Boolean),
    });
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {league ? "Edit League" : "Add League"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              League Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="Premier League"
              required
              data-testid="input-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] font-mono text-sm"
              placeholder="premier-league"
              required
              data-testid="input-slug"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.countryId}
                onChange={(e) => setFormData(prev => ({ ...prev, countryId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                required
                data-testid="select-country"
              >
                <option value="">Select country</option>
                {mockCountries.map(c => (
                  <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ ...prev, tier: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                required
                data-testid="select-tier"
              >
                <option value={1}>Tier 1 (Top Flight)</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
                <option value={4}>Tier 4</option>
                <option value={5}>Tier 5+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Emoji
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="⚽"
                data-testid="input-logo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Season
              </label>
              <input
                type="text"
                value={formData.currentSeason}
                onChange={(e) => setFormData(prev => ({ ...prev, currentSeason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="2025-26"
                data-testid="input-season"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External API IDs
            </label>
            <input
              type="text"
              value={formData.externalApiIds}
              onChange={(e) => setFormData(prev => ({ ...prev, externalApiIds: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] font-mono text-sm"
              placeholder="39, EPL (comma-separated)"
              data-testid="input-external-api-ids"
            />
            <p className="text-xs text-gray-500 mt-1">SportMonks, API-Football, and other API IDs</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.isActive ? "bg-green-500" : "bg-gray-300"
              }`}
              data-testid="toggle-active"
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                formData.isActive ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d] flex items-center justify-center gap-2"
              data-testid="button-save"
            >
              <Check size={18} />
              {league ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeaguesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "teamCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showForm, setShowForm] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);

  const filteredLeagues = mockLeagues.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || l.countryId === filterCountry;
    const matchesTier = filterTier === "all" || l.tier === parseInt(filterTier);
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && l.isActive) ||
                          (filterStatus === "inactive" && !l.isActive);
    return matchesSearch && matchesCountry && matchesTier && matchesStatus;
  }).sort((a, b) => {
    const aVal = sortField === "name" ? a.name : a.teamCount;
    const bVal = sortField === "name" ? b.name : b.teamCount;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: "name" | "teamCount") => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSave = (data: Partial<League>) => {
    console.log("Saving league:", data);
    setShowForm(false);
    setEditingLeague(null);
  };

  const handleEdit = (league: League) => {
    setEditingLeague(league);
    setShowForm(true);
  };

  const handleToggleActive = (league: League) => {
    console.log("Toggle active:", league.id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leagues</h1>
            <p className="text-gray-500 mt-1">Manage professional and amateur leagues</p>
          </div>
          <button
            onClick={() => { setEditingLeague(null); setShowForm(true); }}
            className="px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d] flex items-center gap-2"
            data-testid="button-add-league"
          >
            <Plus size={18} />
            Add League
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leagues..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-country"
                >
                  <option value="all">All Countries</option>
                  {mockCountries.map(c => (
                    <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                  ))}
                </select>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-tier"
                >
                  <option value="all">All Tiers</option>
                  <option value="1">Tier 1</option>
                  <option value="2">Tier 2</option>
                  <option value="3">Tier 3</option>
                  <option value="4">Tier 4+</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    League
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("teamCount")}
                  >
                    <span className="flex items-center gap-1">
                      Teams
                      {sortField === "teamCount" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Season
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Mapping
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeagues.map((league) => (
                  <tr 
                    key={league.id} 
                    className="hover:bg-gray-50 transition-colors"
                    data-testid={`row-league-${league.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{league.logo}</span>
                        <div>
                          <div className="font-medium text-gray-900">{league.name}</div>
                          <div className="text-xs text-gray-500 font-mono">/{league.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        {league.countryFlag} {league.countryName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 text-sm rounded-full ${
                        league.tier === 1 ? "bg-yellow-100 text-yellow-700" :
                        league.tier === 2 ? "bg-gray-100 text-gray-700" :
                        "bg-orange-50 text-orange-600"
                      }`}>
                        Tier {league.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{league.teamCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{league.currentSeason}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {league.externalApiIds.map((id, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-mono">
                            <LinkIcon size={10} />
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(league)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full ${
                          league.isActive 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-500"
                        }`}
                        data-testid={`toggle-status-${league.id}`}
                      >
                        {league.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        {league.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(league)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          data-testid={`edit-${league.id}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"
                          data-testid={`delete-${league.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeagues.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-gray-400" size={32} />
              </div>
              <h3 className="font-medium text-gray-900">No leagues found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <LeagueFormModal
          league={editingLeague}
          onClose={() => { setShowForm(false); setEditingLeague(null); }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
