import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  Flag, 
  Trophy, 
  Users, 
  FileCheck, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import AdminLayout from "./layout";

interface DashboardStats {
  continents: number;
  countries: number;
  leagues: number;
  teams: number;
  pendingApprovals: number;
  recentAuditLogs: number;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  trend?: string; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1a2d5c]/30 hover:shadow-md transition-all text-left w-full"
      data-testid={`action-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-12 h-12 bg-[#1a2d5c]/10 rounded-xl flex items-center justify-center">
        <Icon className="text-[#1a2d5c]" size={24} />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}

function PendingApprovalItem({ 
  type, 
  name, 
  submittedBy, 
  date 
}: { 
  type: string; 
  name: string; 
  submittedBy: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <AlertCircle className="text-yellow-600" size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{type} • Submitted by {submittedBy}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{date}</span>
        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
          Review
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const stats: DashboardStats = {
    continents: 6,
    countries: 211,
    leagues: 847,
    teams: 12453,
    pendingApprovals: 23,
    recentAuditLogs: 156
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to the WSL Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Globe}
            label="Continents"
            value={stats.continents}
            color="bg-blue-500"
          />
          <StatCard
            icon={Flag}
            label="Countries"
            value={stats.countries}
            color="bg-green-500"
          />
          <StatCard
            icon={Trophy}
            label="Leagues"
            value={stats.leagues}
            trend="+12 this month"
            color="bg-purple-500"
          />
          <StatCard
            icon={Users}
            label="Teams"
            value={stats.teams}
            trend="+234 this month"
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                  {stats.pendingApprovals} pending
                </span>
              </div>
              <div className="space-y-3">
                <PendingApprovalItem
                  type="Youth Team"
                  name="FC Dallas U-15 Academy"
                  submittedBy="John Smith"
                  date="2 hours ago"
                />
                <PendingApprovalItem
                  type="College Team"
                  name="UCLA Bruins Soccer"
                  submittedBy="Sarah Johnson"
                  date="5 hours ago"
                />
                <PendingApprovalItem
                  type="Pickup Group"
                  name="Austin Sunday League"
                  submittedBy="Mike Davis"
                  date="1 day ago"
                />
              </div>
              <button className="w-full mt-4 py-2 text-[#1a2d5c] font-medium hover:bg-gray-50 rounded-lg">
                View All Pending ({stats.pendingApprovals})
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: "League Updated", entity: "Premier League", user: "Admin", time: "10 min ago", type: "update" },
                  { action: "Team Created", entity: "Inter Miami CF", user: "System", time: "1 hour ago", type: "create" },
                  { action: "Fixture Added", entity: "MLS Week 15", user: "Data Contributor", time: "2 hours ago", type: "create" },
                  { action: "Grassroots Approved", entity: "Austin FC Youth", user: "Admin", time: "3 hours ago", type: "approve" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === "create" ? "bg-green-100" :
                      item.type === "update" ? "bg-blue-100" :
                      "bg-purple-100"
                    }`}>
                      <CheckCircle2 className={`${
                        item.type === "create" ? "text-green-600" :
                        item.type === "update" ? "text-blue-600" :
                        "text-purple-600"
                      }`} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.action}</span>
                        <span className="text-gray-500"> — {item.entity}</span>
                      </p>
                      <p className="text-xs text-gray-400">{item.user} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickAction
                  icon={Trophy}
                  label="Add League"
                  description="Create a new league"
                  onClick={() => {}}
                />
                <QuickAction
                  icon={Users}
                  label="Add Team"
                  description="Register a new team"
                  onClick={() => {}}
                />
                <QuickAction
                  icon={FileCheck}
                  label="Review Submissions"
                  description="Process grassroots queue"
                  onClick={() => {}}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2d5c] to-[#0f1d3d] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">API Status</h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">SportMonks</span>
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Grassroots API</span>
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Last Sync</span>
                  <span className="text-sm text-white/70">5 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
