import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Player, Team } from "@/lib/types";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function PlayerPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/player/:id-:slug");
  const playerId = (params as any)?.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!playerId) return;
      try {
        const playerData = await sportsDataProvider.getPlayer(playerId);
        setPlayer(playerData);
        if (playerData) {
          const teamData = await sportsDataProvider.getTeam(playerData.teamId);
          setTeam(teamData);
        }
      } catch (error) {
        console.error("Failed to load player data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Player not found</p>
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
            <h1 className="text-xl font-bold text-foreground">{player.name}</h1>
            {team && <p className="text-xs text-muted-foreground">{team.name}</p>}
          </div>
        </div>
      </div>

      {/* Player Profile */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Position</p>
            <p className="text-xl font-bold text-foreground">{player.position || "N/A"}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Number</p>
            <p className="text-xl font-bold text-foreground">#{player.number || "—"}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Nationality</p>
            <p className="text-xl font-bold text-foreground">{player.nationality || "N/A"}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">DOB</p>
            <p className="text-xl font-bold text-foreground">{player.dateOfBirth || "N/A"}</p>
          </div>
        </div>

        {/* Team Card */}
        {team && (
          <button
            onClick={() => setLocation(`/team/${team.id}-${team.slug}`)}
            className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary transition-all text-left"
            data-testid="team-card"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Team</p>
            <p className="text-lg font-bold text-foreground">{team.name}</p>
          </button>
        )}
      </div>
    </div>
  );
}
