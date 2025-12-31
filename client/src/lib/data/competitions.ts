export interface Competition {
  id: string;
  name: string;
  icon: string;
  entityType: "national_tournament" | "national_qualifying" | "club_tournament" | "global_club_tournament";
  organizer: "FIFA" | "UEFA" | "AFC" | "CAF" | "CONCACAF" | "CONMEBOL" | "OFC";
}

export interface CompetitionGroup {
  id: string;
  name: string;
  competitions: Competition[];
}

export interface CompetitionSection {
  id: string;
  name: string;
  icon: string;
  groups: CompetitionGroup[];
}

export const INTERNATIONAL_TOURNAMENTS: CompetitionSection = {
  id: "international-tournaments",
  name: "International Tournaments (National Teams)",
  icon: "🌍",
  groups: [
    {
      id: "fifa-national",
      name: "FIFA (National Teams)",
      competitions: [
        { id: "fifa-world-cup", name: "FIFA World Cup", icon: "🏆", entityType: "national_tournament", organizer: "FIFA" },
        { id: "wc-qualifying", name: "World Cup Qualifying", icon: "⚽", entityType: "national_qualifying", organizer: "FIFA" },
        { id: "wc-afc-qualifying", name: "AFC (Asia) Qualifying", icon: "🌏", entityType: "national_qualifying", organizer: "AFC" },
        { id: "wc-caf-qualifying", name: "CAF (Africa) Qualifying", icon: "🌍", entityType: "national_qualifying", organizer: "CAF" },
        { id: "wc-concacaf-qualifying", name: "CONCACAF Qualifying", icon: "🌎", entityType: "national_qualifying", organizer: "CONCACAF" },
        { id: "wc-conmebol-qualifying", name: "CONMEBOL Qualifying", icon: "🌎", entityType: "national_qualifying", organizer: "CONMEBOL" },
        { id: "wc-ofc-qualifying", name: "OFC (Oceania) Qualifying", icon: "🇦🇺", entityType: "national_qualifying", organizer: "OFC" },
        { id: "wc-uefa-qualifying", name: "UEFA (Europe) Qualifying", icon: "🇪🇺", entityType: "national_qualifying", organizer: "UEFA" },
        { id: "wc-intercontinental-playoffs", name: "Intercontinental Playoffs", icon: "🔄", entityType: "national_qualifying", organizer: "FIFA" },
      ]
    },
    {
      id: "continental-championships",
      name: "Continental Championships (National Teams)",
      competitions: [
        { id: "uefa-euro", name: "UEFA European Championship (EURO)", icon: "🇪🇺", entityType: "national_tournament", organizer: "UEFA" },
        { id: "euro-qualifying", name: "EURO Qualifying", icon: "⚽", entityType: "national_qualifying", organizer: "UEFA" },
        { id: "caf-afcon", name: "CAF Africa Cup of Nations (AFCON)", icon: "🌍", entityType: "national_tournament", organizer: "CAF" },
        { id: "afcon-qualifying", name: "AFCON Qualifying", icon: "⚽", entityType: "national_qualifying", organizer: "CAF" },
        { id: "afc-asian-cup", name: "AFC Asian Cup", icon: "🌏", entityType: "national_tournament", organizer: "AFC" },
        { id: "asian-cup-qualifying", name: "Asian Cup Qualifying", icon: "⚽", entityType: "national_qualifying", organizer: "AFC" },
        { id: "concacaf-gold-cup", name: "CONCACAF Gold Cup", icon: "🏆", entityType: "national_tournament", organizer: "CONCACAF" },
        { id: "gold-cup-qualifying", name: "Gold Cup Qualifying / Prelims", icon: "⚽", entityType: "national_qualifying", organizer: "CONCACAF" },
        { id: "conmebol-copa-america", name: "CONMEBOL Copa América", icon: "🌎", entityType: "national_tournament", organizer: "CONMEBOL" },
        { id: "ofc-nations-cup", name: "OFC Nations Cup", icon: "🇦🇺", entityType: "national_tournament", organizer: "OFC" },
        { id: "ofc-nations-cup-qualifying", name: "Nations Cup Qualifying", icon: "⚽", entityType: "national_qualifying", organizer: "OFC" },
      ]
    },
    {
      id: "other-national",
      name: "Other National Team Competitions",
      competitions: [
        { id: "uefa-nations-league", name: "UEFA Nations League", icon: "🏆", entityType: "national_tournament", organizer: "UEFA" },
        { id: "concacaf-nations-league", name: "CONCACAF Nations League", icon: "🏆", entityType: "national_tournament", organizer: "CONCACAF" },
      ]
    },
  ]
};

export const CLUB_TOURNAMENTS: CompetitionSection = {
  id: "club-tournaments",
  name: "Club Tournaments (Continental + Global)",
  icon: "🏟️",
  groups: [
    {
      id: "global-fifa-clubs",
      name: "Global (FIFA) — Clubs",
      competitions: [
        { id: "fifa-club-world-cup", name: "FIFA Club World Cup", icon: "🌐", entityType: "global_club_tournament", organizer: "FIFA" },
        { id: "fifa-intercontinental-cup", name: "FIFA Intercontinental Cup", icon: "🏆", entityType: "global_club_tournament", organizer: "FIFA" },
      ]
    },
    {
      id: "europe-uefa-clubs",
      name: "Europe (UEFA) — Clubs",
      competitions: [
        { id: "uefa-champions-league", name: "UEFA Champions League", icon: "⭐", entityType: "club_tournament", organizer: "UEFA" },
        { id: "uefa-europa-league", name: "UEFA Europa League", icon: "🟠", entityType: "club_tournament", organizer: "UEFA" },
        { id: "uefa-conference-league", name: "UEFA Conference League", icon: "🟢", entityType: "club_tournament", organizer: "UEFA" },
      ]
    },
    {
      id: "south-america-conmebol-clubs",
      name: "South America (CONMEBOL) — Clubs",
      competitions: [
        { id: "copa-libertadores", name: "Copa Libertadores", icon: "🏆", entityType: "club_tournament", organizer: "CONMEBOL" },
        { id: "copa-sudamericana", name: "Copa Sudamericana", icon: "🥈", entityType: "club_tournament", organizer: "CONMEBOL" },
        { id: "recopa-sudamericana", name: "Recopa Sudamericana", icon: "🏆", entityType: "club_tournament", organizer: "CONMEBOL" },
      ]
    },
    {
      id: "north-america-concacaf-clubs",
      name: "North/Central America & Caribbean (CONCACAF) — Clubs",
      competitions: [
        { id: "concacaf-champions-cup", name: "CONCACAF Champions Cup", icon: "🏆", entityType: "club_tournament", organizer: "CONCACAF" },
      ]
    },
    {
      id: "africa-caf-clubs",
      name: "Africa (CAF) — Clubs",
      competitions: [
        { id: "caf-champions-league", name: "CAF Champions League", icon: "🌍", entityType: "club_tournament", organizer: "CAF" },
        { id: "caf-confederation-cup", name: "CAF Confederation Cup", icon: "🥈", entityType: "club_tournament", organizer: "CAF" },
        { id: "caf-super-cup", name: "CAF Super Cup", icon: "🏆", entityType: "club_tournament", organizer: "CAF" },
      ]
    },
    {
      id: "asia-afc-clubs",
      name: "Asia (AFC) — Clubs",
      competitions: [
        { id: "afc-champions-league-elite", name: "AFC Champions League Elite", icon: "🌏", entityType: "club_tournament", organizer: "AFC" },
        { id: "afc-champions-league-two", name: "AFC Champions League Two", icon: "🥈", entityType: "club_tournament", organizer: "AFC" },
        { id: "afc-challenge-league", name: "AFC Challenge League", icon: "🏆", entityType: "club_tournament", organizer: "AFC" },
      ]
    },
    {
      id: "aussie-ofc-clubs",
      name: "Aussie (OFC) — Clubs",
      competitions: [
        { id: "ofc-champions-league", name: "OFC Champions League", icon: "🇦🇺", entityType: "club_tournament", organizer: "OFC" },
      ]
    },
  ]
};

export const ALL_COMPETITION_SECTIONS = [INTERNATIONAL_TOURNAMENTS, CLUB_TOURNAMENTS];
