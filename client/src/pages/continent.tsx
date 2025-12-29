import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Continent, Country, ContinentalCup } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2, Trophy, Flag } from "lucide-react";

const COUNTRY_FLAGS: Record<string, string> = {
  "ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "ESP": "🇪🇸", "GER": "🇩🇪", "FRA": "🇫🇷", "ITA": "🇮🇹",
  "POR": "🇵🇹", "NED": "🇳🇱", "BEL": "🇧🇪", "SCO": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "TUR": "🇹🇷",
  "GRE": "🇬🇷", "AUT": "🇦🇹", "SUI": "🇨🇭", "UKR": "🇺🇦", "POL": "🇵🇱",
  "CZE": "🇨🇿", "DEN": "🇩🇰", "NOR": "🇳🇴", "SWE": "🇸🇪", "RUS": "🇷🇺",
  "USA": "🇺🇸", "MEX": "🇲🇽", "CAN": "🇨🇦", "CRC": "🇨🇷", "JAM": "🇯🇲",
  "HON": "🇭🇳", "PAN": "🇵🇦", "SLV": "🇸🇻",
  "BRA": "🇧🇷", "ARG": "🇦🇷", "COL": "🇨🇴", "CHI": "🇨🇱", "URU": "🇺🇾",
  "PER": "🇵🇪", "ECU": "🇪🇨", "PAR": "🇵🇾", "VEN": "🇻🇪", "BOL": "🇧🇴",
  "JPN": "🇯🇵", "KOR": "🇰🇷", "CHN": "🇨🇳", "SAU": "🇸🇦", "UAE": "🇦🇪",
  "QAT": "🇶🇦", "IRN": "🇮🇷", "AUS": "🇦🇺", "THA": "🇹🇭", "IND": "🇮🇳",
  "EGY": "🇪🇬", "MAR": "🇲🇦", "NGA": "🇳🇬", "SEN": "🇸🇳", "GHA": "🇬🇭",
  "CIV": "🇨🇮", "CMR": "🇨🇲", "ALG": "🇩🇿", "TUN": "🇹🇳", "RSA": "🇿🇦",
  "NZL": "🇳🇿", "FIJ": "🇫🇯", "PNG": "🇵🇬", "SOL": "🇸🇧", "TAH": "🇵🇫", "NCL": "🇳🇨",
};

export default function ContinentPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/continent/:slug");
  const slug = params?.slug as string;

  const [continent, setContinent] = useState<Continent | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubCups, setClubCups] = useState<ContinentalCup[]>([]);
  const [nationalCups, setNationalCups] = useState<ContinentalCup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const contData = await sportsDataProvider.getContinent(slug);
        setContinent(contData);
        if (contData) {
          const [countryData, clubCupsData, nationalCupsData] = await Promise.all([
            sportsDataProvider.getCountriesByContinent(contData.id),
            sportsDataProvider.getContinentalCups(contData.id, "club"),
            sportsDataProvider.getContinentalCups(contData.id, "national"),
          ]);
          setCountries(countryData);
          setClubCups(clubCupsData);
          setNationalCups(nationalCupsData);
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
            <p className="text-xs text-slate-500">{clubCups.length + nationalCups.length} cups, {countries.length} countries</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {clubCups.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#C1153D]" />
              <h2 className="font-bold text-[#1a2d5c] uppercase text-sm tracking-wide">Club Competitions</h2>
            </div>
            <div className="space-y-2">
              {clubCups.map((cup) => (
                <button
                  key={cup.id}
                  onClick={() => setLocation(`/cup/${cup.slug}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#C1153D] hover:bg-red-50/30 transition-all text-left group shadow-sm"
                  data-testid={`cup-button-${cup.slug}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C1153D] to-[#8a0f2b] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a2d5c] text-sm">{cup.name}</p>
                    {cup.description && <p className="text-xs text-slate-500">{cup.description}</p>}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#C1153D] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {nationalCups.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-5 h-5 text-[#1a2d5c]" />
              <h2 className="font-bold text-[#1a2d5c] uppercase text-sm tracking-wide">National Team Competitions</h2>
            </div>
            <div className="space-y-2">
              {nationalCups.map((cup) => (
                <button
                  key={cup.id}
                  onClick={() => setLocation(`/cup/${cup.slug}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-blue-50/30 transition-all text-left group shadow-sm"
                  data-testid={`cup-button-${cup.slug}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2d5c] to-[#0f1d3d] flex items-center justify-center">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a2d5c] text-sm">{cup.name}</p>
                    {cup.description && <p className="text-xs text-slate-500">{cup.description}</p>}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌍</span>
            <h2 className="font-bold text-[#1a2d5c] uppercase text-sm tracking-wide">Countries</h2>
          </div>
          <div className="space-y-2">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => setLocation(`/country/${country.slug}`)}
                className="w-full flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left group shadow-sm"
                data-testid={`country-button-${country.slug}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-200">
                  {COUNTRY_FLAGS[country.code] || "🏳️"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1a2d5c] text-sm">{country.name}</p>
                  <p className="text-xs text-slate-500">{country.code}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a2d5c] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
