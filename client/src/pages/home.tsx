import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { Link } from "wouter";
import { Trophy, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Sport {
  id: string;
  code: string;
  name: string;
  slug: string;
  icon: string | null;
}

const POPULAR_CUPS = [
  { id: "cup-ucl", name: "Champions League", shortName: "UCL", icon: "🏆", region: "Europe" },
  { id: "cup-uel", name: "Europa League", shortName: "UEL", icon: "🏆", region: "Europe" },
  { id: "cup-libertadores", name: "Copa Libertadores", shortName: "Lib", icon: "🏆", region: "South America" },
  { id: "cup-ccl", name: "CONCACAF Champions Cup", shortName: "CCL", icon: "🏆", region: "North America" },
  { id: "cup-goldcup", name: "Gold Cup", shortName: "Gold", icon: "🏆", region: "CONCACAF" },
  { id: "cup-afcon", name: "AFCON", shortName: "AFCON", icon: "🌍", region: "Africa" },
];

export default function Home() {
  const matches = api.getMatches();
  const liveMatches = matches.filter(m => m.status === "LIVE");
  const upcomingMatches = matches.filter(m => m.status !== "LIVE");
  
  const [otherSports, setOtherSports] = useState<Sport[]>([]);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const sports = await response.json();
          setOtherSports(sports.filter((s: Sport) => s.code !== "soccer"));
        }
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };
    loadSports();
  }, []);

  return (
    <AppShell>
      <div className="p-4 space-y-6">
        
        {liveMatches.length > 0 && (
          <section className="space-y-3">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  Live Now
                </h2>
                <span className="text-xs font-medium text-accent uppercase tracking-wide cursor-pointer hover:underline">View All</span>
             </div>
             <div className="space-y-3">
               {liveMatches.map(match => (
                 <MatchCard key={match.id} match={match} />
               ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#C1153D]" />
              Popular Cups
            </h2>
            <Link href="/world">
              <span className="text-xs font-medium text-accent uppercase tracking-wide cursor-pointer hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {POPULAR_CUPS.map(cup => (
              <Link key={cup.id} href={`/cup/${cup.id}`}>
                <div 
                  className="p-3 bg-gradient-to-br from-[#1a2d5c] to-[#2a4a8c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity text-center"
                  data-testid={`cup-card-${cup.id}`}
                >
                  <span className="text-2xl block mb-1">{cup.icon}</span>
                  <span className="text-xs font-semibold block">{cup.shortName}</span>
                  <span className="text-[10px] text-white/60 block">{cup.region}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Upcoming</h2>
            <span className="text-xs font-medium text-accent uppercase tracking-wide cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/world">
              <div className="p-4 bg-gradient-to-br from-[#C1153D] to-[#1a2d5c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-browse-leagues">
                <span className="text-2xl mb-2 block">🌍</span>
                <span className="font-semibold">Browse World</span>
              </div>
            </Link>
            <Link href="/leagues">
              <div className="p-4 bg-gradient-to-br from-[#1a2d5c] to-[#2a4a8c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-leagues">
                <span className="text-2xl mb-2 block">⚽</span>
                <span className="font-semibold">Leagues</span>
              </div>
            </Link>
            <Link href="/teams">
              <div className="p-4 bg-gradient-to-br from-[#2a4a8c] to-[#3a5a9c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-teams">
                <span className="text-2xl mb-2 block">👥</span>
                <span className="font-semibold">Teams</span>
              </div>
            </Link>
            <Link href="/standings">
              <div className="p-4 bg-gradient-to-br from-[#3a5a9c] to-[#4a6aac] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-standings">
                <span className="text-2xl mb-2 block">📊</span>
                <span className="font-semibold">Standings</span>
              </div>
            </Link>
          </div>
        </section>

        {otherSports.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">More Sports</h2>
            <div className="grid grid-cols-4 gap-2">
              {otherSports.map(sport => (
                <Link key={sport.id} href={`/sport/${sport.slug}`}>
                  <div 
                    className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-primary transition-colors text-center"
                    data-testid={`sport-card-${sport.code}`}
                  >
                    <span className="text-2xl block mb-1">{sport.icon || "🏆"}</span>
                    <span className="text-xs font-semibold block text-foreground">{sport.code.toUpperCase()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </AppShell>
  );
}
