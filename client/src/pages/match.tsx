import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/mock-data";
import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";

export default function Match({ params }: { params: { id: string } }) {
  const match = api.getMatch(params.id);
  const homeTeam = match ? api.getTeam(match.homeTeamId) : null;
  const awayTeam = match ? api.getTeam(match.awayTeamId) : null;
  const league = match ? api.getLeague(match.leagueId) : null;

  if (!match || !homeTeam || !awayTeam) return <div>Not found</div>;

  const isLive = match.status === "LIVE";

  return (
    <AppShell title="Match Center">
      {/* Scoreboard */}
      <div className="bg-sidebar text-white pb-8 -mt-1 pt-2">
         <div className="text-center text-xs font-medium uppercase tracking-widest text-sidebar-foreground/60 mb-6">
           {league?.name} • {match.status === 'LIVE' ? 'Week 24' : format(new Date(match.startTime), "MMM d")}
         </div>

         <div className="flex items-center justify-between px-6 max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-3 w-24">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-sidebar text-2xl font-bold">
                 {homeTeam.shortName[0]}
               </div>
               <span className="text-sm font-bold text-center leading-tight">{homeTeam.shortName}</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="text-5xl font-display font-bold tracking-tighter flex items-center gap-4">
                 <span>{match.score.home}</span>
                 <span className="text-sidebar-foreground/20">:</span>
                 <span>{match.score.away}</span>
               </div>
               {isLive && (
                 <div className="mt-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                   {match.minute}'
                 </div>
               )}
            </div>

            <div className="flex flex-col items-center gap-3 w-24">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-sidebar text-2xl font-bold">
                 {awayTeam.shortName[0]}
               </div>
               <span className="text-sm font-bold text-center leading-tight">{awayTeam.shortName}</span>
            </div>
         </div>
      </div>

      <div className="p-4 space-y-6">
         {/* Stats / Timeline would go here */}
         <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center py-12">
            <p className="text-muted-foreground text-sm">Match events and stats would populate here.</p>
         </div>
         
         <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
           <MapPin className="text-accent" />
           <div>
             <div className="text-xs font-bold uppercase text-accent">Venue</div>
             <div className="font-medium text-sm">Etihad Stadium, Manchester</div>
           </div>
         </div>
      </div>
    </AppShell>
  );
}
