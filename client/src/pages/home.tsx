import { AppShell } from "@/components/layout/app-shell";
import { MatchCard } from "@/components/ui/match-card";
import { api } from "@/lib/mock-data";
import { Search, MapPin, ChevronRight, Star } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/abstract_dark_stadium_background_with_stadium_lights.png";

export default function Home() {
  const matches = api.getMatches();
  const liveMatches = matches.filter(m => m.status === "LIVE");
  const upcomingMatches = matches.filter(m => m.status !== "LIVE");

  return (
    <AppShell>
      {/* Hero / Search Section */}
      <div className="relative h-48 bg-sidebar flex flex-col justify-end p-4 pb-6 overflow-hidden">
        {/* Abstract Background Image */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent" />
        
        <div className="relative z-10 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight uppercase italic">
              World Soccer <br/><span className="text-accent">Leagues</span>
            </h1>
            <p className="text-sidebar-foreground/70 text-sm">The game, organized globally.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search teams, leagues, players..." 
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick Access / Shortcuts */}
      <div className="grid grid-cols-4 gap-2 p-4 border-b border-border/40 bg-card">
         <Link href="/explore">
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 group-hover:bg-accent group-hover:text-white transition-colors">
              <MapPin size={20} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground">Near Me</span>
          </div>
         </Link>
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Star size={20} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground">Following</span>
          </div>
           {/* Placeholders for other actions */}
      </div>

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

        {/* Following / For You Section */}
        <section className="space-y-3">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Your Matches</h2>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today</span>
           </div>
           <div className="space-y-3">
             {upcomingMatches.map(match => (
               <MatchCard key={match.id} match={match} />
             ))}
           </div>
        </section>

         {/* Browse Teaser */}
        <section className="pt-4">
           <Link href="/explore">
            <div className="bg-sidebar p-6 rounded-xl relative overflow-hidden group cursor-pointer">
               <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-accent/20 to-transparent" />
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                    <h3 className="text-white text-xl font-bold mb-1">Browse the World</h3>
                    <p className="text-sidebar-foreground/60 text-sm">From Premier League to Pickup.</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-sidebar transition-colors">
                   <ChevronRight size={20} />
                 </div>
               </div>
            </div>
           </Link>
        </section>
      </div>
    </AppShell>
  );
}
