import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/mock-data";
import { MatchCard } from "@/components/ui/match-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

export default function Team({ params }: { params: { id: string } }) {
  const team = api.getTeam(params.id);
  // Mock matches for this team
  const matches = api.getMatches().filter(m => m.homeTeamId === params.id || m.awayTeamId === params.id);
  
  // Mock players if empty
  const players = team?.players.length ? team.players : Array.from({ length: 11 }).map((_, i) => ({
    id: `p-${i}`,
    name: `Player ${i + 1}`,
    position: i === 0 ? "GK" : i < 5 ? "DEF" : i < 9 ? "MID" : "FWD",
    number: i + 1,
  }));

  if (!team) return <div>Not found</div>;

  return (
    <AppShell title={team.name}>
      <div className="bg-sidebar p-6 -mt-1 pt-4 text-center">
         <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center text-sidebar font-display font-bold text-4xl shadow-xl border-4 border-sidebar-accent mb-4">
            {team.shortName[0]}
         </div>
         <h1 className="text-3xl font-display font-bold text-white uppercase">{team.name}</h1>
         <p className="text-accent font-medium uppercase tracking-widest text-xs mt-1">{team.shortName}</p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="squad" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-muted/50 p-1">
            <TabsTrigger value="squad">Squad</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="squad">
             <div className="grid gap-2">
               {/* Group by position logic could go here */}
               {players.map((player) => (
                 <div key={player.id} className="bg-card border border-border p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{player.name}</div>
                        <div className="text-[10px] uppercase text-muted-foreground font-medium">{player.position}</div>
                      </div>
                    </div>
                    <div className="text-xl font-display font-bold text-muted-foreground/30">
                      {player.number}
                    </div>
                 </div>
               ))}
             </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
             {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
