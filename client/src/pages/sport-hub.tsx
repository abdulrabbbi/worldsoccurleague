import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Sport {
  id: string;
  code: string;
  name: string;
  slug: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface League {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  type: string | null;
  tier: number | null;
}

export default function SportHub() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/sport/:slug");
  const sportSlug = (params as any)?.slug as string;

  const [sport, setSport] = useState<Sport | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!sportSlug) return;
      try {
        const response = await fetch(`/api/sports/${sportSlug}/leagues`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Sport not found");
          } else {
            setError("Failed to load sport data");
          }
          setLoading(false);
          return;
        }
        const data = await response.json();
        setSport(data.sport);
        setLeagues(data.leagues || []);
      } catch (err) {
        console.error("Failed to load sport data:", err);
        setError("Failed to load sport data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sportSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !sport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">{error || "Sport not found"}</p>
        <button
          onClick={() => setLocation("/home")}
          className="text-primary hover:underline"
          data-testid="link-home"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            {sport.icon && <span className="text-2xl">{sport.icon}</span>}
            <div>
              <h1 className="text-xl font-bold text-foreground">{sport.name}</h1>
              <p className="text-xs text-muted-foreground">
                {leagues.length} league{leagues.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Leagues</h2>

        {leagues.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No leagues available yet for {sport.name}.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Data will populate once API integration is connected.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {leagues.map((league) => (
              <Card
                key={league.id}
                className="bg-card border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setLocation(`/sport/${sportSlug}/league/${league.id}-${league.slug}`)}
                data-testid={`card-league-${league.id}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl">
                    {league.logo ? (
                      <img src={league.logo} alt={league.name} className="w-8 h-8 object-contain" />
                    ) : (
                      sport.icon || "🏆"
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{league.name}</h3>
                    {league.shortName && (
                      <p className="text-sm text-muted-foreground">{league.shortName}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
