import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Building2, Users, Key, Activity, FileText, Plus, Copy, Trash2, Shield, Eye, Edit3, Crown, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  verificationStatus: string;
  city?: string;
  stateCode?: string;
  country?: string;
  website?: string;
  description?: string;
  createdAt: string;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: {
    displayName: string;
    email: string;
  };
}

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimitPerMinute: number;
  rateLimitPerDay: number;
  lastUsedAt?: string;
  isActive: boolean;
  createdAt: string;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  createdAt: string;
}

interface UsageStats {
  apiCalls: number;
  remainingMinute: number;
  remainingDay: number;
}

const roleIcons: Record<string, typeof Crown> = {
  owner: Crown,
  admin: Shield,
  editor: Edit3,
  viewer: Eye,
};

const roleColors: Record<string, string> = {
  owner: "bg-yellow-100 text-yellow-700",
  admin: "bg-purple-100 text-purple-700",
  editor: "bg-blue-100 text-blue-700",
  viewer: "bg-gray-100 text-gray-600",
};

export default function OrganizationDetail() {
  const [, params] = useRoute("/partner/organization/:orgId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = params?.orgId;

  const [activeTab, setActiveTab] = useState("settings");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("viewer");
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const { data: org, isLoading: orgLoading } = useQuery<Organization>({
    queryKey: [`/api/partner/organizations/${orgId}`],
    enabled: !!orgId,
  });

  const { data: membersData } = useQuery<{ members: Member[] }>({
    queryKey: [`/api/partner/organizations/${orgId}/members`],
    enabled: !!orgId,
  });

  const { data: keysData } = useQuery<{ apiKeys: ApiKey[] }>({
    queryKey: [`/api/partner/organizations/${orgId}/api-keys`],
    enabled: !!orgId,
  });

  const { data: auditData } = useQuery<{ logs: AuditLog[] }>({
    queryKey: [`/api/partner/organizations/${orgId}/audit-logs`],
    enabled: !!orgId,
  });

  const members = membersData?.members || [];
  const apiKeys = keysData?.apiKeys || [];
  const auditLogs = auditData?.logs || [];

  const currentMember = members.find(m => m.userId === user?.id);
  const isOwner = currentMember?.role === "owner";
  const isAdmin = currentMember?.role === "admin" || isOwner;

  const addMemberMutation = useMutation({
    mutationFn: async (data: { userId: string; role: string }) => {
      const res = await fetch(`/api/partner/organizations/${orgId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/partner/organizations/${orgId}/members`] });
      setShowAddMember(false);
      setNewMemberEmail("");
      toast({ title: "Member added successfully" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      const res = await fetch(`/api/partner/organizations/${orgId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/partner/organizations/${orgId}/members`] });
      toast({ title: "Role updated" });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/partner/organizations/${orgId}/members/${memberId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/partner/organizations/${orgId}/members`] });
      toast({ title: "Member removed" });
    },
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: { name: string; scopes: string[] }) => {
      const res = await fetch(`/api/partner/organizations/${orgId}/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create API key");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/partner/organizations/${orgId}/api-keys`] });
      setCreatedKey(data.apiKey.key);
      setNewKeyName("");
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await fetch(`/api/partner/organizations/${orgId}/api-keys/${keyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to revoke key");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/partner/organizations/${orgId}/api-keys`] });
      toast({ title: "API key revoked" });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a2d5c] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Organization not found</p>
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
          <div className="flex-1">
            <h1 className="text-xl font-bold">{org.name}</h1>
            <p className="text-sm text-gray-500">{org.type}</p>
          </div>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            org.verificationStatus === "verified" ? "bg-green-100 text-green-700" :
            org.verificationStatus === "review" ? "bg-yellow-100 text-yellow-700" :
            org.verificationStatus === "rejected" ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {org.verificationStatus}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="settings" className="text-xs">
              <Building2 size={16} className="mr-1" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs">
              <Users size={16} className="mr-1" />
              Members
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="text-xs">
              <Key size={16} className="mr-1" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="usage" className="text-xs">
              <Activity size={16} className="mr-1" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">
              <FileText size={16} className="mr-1" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization Name</label>
                  <p className="text-gray-900 font-semibold">{org.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900">{org.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Slug</label>
                  <p className="text-gray-900 font-mono text-sm">{org.slug}</p>
                </div>
                {org.city && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{org.city}, {org.stateCode} {org.country}</p>
                  </div>
                )}
                {org.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-blue-600">{org.website}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Verification Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {org.verificationStatus === "verified" ? (
                      <CheckCircle2 className="text-green-500" size={18} />
                    ) : org.verificationStatus === "review" ? (
                      <Clock className="text-yellow-500" size={18} />
                    ) : (
                      <AlertCircle className="text-gray-400" size={18} />
                    )}
                    <span className="capitalize">{org.verificationStatus}</span>
                  </div>
                </div>
              </div>

              {org.verificationStatus === "draft" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-blue-900">Submit for Verification</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Once verified, you'll be able to create API keys and publish data to the Grassroots network.
                      </p>
                      <button
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                        data-testid="button-submit-verification"
                      >
                        Submit for Review
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold mb-3">Your Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partner Tier</p>
                    <p className="text-sm text-gray-500">$9.99/month</p>
                  </div>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600"
                    data-testid="button-manage-plan"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-4">
              {isAdmin && (
                <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                  <DialogTrigger asChild>
                    <button
                      className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#1a2d5c] hover:text-[#1a2d5c] transition-colors"
                      data-testid="button-add-member"
                    >
                      <Plus size={20} />
                      Add Member
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">User ID or Email</label>
                        <input
                          type="text"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Enter user ID"
                          data-testid="input-member-email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          data-testid="select-member-role"
                        >
                          <option value="viewer">Viewer - Can view org data</option>
                          <option value="editor">Editor - Can submit data</option>
                          <option value="admin">Admin - Can manage members</option>
                        </select>
                      </div>
                      <button
                        onClick={() => addMemberMutation.mutate({ userId: newMemberEmail, role: newMemberRole })}
                        className="w-full py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold"
                        data-testid="button-confirm-add-member"
                      >
                        Add Member
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <div className="bg-white rounded-xl border border-gray-200 divide-y">
                {members.map((member) => {
                  const RoleIcon = roleIcons[member.role] || Eye;
                  return (
                    <div key={member.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <RoleIcon size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.user?.displayName || member.userId}</p>
                        <p className="text-sm text-gray-500">{member.user?.email || "User ID: " + member.userId.slice(0, 8)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${roleColors[member.role]}`}>
                        {member.role}
                      </span>
                      {isOwner && member.role !== "owner" && (
                        <div className="flex gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => updateRoleMutation.mutate({ memberId: member.id, role: e.target.value })}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            data-testid={`select-role-${member.id}`}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => removeMemberMutation.mutate(member.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            data-testid={`button-remove-${member.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-2">Role Permissions</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Owner:</strong> Full control, transfer ownership, delete org</p>
                  <p><strong>Admin:</strong> Manage members, view API keys, submit data</p>
                  <p><strong>Editor:</strong> Submit teams, leagues, venues</p>
                  <p><strong>Viewer:</strong> View organization data only</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api-keys">
            <div className="space-y-4">
              {org.verificationStatus !== "verified" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-yellow-900">Verification Required</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your organization must be verified before you can create API keys.
                      </p>
                    </div>
                  </div>
                </div>
              ) : isOwner ? (
                <Dialog open={showCreateKey} onOpenChange={(open) => {
                  setShowCreateKey(open);
                  if (!open) setCreatedKey(null);
                }}>
                  <DialogTrigger asChild>
                    <button
                      className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#1a2d5c] hover:text-[#1a2d5c] transition-colors"
                      data-testid="button-create-key"
                    >
                      <Plus size={20} />
                      Create API Key
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{createdKey ? "API Key Created" : "Create API Key"}</DialogTitle>
                    </DialogHeader>
                    {createdKey ? (
                      <div className="space-y-4 pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-800 font-medium mb-2">Save this key now - it won't be shown again!</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
                              {createdKey}
                            </code>
                            <button
                              onClick={() => copyToClipboard(createdKey)}
                              className="p-2 hover:bg-green-100 rounded"
                              data-testid="button-copy-key"
                            >
                              <Copy size={18} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowCreateKey(false);
                            setCreatedKey(null);
                          }}
                          className="w-full py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Key Name</label>
                          <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="e.g., Production API Key"
                            data-testid="input-key-name"
                          />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">Rate Limits</p>
                          <p className="text-sm text-gray-600">60 requests/minute, 10,000 requests/day</p>
                        </div>
                        <button
                          onClick={() => createKeyMutation.mutate({ name: newKeyName, scopes: ["read", "write"] })}
                          disabled={!newKeyName}
                          className="w-full py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold disabled:opacity-50"
                          data-testid="button-confirm-create-key"
                        >
                          Create Key
                        </button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ) : null}

              {apiKeys.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No API keys yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 divide-y">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Key size={18} className={key.isActive ? "text-green-500" : "text-gray-400"} />
                          <span className="font-medium">{key.name}</span>
                          {!key.isActive && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Revoked</span>
                          )}
                        </div>
                        {isOwner && key.isActive && (
                          <button
                            onClick={() => revokeKeyMutation.mutate(key.id)}
                            className="text-sm text-red-500 hover:underline"
                            data-testid={`button-revoke-${key.id}`}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-mono">{key.keyPrefix}...</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Scopes: {key.scopes.join(", ")}</span>
                        <span>{key.rateLimitPerMinute}/min</span>
                        <span>{key.rateLimitPerDay.toLocaleString()}/day</span>
                      </div>
                      {key.lastUsedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">API Calls Today</p>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-xs text-gray-400">of 10,000 daily limit</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">This Minute</p>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-xs text-gray-400">of 60 per minute</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold mb-4">Rate Limits</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Per Minute</span>
                      <span className="text-gray-500">0 / 60</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Per Day</span>
                      <span className="text-gray-500">0 / 10,000</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Activity className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-blue-900">Need higher limits?</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Contact us for enterprise plans with custom rate limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-4">
              {auditLogs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No audit logs yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 divide-y">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{log.action.replace(/_/g, " ")}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.entityType}: {log.entityName || log.entityId}
                      </p>
                      {log.previousData && (
                        <p className="text-xs text-gray-400 mt-1">
                          Changed from: {JSON.stringify(log.previousData)}
                        </p>
                      )}
                      {log.newData && (
                        <p className="text-xs text-gray-400">
                          Changed to: {JSON.stringify(log.newData)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
