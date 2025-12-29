import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Country, League } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2, Trophy, Medal, Shirt, GraduationCap, Users } from "lucide-react";

export default function CountryPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/country/:slug");
  const slug = params?.slug as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [cups, setCups] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const countryData = await sportsDataProvider.getCountry(slug);
        setCountry(countryData);
        if (countryData) {
          const leagueData = await sportsDataProvider.getLeaguesByTier(countryData.id, "league");
          const cupData = await sportsDataProvider.getLeaguesByTier(countryData.id, "cup");
          setLeagues(leagueData);
          setCups(cupData);
        }
      } catch (error) {
        console.error("Failed to load country data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const getCountryFlag = (code: string) => {
    const flags: Record<string, string> = {
      USA: "🇺🇸", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ESP: "🇪🇸", GER: "🇩🇪", FRA: "🇫🇷", ITA: "🇮🇹",
      POR: "🇵🇹", NED: "🇳🇱", BEL: "🇧🇪", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", TUR: "🇹🇷", GRE: "🇬🇷",
      AUT: "🇦🇹", SUI: "🇨🇭", UKR: "🇺🇦", POL: "🇵🇱", CZE: "🇨🇿", DEN: "🇩🇰",
      NOR: "🇳🇴", SWE: "🇸🇪", RUS: "🇷🇺", CRO: "🇭🇷", SRB: "🇷🇸",
      MEX: "🇲🇽", CAN: "🇨🇦", CRC: "🇨🇷", JAM: "🇯🇲", HON: "🇭🇳", PAN: "🇵🇦",
      BRA: "🇧🇷", ARG: "🇦🇷", COL: "🇨🇴", CHI: "🇨🇱", URU: "🇺🇾", PER: "🇵🇪", ECU: "🇪🇨",
      JPN: "🇯🇵", KOR: "🇰🇷", CHN: "🇨🇳", SAU: "🇸🇦", UAE: "🇦🇪", QAT: "🇶🇦", IRN: "🇮🇷",
      AUS: "🇦🇺", THA: "🇹🇭", IND: "🇮🇳", IDN: "🇮🇩", MYS: "🇲🇾",
      EGY: "🇪🇬", MAR: "🇲🇦", NGA: "🇳🇬", SEN: "🇸🇳", GHA: "🇬🇭", CIV: "🇨🇮", CMR: "🇨🇲",
      ALG: "🇩🇿", TUN: "🇹🇳", RSA: "🇿🇦",
      NZL: "🇳🇿", FIJ: "🇫🇯",
    };
    return flags[code] || "🏳️";
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return "1st Tier";
      case 2: return "2nd Tier";
      case 3: return "3rd Tier";
      case 4: return "4th Tier";
      case 5: return "5th Tier";
      default: return `Tier ${tier}`;
    }
  };

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

  // Group leagues by tier
  const leaguesByTier: Record<number, League[]> = {};
  leagues.forEach(league => {
    if (!leaguesByTier[league.tier]) leaguesByTier[league.tier] = [];
    leaguesByTier[league.tier].push(league);
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a2d5c] text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold uppercase tracking-wide">{country.name}</h1>
            <p className="text-xs text-white/70">Leagues & Cups</p>
          </div>
          <div className="w-10 h-10 flex items-center justify-center text-2xl bg-white/10 rounded-full">
            {getCountryFlag(country.code)}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Cups Section */}
        {cups.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#C1153D]" />
              <h2 className="text-sm font-bold text-[#1a2d5c] uppercase tracking-wide">Domestic Cups</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {cups.map((cup) => (
                <button
                  key={cup.id}
                  onClick={() => setLocation(`/league/${cup.id}-${cup.slug}`)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                  data-testid={`cup-${cup.id}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C1153D] to-[#8B0A2A] flex items-center justify-center text-white">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a2d5c] truncate">{cup.name}</p>
                    <p className="text-xs text-slate-500">Cup Competition</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Leagues by Tier */}
        {Object.entries(leaguesByTier).sort(([a], [b]) => Number(a) - Number(b)).map(([tier, tierLeagues]) => (
          <section key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <Medal className="w-5 h-5 text-[#1a2d5c]" />
              <h2 className="text-sm font-bold text-[#1a2d5c] uppercase tracking-wide">
                {getTierLabel(Number(tier))}
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {tierLeagues.map((league) => (
                <button
                  key={league.id}
                  onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                  data-testid={`league-${league.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    Number(tier) === 1 ? 'bg-gradient-to-br from-[#1a2d5c] to-[#2a4a8c]' :
                    Number(tier) === 2 ? 'bg-gradient-to-br from-slate-600 to-slate-700' :
                    'bg-gradient-to-br from-slate-400 to-slate-500'
                  }`}>
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a2d5c] truncate">{league.name}</p>
                    <p className="text-xs text-slate-500">
                      {league.name.toLowerCase().includes('women') || league.name.toLowerCase().includes('femen') || league.name.toLowerCase().includes('frauen') ? 
                        "Women's League" : "Men's League"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* College/Youth Categories for USA */}
        {country.code === "USA" && (
          <>
            <section>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-[#1a2d5c]" />
                <h2 className="text-sm font-bold text-[#1a2d5c] uppercase tracking-wide">College Soccer</h2>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
                {["NCAA Division I", "NCAA Division II", "NCAA Division III", "NAIA", "NJCAA"].map((name) => {
                  const league = leagues.find(l => l.name === name) || {
                    id: `l-usa-${name.toLowerCase().replace(/\s+/g, '-')}`,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    name
                  };
                  return (
                    <button
                      key={league.id}
                      onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                      data-testid={`league-${league.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a2d5c] truncate">{league.name}</p>
                        <p className="text-xs text-slate-500">College Soccer</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#1a2d5c]" />
                <h2 className="text-sm font-bold text-[#1a2d5c] uppercase tracking-wide">Semi-Pro & Amateur</h2>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
                {["NPSL", "UPSL"].map((name) => {
                  const league = leagues.find(l => l.name === name) || {
                    id: `l-usa-${name.toLowerCase()}`,
                    slug: name.toLowerCase(),
                    name
                  };
                  return (
                    <button
                      key={league.id}
                      onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                      data-testid={`league-${league.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a2d5c] truncate">{league.name}</p>
                        <p className="text-xs text-slate-500">Semi-Professional</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {leagues.length === 0 && cups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No leagues or cups found for this country</p>
          </div>
        )}
      </div>
    </div>
  );
}
