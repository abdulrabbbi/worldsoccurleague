import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Trophy,
  Loader2
} from "lucide-react";
import AdminLayout, { useAdminSport } from "./layout";
import { apiRequest } from "@/lib/queryClient";

interface AdminLeague {
  id: string;
  name: string;
  slug: string;
  countryId: string | null;
  tier: number | null;
  logo: string | null;
  isActive: boolean | null;
  sportId: string | null;
  sportCode?: string;
  teamCount?: number;
  currentSeasonId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

function LeaguesContent() {
  const { selectedSportSlug } = useAdminSport();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "teamCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: leagues = [], isLoading, error } = useQuery<AdminLeague[]>({
    queryKey: ["/api/admin/leagues", selectedSportSlug],
    queryFn: async () => {
      const url = selectedSportSlug && selectedSportSlug !== "all" 
        ? `/api/admin/leagues?sport=${selectedSportSlug}`
        : "/api/admin/leagues";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leagues");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/leagues/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leagues"] });
    },
  });

  const filteredLeagues = leagues.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && l.isActive) ||
                          (filterStatus === "inactive" && !l.isActive);
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aVal = sortField === "name" ? a.name : (a.teamCount || 0);
    const bVal = sortField === "name" ? b.name : (b.teamCount || 0);
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

  const handleToggleActive = (league: AdminLeague) => {
    toggleMutation.mutate({ id: league.id, isActive: !league.isActive });
  };

  const getSportIcon = (sportCode?: string) => {
    switch (sportCode) {
      case "nfl": return "🏈";
      case "nba": return "🏀";
      case "mlb": return "⚾";
      case "nhl": return "🏒";
      default: return "⚽";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="text-red-400" size={32} />
        </div>
        <h3 className="font-medium text-gray-900">Failed to load leagues</h3>
        <p className="text-sm text-gray-500 mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leagues</h1>
          <p className="text-gray-500 mt-1">
            {selectedSportSlug === "all" 
              ? "Manage leagues across all sports" 
              : `Manage ${selectedSportSlug} leagues`}
          </p>
        </div>
        <button
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
                  Sport
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
                      <span className="text-2xl">{league.logo || getSportIcon(league.sportCode)}</span>
                      <div>
                        <div className="font-medium text-gray-900">{league.name}</div>
                        <div className="text-xs text-gray-500 font-mono">/{league.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {getSportIcon(league.sportCode)} {league.sportCode?.toUpperCase() || "SOCCER"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-sm rounded-full ${
                      league.tier === 1 ? "bg-yellow-100 text-yellow-700" :
                      league.tier === 2 ? "bg-gray-100 text-gray-700" :
                      "bg-orange-50 text-orange-600"
                    }`}>
                      Tier {league.tier || 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{league.teamCount || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(league)}
                      disabled={toggleMutation.isPending}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors ${
                        league.isActive 
                          ? "bg-green-100 text-green-700 hover:bg-green-200" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      } ${toggleMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      data-testid={`toggle-status-${league.id}`}
                    >
                      {league.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      {league.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
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
            <p className="text-sm text-gray-500 mt-1">
              {leagues.length === 0 
                ? "No leagues have been created yet" 
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeaguesPage() {
  return (
    <AdminLayout>
      <LeaguesContent />
    </AdminLayout>
  );
}
