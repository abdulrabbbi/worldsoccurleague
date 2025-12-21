// Sports Data Provider - API-Ready Layer
// This abstracts data fetching from SportMonks, Grassroots APIs, or mock data

import type {
  Continent,
  Country,
  Region,
  City,
  League,
  Team,
  Player,
  Match,
  Standing,
  Fixture,
  LeagueCategory
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
  { id: "c-usa", name: "USA", code: "USA", slug: "usa", continentId: "cont-na" },
  { id: "c-can", name: "Canada", code: "CAN", slug: "canada", continentId: "cont-na" },
  { id: "c-mex", name: "Mexico", code: "MEX", slug: "mexico", continentId: "cont-na" },
  { id: "c-bra", name: "Brazil", code: "BRA", slug: "brazil", continentId: "cont-sa" },
];

const MOCK_REGIONS: Region[] = [
  { id: "r-tx", name: "Texas", slug: "texas", countryId: "c-usa" },
  { id: "r-ca", name: "California", slug: "california", countryId: "c-usa" },
  { id: "r-ny", name: "New York", slug: "new-york", countryId: "c-usa" },
  { id: "r-fl", name: "Florida", slug: "florida", countryId: "c-usa" },
];

const MOCK_CITIES: City[] = [
  { id: "city-hou", name: "Houston", slug: "houston", regionId: "r-tx" },
  { id: "city-dal", name: "Dallas", slug: "dallas", regionId: "r-tx" },
  { id: "city-aus", name: "Austin", slug: "austin", regionId: "r-tx" },
  { id: "city-la", name: "Los Angeles", slug: "los-angeles", regionId: "r-ca" },
  { id: "city-nyc", name: "New York City", slug: "new-york-city", regionId: "r-ny" },
];

const MOCK_LEAGUES: League[] = [
  // National Teams
  { id: "l-nat-usa-m", name: "USMNT", slug: "usmnt", countryId: "c-usa", category: "National Teams", tier: 1 },
  { id: "l-nat-usa-w", name: "USWNT", slug: "uswnt", countryId: "c-usa", category: "National Teams", tier: 1 },

  // Professional Leagues (USA)
  { id: "l-mls", name: "MLS", slug: "mls", countryId: "c-usa", category: "Professional Leagues", tier: 1 },
  { id: "l-usl-c", name: "USL Championship", slug: "usl-championship", countryId: "c-usa", category: "Professional Leagues", tier: 2 },
  { id: "l-usl-1", name: "USL League One", slug: "usl-league-one", countryId: "c-usa", category: "Professional Leagues", tier: 3 },
  { id: "l-nisa", name: "NISA", slug: "nisa", countryId: "c-usa", category: "Professional Leagues", tier: 3 },
  
  // European Leagues
  { id: "l-pl", name: "Premier League", slug: "premier-league", countryId: "c-eng", category: "Professional Leagues", tier: 1 },
  { id: "l-ll", name: "La Liga", slug: "la-liga", countryId: "c-esp", category: "Professional Leagues", tier: 1 },
  { id: "l-bl", name: "Bundesliga", slug: "bundesliga", countryId: "c-ger", category: "Professional Leagues", tier: 1 },

  // College Soccer (USA)
  { id: "l-ncaa-d1", name: "NCAA Division I", slug: "ncaa-d1", countryId: "c-usa", category: "College Soccer", tier: 1 },
  
  // High School (Texas)
  { id: "l-uil-6a", name: "UIL 6A", slug: "uil-6a", countryId: "c-usa", regionId: "r-tx", category: "High School Soccer", tier: 1 },
  
  // Pickup Soccer
  { id: "l-pickup-hou", name: "Houston Pickup", slug: "houston-pickup", countryId: "c-usa", regionId: "r-tx", cityId: "city-hou", category: "Pickup Soccer", tier: 1 },
];

const MOCK_TEAMS: Team[] = [
  // MLS
  { id: "t-mia", name: "Inter Miami CF", slug: "inter-miami-cf", leagueId: "l-mls", countryId: "c-usa", city: "Miami", type: "Club" },
  { id: "t-lafc", name: "LAFC", slug: "lafc", leagueId: "l-mls", countryId: "c-usa", city: "Los Angeles", type: "Club" },
  
  // Premier League
  { id: "t-mci", name: "Manchester City", slug: "manchester-city", leagueId: "l-pl", countryId: "c-eng", city: "Manchester", type: "Club" },
  
  // High School
  { id: "t-woodlands", name: "The Woodlands HS", slug: "the-woodlands-hs", leagueId: "l-uil-6a", countryId: "c-usa", city: "The Woodlands", type: "School" },
  
  // Pickup
  { id: "t-urban-soccer", name: "Urban Soccer Group", slug: "urban-soccer-group", leagueId: "l-pickup-hou", countryId: "c-usa", city: "Houston", type: "Pickup Group" },
];

const MOCK_MATCHES: Match[] = [
  {
    id: "m-1",
    leagueId: "l-pl",
    homeTeamId: "t-mci",
    awayTeamId: "t-liv", // Assuming exists in mock
    kickoffTime: new Date(Date.now() + 86400000).toISOString(),
    status: "SCHEDULED",
  },
];

export class SportsDataProvider {
  async getContinents(): Promise<Continent[]> {
    return MOCK_CONTINENTS;
  }

  async getContinent(slug: string): Promise<Continent | null> {
    return MOCK_CONTINENTS.find((c) => c.slug === slug) || null;
  }

  async getCountriesByContinent(continentId: string): Promise<Country[]> {
    return MOCK_COUNTRIES.filter((c) => c.continentId === continentId);
  }

  async getCountry(slug: string): Promise<Country | null> {
    return MOCK_COUNTRIES.find((c) => c.slug === slug) || null;
  }

  async getRegions(countryId: string): Promise<Region[]> {
    return MOCK_REGIONS.filter(r => r.countryId === countryId);
  }

  async getCities(regionId: string): Promise<City[]> {
    return MOCK_CITIES.filter(c => c.regionId === regionId);
  }

  async getLeaguesByCategory(countryId: string, category: LeagueCategory): Promise<League[]> {
    return MOCK_LEAGUES.filter(l => l.countryId === countryId && l.category === category);
  }

  // Helper for hierarchical browsing
  async getCategories(countryId: string): Promise<LeagueCategory[]> {
    // In a real API, this would return categories available for that country
    return [
      "National Teams",
      "Professional Leagues",
      "College Soccer",
      "High School Soccer",
      "Youth Soccer Leagues",
      "Sanctioned Leagues",
      "Pickup Soccer"
    ];
  }

  async getLeaguesByCountry(countryId: string): Promise<League[]> {
    return MOCK_LEAGUES.filter((l) => l.countryId === countryId);
  }

  async getLeague(id: string): Promise<League | null> {
    return MOCK_LEAGUES.find((l) => l.id === id) || null;
  }

  async getTeamsByLeague(leagueId: string): Promise<Team[]> {
    return MOCK_TEAMS.filter((t) => t.leagueId === leagueId);
  }

  async getTeam(id: string): Promise<Team | null> {
    return MOCK_TEAMS.find((t) => t.id === id) || null;
  }

  async getMatch(id: string): Promise<Match | null> {
    return MOCK_MATCHES.find((m) => m.id === id) || null;
  }

  // ... other methods (search, players) remain similar
}

export const sportsDataProvider = new SportsDataProvider();
