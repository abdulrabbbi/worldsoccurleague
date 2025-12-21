import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { Link } from "wouter";

export default function Home() {
  const matches = api.getMatches();
  const liveMatches = matches.filter(m => m.status === "LIVE");
  const upcomingMatches = matches.filter(m => m.status !== "LIVE");

  return (
    <AppShell>
      <div className="p-4 space-y-6">
        
        {/* Live Section */}
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

        {/* Upcoming Section */}
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

        {/* Quick Links */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/leagues">
              <div className="p-4 bg-gradient-to-br from-[#C1153D] to-[#1a2d5c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-browse-leagues">
                <span className="text-2xl mb-2 block">⚽</span>
                <span className="font-semibold">Browse Leagues</span>
              </div>
            </Link>
            <Link href="/teams">
              <div className="p-4 bg-gradient-to-br from-[#1a2d5c] to-[#2a4a8c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-teams">
                <span className="text-2xl mb-2 block">👥</span>
                <span className="font-semibold">Teams</span>
              </div>
            </Link>
            <Link href="/players">
              <div className="p-4 bg-gradient-to-br from-[#2a4a8c] to-[#3a5a9c] rounded-xl text-white cursor-pointer hover:opacity-90 transition-opacity" data-testid="link-players">
                <span className="text-2xl mb-2 block">🏃</span>
                <span className="font-semibold">Players</span>
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

      </div>
    </AppShell>
  );
}
