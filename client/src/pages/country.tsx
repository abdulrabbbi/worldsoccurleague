import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Country, LeagueCategory } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function CountryPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/country/:slug");
  const slug = params?.slug as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [categories, setCategories] = useState<LeagueCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const countryData = await sportsDataProvider.getCountry(slug);
        setCountry(countryData);
        if (countryData) {
          const cats = await sportsDataProvider.getCategories(countryData.id);
          setCategories(cats);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "National Teams": return "🏛️";
      case "Professional Leagues": return "🏆";
      case "College Soccer": return "🎓";
      case "High School Soccer": return "🏫";
      case "Youth Soccer Leagues": return "⚽";
      case "Sanctioned Leagues": return "📋";
      case "Pickup Soccer": return "📍";
      default: return "⚽";
    }
  };

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
            <h1 className="text-lg font-bold text-[#1a2d5c] uppercase tracking-wide">{country.name}</h1>
            <p className="text-xs text-slate-500">Select League Category</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center text-xl">
            {country.code === "USA" ? "🇺🇸" : 
             country.code === "ENG" ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿" :
             country.code === "ESP" ? "🇪🇸" : "🏳️"}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setLocation(`/country/${slug}/category/${encodeURIComponent(category)}`)} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
            data-testid={`category-button-${category}`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-200">
              {getCategoryIcon(category)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1a2d5c]">{category}</p>
              <p className="text-xs text-slate-500">Browse {category.toLowerCase()}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
