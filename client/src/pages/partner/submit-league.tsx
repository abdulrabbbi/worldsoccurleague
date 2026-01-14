import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Country {
  id: string;
  name: string;
  code: string;
}

const GRASSROOTS_TYPES = [
  { value: "college", label: "College Soccer" },
  { value: "high_school", label: "High School" },
  { value: "youth", label: "Youth League" },
  { value: "adult_amateur", label: "Adult Amateur" },
  { value: "pickup", label: "Pickup/Recreational" },
];

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function SubmitLeague() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    entityName: "",
    slug: "",
    shortName: "",
    type: "adult_amateur",
    countryId: "c-usa",
    stateCode: "",
    city: "",
    tier: 4,
    ageGroup: "",
    gender: "",
  });

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        entityType: "league",
        submittedById: user?.id,
      };
      return apiRequest("POST", "/api/grassroots/submissions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grassroots/submissions"] });
      setLocation("/partner");
    },
  });

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      entityName: name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.entityName.trim()) return;
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/partner")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            data-testid="button-back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">Submit League</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
          <h2 className="font-semibold text-gray-900">League Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">League Name *</label>
            <input
              type="text"
              value={formData.entityName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Holy City Soccer League"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
              data-testid="input-name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="holy-city-soccer-league"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
              data-testid="input-slug"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value }))}
              placeholder="e.g., HCSL"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
              data-testid="input-shortname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">League Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
              data-testid="select-type"
            >
              {GRASSROOTS_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <input
                type="text"
                value={formData.ageGroup}
                onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value }))}
                placeholder="e.g., U-14, Adult"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
                data-testid="input-agegroup"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
                data-testid="select-gender"
              >
                <option value="">Any/Coed</option>
                <option value="M">Men/Boys</option>
                <option value="F">Women/Girls</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
          <h2 className="font-semibold text-gray-900">Location</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={formData.countryId}
              onChange={(e) => setFormData(prev => ({ ...prev, countryId: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
              data-testid="select-country"
            >
              <option value="c-usa">USA</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={formData.stateCode}
                onChange={(e) => setFormData(prev => ({ ...prev, stateCode: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
                data-testid="select-state"
              >
                <option value="">Select State</option>
                {US_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Charleston"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]/50"
                data-testid="input-city"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitMutation.isPending || !formData.entityName.trim()}
          className="w-full py-4 bg-[#1a2d5c] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          data-testid="button-submit"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit League for Review"
          )}
        </button>

        {submitMutation.isError && (
          <p className="text-red-600 text-sm text-center">
            Failed to submit. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
