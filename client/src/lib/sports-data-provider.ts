// Sports Data Provider - API-Ready Layer
// This abstracts data fetching from SportMonks, Grassroots APIs, or mock data
// Same interface works with any backend

import type {
  Continent,
  Country,
  League,
  Team,
  Player,
  Match,
  Standing,
  Fixture,
} from "./types";

// Mock data for initial development
const MOCK_CONTINENTS: Continent[] = [
  { id: "cont-eu", name: "Europe", slug: "europe" },
  { id: "cont-sa", name: "South America", slug: "south-america" },
  { id: "cont-na", name: "North America", slug: "north-america" },
  { id: "cont-as", name: "Asia", slug: "asia" },
  { id: "cont-af", name: "Africa", slug: "africa" },
  { id: "cont-oc", name: "Oceania", slug: "oceania" },
];

const MOCK_COUNTRIES: Country[] = [
  { id: "c-eng", name: "England", code: "ENG", slug: "england", continentId: "cont-eu" },
  { id: "c-esp", name: "Spain", code: "ESP", slug: "spain", continentId: "cont-eu" },
  { id: "c-ger", name: "Germany", code: "GER", slug: "germany", continentId: "cont-eu" },
  { id: "c-fra", name: "France", code: "FRA", slug: "france", continentId: "cont-eu" },
  { id: "c-ita", name: "Italy", code: "ITA", slug: "italy", continentId: "cont-eu" },
  { id: "c-usa", name: "USA", code: "USA", slug: "usa", continentId: "cont-na" },
  { id: "c-can", name: "Canada", code: "CAN", slug: "canada", continentId: "cont-na" },
  { id: "c-mex", name: "Mexico", code: "MEX", slug: "mexico", continentId: "cont-na" },
  { id: "c-bra", name: "Brazil", code: "BRA", slug: "brazil", continentId: "cont-sa" },
  { id: "c-arg", name: "Argentina", code: "ARG", slug: "argentina", continentId: "cont-sa" },
];

const MOCK_LEAGUES: League[] = [
  // England
  { id: "l-pl", name: "Premier League", slug: "premier-league", countryId: "c-eng", tier: 1, type: "League" },
  { id: "l-champ", name: "Championship", slug: "championship", countryId: "c-eng", tier: 2, type: "League" },
  
  // Spain
  { id: "l-ll", name: "La Liga", slug: "la-liga", countryId: "c-esp", tier: 1, type: "League" },
  { id: "l-liga2", name: "Segunda División", slug: "segunda-division", countryId: "c-esp", tier: 2, type: "League" },
  
  // Germany
  { id: "l-bl", name: "Bundesliga", slug: "bundesliga", countryId: "c-ger", tier: 1, type: "League" },
  { id: "l-bl2", name: "2. Bundesliga", slug: "2-bundesliga", countryId: "c-ger", tier: 2, type: "League" },
  
  // France
  { id: "l-ligue1", name: "Ligue 1", slug: "ligue-1", countryId: "c-fra", tier: 1, type: "League" },
  
  // Italy
  { id: "l-seriea", name: "Serie A", slug: "serie-a", countryId: "c-ita", tier: 1, type: "League" },
  
  // USA
  { id: "l-mls", name: "MLS", slug: "mls", countryId: "c-usa", tier: 1, type: "League" },
  { id: "l-usl", name: "USL Championship", slug: "usl-championship", countryId: "c-usa", tier: 2, type: "League" },
  { id: "l-ncaa", name: "NCAA Division 1", slug: "ncaa-d1", countryId: "c-usa", tier: 4, type: "League" },
  
  // Brazil
  { id: "l-brasileirao", name: "Série A", slug: "serie-a-brasil", countryId: "c-bra", tier: 1, type: "League" },
];

const MOCK_TEAMS: Team[] = [
  // Premier League
  { id: "t-mci", name: "Manchester City", slug: "manchester-city", leagueId: "l-pl", countryId: "c-eng", city: "Manchester" },
  { id: "t-liv", name: "Liverpool", slug: "liverpool", leagueId: "l-pl", countryId: "c-eng", city: "Liverpool" },
  { id: "t-ars", name: "Arsenal", slug: "arsenal", leagueId: "l-pl", countryId: "c-eng", city: "London" },
  { id: "t-mun", name: "Manchester United", slug: "manchester-united", leagueId: "l-pl", countryId: "c-eng", city: "Manchester" },
  
  // La Liga
  { id: "t-rma", name: "Real Madrid", slug: "real-madrid", leagueId: "l-ll", countryId: "c-esp", city: "Madrid" },
  { id: "t-bar", name: "Barcelona", slug: "barcelona", leagueId: "l-ll", countryId: "c-esp", city: "Barcelona" },
  
  // Bundesliga
  { id: "t-bav", name: "Bayern Munich", slug: "bayern-munich", leagueId: "l-bl", countryId: "c-ger", city: "Munich" },
  { id: "t-dor", name: "Borussia Dortmund", slug: "borussia-dortmund", leagueId: "l-bl", countryId: "c-ger", city: "Dortmund" },
  
  // MLS
  { id: "t-mia", name: "Inter Miami CF", slug: "inter-miami-cf", leagueId: "l-mls", countryId: "c-usa", city: "Miami" },
  { id: "t-lafc", name: "LAFC", slug: "lafc", leagueId: "l-mls", countryId: "c-usa", city: "Los Angeles" },
];

const MOCK_PLAYERS: Player[] = [
  // Manchester City
  { id: "p-haaland", name: "Erling Haaland", slug: "erling-haaland", teamId: "t-mci", position: "FWD", number: 9, nationality: "Norway" },
  { id: "p-foden", name: "Phil Foden", slug: "phil-foden", teamId: "t-mci", position: "MID", number: 47, nationality: "England" },
  
  // Real Madrid
  { id: "p-vinicius", name: "Vinícius Júnior", slug: "vinicius-junior", teamId: "t-rma", position: "FWD", number: 20, nationality: "Brazil" },
  { id: "p-modric", name: "Luka Modrić", slug: "luka-modric", teamId: "t-rma", position: "MID", number: 10, nationality: "Croatia" },
];

const MOCK_MATCHES: Match[] = [
  {
    id: "m-1",
    leagueId: "l-pl",
    homeTeamId: "t-mci",
    awayTeamId: "t-liv",
    kickoffTime: new Date(Date.now() + 86400000).toISOString(),
    status: "SCHEDULED",
  },
  {
    id: "m-2",
    leagueId: "l-ll",
    homeTeamId: "t-rma",
    awayTeamId: "t-bar",
    kickoffTime: new Date().toISOString(),
    status: "LIVE",
    homeScore: 1,
    awayScore: 0,
    minute: 34,
  },
];

// Provider interface for dependency injection
export class SportsDataProvider {
  async getContinents(): Promise<Continent[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_CONTINENTS;
  }

  async getContinent(slug: string): Promise<Continent | null> {
    return MOCK_CONTINENTS.find((c) => c.slug === slug) || null;
  }

  async getCountriesByContinent(continentId: string): Promise<Country[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_COUNTRIES.filter((c) => c.continentId === continentId);
  }

  async getCountry(slug: string): Promise<Country | null> {
    return MOCK_COUNTRIES.find((c) => c.slug === slug) || null;
  }

  async getLeaguesByCountry(countryId: string): Promise<League[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_LEAGUES.filter((l) => l.countryId === countryId);
  }

  async getLeague(id: string): Promise<League | null> {
    return MOCK_LEAGUES.find((l) => l.id === id) || null;
  }

  async getTeamsByLeague(leagueId: string): Promise<Team[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_TEAMS.filter((t) => t.leagueId === leagueId);
  }

  async getTeam(id: string): Promise<Team | null> {
    return MOCK_TEAMS.find((t) => t.id === id) || null;
  }

  async getStandings(leagueId: string): Promise<Standing[]> {
    // TODO: Replace with SportMonks API call
    // Return placeholder standings
    return [];
  }

  async getFixtures(leagueId: string): Promise<Fixture[]> {
    // TODO: Replace with SportMonks API call
    return [];
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_PLAYERS.filter((p) => p.teamId === teamId);
  }

  async getPlayer(id: string): Promise<Player | null> {
    return MOCK_PLAYERS.find((p) => p.id === id) || null;
  }

  async getMatch(id: string): Promise<Match | null> {
    return MOCK_MATCHES.find((m) => m.id === id) || null;
  }

  async searchTeams(query: string): Promise<Team[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_TEAMS.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchLeagues(query: string): Promise<League[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_LEAGUES.filter((l) =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchPlayers(query: string): Promise<Player[]> {
    // TODO: Replace with SportMonks API call
    return MOCK_PLAYERS.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Singleton instance
export const sportsDataProvider = new SportsDataProvider();
