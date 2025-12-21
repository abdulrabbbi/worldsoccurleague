import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Country, League } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function CountryPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/country/:slug");
  const slug = params?.slug as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const countryData = await sportsDataProvider.getCountry(slug);
        setCountry(countryData);
        if (countryData) {
          const leagueData = await sportsDataProvider.getLeaguesByCountry(countryData.id);
          setLeagues(leagueData);
        }
      } catch (error) {
        console.error("Failed to load country data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Country not found</p>
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
            <h1 className="text-xl font-bold text-foreground">{country.name}</h1>
            <p className="text-xs text-muted-foreground">{leagues.length} leagues</p>
          </div>
        </div>
      </div>

      {/* Leagues */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
            data-testid={`league-button-${league.slug}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
              {league.tier}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{league.name}</p>
              <p className="text-xs text-muted-foreground">Tier {league.tier} • {league.type}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
