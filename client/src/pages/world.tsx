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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a2d5c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#1a2d5c]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2d5c] font-display uppercase tracking-wide">World Soccer Leagues</h1>
            <p className="text-xs text-slate-500">Select a region to browse</p>
          </div>
        </div>
      </div>

      {/* Continents */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {continents.map((continent) => (
          <button
            key={continent.id}
            onClick={() => setLocation(`/continent/${continent.slug}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
            data-testid={`continent-button-${continent.slug}`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-sm transition-all">
              🌍
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1a2d5c]">{continent.name}</p>
              <p className="text-xs text-slate-500">Browse leagues & teams</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
