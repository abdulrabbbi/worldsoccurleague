import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Continent, Country } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function ContinentPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/continent/:slug");
  const slug = params?.slug as string;

  const [continent, setContinent] = useState<Continent | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const contData = await sportsDataProvider.getContinent(slug);
        setContinent(contData);
        if (contData) {
          const countryData = await sportsDataProvider.getCountriesByContinent(contData.id);
          setCountries(countryData);
        }
      } catch (error) {
        console.error("Failed to load continent data:", error);
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

  if (!continent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Continent not found</p>
        <button
          onClick={() => setLocation("/world")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Back to World
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/world")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{continent.name}</h1>
            <p className="text-xs text-muted-foreground">{countries.length} countries</p>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => setLocation(`/country/${country.slug}`)}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
            data-testid={`country-button-${country.slug}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {country.code}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{country.name}</p>
              <p className="text-xs text-muted-foreground">{country.code}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
