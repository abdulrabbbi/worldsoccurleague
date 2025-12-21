import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { League, Team } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaguePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/league/:id-:slug");
  const leagueId = (params as any)?.id as string;

  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!leagueId) return;
      try {
        const leagueData = await sportsDataProvider.getLeague(leagueId);
        setLeague(leagueData);
        if (leagueData) {
          const teamData = await sportsDataProvider.getTeamsByLeague(leagueData.id);
          setTeams(teamData);
        }
      } catch (error) {
        console.error("Failed to load league data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [leagueId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">League not found</p>
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
            <h1 className="text-xl font-bold text-foreground">{league.name}</h1>
            <p className="text-xs text-muted-foreground">Tier {league.tier} • {teams.length} teams</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="standings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Standings
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Results
            </TabsTrigger>
          </TabsList>

          {/* Standings Tab */}
          <TabsContent value="standings" className="p-4 space-y-3">
            <div className="space-y-2">
              {/* Placeholder standings header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Team</div>
                <div className="col-span-1">P</div>
                <div className="col-span-1">W</div>
                <div className="col-span-1">D</div>
                <div className="col-span-1">Pts</div>
              </div>
              {/* Placeholder rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg bg-card border border-border hover:border-primary transition-colors cursor-pointer">
                  <div className="col-span-1 text-sm font-semibold">{i}</div>
                  <div className="col-span-6 text-sm font-semibold">Team {i}</div>
                  <div className="col-span-1 text-sm text-muted-foreground">0</div>
                  <div className="col-span-1 text-sm text-muted-foreground">0</div>
                  <div className="col-span-1 text-sm text-muted-foreground">0</div>
                  <div className="col-span-1 text-sm font-bold">0</div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Fixtures Tab */}
          <TabsContent value="fixtures" className="p-4 space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <p>Upcoming fixtures loading...</p>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="p-4 space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <p>Recent results loading...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Teams List */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Teams</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setLocation(`/team/${team.id}-${team.slug}`)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
                data-testid={`team-button-${team.slug}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                  {team.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{team.name}</p>
                  {team.city && <p className="text-xs text-muted-foreground">{team.city}</p>}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
