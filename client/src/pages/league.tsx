import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/mock-data";
import { MatchCard } from "@/components/ui/match-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function League({ params }: { params: { id: string } }) {
  const league = api.getLeague(params.id);
  const matches = api.getMatches().filter(m => m.leagueId === params.id);
  const teams = api.getTeams(params.id);

  if (!league) return <div>Not found</div>;

  return (
    <AppShell title={league.name}>
      <div className="bg-sidebar text-sidebar-foreground p-6 -mt-1 pt-4">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-sidebar font-display font-bold text-3xl shadow-lg">
              {league.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold uppercase">{league.name}</h1>
              <p className="text-sidebar-foreground/60 text-sm">Season 2024/25</p>
            </div>
         </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/50 p-1">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
             {matches.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">No matches scheduled.</div>
             ) : (
               matches.map(m => <MatchCard key={m.id} match={m} />)
             )}
          </TabsContent>

          <TabsContent value="table">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
               <table className="w-full text-sm">
                 <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-[10px] tracking-wider text-left">
                   <tr>
                     <th className="p-3 w-8 text-center">#</th>
                     <th className="p-3">Team</th>
                     <th className="p-3 text-center">PL</th>
                     <th className="p-3 text-center">GD</th>
                     <th className="p-3 text-center font-bold text-foreground">PTS</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {/* Mock Standings Logic - Random for prototype */}
                    {teams.map((team, i) => (
                      <tr key={team.id} className="hover:bg-muted/20">
                        <td className="p-3 text-center font-medium border-l-2 border-transparent first:border-accent">{i + 1}</td>
                        <td className="p-3">
                           <Link href={`/team/${team.id}`}>
                             <div className="flex items-center gap-2 cursor-pointer group">
                               <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:scale-110 transition-transform">
                                 {team.shortName[0]}
                               </div>
                               <span className="font-semibold group-hover:text-accent transition-colors">{team.name}</span>
                             </div>
                           </Link>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">24</td>
                        <td className="p-3 text-center text-muted-foreground">+12</td>
                        <td className="p-3 text-center font-bold text-base">{60 - (i * 3)}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </TabsContent>

           <TabsContent value="teams">
             <div className="grid grid-cols-2 gap-3">
               {teams.map(team => (
                 <Link key={team.id} href={`/team/${team.id}`}>
                   <div className="bg-card border border-border p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-accent/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                         {team.shortName[0]}
                      </div>
                      <span className="font-medium text-sm">{team.name}</span>
                   </div>
                 </Link>
               ))}
             </div>
           </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
