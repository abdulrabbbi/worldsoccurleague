import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Continent, Country } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2, Globe } from "lucide-react";

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a2d5c] animate-spin" />
      </div>
    );
  }

  if (!continent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <p className="text-slate-500">Continent not found</p>
        <button
          onClick={() => setLocation("/world")}
          className="px-6 py-2 bg-[#1a2d5c] text-white rounded-full font-bold text-sm"
        >
          Back to World
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/world")}
            className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors text-slate-800"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1a2d5c] uppercase tracking-wide">{continent.name}</h1>
            <p className="text-xs text-slate-500">{countries.length} countries available</p>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => setLocation(`/country/${country.slug}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
            data-testid={`country-button-${country.slug}`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-200">
              {country.code === "USA" ? "🇺🇸" : 
               country.code === "ENG" ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿" :
               country.code === "ESP" ? "🇪🇸" :
               country.code === "GER" ? "🇩🇪" :
               country.code === "FRA" ? "🇫🇷" :
               country.code === "ITA" ? "🇮🇹" :
               country.code === "BRA" ? "🇧🇷" :
               country.code === "MEX" ? "🇲🇽" : 
               country.code === "CAN" ? "🇨🇦" : "🏳️"}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1a2d5c]">{country.name}</p>
              <p className="text-xs text-slate-500">{country.code}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
