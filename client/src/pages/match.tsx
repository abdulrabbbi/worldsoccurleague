import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Match, Team } from "@/lib/types";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/match/:id");
  const matchId = params?.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!matchId) return;
      try {
        const matchData = await sportsDataProvider.getMatch(matchId);
        setMatch(matchData);
        if (matchData) {
          const home = await sportsDataProvider.getTeam(matchData.homeTeamId);
          const away = await sportsDataProvider.getTeam(matchData.awayTeamId);
          setHomeTeam(home);
          setAwayTeam(away);
        }
      } catch (error) {
        console.error("Failed to load match data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!match || !homeTeam || !awayTeam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Match not found</p>
      </div>
    );
  }

  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FT";

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
            <h1 className="text-lg font-bold text-foreground">Match Details</h1>
            <p className="text-xs text-muted-foreground">
              {isLive && "LIVE"}
              {isFinished && "FINISHED"}
              {!isLive && !isFinished && "SCHEDULED"}
            </p>
          </div>
        </div>
      </div>

      {/* Match Scoreline */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Teams & Score */}
          <div className="space-y-4">
            {/* Home Team */}
            <button
              onClick={() => setLocation(`/team/${homeTeam.id}-${homeTeam.slug}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="text-center flex-1">
                <p className="font-bold text-foreground mb-2">{homeTeam.name}</p>
                <p className="text-3xl font-bold text-primary">{match.homeScore ?? "—"}</p>
              </div>
            </button>

            {/* Status/Minute */}
            <div className="text-center py-4 border-y border-border">
              {isLive && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <p className="text-sm font-bold text-destructive">LIVE - {match.minute}'</p>
                </div>
              )}
              {isFinished && <p className="text-sm font-bold text-muted-foreground">Full Time</p>}
              {!isLive && !isFinished && (
                <p className="text-sm font-bold text-muted-foreground">
                  {new Date(match.kickoffTime).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Away Team */}
            <button
              onClick={() => setLocation(`/team/${awayTeam.id}-${awayTeam.slug}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="text-center flex-1">
                <p className="font-bold text-foreground mb-2">{awayTeam.name}</p>
                <p className="text-3xl font-bold text-primary">{match.awayScore ?? "—"}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto mt-6">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="lineups" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Lineups
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Match events & timeline loading...</p>
            </div>
          </TabsContent>

          <TabsContent value="lineups" className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Team lineups loading...</p>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Match statistics loading...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
