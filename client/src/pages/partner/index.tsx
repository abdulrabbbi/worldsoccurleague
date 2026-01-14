import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Building2, Users, Trophy, MapPin, Plus, FileCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  verificationStatus: string;
  city?: string;
  stateCode?: string;
}

interface Submission {
  id: string;
  entityType: string;
  entityName: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function PartnerDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/partner/organizations"],
    enabled: !!user,
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/grassroots/submissions"],
    enabled: !!user,
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;

  const isPro = user?.planTier === "pro" || user?.planTier === "partner";
  const isPartner = user?.planTier === "partner";

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => setLocation("/profile")}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              data-testid="button-back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold">Partner Portal</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Upgrade to Partner</h2>
          <p className="text-gray-600 mb-6">
            Get access to the Grassroots API, create organizations, and submit teams, leagues, and venues.
          </p>
          <button
            onClick={() => setLocation("/auth/profile-setup/plan")}
            className="px-6 py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold"
            data-testid="button-upgrade"
          >
            Upgrade to Partner - $9.99/mo
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
            onClick={() => setLocation("/profile")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            data-testid="button-back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">Partner Portal</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{approvedCount}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{rejectedCount}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>

        {isPartner && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">My Organizations</h2>
              <button
                onClick={() => setLocation("/partner/organization/new")}
                className="text-sm text-[#1a2d5c] font-medium flex items-center gap-1"
                data-testid="button-new-org"
              >
                <Plus size={16} />
                New
              </button>
            </div>
            <div className="space-y-2">
              {organizations.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                  <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No organizations yet</p>
                  <button
                    onClick={() => setLocation("/partner/organization/new")}
                    className="px-4 py-2 bg-[#1a2d5c] text-white rounded-lg text-sm font-medium"
                    data-testid="button-create-org"
                  >
                    Create Organization
                  </button>
                </div>
              ) : (
                organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => setLocation(`/partner/organization/${org.id}`)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a2d5c]/30 transition-colors text-left"
                    data-testid={`org-${org.slug}`}
                  >
                    <div className="w-12 h-12 bg-[#1a2d5c]/10 rounded-xl flex items-center justify-center">
                      <Building2 className="text-[#1a2d5c]" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.type} {org.city && `• ${org.city}, ${org.stateCode}`}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      org.verificationStatus === "verified" ? "bg-green-100 text-green-700" :
                      org.verificationStatus === "review" ? "bg-yellow-100 text-yellow-700" :
                      org.verificationStatus === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {org.verificationStatus}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Submit Data</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocation("/partner/submit/league")}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a2d5c]/30 transition-colors"
              data-testid="button-submit-league"
            >
              <Trophy className="text-[#1a2d5c]" size={28} />
              <span className="font-medium text-sm">League</span>
            </button>
            <button
              onClick={() => setLocation("/partner/submit/team")}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a2d5c]/30 transition-colors"
              data-testid="button-submit-team"
            >
              <Users className="text-[#1a2d5c]" size={28} />
              <span className="font-medium text-sm">Team</span>
            </button>
            <button
              onClick={() => setLocation("/partner/submit/venue")}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a2d5c]/30 transition-colors"
              data-testid="button-submit-venue"
            >
              <MapPin className="text-[#1a2d5c]" size={28} />
              <span className="font-medium text-sm">Venue</span>
            </button>
            <button
              onClick={() => setLocation("/partner/submit/fixture")}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a2d5c]/30 transition-colors"
              data-testid="button-submit-fixture"
            >
              <FileCheck className="text-[#1a2d5c]" size={28} />
              <span className="font-medium text-sm">Match Result</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Recent Submissions</h2>
          <div className="space-y-2">
            {submissions.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <FileCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No submissions yet</p>
              </div>
            ) : (
              submissions.slice(0, 5).map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    sub.status === "approved" ? "bg-green-100" :
                    sub.status === "rejected" ? "bg-red-100" :
                    "bg-yellow-100"
                  }`}>
                    {sub.status === "approved" ? <CheckCircle2 className="text-green-600" size={20} /> :
                     sub.status === "rejected" ? <XCircle className="text-red-600" size={20} /> :
                     <Clock className="text-yellow-600" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sub.entityName}</p>
                    <p className="text-sm text-gray-500">{sub.entityType} • {sub.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    sub.status === "approved" ? "bg-green-100 text-green-700" :
                    sub.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
