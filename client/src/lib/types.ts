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

// Hierarchy Levels
export interface Region { // State/Province
  id: string;
  name: string;
  slug: string;
  countryId: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  regionId: string;
}

export type LeagueCategory = 
  | "National Teams"
  | "Professional Leagues"
  | "College Soccer"
  | "High School Soccer"
  | "Youth Soccer Leagues"
  | "Sanctioned Leagues"
  | "Pickup Soccer";

export interface League {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  regionId?: string; // Optional: for State leagues
  cityId?: string;   // Optional: for City leagues
  category: LeagueCategory;
  tier: number;
  logoUrl?: string;
  season?: string;
}

// Extended Team interface to support Schools/Clubs/Pickup Groups
export interface Team {
  id: string;
  name: string;
  slug: string;
  leagueId: string;
  countryId: string;
  city?: string; // Legacy string
  cityId?: string; // Relation to City entity
  schoolId?: string; // Relation to School entity if applicable
  type?: "Club" | "School" | "Pickup Group" | "National Team";
  crestUrl?: string;
  founded?: number;
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

export interface ContinentalCup {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  continentId: string;
  type: "club" | "national";
  tier: number;
  description?: string;
  logoUrl?: string;
}
