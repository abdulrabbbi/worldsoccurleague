import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orgTypes = [
  { value: "club", label: "Club", description: "Youth or adult soccer club" },
  { value: "league", label: "League", description: "Organize and run leagues" },
  { value: "tournament", label: "Tournament", description: "Run tournaments and cups" },
  { value: "fan_club", label: "Fan Club", description: "Supporter group" },
  { value: "pickup", label: "Pickup Group", description: "Casual pickup games" },
];

export default function NewOrganization() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("club");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [country, setCountry] = useState("USA");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await fetch("/api/partner/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create organization");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Organization created!" });
      setLocation(`/partner/organization/${data.organization.id}`);
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug,
      type,
      city,
      stateCode,
      country,
      website,
      description,
    });
  };

  if (user?.planTier !== "partner") {
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
            <h1 className="text-xl font-bold">Create Organization</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Partner Tier Required</h2>
          <p className="text-gray-600 mb-6">
            Upgrade to Partner to create and manage organizations.
          </p>
          <button
            onClick={() => setLocation("/auth/profile-setup/plan")}
            className="px-6 py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold"
            data-testid="button-upgrade"
          >
            Upgrade to Partner
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Create Organization</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="e.g., Riverside Youth Soccer Club"
              required
              data-testid="input-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Slug *</label>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-1">wsl.app/org/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="riverside-ysc"
                required
                data-testid="input-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Organization Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {orgTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    type === t.value
                      ? "border-[#1a2d5c] bg-[#1a2d5c]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  data-testid={`type-${t.value}`}
                >
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Austin"
                data-testid="input-city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value.toUpperCase().slice(0, 2))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="TX"
                maxLength={2}
                data-testid="input-state"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="USA"
              data-testid="input-country"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold">Additional Info</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="https://yourclub.com"
              data-testid="input-website"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
              placeholder="Tell us about your organization..."
              data-testid="input-description"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!name || !slug || createMutation.isPending}
          className="w-full py-4 bg-[#1a2d5c] text-white rounded-xl font-semibold disabled:opacity-50"
          data-testid="button-create"
        >
          {createMutation.isPending ? "Creating..." : "Create Organization"}
        </button>
      </form>
    </div>
  );
}
