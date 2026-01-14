import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  MoreVertical,
  Eye,
  EyeOff,
  ExternalLink
} from "lucide-react";
import AdminLayout from "./layout";

interface Continent {
  id: string;
  code: string;
  name: string;
  slug: string;
  flag: string | null;
  isActive: boolean;
  sortOrder: number | null;
  extApiIds: string[] | null;
}

const mockContinents: Continent[] = [
  { id: "1", code: "EU", name: "Europe", slug: "europe", flag: "🇪🇺", isActive: true, sortOrder: 1, extApiIds: ["sportmonks_1"] },
  { id: "2", code: "NA", name: "North America", slug: "north-america", flag: "🌎", isActive: true, sortOrder: 2, extApiIds: ["sportmonks_2"] },
  { id: "3", code: "SA", name: "South America", slug: "south-america", flag: "🌎", isActive: true, sortOrder: 3, extApiIds: ["sportmonks_3"] },
  { id: "4", code: "AS", name: "Asia", slug: "asia", flag: "🌏", isActive: true, sortOrder: 4, extApiIds: ["sportmonks_4"] },
  { id: "5", code: "AF", name: "Africa", slug: "africa", flag: "🌍", isActive: true, sortOrder: 5, extApiIds: ["sportmonks_5"] },
  { id: "6", code: "OC", name: "Oceania", slug: "oceania", flag: "🇦🇺", isActive: true, sortOrder: 6, extApiIds: ["sportmonks_6"] },
];

function ContinentModal({ 
  continent, 
  onClose, 
  onSave 
}: { 
  continent: Continent | null; 
  onClose: () => void; 
  onSave: (data: Partial<Continent>) => void;
}) {
  const [formData, setFormData] = useState({
    code: continent?.code || "",
    name: continent?.name || "",
    slug: continent?.slug || "",
    flag: continent?.flag || "",
    isActive: continent?.isActive ?? true,
    sortOrder: continent?.sortOrder || 0,
    extApiIds: continent?.extApiIds?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      extApiIds: formData.extApiIds ? formData.extApiIds.split(",").map(s => s.trim()) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {continent ? "Edit Continent" : "Add Continent"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="EU"
                required
                data-testid="input-code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flag Emoji</label>
              <input
                type="text"
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                placeholder="🇪🇺"
                data-testid="input-flag"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="Europe"
              required
              data-testid="input-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="europe"
              required
              data-testid="input-slug"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                data-testid="input-sort-order"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#1a2d5c] focus:ring-[#1a2d5c]"
                  data-testid="input-is-active"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External API IDs <span className="text-gray-400">(comma separated)</span>
            </label>
            <input
              type="text"
              value={formData.extApiIds}
              onChange={(e) => setFormData({ ...formData, extApiIds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
              placeholder="sportmonks_1, football_api_45"
              data-testid="input-ext-api-ids"
            />
          </div>
          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d]"
              data-testid="button-save"
            >
              {continent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContinentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContinent, setEditingContinent] = useState<Continent | null>(null);

  const continents = mockContinents.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (continent: Continent) => {
    setEditingContinent(continent);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingContinent(null);
    setShowModal(true);
  };

  const handleSave = (data: Partial<Continent>) => {
    console.log("Saving:", data);
    setShowModal(false);
    setEditingContinent(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Continents</h1>
            <p className="text-gray-500 mt-1">Manage geographic regions</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2d5c] text-white rounded-lg hover:bg-[#0f1d3d]"
            data-testid="button-add-continent"
          >
            <Plus size={20} />
            Add Continent
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search continents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                data-testid="input-search"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Continent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  API IDs
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {continents.map((continent) => (
                <tr key={continent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{continent.flag}</span>
                      <span className="font-medium text-gray-900">{continent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded font-mono">
                      {continent.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    /{continent.slug}
                  </td>
                  <td className="px-6 py-4">
                    {continent.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        <Eye size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                        <EyeOff size={14} />
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {continent.extApiIds?.map((id, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded mr-1">
                        <ExternalLink size={10} />
                        {id}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(continent)}
                        className="p-2 text-gray-400 hover:text-[#1a2d5c] hover:bg-gray-100 rounded-lg"
                        data-testid={`edit-${continent.id}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        data-testid={`delete-${continent.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ContinentModal
          continent={editingContinent}
          onClose={() => {
            setShowModal(false);
            setEditingContinent(null);
          }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
