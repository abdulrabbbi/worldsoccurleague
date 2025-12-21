import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Continent } from "@/lib/types";
import { Globe, ChevronRight, Loader2 } from "lucide-react";

export default function World() {
  const [, setLocation] = useLocation();
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContinents = async () => {
      try {
        const data = await sportsDataProvider.getContinents();
        setContinents(data);
      } catch (error) {
        console.error("Failed to load continents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContinents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">World Soccer Leagues</h1>
            <p className="text-xs text-muted-foreground">Select a continent</p>
          </div>
        </div>
      </div>

      {/* Continents */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {continents.map((continent) => (
          <button
            key={continent.id}
            onClick={() => setLocation(`/continent/${continent.slug}`)}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
            data-testid={`continent-button-${continent.slug}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              🌍
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{continent.name}</p>
              <p className="text-xs text-muted-foreground">Browse leagues & teams</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
