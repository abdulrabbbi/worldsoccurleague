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
  Flag
} from "lucide-react";
import AdminLayout from "./layout";

interface Country {
  id: string;
  code: string;
  name: string;
  slug: string;
  continentId: string;
  continentName: string;
  flag: string;
  isActive: boolean;
  externalApiIds: string[];
  leagueCount: number;
}

const mockCountries: Country[] = [
  { id: "1", code: "US", name: "United States", slug: "united-states", continentId: "1", continentName: "North America", flag: "🇺🇸", isActive: true, externalApiIds: ["USA"], leagueCount: 12 },
  { id: "2", code: "GB", name: "England", slug: "england", continentId: "2", continentName: "Europe", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", isActive: true, externalApiIds: ["ENG", "462"], leagueCount: 8 },
  { id: "3", code: "ES", name: "Spain", slug: "spain", continentId: "2", continentName: "Europe", flag: "🇪🇸", isActive: true, externalApiIds: ["ESP", "32"], leagueCount: 5 },
  { id: "4", code: "DE", name: "Germany", slug: "germany", continentId: "2", continentName: "Europe", flag: "🇩🇪", isActive: true, externalApiIds: ["GER", "81"], leagueCount: 5 },
  { id: "5", code: "IT", name: "Italy", slug: "italy", continentId: "2", continentName: "Europe", flag: "🇮🇹", isActive: true, externalApiIds: ["ITA", "380"], leagueCount: 4 },
  { id: "6", code: "FR", name: "France", slug: "france", continentId: "2", continentName: "Europe", flag: "🇫🇷", isActive: true, externalApiIds: ["FRA", "250"], leagueCount: 4 },
  { id: "7", code: "BR", name: "Brazil", slug: "brazil", continentId: "3", continentName: "South America", flag: "🇧🇷", isActive: true, externalApiIds: ["BRA", "76"], leagueCount: 6 },
  { id: "8", code: "AR", name: "Argentina", slug: "argentina", continentId: "3", continentName: "South America", flag: "🇦🇷", isActive: true, externalApiIds: ["ARG", "32"], leagueCount: 4 },
  { id: "9", code: "MX", name: "Mexico", slug: "mexico", continentId: "1", continentName: "North America", flag: "🇲🇽", isActive: true, externalApiIds: ["MEX", "484"], leagueCount: 3 },
  { id: "10", code: "JP", name: "Japan", slug: "japan", continentId: "4", continentName: "Asia", flag: "🇯🇵", isActive: true, externalApiIds: ["JPN", "392"], leagueCount: 3 },
];

const mockContinents = [
  { id: "1", name: "North America" },
  { id: "2", name: "Europe" },
  { id: "3", name: "South America" },
  { id: "4", name: "Asia" },
  { id: "5", name: "Africa" },
  { id: "6", name: "Aussie" },
];

function CountryFormModal({ 
  country, 
  onClose, 
  onSave 
}: { 
  country: Country | null; 
  onClose: () => void;
  onSave: (data: Partial<Country>) => void;
}) {
  const [formData, setFormData] = useState({
    code: country?.code || "",
    name: country?.name || "",
    slug: country?.slug || "",
    continentId: country?.continentId || "",
    flag: country?.flag || "",
    isActive: country?.isActive ?? true,
    externalApiIds: country?.externalApiIds?.join(", ") || "",
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
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {country ? "Edit Country" : "Add Country"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="US"
                maxLength={3}
                required
                data-testid="input-code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flag Emoji
              </label>
              <input
                type="text"
                value={formData.flag}
                onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="🇺🇸"
                data-testid="input-flag"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="United States"
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
              placeholder="united-states"
              required
              data-testid="input-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Continent <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.continentId}
              onChange={(e) => setFormData(prev => ({ ...prev, continentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              required
              data-testid="select-continent"
            >
              <option value="">Select continent</option>
              {mockContinents.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
              placeholder="USA, 840 (comma-separated)"
              data-testid="input-external-api-ids"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated IDs for external API mapping</p>
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
              {country ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterContinent, setFilterContinent] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "leagueCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const filteredCountries = mockCountries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = filterContinent === "all" || c.continentId === filterContinent;
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && c.isActive) ||
                          (filterStatus === "inactive" && !c.isActive);
    return matchesSearch && matchesContinent && matchesStatus;
  }).sort((a, b) => {
    const aVal = sortField === "name" ? a.name : a.leagueCount;
    const bVal = sortField === "name" ? b.name : b.leagueCount;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: "name" | "leagueCount") => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSave = (data: Partial<Country>) => {
    console.log("Saving country:", data);
    setShowForm(false);
    setEditingCountry(null);
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleToggleActive = (country: Country) => {
    console.log("Toggle active:", country.id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
            <p className="text-gray-500 mt-1">Manage countries within continents</p>
          </div>
          <button
            onClick={() => { setEditingCountry(null); setShowForm(true); }}
            className="px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d] flex items-center gap-2"
            data-testid="button-add-country"
          >
            <Plus size={18} />
            Add Country
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
                  placeholder="Search countries..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterContinent}
                  onChange={(e) => setFilterContinent(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-continent"
                >
                  <option value="all">All Continents</option>
                  {mockContinents.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Continent
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("leagueCount")}
                  >
                    <span className="flex items-center gap-1">
                      Leagues
                      {sortField === "leagueCount" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
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
                {filteredCountries.map((country) => (
                  <tr 
                    key={country.id} 
                    className="hover:bg-gray-50 transition-colors"
                    data-testid={`row-country-${country.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-medium text-gray-900">{country.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{country.code} • /{country.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {country.continentName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {country.leagueCount} leagues
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {country.externalApiIds.map((id, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-mono">
                            <LinkIcon size={10} />
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(country)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full ${
                          country.isActive 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-500"
                        }`}
                        data-testid={`toggle-status-${country.id}`}
                      >
                        {country.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        {country.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(country)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          data-testid={`edit-${country.id}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"
                          data-testid={`delete-${country.id}`}
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

          {filteredCountries.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flag className="text-gray-400" size={32} />
              </div>
              <h3 className="font-medium text-gray-900">No countries found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <CountryFormModal
          country={editingCountry}
          onClose={() => { setShowForm(false); setEditingCountry(null); }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
