// API-Ready Types for Sports Data Hierarchy

export interface Continent {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  slug: string;
  continentId: string;
  flagUrl?: string;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  tier: number;
  type: "League" | "Cup";
  logoUrl?: string;
  season?: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  leagueId: string;
  countryId: string;
  crestUrl?: string;
  founded?: number;
  city?: string;
}

export interface Player {
  id: string;
  name: string;
  slug: string;
  teamId: string;
  position?: "GK" | "DEF" | "MID" | "FWD";
  number?: number;
  nationality?: string;
  dateOfBirth?: string;
  photoUrl?: string;
}

export interface Match {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string;
  status: "SCHEDULED" | "LIVE" | "FT" | "CANCELLED";
  homeScore?: number;
  awayScore?: number;
  minute?: number;
}

export interface Standing {
  position: number;
  teamId: string;
  teamName: string;
  teamSlug: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Fixture {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  kickoffTime: string;
  status: "SCHEDULED" | "LIVE" | "FT";
  homeScore?: number;
  awayScore?: number;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}
