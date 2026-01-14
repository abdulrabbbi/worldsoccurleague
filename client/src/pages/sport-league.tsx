import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Sport {
  id: string;
  code: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface League {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  type: string | null;
  tier: number | null;
  sportId: string | null;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
}

export default function SportLeague() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/sport/:sportSlug/league/:id-:slug");
  const sportSlug = (params as any)?.sportSlug as string;
  const leagueId = (params as any)?.id as string;

  const [sport, setSport] = useState<Sport | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!sportSlug || !leagueId) return;
      try {
        const sportRes = await fetch(`/api/sports/${sportSlug}`);
        if (!sportRes.ok) {
          setError("Sport not found");
          setLoading(false);
          return;
        }
        const sportData = await sportRes.json();
        setSport(sportData);

        const leaguesRes = await fetch(`/api/sports/${sportSlug}/leagues`);
        if (leaguesRes.ok) {
          const leaguesData = await leaguesRes.json();
          const foundLeague = leaguesData.leagues?.find((l: League) => l.id === leagueId);
          if (foundLeague) {
            setLeague(foundLeague);
          } else {
            setError("League not found in this sport");
          }
        }

        const teamsRes = await fetch(`/api/leagues/${leagueId}/teams`);
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load league data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sportSlug, leagueId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !league || !sport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">{error || "League not found"}</p>
        <button
          onClick={() => setLocation(`/sport/${sportSlug}`)}
          className="text-primary hover:underline"
          data-testid="link-back-sport"
        >
          Back to {sport?.name || "Sport Hub"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation(`/sport/${sportSlug}`)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            {sport.icon && <span className="text-xl">{sport.icon}</span>}
            <div>
              <h1 className="text-xl font-bold text-foreground">{league.name}</h1>
              <p className="text-xs text-muted-foreground">
                {sport.name} • {teams.length} team{teams.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Teams
            </TabsTrigger>
            <TabsTrigger value="standings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Standings
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="p-4 space-y-2">
            {teams.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No teams available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Data will populate once API integration is connected.
                  </p>
                </CardContent>
              </Card>
            ) : (
              teams.map((team) => (
                <Card
                  key={team.id}
                  className="bg-card border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setLocation(`/sport/${sportSlug}/team/${team.id}-${team.slug}`)}
                  data-testid={`card-team-${team.id}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                      ) : (
                        sport.icon || "🏆"
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{team.name}</h3>
                      {team.shortName && (
                        <p className="text-sm text-muted-foreground">{team.shortName}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="standings" className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Team</div>
                <div className="col-span-1">W</div>
                <div className="col-span-1">L</div>
                <div className="col-span-1">T</div>
                <div className="col-span-2">PCT</div>
              </div>
              <div className="text-center py-4 text-sm text-muted-foreground">
                Standings data loading...
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="p-4 space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <p>Schedule loading...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
