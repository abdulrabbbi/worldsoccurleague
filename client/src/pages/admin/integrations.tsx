import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import AdminLayout from "./layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  ShoppingBag, 
  Megaphone, 
  Link2, 
  Settings, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Key,
  Globe,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  AlertTriangle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type IntegrationStatus = "not_configured" | "configured_stub" | "connected";

interface IntegrationConfig {
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  features: string[];
  docsUrl: string;
  status: IntegrationStatus;
  rbacRole: string;
  networks?: string[];
}

const integrations: Record<string, IntegrationConfig> = {
  bettermode: {
    name: "BetterMode",
    description: "Community forums, discussions, and fan engagement",
    category: "Community",
    icon: MessageSquare,
    color: "bg-purple-500",
    features: ["Discussion Forums", "Fan Groups", "Polls & Voting", "User Badges", "Activity Feed"],
    docsUrl: "https://developers.bettermode.com",
    status: "not_configured",
    rbacRole: "Community Admin / Moderator",
  },
  sharetribe: {
    name: "Sharetribe",
    description: "Marketplace for gear, tickets, and fan merchandise",
    category: "Marketplace",
    icon: ShoppingBag,
    color: "bg-green-500",
    features: ["Product Listings", "Seller Profiles", "Secure Payments", "Reviews & Ratings", "Order Management"],
    docsUrl: "https://www.sharetribe.com/docs",
    status: "not_configured",
    rbacRole: "Marketplace Admin",
  },
  ads: {
    name: "Kevel / AdButler",
    description: "Ad serving, placements, and revenue optimization",
    category: "Advertising",
    icon: Megaphone,
    color: "bg-orange-500",
    features: ["Banner Ads", "Native Ads", "Sponsorship Slots", "Geo-Targeting", "Revenue Reports"],
    docsUrl: "https://dev.kevel.com",
    status: "not_configured",
    rbacRole: "Ads Admin",
  },
  affiliate: {
    name: "Affiliate Networks",
    description: "Shop integrations with Impact, CJ, Rakuten, ShareASale",
    category: "Affiliate Shop",
    icon: Link2,
    color: "bg-blue-500",
    features: ["Product Feeds", "Deep Links", "Commission Tracking", "Earnings Reports", "Multi-Network Support"],
    networks: ["Impact", "CJ Affiliate", "Rakuten", "ShareASale"],
    docsUrl: "https://impact.com/developer",
    status: "not_configured",
    rbacRole: "Affiliate Shop Admin",
  },
};

function StatusBadge({ status }: { status: IntegrationStatus }) {
  switch (status) {
    case "connected":
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          <CheckCircle2 size={12} />
          Connected (Future)
        </span>
      );
    case "configured_stub":
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          <AlertCircle size={12} />
          Configured (Stub)
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          <XCircle size={12} />
          Not Configured
        </span>
      );
  }
}

function IntegrationCard({ 
  id, 
  integration, 
  onConfigure 
}: { 
  id: string; 
  integration: IntegrationConfig; 
  onConfigure: () => void;
}) {
  const Icon = integration.icon;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center`}>
            <Icon className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{integration.name}</h3>
            <p className="text-sm text-gray-500">{integration.category}</p>
          </div>
        </div>
        <StatusBadge status={integration.status} />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={14} />
          <span className="text-xs font-semibold text-red-700">STUB / NOT CONNECTED</span>
        </div>
        <p className="text-xs text-red-600 mt-0.5">No live connection yet</p>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{integration.description}</p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="text-slate-500" size={14} />
          <span className="text-xs font-medium text-slate-600">Future RBAC Role:</span>
        </div>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{integration.rbacRole}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Features</p>
        <div className="flex flex-wrap gap-2">
          {integration.features.map((feature) => (
            <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {'networks' in integration && integration.networks && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Supported Networks</p>
          <div className="flex flex-wrap gap-2">
            {integration.networks.map((network) => (
              <span key={network} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                {network}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={onConfigure}
          className="flex-1 py-2 px-4 bg-[#1a2d5c] text-white rounded-lg font-medium text-sm"
          data-testid={`button-configure-${id}`}
        >
          Configure
        </button>
        <a
          href={integration.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 border border-gray-300 rounded-lg text-sm flex items-center gap-1 text-gray-600 hover:bg-gray-50"
          data-testid={`link-docs-${id}`}
        >
          <ExternalLink size={14} />
          Docs
        </a>
      </div>
    </div>
  );
}

function ConfigPanel({ 
  integration, 
  onClose,
  onSave
}: { 
  integration: IntegrationConfig & { id: string }; 
  onClose: () => void;
  onSave: (config: Record<string, string>) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const handleSave = () => {
    const config: Record<string, string> = {
      apiKey: apiKey ? "[REDACTED]" : "",
      webhookUrl,
      ...extraFields
    };
    onSave(config);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
            <integration.icon className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold">{integration.name} Configuration</h3>
            <p className="text-sm text-gray-500">Connect your {integration.name} account</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-900">STUB / NOT CONNECTED</p>
            <p className="text-sm text-red-700 mt-1">
              No live connection yet. This is placeholder configuration for the production team.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-yellow-900">Placeholder Configuration</p>
            <p className="text-sm text-yellow-700 mt-1">
              This is a reference implementation stub. The production app team will wire 
              these integrations with actual API credentials and webhooks.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="text-slate-500" size={16} />
          <span className="text-sm font-medium text-slate-700">Required RBAC Role:</span>
          <span className="text-sm font-bold text-slate-900">{integration.rbacRole}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            <Key size={14} className="inline mr-1" />
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter API key..."
            data-testid="input-api-key"
          />
          <p className="text-xs text-gray-500 mt-1">
            Obtain from {integration.name} developer portal
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <Globe size={14} className="inline mr-1" />
            Webhook URL
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://your-app.com/webhooks/..."
            data-testid="input-webhook-url"
          />
          <p className="text-xs text-gray-500 mt-1">
            Events will be sent to this endpoint
          </p>
        </div>

        {integration.id === "bettermode" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              <Users size={14} className="inline mr-1" />
              Community ID
            </label>
            <input
              type="text"
              value={extraFields.communityId || ""}
              onChange={(e) => setExtraFields({ ...extraFields, communityId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="community-123"
              data-testid="input-community-id"
            />
          </div>
        )}

        {integration.id === "sharetribe" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              <ShoppingBag size={14} className="inline mr-1" />
              Marketplace ID
            </label>
            <input
              type="text"
              value={extraFields.marketplaceId || ""}
              onChange={(e) => setExtraFields({ ...extraFields, marketplaceId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="marketplace-123"
              data-testid="input-marketplace-id"
            />
          </div>
        )}

        {integration.id === "ads" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                <DollarSign size={14} className="inline mr-1" />
                Network ID
              </label>
              <input
                type="text"
                value={extraFields.networkId || ""}
                onChange={(e) => setExtraFields({ ...extraFields, networkId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="network-123"
                data-testid="input-network-id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ad Placements</label>
              <div className="space-y-2">
                {["Header Banner", "Sidebar", "In-Feed Native", "Footer"].map((placement) => (
                  <label key={placement} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{placement}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {integration.id === "affiliate" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              <BarChart3 size={14} className="inline mr-1" />
              Active Networks
            </label>
            <div className="space-y-2">
              {["Impact", "CJ Affiliate", "Rakuten", "ShareASale"].map((network) => (
                <label key={network} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{network}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-[#1a2d5c] text-white rounded-lg font-semibold"
          data-testid="button-save-config"
        >
          Save Configuration (Stub)
        </button>
        <button
          onClick={onClose}
          className="py-3 px-6 border border-gray-300 rounded-lg font-medium"
          data-testid="button-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminIntegrations() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [integrationStates, setIntegrationStates] = useState<Record<string, IntegrationStatus>>({
    bettermode: "not_configured",
    sharetribe: "not_configured",
    ads: "not_configured",
    affiliate: "not_configured",
  });

  if (!user || (user.platformRole !== "platform_admin" && user.platformRole !== "platform_moderator")) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Admin access required</p>
        </div>
      </AdminLayout>
    );
  }

  const handleSaveConfig = async (integrationId: string, config: Record<string, string>) => {
    try {
      await apiRequest("POST", "/api/admin/audit-logs", {
        action: "integration_config_updated",
        entityType: "integration",
        entityId: integrationId,
        details: {
          integration: integrations[integrationId].name,
          configFields: Object.keys(config).filter(k => config[k]),
          status: "configured_stub",
          note: "Stub configuration saved - no live connection"
        }
      });

      setIntegrationStates(prev => ({
        ...prev,
        [integrationId]: "configured_stub"
      }));

      setConfiguring(null);
    } catch (error) {
      console.error("Failed to log config change:", error);
      setIntegrationStates(prev => ({
        ...prev,
        [integrationId]: "configured_stub"
      }));
      setConfiguring(null);
    }
  };

  const getIntegrationWithState = (id: string) => ({
    ...integrations[id],
    status: integrationStates[id] || "not_configured"
  });

  const configuringIntegration = configuring 
    ? { ...getIntegrationWithState(configuring), id: configuring }
    : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-500">Connect external services for community, marketplace, ads, and affiliate shop</p>
        </div>

        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-red-900">Security Note</p>
              <p className="text-sm text-red-700 mt-1">
                Do not store real API secrets in the frontend. Production app team will wire secrets server-side.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Settings className="text-blue-500 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-blue-900">Phase 4: Integration Scaffolding</p>
              <p className="text-sm text-blue-700 mt-1">
                These are placeholder stubs for the production app team. Each integration 
                shows the required configuration fields and expected features. No live 
                API connections are made from this reference build.
              </p>
            </div>
          </div>
        </div>

        {configuring && configuringIntegration ? (
          <ConfigPanel 
            integration={configuringIntegration} 
            onClose={() => setConfiguring(null)}
            onSave={(config) => handleSaveConfig(configuring, config)}
          />
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Integrations</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="ads">Advertising</TabsTrigger>
                <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(integrations).map(([id, integration]) => (
                    <IntegrationCard
                      key={id}
                      id={id}
                      integration={getIntegrationWithState(id)}
                      onConfigure={() => setConfiguring(id)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <IntegrationCard
                  id="bettermode"
                  integration={getIntegrationWithState("bettermode")}
                  onConfigure={() => setConfiguring("bettermode")}
                />
              </TabsContent>

              <TabsContent value="marketplace" className="mt-6">
                <IntegrationCard
                  id="sharetribe"
                  integration={getIntegrationWithState("sharetribe")}
                  onConfigure={() => setConfiguring("sharetribe")}
                />
              </TabsContent>

              <TabsContent value="ads" className="mt-6">
                <IntegrationCard
                  id="ads"
                  integration={getIntegrationWithState("ads")}
                  onConfigure={() => setConfiguring("ads")}
                />
              </TabsContent>

              <TabsContent value="affiliate" className="mt-6">
                <IntegrationCard
                  id="affiliate"
                  integration={getIntegrationWithState("affiliate")}
                  onConfigure={() => setConfiguring("affiliate")}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Integration Roadmap</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare size={16} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">BetterMode Community</p>
                <p className="text-sm text-gray-500">Fan forums, discussion boards, polls</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Planned</span>
                <p className="text-xs text-gray-400 mt-1">Community Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sharetribe Marketplace</p>
                <p className="text-sm text-gray-500">Gear exchange, ticket resale</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Planned</span>
                <p className="text-xs text-gray-400 mt-1">Marketplace Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Megaphone size={16} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Kevel / AdButler Ads</p>
                <p className="text-sm text-gray-500">Banner ads, native placements, sponsorships</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Planned</span>
                <p className="text-xs text-gray-400 mt-1">Ads Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Link2 size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Affiliate Shop Networks</p>
                <p className="text-sm text-gray-500">Impact, CJ, Rakuten, ShareASale product feeds</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Planned</span>
                <p className="text-xs text-gray-400 mt-1">Affiliate Shop Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
