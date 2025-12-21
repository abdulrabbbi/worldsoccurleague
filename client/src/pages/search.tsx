import { useState } from "react";
import { useLocation } from "wouter";
import { sportsDataProvider } from "@/lib/sports-data-provider";
import type { Team, League, Player } from "@/lib/types";
import { Search, ChevronRight, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setTeams([]);
      setLeagues([]);
      setPlayers([]);
      return;
    }

    setLoading(true);
    try {
      const [teamsData, leaguesData, playersData] = await Promise.all([
        sportsDataProvider.searchTeams(searchQuery),
        sportsDataProvider.searchLeagues(searchQuery),
        sportsDataProvider.searchPlayers(searchQuery),
      ]);
      setTeams(teamsData);
      setLeagues(leaguesData);
      setPlayers(playersData);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams, leagues, players..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : query ? (
          <>
            {/* Leagues */}
            {leagues.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Leagues</h3>
                <div className="space-y-2">
                  {leagues.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => setLocation(`/league/${league.id}-${league.slug}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                      data-testid={`league-result-${league.slug}`}
                    >
                      <p className="font-semibold text-foreground">{league.name}</p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Teams */}
            {teams.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Teams</h3>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setLocation(`/team/${team.id}-${team.slug}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                      data-testid={`team-result-${team.slug}`}
                    >
                      <p className="font-semibold text-foreground">{team.name}</p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            {players.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Players</h3>
                <div className="space-y-2">
                  {players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setLocation(`/player/${player.id}-${player.slug}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                      data-testid={`player-result-${player.slug}`}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.position || "N/A"}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leagues.length === 0 && teams.length === 0 && players.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No results found</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Start typing to search</p>
          </div>
        )}
      </div>
    </div>
  );
}
