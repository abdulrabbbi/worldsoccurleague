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
  Users
} from "lucide-react";
import AdminLayout from "./layout";

interface Team {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  leagueId: string;
  leagueName: string;
  countryName: string;
  countryFlag: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  founded: number | null;
  venue: string;
  isActive: boolean;
  externalApiIds: string[];
  playerCount: number;
}

const mockTeams: Team[] = [
  { id: "1", name: "Manchester United", shortName: "MUN", slug: "manchester-united", leagueId: "1", leagueName: "Premier League", countryName: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logo: "🔴", primaryColor: "#DA291C", secondaryColor: "#FBE122", founded: 1878, venue: "Old Trafford", isActive: true, externalApiIds: ["33", "MU"], playerCount: 27 },
  { id: "2", name: "Liverpool FC", shortName: "LIV", slug: "liverpool", leagueId: "1", leagueName: "Premier League", countryName: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logo: "🔴", primaryColor: "#C8102E", secondaryColor: "#00B2A9", founded: 1892, venue: "Anfield", isActive: true, externalApiIds: ["40", "LFC"], playerCount: 26 },
  { id: "3", name: "Real Madrid", shortName: "RMA", slug: "real-madrid", leagueId: "2", leagueName: "La Liga", countryName: "Spain", countryFlag: "🇪🇸", logo: "⚪", primaryColor: "#FFFFFF", secondaryColor: "#00529F", founded: 1902, venue: "Santiago Bernabéu", isActive: true, externalApiIds: ["541", "RM"], playerCount: 25 },
  { id: "4", name: "Barcelona", shortName: "BAR", slug: "barcelona", leagueId: "2", leagueName: "La Liga", countryName: "Spain", countryFlag: "🇪🇸", logo: "🔵", primaryColor: "#004D98", secondaryColor: "#A50044", founded: 1899, venue: "Camp Nou", isActive: true, externalApiIds: ["529", "FCB"], playerCount: 24 },
  { id: "5", name: "Bayern Munich", shortName: "BAY", slug: "bayern-munich", leagueId: "3", leagueName: "Bundesliga", countryName: "Germany", countryFlag: "🇩🇪", logo: "🔴", primaryColor: "#DC052D", secondaryColor: "#0066B2", founded: 1900, venue: "Allianz Arena", isActive: true, externalApiIds: ["157", "FCB"], playerCount: 28 },
  { id: "6", name: "Inter Miami CF", shortName: "MIA", slug: "inter-miami", leagueId: "6", leagueName: "MLS", countryName: "United States", countryFlag: "🇺🇸", logo: "🩷", primaryColor: "#F5B8C9", secondaryColor: "#231F20", founded: 2018, venue: "Chase Stadium", isActive: true, externalApiIds: ["2297", "MIA"], playerCount: 30 },
  { id: "7", name: "LA Galaxy", shortName: "LAG", slug: "la-galaxy", leagueId: "6", leagueName: "MLS", countryName: "United States", countryFlag: "🇺🇸", logo: "🌟", primaryColor: "#00245D", secondaryColor: "#FFD200", founded: 1994, venue: "Dignity Health Sports Park", isActive: true, externalApiIds: ["1600", "LA"], playerCount: 28 },
  { id: "8", name: "Juventus", shortName: "JUV", slug: "juventus", leagueId: "4", leagueName: "Serie A", countryName: "Italy", countryFlag: "🇮🇹", logo: "⬜", primaryColor: "#000000", secondaryColor: "#FFFFFF", founded: 1897, venue: "Allianz Stadium", isActive: true, externalApiIds: ["496", "JUV"], playerCount: 26 },
];

const mockLeagues = [
  { id: "1", name: "Premier League" },
  { id: "2", name: "La Liga" },
  { id: "3", name: "Bundesliga" },
  { id: "4", name: "Serie A" },
  { id: "5", name: "Ligue 1" },
  { id: "6", name: "MLS" },
];

function TeamFormModal({ 
  team, 
  onClose, 
  onSave 
}: { 
  team: Team | null; 
  onClose: () => void;
  onSave: (data: Partial<Team>) => void;
}) {
  const [formData, setFormData] = useState({
    name: team?.name || "",
    shortName: team?.shortName || "",
    slug: team?.slug || "",
    leagueId: team?.leagueId || "",
    logo: team?.logo || "",
    primaryColor: team?.primaryColor || "#1a2d5c",
    secondaryColor: team?.secondaryColor || "#ffffff",
    founded: team?.founded?.toString() || "",
    venue: team?.venue || "",
    isActive: team?.isActive ?? true,
    externalApiIds: team?.externalApiIds?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      founded: formData.founded ? parseInt(formData.founded) : null,
      externalApiIds: formData.externalApiIds.split(",").map(id => id.trim()).filter(Boolean),
    });
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      shortName: name.substring(0, 3).toUpperCase(),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {team ? "Edit Team" : "Add Team"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="Manchester United"
                required
                data-testid="input-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Name
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="MUN"
                maxLength={4}
                data-testid="input-short-name"
              />
            </div>
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
              placeholder="manchester-united"
              required
              data-testid="input-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              League <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.leagueId}
              onChange={(e) => setFormData(prev => ({ ...prev, leagueId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              required
              data-testid="select-league"
            >
              <option value="">Select league</option>
              {mockLeagues.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
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
                placeholder="🔴"
                data-testid="input-logo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                value={formData.founded}
                onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="1878"
                min="1800"
                max="2030"
                data-testid="input-founded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer"
                  data-testid="input-primary-color"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer"
                  data-testid="input-secondary-color"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stadium/Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="Old Trafford"
              data-testid="input-venue"
            />
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
              placeholder="33, MU (comma-separated)"
              data-testid="input-external-api-ids"
            />
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
              {team ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLeague, setFilterLeague] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filteredTeams = mockTeams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = filterLeague === "all" || t.leagueId === filterLeague;
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && t.isActive) ||
                          (filterStatus === "inactive" && !t.isActive);
    return matchesSearch && matchesLeague && matchesStatus;
  });

  const handleSave = (data: Partial<Team>) => {
    console.log("Saving team:", data);
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleToggleActive = (team: Team) => {
    console.log("Toggle active:", team.id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-500 mt-1">Manage teams within leagues</p>
          </div>
          <button
            onClick={() => { setEditingTeam(null); setShowForm(true); }}
            className="px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d] flex items-center gap-2"
            data-testid="button-add-team"
          >
            <Plus size={18} />
            Add Team
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
                  placeholder="Search teams..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterLeague}
                  onChange={(e) => setFilterLeague(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-league"
                >
                  <option value="all">All Leagues</option>
                  {mockLeagues.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredTeams.map((team) => (
              <div 
                key={team.id} 
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                data-testid={`card-team-${team.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: team.primaryColor + "20" }}
                    >
                      {team.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.countryFlag} {team.leagueName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(team)}
                    className={`p-1.5 rounded-lg ${
                      team.isActive ? "text-green-600" : "text-gray-400"
                    }`}
                    data-testid={`toggle-status-${team.id}`}
                  >
                    {team.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Players</span>
                    <span className="text-gray-900 font-medium">{team.playerCount}</span>
                  </div>
                  {team.venue && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Venue</span>
                      <span className="text-gray-900">{team.venue}</span>
                    </div>
                  )}
                  {team.founded && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Founded</span>
                      <span className="text-gray-900">{team.founded}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Colors</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-5 h-5 rounded border border-gray-200" 
                        style={{ backgroundColor: team.primaryColor }}
                      />
                      <div 
                        className="w-5 h-5 rounded border border-gray-200" 
                        style={{ backgroundColor: team.secondaryColor }}
                      />
                    </div>
                  </div>
                </div>

                {team.externalApiIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {team.externalApiIds.map((id, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-mono">
                        <LinkIcon size={10} />
                        {id}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(team)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                    data-testid={`edit-${team.id}`}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    data-testid={`delete-${team.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gray-400" size={32} />
              </div>
              <h3 className="font-medium text-gray-900">No teams found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <TeamFormModal
          team={editingTeam}
          onClose={() => { setShowForm(false); setEditingTeam(null); }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
