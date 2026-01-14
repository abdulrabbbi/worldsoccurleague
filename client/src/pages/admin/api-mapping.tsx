import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  X,
  Check,
  Code,
  Database,
  ExternalLink,
  Copy,
  CheckCheck
} from "lucide-react";
import AdminLayout from "./layout";

interface ProviderMapping {
  id: string;
  providerName: string;
  providerEntityType: string;
  providerEntityId: string;
  internalEntityId: string;
  providerEntityName: string;
  rawPayload: any;
  lastSyncedAt: string | null;
  isActive: boolean;
}

const mockProviders = [
  { id: "sportmonks", name: "SportMonks", color: "bg-blue-100 text-blue-700" },
  { id: "api_football", name: "API-Football", color: "bg-green-100 text-green-700" },
  { id: "football_data", name: "Football-Data.org", color: "bg-purple-100 text-purple-700" },
];

const entityTypes = [
  { id: "continent", label: "Continent" },
  { id: "country", label: "Country" },
  { id: "league", label: "League" },
  { id: "team", label: "Team" },
  { id: "season", label: "Season" },
  { id: "player", label: "Player" },
  { id: "fixture", label: "Fixture" },
];

const mockMappings: ProviderMapping[] = [
  {
    id: "1",
    providerName: "sportmonks",
    providerEntityType: "league",
    providerEntityId: "8",
    internalEntityId: "league-premier-league",
    providerEntityName: "Premier League",
    rawPayload: {
      id: 8,
      sport_id: 1,
      country_id: 462,
      name: "Premier League",
      active: true,
      short_code: "UK PL",
      image_path: "https://cdn.sportmonks.com/images/soccer/leagues/8/8.png",
      type: "league",
      sub_type: "domestic",
      has_jerseys: false
    },
    lastSyncedAt: "2026-01-14T10:30:00Z",
    isActive: true
  },
  {
    id: "2",
    providerName: "sportmonks",
    providerEntityType: "team",
    providerEntityId: "19",
    internalEntityId: "team-arsenal",
    providerEntityName: "Arsenal",
    rawPayload: {
      id: 19,
      sport_id: 1,
      country_id: 462,
      venue_id: 204,
      gender: "male",
      name: "Arsenal",
      short_code: "ARS",
      image_path: "https://cdn.sportmonks.com/images/soccer/teams/19/19.png",
      founded: 1886,
      type: "domestic",
      last_played_at: "2026-01-12 17:30:00"
    },
    lastSyncedAt: "2026-01-14T09:15:00Z",
    isActive: true
  },
  {
    id: "3",
    providerName: "sportmonks",
    providerEntityType: "country",
    providerEntityId: "462",
    internalEntityId: "country-england",
    providerEntityName: "England",
    rawPayload: {
      id: 462,
      continent_id: 1,
      name: "England",
      official_name: "England",
      fifa_name: "ENG",
      iso2: "EN",
      iso3: "ENG",
      latitude: "52.3555177",
      longitude: "-1.1743197",
      borders: ["WLS", "SCT"],
      image_path: "https://cdn.sportmonks.com/images/countries/png/short/en.png"
    },
    lastSyncedAt: "2026-01-13T15:00:00Z",
    isActive: true
  },
  {
    id: "4",
    providerName: "api_football",
    providerEntityType: "league",
    providerEntityId: "39",
    internalEntityId: "league-premier-league",
    providerEntityName: "Premier League",
    rawPayload: {
      league: {
        id: 39,
        name: "Premier League",
        type: "League",
        logo: "https://media.api-sports.io/football/leagues/39.png"
      },
      country: {
        name: "England",
        code: "GB",
        flag: "https://media.api-sports.io/flags/gb.svg"
      },
      seasons: [
        { year: 2025, start: "2025-08-16", end: "2026-05-25", current: true }
      ]
    },
    lastSyncedAt: "2026-01-14T08:00:00Z",
    isActive: true
  },
  {
    id: "5",
    providerName: "sportmonks",
    providerEntityType: "season",
    providerEntityId: "23614",
    internalEntityId: "season-epl-2025-26",
    providerEntityName: "2025/2026",
    rawPayload: {
      id: 23614,
      sport_id: 1,
      league_id: 8,
      tie_breaker_rule_id: 1536,
      name: "2025/2026",
      finished: false,
      pending: false,
      is_current: true,
      starting_at: "2025-08-16",
      ending_at: "2026-05-25",
      standings_recalculated_at: "2026-01-14 00:00:01"
    },
    lastSyncedAt: "2026-01-14T06:00:00Z",
    isActive: true
  },
];

const internalEntities = {
  continent: [
    { id: "continent-europe", name: "Europe" },
    { id: "continent-north-america", name: "North America" },
    { id: "continent-south-america", name: "South America" },
    { id: "continent-asia", name: "Asia" },
    { id: "continent-africa", name: "Africa" },
    { id: "continent-oceania", name: "Oceania" },
  ],
  country: [
    { id: "country-england", name: "England" },
    { id: "country-spain", name: "Spain" },
    { id: "country-germany", name: "Germany" },
    { id: "country-usa", name: "United States" },
    { id: "country-france", name: "France" },
    { id: "country-italy", name: "Italy" },
  ],
  league: [
    { id: "league-premier-league", name: "Premier League" },
    { id: "league-la-liga", name: "La Liga" },
    { id: "league-bundesliga", name: "Bundesliga" },
    { id: "league-mls", name: "MLS" },
    { id: "league-serie-a", name: "Serie A" },
  ],
  team: [
    { id: "team-arsenal", name: "Arsenal" },
    { id: "team-liverpool", name: "Liverpool" },
    { id: "team-man-united", name: "Manchester United" },
    { id: "team-real-madrid", name: "Real Madrid" },
    { id: "team-barcelona", name: "Barcelona" },
  ],
  season: [
    { id: "season-epl-2025-26", name: "EPL 2025/26" },
    { id: "season-laliga-2025-26", name: "La Liga 2025/26" },
    { id: "season-mls-2026", name: "MLS 2026" },
  ],
  player: [
    { id: "player-salah", name: "Mohamed Salah" },
    { id: "player-haaland", name: "Erling Haaland" },
    { id: "player-messi", name: "Lionel Messi" },
  ],
  fixture: [
    { id: "fixture-1", name: "Arsenal vs Liverpool" },
    { id: "fixture-2", name: "Man City vs Chelsea" },
  ],
};

function JsonPreviewModal({ 
  mapping, 
  onClose 
}: { 
  mapping: ProviderMapping; 
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mapping.rawPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const provider = mockProviders.find(p => p.id === mapping.providerName);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Code size={20} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Raw API Payload</h2>
                <p className="text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mr-2 ${provider?.color}`}>
                    {provider?.name}
                  </span>
                  {mapping.providerEntityName}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="button-close-modal">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="text-xs font-medium text-gray-500 uppercase">Provider Entity ID</label>
              <p className="text-gray-900 font-mono">{mapping.providerEntityId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="text-xs font-medium text-gray-500 uppercase">Internal Entity ID</label>
              <p className="text-gray-900 font-mono">{mapping.internalEntityId}</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600"
              data-testid="button-copy-json"
            >
              {copied ? <CheckCheck size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto text-sm font-mono max-h-[400px]">
              {JSON.stringify(mapping.rawPayload, null, 2)}
            </pre>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Field Mapping Notes</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>id:</strong> Maps to <code className="bg-blue-100 px-1 rounded">providerEntityId</code></p>
              <p><strong>name:</strong> Maps to <code className="bg-blue-100 px-1 rounded">providerEntityName</code></p>
              {mapping.providerEntityType === "team" && (
                <p><strong>country_id:</strong> Use provider_mappings to resolve to internal country</p>
              )}
              {mapping.providerEntityType === "league" && (
                <p><strong>country_id:</strong> Use provider_mappings to resolve to internal country</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d]"
            data-testid="button-close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MappingFormModal({ 
  mapping, 
  onClose, 
  onSave 
}: { 
  mapping: ProviderMapping | null; 
  onClose: () => void;
  onSave: (data: Partial<ProviderMapping>) => void;
}) {
  const [formData, setFormData] = useState({
    providerName: mapping?.providerName || "",
    providerEntityType: mapping?.providerEntityType || "",
    providerEntityId: mapping?.providerEntityId || "",
    internalEntityId: mapping?.internalEntityId || "",
    providerEntityName: mapping?.providerEntityName || "",
    rawPayload: mapping?.rawPayload ? JSON.stringify(mapping.rawPayload, null, 2) : "",
    isActive: mapping?.isActive ?? true,
  });

  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let parsedPayload = null;
    if (formData.rawPayload.trim()) {
      try {
        parsedPayload = JSON.parse(formData.rawPayload);
        setJsonError(null);
      } catch (err) {
        setJsonError("Invalid JSON format");
        return;
      }
    }

    onSave({
      ...formData,
      rawPayload: parsedPayload,
    });
  };

  const availableEntities = formData.providerEntityType 
    ? internalEntities[formData.providerEntityType as keyof typeof internalEntities] || []
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mapping ? "Edit Mapping" : "Add Provider Mapping"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="button-close-modal">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.providerName}
                onChange={(e) => setFormData(prev => ({ ...prev, providerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                required
                data-testid="select-provider"
              >
                <option value="">Select provider</option>
                {mockProviders.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.providerEntityType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  providerEntityType: e.target.value,
                  internalEntityId: "" 
                }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                required
                data-testid="select-entity-type"
              >
                <option value="">Select type</option>
                {entityTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Entity ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.providerEntityId}
                onChange={(e) => setFormData(prev => ({ ...prev, providerEntityId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] font-mono"
                placeholder="8"
                required
                data-testid="input-provider-entity-id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Entity <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.internalEntityId}
                onChange={(e) => setFormData(prev => ({ ...prev, internalEntityId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                required
                disabled={!formData.providerEntityType}
                data-testid="select-internal-entity"
              >
                <option value="">Select entity</option>
                {availableEntities.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider Entity Name
            </label>
            <input
              type="text"
              value={formData.providerEntityName}
              onChange={(e) => setFormData(prev => ({ ...prev, providerEntityName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="Premier League"
              data-testid="input-provider-entity-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raw API Payload (JSON)
            </label>
            <textarea
              value={formData.rawPayload}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, rawPayload: e.target.value }));
                setJsonError(null);
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm min-h-[120px] ${
                jsonError ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-[#1a2d5c]"
              }`}
              placeholder='{"id": 8, "name": "Premier League", ...}'
              data-testid="input-raw-payload"
            />
            {jsonError && (
              <p className="text-xs text-red-500 mt-1" data-testid="error-json">{jsonError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Paste the raw JSON response from the API</p>
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
              {mapping ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApiMappingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterEntityType, setFilterEntityType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ProviderMapping | null>(null);
  const [viewingMapping, setViewingMapping] = useState<ProviderMapping | null>(null);

  const filteredMappings = mockMappings.filter(m => {
    const matchesSearch = m.providerEntityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.providerEntityId.includes(searchQuery) ||
                          m.internalEntityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = filterProvider === "all" || m.providerName === filterProvider;
    const matchesEntityType = filterEntityType === "all" || m.providerEntityType === filterEntityType;
    return matchesSearch && matchesProvider && matchesEntityType;
  });

  const handleSave = (data: Partial<ProviderMapping>) => {
    console.log("Saving mapping:", data);
    setShowForm(false);
    setEditingMapping(null);
  };

  const handleEdit = (mapping: ProviderMapping) => {
    setEditingMapping(mapping);
    setShowForm(true);
  };

  const handleViewPayload = (mapping: ProviderMapping) => {
    setViewingMapping(mapping);
  };

  const getProviderBadge = (providerName: string) => {
    const provider = mockProviders.find(p => p.id === providerName);
    return provider ? (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${provider.color}`}>
        {provider.name}
      </span>
    ) : null;
  };

  const getEntityTypeBadge = (entityType: string) => {
    const type = entityTypes.find(t => t.id === entityType);
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
        {type?.label || entityType}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Mapping</h1>
            <p className="text-gray-500 mt-1">Map external provider IDs to internal hierarchy entities</p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              data-testid="button-sync-all"
            >
              <RefreshCw size={18} />
              Sync All
            </button>
            <button
              onClick={() => { setEditingMapping(null); setShowForm(true); }}
              className="px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d] flex items-center gap-2"
              data-testid="button-add-mapping"
            >
              <Plus size={18} />
              Add Mapping
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockMappings.length}</p>
                <p className="text-sm text-gray-500">Total Mappings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                <LinkIcon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockProviders.length}</p>
                <p className="text-sm text-gray-500">Connected Providers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center">
                <Code size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{entityTypes.length}</p>
                <p className="text-sm text-gray-500">Entity Types</p>
              </div>
            </div>
          </div>
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
                  placeholder="Search mappings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-provider-filter"
                >
                  <option value="all">All Providers</option>
                  {mockProviders.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={filterEntityType}
                  onChange={(e) => setFilterEntityType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-entity-type-filter"
                >
                  <option value="all">All Types</option>
                  {entityTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider ID → Internal ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Synced
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMappings.map((mapping) => (
                  <tr 
                    key={mapping.id} 
                    className="hover:bg-gray-50 transition-colors"
                    data-testid={`row-mapping-${mapping.id}`}
                  >
                    <td className="px-4 py-3">
                      {getProviderBadge(mapping.providerName)}
                    </td>
                    <td className="px-4 py-3">
                      {getEntityTypeBadge(mapping.providerEntityType)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded">
                          {mapping.providerEntityId}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                          {mapping.internalEntityId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {mapping.providerEntityName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {mapping.lastSyncedAt 
                        ? new Date(mapping.lastSyncedAt).toLocaleString()
                        : "Never"
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewPayload(mapping)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          title="View Raw Payload"
                          data-testid={`view-payload-${mapping.id}`}
                        >
                          <Code size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(mapping)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          title="Edit Mapping"
                          data-testid={`edit-${mapping.id}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"
                          title="Delete Mapping"
                          data-testid={`delete-${mapping.id}`}
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

          {filteredMappings.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-gray-400" size={32} />
              </div>
              <h3 className="font-medium text-gray-900">No mappings found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <MappingFormModal
          mapping={editingMapping}
          onClose={() => { setShowForm(false); setEditingMapping(null); }}
          onSave={handleSave}
        />
      )}

      {viewingMapping && (
        <JsonPreviewModal
          mapping={viewingMapping}
          onClose={() => setViewingMapping(null)}
        />
      )}
    </AdminLayout>
  );
}
