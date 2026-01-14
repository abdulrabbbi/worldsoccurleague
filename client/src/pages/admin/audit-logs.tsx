import { useState } from "react";
import { 
  Search, 
  Filter,
  Clock,
  User,
  Globe,
  Trophy,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import AdminLayout from "./layout";

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: "create" | "update" | "delete" | "approve" | "reject" | "activate" | "deactivate";
  entityType: string;
  entityId: string;
  entityName: string;
  previousData: any;
  newData: any;
  ipAddress: string;
  createdAt: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Admin User",
    action: "update",
    entityType: "League",
    entityId: "l1",
    entityName: "Premier League",
    previousData: { name: "English Premier League" },
    newData: { name: "Premier League" },
    ipAddress: "192.168.1.1",
    createdAt: "2026-01-14T12:30:00Z"
  },
  {
    id: "2",
    userId: "u2",
    userName: "System",
    action: "create",
    entityType: "Team",
    entityId: "t1",
    entityName: "Inter Miami CF",
    previousData: null,
    newData: { name: "Inter Miami CF", league: "MLS" },
    ipAddress: "0.0.0.0",
    createdAt: "2026-01-14T11:15:00Z"
  },
  {
    id: "3",
    userId: "u1",
    userName: "Admin User",
    action: "approve",
    entityType: "GrassrootsSubmission",
    entityId: "gs1",
    entityName: "Austin FC Youth U-15",
    previousData: { status: "pending" },
    newData: { status: "approved" },
    ipAddress: "192.168.1.1",
    createdAt: "2026-01-14T10:45:00Z"
  },
  {
    id: "4",
    userId: "u3",
    userName: "Data Contributor",
    action: "create",
    entityType: "Fixture",
    entityId: "f1",
    entityName: "MLS Week 15: LAG vs LAFC",
    previousData: null,
    newData: { homeTeam: "LA Galaxy", awayTeam: "LAFC", date: "2026-01-20" },
    ipAddress: "10.0.0.5",
    createdAt: "2026-01-14T09:30:00Z"
  },
  {
    id: "5",
    userId: "u1",
    userName: "Admin User",
    action: "deactivate",
    entityType: "Country",
    entityId: "c1",
    entityName: "Test Country",
    previousData: { isActive: true },
    newData: { isActive: false },
    ipAddress: "192.168.1.1",
    createdAt: "2026-01-13T16:20:00Z"
  },
  {
    id: "6",
    userId: "u1",
    userName: "Admin User",
    action: "reject",
    entityType: "GrassrootsSubmission",
    entityId: "gs2",
    entityName: "Invalid Team Submission",
    previousData: { status: "pending" },
    newData: { status: "rejected", reason: "Duplicate entry" },
    ipAddress: "192.168.1.1",
    createdAt: "2026-01-13T14:10:00Z"
  },
];

const actionIcons = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  approve: CheckCircle,
  reject: XCircle,
  activate: Eye,
  deactivate: EyeOff,
};

const actionColors = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  approve: "bg-emerald-100 text-emerald-700",
  reject: "bg-orange-100 text-orange-700",
  activate: "bg-purple-100 text-purple-700",
  deactivate: "bg-gray-100 text-gray-700",
};

const actionLabels = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  approve: "Approved",
  reject: "Rejected",
  activate: "Activated",
  deactivate: "Deactivated",
};

function LogDetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Action</label>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${actionColors[log.action]}`}>
                {actionLabels[log.action]}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Timestamp</label>
              <p className="text-gray-900">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">User</label>
              <p className="text-gray-900">{log.userName}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">IP Address</label>
              <p className="text-gray-900 font-mono text-sm">{log.ipAddress}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Entity Type</label>
              <p className="text-gray-900">{log.entityType}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Entity Name</label>
              <p className="text-gray-900">{log.entityName}</p>
            </div>
          </div>

          {log.previousData && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Previous Data</label>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <pre className="text-sm text-red-700 whitespace-pre-wrap">
                  {JSON.stringify(log.previousData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {log.newData && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">New Data</label>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <pre className="text-sm text-green-700 whitespace-pre-wrap">
                  {JSON.stringify(log.newData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
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
    </div>
  );
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntityType, setFilterEntityType] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesEntityType = filterEntityType === "all" || log.entityType === filterEntityType;
    return matchesSearch && matchesAction && matchesEntityType;
  });

  const entityTypes = Array.from(new Set(mockAuditLogs.map(l => l.entityType)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Track all admin actions and changes</p>
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
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-action"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Created</option>
                  <option value="update">Updated</option>
                  <option value="delete">Deleted</option>
                  <option value="approve">Approved</option>
                  <option value="reject">Rejected</option>
                  <option value="activate">Activated</option>
                  <option value="deactivate">Deactivated</option>
                </select>
                <select
                  value={filterEntityType}
                  onChange={(e) => setFilterEntityType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5c]"
                  data-testid="select-entity-type"
                >
                  <option value="all">All Entities</option>
                  {entityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const Icon = actionIcons[log.action];
              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                  data-testid={`log-${log.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${actionColors[log.action]} rounded-lg flex items-center justify-center`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{log.userName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${actionColors[log.action]}`}>
                            {actionLabels[log.action]}
                          </span>
                          <span className="text-gray-500">{log.entityType}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {log.entityName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="font-mono">{log.ipAddress}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="font-medium text-gray-900">No logs found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </AdminLayout>
  );
}
