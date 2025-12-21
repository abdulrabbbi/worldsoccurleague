import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/mock-data";
import { ChevronRight, Globe, Map, Trophy, Users } from "lucide-react";
import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";

export default function Explore() {
  const continents = api.getContinents();

  return (
    <AppShell title="World Browser">
      <div className="p-4 space-y-6">
        
        {/* Breadcrumb style header for World */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-4">
           <Globe size={16} />
           <span>World</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display uppercase">Select Region</h1>
          <p className="text-muted-foreground text-sm">Start by choosing a continent.</p>
        </div>

        <div className="grid gap-3">
          {continents.map(continent => (
             <Link key={continent.id} href={`/explore/continent/${continent.id}`}>
               <div className="bg-card hover:bg-muted/50 border border-border p-4 rounded-xl flex items-center justify-between group cursor-pointer transition-colors shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <Globe size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-none">{continent.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">
                        {api.getChildren("continent", continent.id).length} Countries
                      </p>
                    </div>
                 </div>
                 <ChevronRight className="text-muted-foreground/30 group-hover:text-accent transition-colors" />
               </div>
             </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// --- Sub-pages for the hierarchy (Normally I'd split these files, but for speed putting them here for now or creating a generic Browser component)

export function ContinentView({ params }: { params: { id: string } }) {
  const continent = api.getContinents().find(c => c.id === params.id);
  const countries = api.getCountries(params.id);

  if (!continent) return <div>Not found</div>;

  return (
    <AppShell title={continent.name}>
       <div className="p-4 space-y-4">
         <div className="flex items-center gap-2 text-sm font-medium mb-4">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Globe size={14} /> World
            </Link>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-foreground">{continent.name}</span>
         </div>

         <div className="grid gap-3">
            {countries.map(country => (
              <Link key={country.id} href={`/explore/country/${country.id}`}>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                      {/* Flag Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border overflow-hidden">
                        {country.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-lg font-bold">{country.name}</span>
                  </div>
                  <ChevronRight className="text-muted-foreground/30 group-hover:text-accent" />
                </div>
              </Link>
            ))}
         </div>
       </div>
    </AppShell>
  );
}

export function CountryView({ params }: { params: { id: string } }) {
  const country = api.getCountry(params.id);
  const leagues = api.getLeagues(params.id);

  if (!country) return <div>Not found</div>;

  return (
    <AppShell title={country.name}>
       <div className="p-4 space-y-4">
         {/* Breadcrumbs simplified */}
         <div className="flex items-center gap-2 text-sm font-medium mb-4 text-muted-foreground">
            <Link href="/explore">World</Link> / <span>{country.name}</span>
         </div>
         
         {/* USA Special Logic visualizer */}
         {country.id === "c-usa" && (
           <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg mb-4">
             <h4 className="text-blue-900 font-bold uppercase text-xs mb-1">Grassroots Enabled</h4>
             <p className="text-blue-700 text-sm">Deep browse enabled for College, Youth, and Pickup leagues.</p>
           </div>
         )}

         <div className="space-y-6">
            {/* Group by Tier/Type maybe? For now flat list */}
            {leagues.map(league => (
               <Link key={league.id} href={`/league/${league.id}`}>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold border",
                        league.tier === 1 ? "bg-sidebar text-white border-sidebar" : "bg-white text-gray-500 border-gray-200"
                      )}>
                        {league.name[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold leading-none">{league.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            Tier {league.tier}
                          </span>
                           <span className="text-[10px] uppercase text-muted-foreground">{league.type}</span>
                        </div>
                      </div>
                  </div>
                  <ChevronRight className="text-muted-foreground/30 group-hover:text-accent" />
                </div>
              </Link>
            ))}
         </div>
       </div>
    </AppShell>
  );
}
