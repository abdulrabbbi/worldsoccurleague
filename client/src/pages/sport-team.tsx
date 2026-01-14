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

interface Team {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  leagueId: string | null;
}

export default function SportTeam() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/sport/:sportSlug/team/:id-:slug");
  const sportSlug = (params as any)?.sportSlug as string;
  const teamId = (params as any)?.id as string;

  const [sport, setSport] = useState<Sport | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!sportSlug || !teamId) return;
      try {
        const sportRes = await fetch(`/api/sports/${sportSlug}`);
        if (!sportRes.ok) {
          setError("Sport not found");
          setLoading(false);
          return;
        }
        const sportData = await sportRes.json();
        setSport(sportData);

        const teamRes = await fetch(`/api/teams/${teamId}`);
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeam(teamData);
        } else {
          setError("Team not found");
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sportSlug, teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !team || !sport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">{error || "Team not found"}</p>
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
            onClick={() => window.history.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
              ) : (
                sport.icon || "🏆"
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{team.name}</h1>
              <p className="text-xs text-muted-foreground">{sport.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="roster" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Roster
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 space-y-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto bg-muted rounded-xl flex items-center justify-center text-4xl mb-4">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
                  ) : (
                    sport.icon || "🏆"
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{team.name}</h2>
                {team.shortName && (
                  <p className="text-muted-foreground">{team.shortName}</p>
                )}
                <div className="mt-4 flex justify-center gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sport</p>
                    <p className="font-semibold">{sport.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roster" className="p-4">
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Roster data loading...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="p-4">
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Schedule data loading...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Statistics loading...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
