import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Team, Player } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id-:slug");
  const teamId = (params as any)?.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!teamId) return;
      try {
        const teamData = await sportsDataProvider.getTeam(teamId);
        setTeam(teamData);
        if (teamData) {
          const playerData = await sportsDataProvider.getPlayersByTeam(teamData.id);
          setPlayers(playerData);
        }
      } catch (error) {
        console.error("Failed to load team data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{team.name}</h1>
            {team.city && <p className="text-xs text-muted-foreground">{team.city}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="squad" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Squad
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Fixtures
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Founded</p>
                <p className="text-lg font-bold text-foreground">{team.founded || "N/A"}</p>
              </div>
            </div>
          </TabsContent>

          {/* Squad Tab */}
          <TabsContent value="squad" className="p-4 space-y-3">
            {players.length > 0 ? (
              <div className="space-y-3">
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => setLocation(`/player/${player.id}-${player.slug}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
                    data-testid={`player-button-${player.slug}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">#{player.number || "—"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.position || "N/A"}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Squad data loading...</p>
              </div>
            )}
          </TabsContent>

          {/* Fixtures Tab */}
          <TabsContent value="fixtures" className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Fixtures & results loading...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
