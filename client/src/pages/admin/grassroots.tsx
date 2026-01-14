import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  GraduationCap,
  School,
  Users,
  MapPin,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import AdminLayout from "./layout";

interface GrassrootsSubmission {
  id: string;
  type: "college" | "high_school" | "youth" | "adult_amateur" | "pickup";
  entityType: string;
  entityName: string;
  submittedById: string;
  submittedByName: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  stateCode: string | null;
  city: string | null;
  slug: string;
  shortName: string | null;
  logo: string | null;
  countryId: string | null;
  parentLeagueId: string | null;
  parentDivisionId: string | null;
  parentTeamId: string | null;
  venue: string | null;
  tier: number | null;
  ageGroup: string | null;
  gender: string | null;
  entityData: any;
  promotedEntityId: string | null;
  promotedAt: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
}

const typeIcons = {
  college: GraduationCap,
  high_school: School,
  youth: Users,
  adult_amateur: Users,
  pickup: MapPin,
};

const typeLabels = {
  college: "College",
  high_school: "High School",
  youth: "Youth",
  adult_amateur: "Adult Amateur",
  pickup: "Pickup",
};

const typeColors = {
  college: "bg-blue-100 text-blue-700",
  high_school: "bg-green-100 text-green-700",
  youth: "bg-purple-100 text-purple-700",
  adult_amateur: "bg-orange-100 text-orange-700",
  pickup: "bg-pink-100 text-pink-700",
};

const entityTypeLabels: Record<string, string> = {
  league: "League",
  team: "Team",
  division: "Division",
  venue: "Venue",
  season: "Season",
};

function ReviewModal({ 
  submission, 
  onClose, 
  onApprove, 
  onReject,
  onPromote,
  isApproving,
  isRejecting,
  isPromoting
}: { 
  submission: GrassrootsSubmission; 
  onClose: () => void;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
  onPromote: () => void;
  isApproving: boolean;
  isRejecting: boolean;
  isPromoting: boolean;
}) {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const Icon = typeIcons[submission.type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${typeColors[submission.type]} rounded-xl flex items-center justify-center`}>
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{submission.entityName}</h2>
              <p className="text-gray-500">
                {typeLabels[submission.type]} • {entityTypeLabels[submission.entityType] || submission.entityType}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Submitted By</label>
              <p className="text-gray-900">{submission.submittedByName}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Submitted At</label>
              <p className="text-gray-900">
                {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Location</label>
              <p className="text-gray-900">
                {submission.city && submission.stateCode 
                  ? `${submission.city}, ${submission.stateCode}` 
                  : submission.city || submission.stateCode || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Entity Type</label>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {entityTypeLabels[submission.entityType] || submission.entityType}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Slug</label>
              <p className="text-gray-900 font-mono text-sm">{submission.slug}</p>
            </div>
            {submission.venue && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Venue</label>
                <p className="text-gray-900">{submission.venue}</p>
              </div>
            )}
            {submission.ageGroup && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Age Group</label>
                <p className="text-gray-900">{submission.ageGroup}</p>
              </div>
            )}
            {submission.gender && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{submission.gender}</p>
              </div>
            )}
          </div>

          {submission.entityData && Object.keys(submission.entityData).length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Additional Data</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(submission.entityData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {submission.status === "approved" && !submission.promotedEntityId && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-900 mb-2">Ready for Promotion</h4>
              <p className="text-sm text-green-700 mb-3">
                This submission has been approved. You can now promote it to an official {entityTypeLabels[submission.entityType]?.toLowerCase() || submission.entityType}.
              </p>
              <button
                onClick={onPromote}
                disabled={isPromoting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                data-testid="button-promote"
              >
                {isPromoting ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                Promote to {entityTypeLabels[submission.entityType] || submission.entityType}
              </button>
            </div>
          )}

          {submission.promotedEntityId && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-1">Promoted</h4>
              <p className="text-sm text-blue-700">
                This submission was promoted to {entityTypeLabels[submission.entityType]?.toLowerCase() || submission.entityType} on{" "}
                {submission.promotedAt && new Date(submission.promotedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-blue-600 font-mono mt-1">ID: {submission.promotedEntityId}</p>
            </div>
          )}

          {submission.status === "rejected" && submission.rejectionReason && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-900 mb-1">Rejection Reason</h4>
              <p className="text-sm text-red-700">{submission.rejectionReason}</p>
            </div>
          )}

          {submission.status === "pending" && !showRejectForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] min-h-[80px]"
                placeholder="Add any notes about this approval..."
                data-testid="input-notes"
              />
            </div>
          )}

          {submission.status === "pending" && showRejectForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[80px] ${
                  rejectionReason.trim() ? "border-gray-200 focus:ring-[#1a2d5c]" : "border-red-200 focus:ring-red-500"
                }`}
                placeholder="Explain why this submission is being rejected..."
                required
                data-testid="input-rejection-reason"
              />
              {!rejectionReason.trim() && (
                <p className="text-xs text-red-500 mt-1" data-testid="error-rejection-reason">
                  Rejection reason is required
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              data-testid="button-cancel"
            >
              Close
            </button>
            {submission.status === "pending" && !showRejectForm && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                  data-testid="button-reject"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(notes)}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-approve"
                >
                  {isApproving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  Approve
                </button>
              </>
            )}
            {submission.status === "pending" && showRejectForm && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                  data-testid="button-back"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => onReject(rejectionReason)}
                  disabled={!rejectionReason.trim() || isRejecting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-confirm-reject"
                >
                  {isRejecting ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                  Confirm Rejection
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GrassrootsQueuePage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<GrassrootsSubmission | null>(null);

  const { data, isLoading } = useQuery<{ submissions: GrassrootsSubmission[] }>({
    queryKey: ["/api/admin/grassroots/submissions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/grassroots/submissions");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const res = await fetch(`/api/admin/grassroots/submissions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grassroots/submissions"] });
      setSelectedSubmission(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await fetch(`/api/admin/grassroots/submissions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grassroots/submissions"] });
      setSelectedSubmission(null);
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/grassroots/submissions/${id}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to promote");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grassroots/submissions"] });
      setSelectedSubmission(null);
    },
  });

  const submissions = data?.submissions || [];

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.submittedByName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  const handleApprove = (notes: string) => {
    if (selectedSubmission) {
      approveMutation.mutate({ id: selectedSubmission.id, notes });
    }
  };

  const handleReject = (reason: string) => {
    if (selectedSubmission) {
      rejectMutation.mutate({ id: selectedSubmission.id, reason });
    }
  };

  const handlePromote = () => {
    if (selectedSubmission) {
      promoteMutation.mutate(selectedSubmission.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grassroots Queue</h1>
            <p className="text-gray-500 mt-1">Review and approve community submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              {pendingCount} pending
            </span>
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
                  placeholder="Search submissions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-type"
                >
                  <option value="all">All Types</option>
                  <option value="college">College</option>
                  <option value="high_school">High School</option>
                  <option value="youth">Youth</option>
                  <option value="adult_amateur">Adult Amateur</option>
                  <option value="pickup">Pickup</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Loading submissions...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSubmissions.map((submission) => {
                const Icon = typeIcons[submission.type] || Users;
                const colors = typeColors[submission.type] || "bg-gray-100 text-gray-700";
                return (
                  <div
                    key={submission.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`row-submission-${submission.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colors} rounded-xl flex items-center justify-center`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{submission.entityName}</h3>
                          <p className="text-sm text-gray-500">
                            {typeLabels[submission.type] || submission.type} • {entityTypeLabels[submission.entityType] || submission.entityType}
                            {submission.city && submission.stateCode && ` • ${submission.city}, ${submission.stateCode}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Submitted by {submission.submittedByName} • {new Date(submission.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full" data-testid={`status-pending-${submission.id}`}>
                            <Clock size={14} />
                            Pending
                          </span>
                        ) : submission.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full" data-testid={`status-approved-${submission.id}`}>
                            <CheckCircle size={14} />
                            {submission.promotedEntityId ? "Promoted" : "Approved"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full" data-testid={`status-rejected-${submission.id}`}>
                            <XCircle size={14} />
                            Rejected
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="px-4 py-2 bg-[#1a2d5c] text-white text-sm rounded-lg hover:bg-[#0f1d3d] flex items-center gap-2"
                          data-testid={`review-${submission.id}`}
                        >
                          <Eye size={16} />
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSubmissions.length === 0 && !isLoading && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-gray-400" size={32} />
                  </div>
                  <h3 className="font-medium text-gray-900">No submissions found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {filterStatus === "pending" 
                      ? "All submissions have been reviewed!" 
                      : "Try adjusting your filters"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedSubmission && (
        <ReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onPromote={handlePromote}
          isApproving={approveMutation.isPending}
          isRejecting={rejectMutation.isPending}
          isPromoting={promoteMutation.isPending}
        />
      )}
    </AdminLayout>
  );
}
