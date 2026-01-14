import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
  X,
  AlertTriangle,
  Database,
  ExternalLink,
  BarChart3,
  Layers
} from "lucide-react";
import AdminLayout, { useAdminSport } from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProviderMapping {
  id: string;
  providerName: string;
  providerEntityType: string;
  providerEntityId: string;
  internalEntityId: string;
  providerEntityName: string | null;
  rawPayload: any;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CoverageStat {
  entityType: string;
  total: number;
  mapped: number;
  percentage: number;
}

interface UnmappedEntity {
  id: string;
  name: string;
  entityType: string;
  sportCode?: string;
}

interface InternalEntity {
  id: string;
  name: string;
  sportCode?: string;
}

interface ConflictError {
  error: string;
  conflictType: 'provider_conflict' | 'internal_conflict';
  existingMapping: ProviderMapping;
}

const providers = [
  { id: "sportmonks", name: "SportMonks", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "api_football", name: "API-Football", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { id: "football_data", name: "Football-Data.org", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
];

const entityTypes = [
  { id: "league", label: "League" },
  { id: "team", label: "Team" },
];

function CoverageDashboard({ sportSlug }: { sportSlug: string }) {
  const { data: stats, isLoading } = useQuery<CoverageStat[]>({
    queryKey: ["/api/admin/coverage", sportSlug],
    queryFn: async () => {
      const params = sportSlug && sportSlug !== "all" ? `?sport=${sportSlug}` : "";
      const res = await fetch(`/api/admin/coverage${params}`);
      if (!res.ok) throw new Error("Failed to fetch coverage");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded w-32 mb-2" />
              <div className="h-2 bg-muted rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats?.map((stat) => (
        <Card key={stat.entityType} data-testid={`coverage-card-${stat.entityType}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
              {stat.entityType === "league" ? <Layers className="h-4 w-4" /> : <Database className="h-4 w-4" />}
              {stat.entityType}s
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{stat.mapped}</span>
              <span className="text-muted-foreground">/ {stat.total} mapped</span>
              <Badge 
                variant={stat.percentage >= 80 ? "default" : stat.percentage >= 50 ? "secondary" : "destructive"}
                className="ml-auto"
              >
                {stat.percentage}%
              </Badge>
            </div>
            <Progress value={stat.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stat.total - stat.mapped} unmapped {stat.entityType}s remaining
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UnmappedEntitiesList({ 
  sportSlug, 
  onMapEntity 
}: { 
  sportSlug: string;
  onMapEntity: (entity: UnmappedEntity) => void;
}) {
  const [entityType, setEntityType] = useState<'league' | 'team'>('league');
  
  const { data: unmapped, isLoading } = useQuery<UnmappedEntity[]>({
    queryKey: ["/api/admin/unmapped", entityType, sportSlug],
    queryFn: async () => {
      const params = new URLSearchParams({ entityType });
      if (sportSlug && sportSlug !== "all") params.set("sport", sportSlug);
      params.set("limit", "20");
      const res = await fetch(`/api/admin/unmapped?${params}`);
      if (!res.ok) throw new Error("Failed to fetch unmapped");
      return res.json();
    },
  });

  return (
    <Card data-testid="unmapped-entities-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Coverage Gaps
          </CardTitle>
          <Select value={entityType} onValueChange={(v) => setEntityType(v as 'league' | 'team')}>
            <SelectTrigger className="w-32" data-testid="entity-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="league">Leagues</SelectItem>
              <SelectItem value="team">Teams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : unmapped?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            All {entityType}s are mapped!
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {unmapped?.map((entity) => (
              <div 
                key={entity.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                data-testid={`unmapped-entity-${entity.id}`}
              >
                <div>
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {entity.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {entity.sportCode && (
                    <Badge variant="outline" className="text-xs">{entity.sportCode}</Badge>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => onMapEntity(entity)}
                    data-testid={`map-button-${entity.id}`}
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Map
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MappingModal({
  open,
  onOpenChange,
  prefillEntity,
  editMapping,
  onSuccess,
  sportSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillEntity?: UnmappedEntity | null;
  editMapping?: ProviderMapping | null;
  onSuccess: () => void;
  sportSlug?: string;
}) {
  const queryClient = useQueryClient();
  const [providerName, setProviderName] = useState("");
  const [entityType, setEntityType] = useState<string>("league");
  const [providerEntityId, setProviderEntityId] = useState("");
  const [providerEntityName, setProviderEntityName] = useState("");
  const [internalEntityId, setInternalEntityId] = useState("");
  const [internalSearch, setInternalSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictError | null>(null);

  const { data: internalEntities } = useQuery<InternalEntity[]>({
    queryKey: ["/api/admin/internal-entities", entityType, internalSearch, sportSlug],
    queryFn: async () => {
      const params = new URLSearchParams({ entityType });
      if (internalSearch) params.set("search", internalSearch);
      if (sportSlug && sportSlug !== "all") params.set("sport", sportSlug);
      const res = await fetch(`/api/admin/internal-entities?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: open && !!entityType && internalSearch.length >= 2,
  });

  useEffect(() => {
    if (prefillEntity && open) {
      setEntityType(prefillEntity.entityType);
      setInternalEntityId(prefillEntity.id);
      setInternalSearch(prefillEntity.name);
    }
    if (editMapping && open) {
      setProviderName(editMapping.providerName);
      setEntityType(editMapping.providerEntityType);
      setProviderEntityId(editMapping.providerEntityId);
      setProviderEntityName(editMapping.providerEntityName || "");
      setInternalEntityId(editMapping.internalEntityId);
      setShowAdvanced(true);
    }
    if (!open) {
      setProviderName("");
      setEntityType("league");
      setProviderEntityId("");
      setProviderEntityName("");
      setInternalEntityId("");
      setInternalSearch("");
      setShowAdvanced(false);
      setError(null);
      setConflict(null);
    }
  }, [prefillEntity, editMapping, open]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/provider-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          throw { isConflict: true, ...err };
        }
        throw new Error(err.error || "Failed to create mapping");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/provider-mappings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coverage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/unmapped"] });
      onSuccess();
      onOpenChange(false);
    },
    onError: (err: any) => {
      if (err.isConflict) {
        setConflict(err as ConflictError);
      } else {
        setError(err.message);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admin/provider-mappings/${editMapping?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          throw { isConflict: true, ...err };
        }
        throw new Error(err.error || "Failed to update mapping");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/provider-mappings"] });
      onSuccess();
      onOpenChange(false);
    },
    onError: (err: any) => {
      if (err.isConflict) {
        setConflict(err as ConflictError);
      } else {
        setError(err.message);
      }
    },
  });

  const handleSubmit = () => {
    setError(null);
    setConflict(null);

    if (!providerName || !entityType || !providerEntityId || !internalEntityId) {
      setError("Please fill in all required fields");
      return;
    }

    const data = {
      providerName,
      providerEntityType: entityType,
      providerEntityId,
      internalEntityId,
      providerEntityName: providerEntityName || null,
    };

    if (editMapping) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleResolveConflict = async () => {
    if (!conflict) return;
    
    await fetch(`/api/admin/provider-mappings/${conflict.existingMapping.id}`, {
      method: "DELETE",
    });
    
    setConflict(null);
    handleSubmit();
  };

  const provider = providers.find(p => p.id === providerName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="mapping-modal">
        <DialogHeader>
          <DialogTitle>{editMapping ? "Edit" : "Create"} Provider Mapping</DialogTitle>
          <DialogDescription>
            Link an external provider entity to an internal entity
          </DialogDescription>
        </DialogHeader>

        {conflict && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4" data-testid="conflict-alert">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Mapping Conflict</p>
                <p className="text-sm text-muted-foreground mt-1">{conflict.error}</p>
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <p>Existing mapping:</p>
                  <p className="font-mono">
                    {conflict.existingMapping.providerName}:{conflict.existingMapping.providerEntityId} 
                    → {conflict.existingMapping.internalEntityId}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleResolveConflict}
                    data-testid="resolve-conflict-button"
                  >
                    Replace Existing
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setConflict(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && !conflict && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Provider</label>
            <Select value={providerName} onValueChange={setProviderName}>
              <SelectTrigger data-testid="provider-select">
                <SelectValue placeholder="Select provider..." />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className={`px-2 py-0.5 rounded text-xs ${p.color}`}>{p.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Entity Type</label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger data-testid="entity-type-modal-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Internal Entity</label>
            {prefillEntity ? (
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="font-medium">{prefillEntity.name}</p>
                <p className="text-xs text-muted-foreground">ID: {prefillEntity.id}</p>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search by name..."
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  data-testid="internal-search-input"
                />
                {internalEntities && internalEntities.length > 0 && internalSearch.length >= 2 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
                    {internalEntities.map((entity) => (
                      <button
                        key={entity.id}
                        className={`w-full text-left p-2 hover:bg-muted text-sm ${
                          internalEntityId === entity.id ? "bg-primary/10" : ""
                        }`}
                        onClick={() => {
                          setInternalEntityId(entity.id);
                          setInternalSearch(entity.name);
                        }}
                        data-testid={`internal-entity-option-${entity.id}`}
                      >
                        <p className="font-medium">{entity.name}</p>
                        <p className="text-xs text-muted-foreground">{entity.id}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <button 
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Advanced / Manual Entry
            </button>
            
            {showAdvanced && (
              <div className="mt-3 space-y-3 pl-4 border-l-2">
                <div>
                  <label className="text-sm font-medium">Provider Entity ID</label>
                  <Input
                    placeholder="e.g., 8"
                    value={providerEntityId}
                    onChange={(e) => setProviderEntityId(e.target.value)}
                    data-testid="provider-id-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The ID used by {provider?.name || "the provider"} for this entity
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Provider Entity Name (optional)</label>
                  <Input
                    placeholder="e.g., Premier League"
                    value={providerEntityName}
                    onChange={(e) => setProviderEntityName(e.target.value)}
                    data-testid="provider-name-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createMutation.isPending || updateMutation.isPending}
            data-testid="submit-mapping-button"
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {editMapping ? "Update" : "Create"} Mapping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AllMappingsTable({ sportSlug }: { sportSlug: string }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [editMapping, setEditMapping] = useState<ProviderMapping | null>(null);

  const { data: mappings, isLoading } = useQuery<ProviderMapping[]>({
    queryKey: ["/api/admin/provider-mappings", providerFilter, entityTypeFilter, sportSlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (providerFilter !== "all") params.set("provider", providerFilter);
      if (entityTypeFilter !== "all") params.set("entityType", entityTypeFilter);
      if (sportSlug && sportSlug !== "all") params.set("sport", sportSlug);
      const res = await fetch(`/api/admin/provider-mappings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch mappings");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/provider-mappings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/provider-mappings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coverage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/unmapped"] });
    },
  });

  const filteredMappings = mappings?.filter((m) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      m.providerEntityId.toLowerCase().includes(searchLower) ||
      m.internalEntityId.toLowerCase().includes(searchLower) ||
      m.providerEntityName?.toLowerCase().includes(searchLower)
    );
  });

  const getProviderBadge = (providerName: string) => {
    const provider = providers.find(p => p.id === providerName);
    return provider ? (
      <Badge className={provider.color}>{provider.name}</Badge>
    ) : (
      <Badge variant="outline">{providerName}</Badge>
    );
  };

  return (
    <Card data-testid="all-mappings-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            All Mappings
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mappings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-48"
                data-testid="search-mappings-input"
              />
            </div>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-36" data-testid="provider-filter-select">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-28" data-testid="entity-filter-select">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {entityTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : filteredMappings?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No mappings found</p>
            <p className="text-sm">Create your first mapping using the Coverage Gaps section</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Provider ID</TableHead>
                  <TableHead>Internal ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMappings?.map((mapping) => (
                  <TableRow key={mapping.id} data-testid={`mapping-row-${mapping.id}`}>
                    <TableCell>{getProviderBadge(mapping.providerName)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {mapping.providerEntityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {mapping.providerEntityId}
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-40 truncate">
                      {mapping.internalEntityId}
                    </TableCell>
                    <TableCell>{mapping.providerEntityName || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditMapping(mapping)}
                          data-testid={`edit-mapping-${mapping.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this mapping?")) {
                              deleteMutation.mutate(mapping.id);
                            }
                          }}
                          data-testid={`delete-mapping-${mapping.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <MappingModal
        open={!!editMapping}
        onOpenChange={(open) => !open && setEditMapping(null)}
        editMapping={editMapping}
        onSuccess={() => setEditMapping(null)}
        sportSlug={sportSlug}
      />
    </Card>
  );
}

export default function ApiMappingPage() {
  const { selectedSportSlug } = useAdminSport();
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [prefillEntity, setPrefillEntity] = useState<UnmappedEntity | null>(null);
  const queryClient = useQueryClient();

  const handleMapEntity = (entity: UnmappedEntity) => {
    setPrefillEntity(entity);
    setMappingModalOpen(true);
  };

  const handleMappingSuccess = () => {
    setPrefillEntity(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Provider Mappings</h1>
            <p className="text-muted-foreground">
              Map external API entities to internal database records
            </p>
          </div>
          <Button 
            onClick={() => setMappingModalOpen(true)}
            data-testid="create-mapping-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Mapping
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Coverage Dashboard
            </TabsTrigger>
            <TabsTrigger value="mappings" data-testid="tab-mappings">
              <Database className="h-4 w-4 mr-2" />
              All Mappings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <CoverageDashboard sportSlug={selectedSportSlug} />
            <UnmappedEntitiesList 
              sportSlug={selectedSportSlug} 
              onMapEntity={handleMapEntity}
            />
          </TabsContent>

          <TabsContent value="mappings">
            <AllMappingsTable sportSlug={selectedSportSlug} />
          </TabsContent>
        </Tabs>

        <MappingModal
          open={mappingModalOpen}
          onOpenChange={setMappingModalOpen}
          prefillEntity={prefillEntity}
          onSuccess={handleMappingSuccess}
          sportSlug={selectedSportSlug}
        />
      </div>
    </AdminLayout>
  );
}
