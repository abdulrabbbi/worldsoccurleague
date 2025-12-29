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
  LeagueCategory,
  ContinentalCup
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
    awayTeamId: "t-liv",
    kickoffTime: new Date(Date.now() + 86400000).toISOString(),
    status: "SCHEDULED",
  },
];

const MOCK_CONTINENTAL_CUPS: ContinentalCup[] = [
  // Europe - Club Competitions
  { id: "cup-ucl", name: "UEFA Champions League", shortName: "UCL", slug: "champions-league", continentId: "cont-eu", type: "club", tier: 1, description: "Europe's premier club competition" },
  { id: "cup-uel", name: "UEFA Europa League", shortName: "UEL", slug: "europa-league", continentId: "cont-eu", type: "club", tier: 2, description: "Europe's second-tier club competition" },
  { id: "cup-uecl", name: "UEFA Europa Conference League", shortName: "UECL", slug: "conference-league", continentId: "cont-eu", type: "club", tier: 3 },
  { id: "cup-usc", name: "UEFA Super Cup", shortName: "USC", slug: "super-cup", continentId: "cont-eu", type: "club", tier: 1 },
  { id: "cup-uwcl", name: "UEFA Women's Champions League", shortName: "UWCL", slug: "womens-champions-league", continentId: "cont-eu", type: "club", tier: 1 },
  // Europe - National Team Competitions
  { id: "cup-euro", name: "UEFA European Championship", shortName: "EURO", slug: "euro", continentId: "cont-eu", type: "national", tier: 1, description: "Europe's premier national team competition" },
  { id: "cup-unl", name: "UEFA Nations League", shortName: "UNL", slug: "nations-league", continentId: "cont-eu", type: "national", tier: 2 },
  { id: "cup-u21euro", name: "UEFA U-21 Championship", shortName: "U21 EURO", slug: "u21-euro", continentId: "cont-eu", type: "national", tier: 3 },
  { id: "cup-weuro", name: "UEFA Women's Euro", shortName: "W EURO", slug: "womens-euro", continentId: "cont-eu", type: "national", tier: 1 },

  // South America - Club Competitions
  { id: "cup-libertadores", name: "Copa Libertadores", shortName: "Libertadores", slug: "copa-libertadores", continentId: "cont-sa", type: "club", tier: 1, description: "South America's premier club competition" },
  { id: "cup-sudamericana", name: "Copa Sudamericana", shortName: "Sudamericana", slug: "copa-sudamericana", continentId: "cont-sa", type: "club", tier: 2 },
  { id: "cup-recopa", name: "Recopa Sudamericana", shortName: "Recopa", slug: "recopa-sudamericana", continentId: "cont-sa", type: "club", tier: 1 },
  { id: "cup-libfem", name: "Copa Libertadores Femenina", shortName: "Lib Fem", slug: "libertadores-femenina", continentId: "cont-sa", type: "club", tier: 1 },
  // South America - National Team Competitions
  { id: "cup-copaamerica", name: "Copa América", shortName: "Copa América", slug: "copa-america", continentId: "cont-sa", type: "national", tier: 1, description: "South America's premier national team competition" },
  { id: "cup-conmebol-u20", name: "CONMEBOL U-20 Championship", shortName: "U20 SA", slug: "conmebol-u20", continentId: "cont-sa", type: "national", tier: 2 },

  // North America (CONCACAF) - Club Competitions
  { id: "cup-ccl", name: "CONCACAF Champions Cup", shortName: "CCL", slug: "concacaf-champions-cup", continentId: "cont-na", type: "club", tier: 1, description: "CONCACAF's premier club competition" },
  { id: "cup-leaguescup", name: "Leagues Cup", shortName: "Leagues Cup", slug: "leagues-cup", continentId: "cont-na", type: "club", tier: 2, description: "MLS vs Liga MX tournament" },
  { id: "cup-campeones", name: "Campeones Cup", shortName: "Campeones", slug: "campeones-cup", continentId: "cont-na", type: "club", tier: 2 },
  { id: "cup-usopen", name: "U.S. Open Cup", shortName: "US Open", slug: "us-open-cup", continentId: "cont-na", type: "club", tier: 3 },
  { id: "cup-canadachamp", name: "Canadian Championship", shortName: "Can Champ", slug: "canadian-championship", continentId: "cont-na", type: "club", tier: 3 },
  // North America - National Team Competitions
  { id: "cup-goldcup", name: "CONCACAF Gold Cup", shortName: "Gold Cup", slug: "gold-cup", continentId: "cont-na", type: "national", tier: 1, description: "CONCACAF's premier national team competition" },
  { id: "cup-nationsl", name: "CONCACAF Nations League", shortName: "CNL", slug: "concacaf-nations-league", continentId: "cont-na", type: "national", tier: 2 },
  { id: "cup-wgoldcup", name: "CONCACAF W Gold Cup", shortName: "W Gold Cup", slug: "w-gold-cup", continentId: "cont-na", type: "national", tier: 1 },

  // Asia (AFC) - Club Competitions
  { id: "cup-acl", name: "AFC Champions League Elite", shortName: "ACL", slug: "afc-champions-league", continentId: "cont-as", type: "club", tier: 1, description: "Asia's premier club competition" },
  { id: "cup-acl2", name: "AFC Champions League Two", shortName: "ACL2", slug: "afc-champions-league-two", continentId: "cont-as", type: "club", tier: 2 },
  { id: "cup-afccup", name: "AFC Cup", shortName: "AFC Cup", slug: "afc-cup", continentId: "cont-as", type: "club", tier: 3 },
  // Asia - National Team Competitions
  { id: "cup-asiancup", name: "AFC Asian Cup", shortName: "Asian Cup", slug: "asian-cup", continentId: "cont-as", type: "national", tier: 1, description: "Asia's premier national team competition" },
  { id: "cup-wasiancup", name: "AFC Women's Asian Cup", shortName: "W Asian Cup", slug: "womens-asian-cup", continentId: "cont-as", type: "national", tier: 1 },
  { id: "cup-u23asian", name: "AFC U-23 Asian Cup", shortName: "U23 Asian", slug: "u23-asian-cup", continentId: "cont-as", type: "national", tier: 2 },

  // Africa (CAF) - Club Competitions
  { id: "cup-cafcl", name: "CAF Champions League", shortName: "CAF CL", slug: "caf-champions-league", continentId: "cont-af", type: "club", tier: 1, description: "Africa's premier club competition" },
  { id: "cup-cafcc", name: "CAF Confederation Cup", shortName: "CAF CC", slug: "caf-confederation-cup", continentId: "cont-af", type: "club", tier: 2 },
  { id: "cup-cafsc", name: "CAF Super Cup", shortName: "CAF SC", slug: "caf-super-cup", continentId: "cont-af", type: "club", tier: 1 },
  // Africa - National Team Competitions
  { id: "cup-afcon", name: "Africa Cup of Nations", shortName: "AFCON", slug: "afcon", continentId: "cont-af", type: "national", tier: 1, description: "Africa's premier national team competition" },
  { id: "cup-wafcon", name: "Women's Africa Cup of Nations", shortName: "W AFCON", slug: "womens-afcon", continentId: "cont-af", type: "national", tier: 1 },
  { id: "cup-chan", name: "African Nations Championship", shortName: "CHAN", slug: "african-nations-championship", continentId: "cont-af", type: "national", tier: 2 },

  // Oceania (OFC) - Club Competitions
  { id: "cup-ofccl", name: "OFC Champions League", shortName: "OFC CL", slug: "ofc-champions-league", continentId: "cont-oc", type: "club", tier: 1, description: "Oceania's premier club competition" },
  // Oceania - National Team Competitions
  { id: "cup-ofcnc", name: "OFC Nations Cup", shortName: "OFC NC", slug: "ofc-nations-cup", continentId: "cont-oc", type: "national", tier: 1, description: "Oceania's premier national team competition" },
  { id: "cup-wofcnc", name: "OFC Women's Nations Cup", shortName: "W OFC NC", slug: "womens-ofc-nations-cup", continentId: "cont-oc", type: "national", tier: 1 },
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

  async getContinentalCups(continentId: string, type?: "club" | "national"): Promise<ContinentalCup[]> {
    let cups = MOCK_CONTINENTAL_CUPS.filter(c => c.continentId === continentId);
    if (type) cups = cups.filter(c => c.type === type);
    return cups.sort((a, b) => a.tier - b.tier);
  }

  async getContinentalCup(slug: string): Promise<ContinentalCup | null> {
    return MOCK_CONTINENTAL_CUPS.find(c => c.slug === slug) || null;
  }
}

export const sportsDataProvider = new SportsDataProvider();
