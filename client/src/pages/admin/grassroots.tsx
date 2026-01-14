import { useState } from "react";
import { 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  GraduationCap,
  School,
  Users,
  MapPin
} from "lucide-react";
import AdminLayout from "./layout";

interface GrassrootsSubmission {
  id: string;
  type: "college" | "high_school" | "youth" | "adult_amateur" | "pickup";
  entityType: string;
  entityName: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  stateCode: string;
  city: string;
  entityData: any;
}

const mockSubmissions: GrassrootsSubmission[] = [
  {
    id: "1",
    type: "college",
    entityType: "Team",
    entityName: "UCLA Bruins Men's Soccer",
    submittedBy: "Sarah Johnson",
    submittedAt: "2026-01-14T10:30:00Z",
    status: "pending",
    stateCode: "CA",
    city: "Los Angeles",
    entityData: { conference: "Pac-12", division: "D1" }
  },
  {
    id: "2",
    type: "youth",
    entityType: "Team",
    entityName: "FC Dallas U-15 Academy",
    submittedBy: "John Smith",
    submittedAt: "2026-01-14T08:15:00Z",
    status: "pending",
    stateCode: "TX",
    city: "Dallas",
    entityData: { club: "FC Dallas", ageGroup: "U-15" }
  },
  {
    id: "3",
    type: "high_school",
    entityType: "Team",
    entityName: "Lincoln High School Varsity",
    submittedBy: "Mike Davis",
    submittedAt: "2026-01-13T16:45:00Z",
    status: "pending",
    stateCode: "NE",
    city: "Lincoln",
    entityData: { district: "Lincoln Public Schools", level: "Varsity" }
  },
  {
    id: "4",
    type: "pickup",
    entityType: "Session",
    entityName: "Austin Sunday Pickup",
    submittedBy: "Chris Lee",
    submittedAt: "2026-01-13T14:20:00Z",
    status: "pending",
    stateCode: "TX",
    city: "Austin",
    entityData: { location: "Zilker Park", dayOfWeek: "Sunday" }
  },
  {
    id: "5",
    type: "adult_amateur",
    entityType: "Team",
    entityName: "Portland City FC",
    submittedBy: "Emily Brown",
    submittedAt: "2026-01-12T11:00:00Z",
    status: "approved",
    stateCode: "OR",
    city: "Portland",
    entityData: { league: "UPSL", division: "Northwest" }
  },
];

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

function ReviewModal({ 
  submission, 
  onClose, 
  onApprove, 
  onReject 
}: { 
  submission: GrassrootsSubmission; 
  onClose: () => void;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
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
                {typeLabels[submission.type]} • {submission.entityType}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Submitted By</label>
              <p className="text-gray-900">{submission.submittedBy}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Submitted At</label>
              <p className="text-gray-900">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Location</label>
              <p className="text-gray-900">{submission.city}, {submission.stateCode}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Type</label>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${typeColors[submission.type]}`}>
                {typeLabels[submission.type]}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Entity Data</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(submission.entityData, null, 2)}
              </pre>
            </div>
          </div>

          {!showRejectForm ? (
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
                placeholder="Explain why this submission is being rejected..."
                required
                data-testid="input-rejection-reason"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            {!showRejectForm ? (
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
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  data-testid="button-approve"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              </>
            ) : (
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
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-confirm-reject"
                >
                  <XCircle size={18} />
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<GrassrootsSubmission | null>(null);

  const filteredSubmissions = mockSubmissions.filter(s => {
    const matchesSearch = s.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = mockSubmissions.filter(s => s.status === "pending").length;

  const handleApprove = (notes: string) => {
    console.log("Approving:", selectedSubmission?.id, "with notes:", notes);
    setSelectedSubmission(null);
  };

  const handleReject = (reason: string) => {
    console.log("Rejecting:", selectedSubmission?.id, "with reason:", reason);
    setSelectedSubmission(null);
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

          <div className="divide-y divide-gray-100">
            {filteredSubmissions.map((submission) => {
              const Icon = typeIcons[submission.type];
              return (
                <div
                  key={submission.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${typeColors[submission.type]} rounded-xl flex items-center justify-center`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{submission.entityName}</h3>
                        <p className="text-sm text-gray-500">
                          {typeLabels[submission.type]} • {submission.entityType} • {submission.city}, {submission.stateCode}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted by {submission.submittedBy} • {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                          <Clock size={14} />
                          Pending
                        </span>
                      ) : submission.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          <CheckCircle size={14} />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
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

            {filteredSubmissions.length === 0 && (
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
        </div>
      </div>

      {selectedSubmission && (
        <ReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </AdminLayout>
  );
}
