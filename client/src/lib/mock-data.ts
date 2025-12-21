import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

export type Player = {
  id: string;
  name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  number: number;
  imageUrl?: string;
};

export type Team = {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  colors: [string, string]; // Primary, Secondary
  leagueId: string;
  players: Player[];
};

export type League = {
  id: string;
  name: string;
  countryId: string;
  logoUrl?: string;
  tier: number; // 1 = Pro, 2 = Semi-Pro, etc.
  type: "League" | "Cup";
};

export type Country = {
  id: string;
  name: string;
  continentId: string;
  flagUrl?: string;
};

export type Continent = {
  id: string;
  name: string;
};

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  startTime: string; // ISO string
  status: "SCHEDULED" | "LIVE" | "FT";
  score: {
    home: number;
    away: number;
  };
  minute?: number;
};

// --- Mock Database ---

const CONTINENTS: Continent[] = [
  { id: "cont-eu", name: "Europe" },
  { id: "cont-sa", name: "South America" },
  { id: "cont-na", name: "North America" },
  { id: "cont-as", name: "Asia" },
  { id: "cont-af", name: "Africa" },
  { id: "cont-oc", name: "Oceania" },
];

const COUNTRIES: Country[] = [
  { id: "c-eng", name: "England", continentId: "cont-eu" },
  { id: "c-esp", name: "Spain", continentId: "cont-eu" },
  { id: "c-ger", name: "Germany", continentId: "cont-eu" },
  { id: "c-usa", name: "USA", continentId: "cont-na" },
  { id: "c-bra", name: "Brazil", continentId: "cont-sa" },
  { id: "c-arg", name: "Argentina", continentId: "cont-sa" },
];

const LEAGUES: League[] = [
  { id: "l-pl", name: "Premier League", countryId: "c-eng", tier: 1, type: "League" },
  { id: "l-ll", name: "La Liga", countryId: "c-esp", tier: 1, type: "League" },
  { id: "l-bl", name: "Bundesliga", countryId: "c-ger", tier: 1, type: "League" },
  { id: "l-mls", name: "MLS", countryId: "c-usa", tier: 1, type: "League" },
  { id: "l-usl", name: "USL Championship", countryId: "c-usa", tier: 2, type: "League" },
  { id: "l-ncaa", name: "NCAA Division 1", countryId: "c-usa", tier: 4, type: "League" }, // Grassroots start
  { id: "l-upsl", name: "UPSL", countryId: "c-usa", tier: 5, type: "League" },
];

const TEAMS: Team[] = [
  // PL
  { id: "t-mci", name: "Manchester City", shortName: "MCI", leagueId: "l-pl", colors: ["#6CABDD", "#1C2C5B"], players: [] },
  { id: "t-liv", name: "Liverpool", shortName: "LIV", leagueId: "l-pl", colors: ["#C8102E", "#00B2A9"], players: [] },
  { id: "t-ars", name: "Arsenal", shortName: "ARS", leagueId: "l-pl", colors: ["#EF0107", "#063672"], players: [] },
  
  // La Liga
  { id: "t-rma", name: "Real Madrid", shortName: "RMA", leagueId: "l-ll", colors: ["#FEBE10", "#00529F"], players: [] },
  { id: "t-bar", name: "Barcelona", shortName: "BAR", leagueId: "l-ll", colors: ["#004D98", "#A50044"], players: [] },

  // MLS
  { id: "t-mia", name: "Inter Miami CF", shortName: "MIA", leagueId: "l-mls", colors: ["#F7B5CD", "#000000"], players: [] },
  { id: "t-lafc", name: "LAFC", shortName: "LAFC", leagueId: "l-mls", colors: ["#000000", "#C39E6C"], players: [] },

  // Grassroots (Example)
  { id: "t-unc", name: "UNC Tar Heels", shortName: "UNC", leagueId: "l-ncaa", colors: ["#7BAFD4", "#FFFFFF"], players: [] },
  { id: "t-duke", name: "Duke Blue Devils", shortName: "DUKE", leagueId: "l-ncaa", colors: ["#003087", "#FFFFFF"], players: [] },
];

const MATCHES: Match[] = [
  // Live matches
  { 
    id: "m-1", 
    homeTeamId: "t-mci", 
    awayTeamId: "t-liv", 
    leagueId: "l-pl", 
    startTime: new Date().toISOString(), 
    status: "LIVE", 
    score: { home: 1, away: 1 },
    minute: 34
  },
  { 
    id: "m-2", 
    homeTeamId: "t-rma", 
    awayTeamId: "t-bar", 
    leagueId: "l-ll", 
    startTime: new Date(Date.now() + 3600000).toISOString(), 
    status: "SCHEDULED", 
    score: { home: 0, away: 0 } 
  },
  { 
    id: "m-3", 
    homeTeamId: "t-mia", 
    awayTeamId: "t-lafc", 
    leagueId: "l-mls", 
    startTime: new Date(Date.now() - 7200000).toISOString(), 
    status: "FT", 
    score: { home: 2, away: 1 } 
  },
   { 
    id: "m-4", 
    homeTeamId: "t-unc", 
    awayTeamId: "t-duke", 
    leagueId: "l-ncaa", 
    startTime: new Date().toISOString(), 
    status: "LIVE", 
    score: { home: 0, away: 2 },
    minute: 67
  },
];

// --- Helpers ---

export const api = {
  getContinents: () => CONTINENTS,
  getCountries: (continentId?: string) => continentId ? COUNTRIES.filter(c => c.continentId === continentId) : COUNTRIES,
  getLeagues: (countryId?: string) => countryId ? LEAGUES.filter(l => l.countryId === countryId) : LEAGUES,
  getTeams: (leagueId?: string) => leagueId ? TEAMS.filter(t => t.leagueId === leagueId) : TEAMS,
  
  getMatch: (id: string) => MATCHES.find(m => m.id === id),
  getMatches: () => MATCHES,
  
  getTeam: (id: string) => TEAMS.find(t => t.id === id),
  getLeague: (id: string) => LEAGUES.find(l => l.id === id),
  getCountry: (id: string) => COUNTRIES.find(c => c.id === id),
  
  // Special helper for hierarchy browsing
  getChildren: (type: "world" | "continent" | "country" | "league", id?: string) => {
    switch (type) {
      case "world": return CONTINENTS;
      case "continent": return COUNTRIES.filter(c => c.continentId === id);
      case "country": return LEAGUES.filter(l => l.countryId === id);
      case "league": return TEAMS.filter(t => t.leagueId === id);
      default: return [];
    }
  }
};
