import { api, type Match } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export function MatchCard({ match }: { match: Match }) {
  const homeTeam = api.getTeam(match.homeTeamId);
  const awayTeam = api.getTeam(match.awayTeamId);
  const league = api.getLeague(match.leagueId);

  if (!homeTeam || !awayTeam) return null;

  const isLive = match.status === "LIVE";
  const isFuture = match.status === "SCHEDULED";

  return (
    <Link href={`/match/${match.id}`}>
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
        {/* Header */}
        <div className="bg-muted/50 px-3 py-1.5 flex justify-between items-center text-xs text-muted-foreground border-b border-border/50 group-hover:bg-muted/70 transition-colors">
          <span className="font-medium uppercase tracking-wider">{league?.name}</span>
          {isLive ? (
            <span className="text-destructive font-bold animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              {match.minute}'
            </span>
          ) : (
            <span>{format(new Date(match.startTime), "MMM d, HH:mm")}</span>
          )}
        </div>

        {/* Teams Row */}
        <div className="p-4 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400 border border-gray-200">
               {homeTeam.shortName[0]}
            </div>
            <span className="text-sm font-semibold leading-tight">{homeTeam.name}</span>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            {isFuture ? (
              <div className="text-2xl font-display font-bold text-muted-foreground">VS</div>
            ) : (
               <div className="flex items-center gap-2 font-display text-3xl font-bold tracking-tighter text-foreground">
                 <span>{match.score.home}</span>
                 <span className="text-muted-foreground/40">-</span>
                 <span>{match.score.away}</span>
               </div>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 text-center">
             <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400 border border-gray-200">
               {awayTeam.shortName[0]}
            </div>
            <span className="text-sm font-semibold leading-tight">{awayTeam.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
