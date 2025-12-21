import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Country, League, Region, LeagueCategory } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react";

export default function CategoryPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/country/:slug/category/:category");
  const slug = params?.slug as string;
  const categoryRaw = decodeURIComponent(params?.category || "") as LeagueCategory;

  const [country, setCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine if this category uses regions (states)
  const isRegional = [
    "College Soccer",
    "High School Soccer",
    "Youth Soccer Leagues",
    "Sanctioned Leagues",
    "Pickup Soccer"
  ].includes(categoryRaw);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const countryData = await sportsDataProvider.getCountry(slug);
        setCountry(countryData);
        if (countryData) {
          if (isRegional) {
            // Load Regions (States)
            const regionData = await sportsDataProvider.getRegions(countryData.id);
            setRegions(regionData);
          } else {
            // Load Leagues directly
            const leagueData = await sportsDataProvider.getLeaguesByCategory(countryData.id, categoryRaw);
            setLeagues(leagueData);
          }
        }
      } catch (error) {
        console.error("Failed to load category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, categoryRaw]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a2d5c] animate-spin" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <p className="text-slate-500">Country not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors text-slate-800"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1a2d5c] uppercase tracking-wide">{categoryRaw}</h1>
            <p className="text-xs text-slate-500">{country.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {isRegional ? (
          // Display Regions (States)
          regions.map((region) => (
            <button
              key={region.id}
              onClick={() => console.log("Navigate to region", region.slug)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl text-[#1a2d5c]">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1a2d5c]">{region.name}</p>
                <p className="text-xs text-slate-500">Select Region</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
            </button>
          ))
        ) : (
          // Display Leagues directly
          leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
              data-testid={`league-button-${league.slug}`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-[#1a2d5c]">
                {league.tier}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1a2d5c]">{league.name}</p>
                <p className="text-xs text-slate-500">Tier {league.tier}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
            </button>
          ))
        )}
        
        {/* Empty State */}
        {!loading && ((isRegional && regions.length === 0) || (!isRegional && leagues.length === 0)) && (
          <div className="text-center py-12 text-slate-400">
            <p>No leagues found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}