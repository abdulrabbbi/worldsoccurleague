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
  colors: [string, string];
  leagueId: string;
  players: Player[];
};

export type League = {
  id: string;
  name: string;
  countryId: string;
  logoUrl?: string;
  tier: number;
  type: "League" | "Cup";
};

export type ContinentalCup = {
  id: string;
  name: string;
  shortName: string;
  continentId: string;
  type: "club" | "national";
  tier: number;
  description?: string;
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
  startTime: string;
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
  { id: "cont-oc", name: "Aussie" },
];

const CONTINENTAL_CUPS: ContinentalCup[] = [
  // Europe - Club Competitions
  { id: "cup-ucl", name: "UEFA Champions League", shortName: "UCL", continentId: "cont-eu", type: "club", tier: 1, description: "Europe's premier club competition" },
  { id: "cup-uel", name: "UEFA Europa League", shortName: "UEL", continentId: "cont-eu", type: "club", tier: 2, description: "Europe's second-tier club competition" },
  { id: "cup-uecl", name: "UEFA Europa Conference League", shortName: "UECL", continentId: "cont-eu", type: "club", tier: 3, description: "Europe's third-tier club competition" },
  { id: "cup-usc", name: "UEFA Super Cup", shortName: "USC", continentId: "cont-eu", type: "club", tier: 1 },
  // Europe - National Team Competitions
  { id: "cup-euro", name: "UEFA European Championship", shortName: "EURO", continentId: "cont-eu", type: "national", tier: 1, description: "Europe's premier national team competition" },
  { id: "cup-unl", name: "UEFA Nations League", shortName: "UNL", continentId: "cont-eu", type: "national", tier: 2 },
  { id: "cup-u21euro", name: "UEFA U-21 Championship", shortName: "U21 EURO", continentId: "cont-eu", type: "national", tier: 3 },
  { id: "cup-weuro", name: "UEFA Women's Euro", shortName: "W EURO", continentId: "cont-eu", type: "national", tier: 1 },
  { id: "cup-uwcl", name: "UEFA Women's Champions League", shortName: "UWCL", continentId: "cont-eu", type: "club", tier: 1 },

  // South America - Club Competitions
  { id: "cup-libertadores", name: "Copa Libertadores", shortName: "Libertadores", continentId: "cont-sa", type: "club", tier: 1, description: "South America's premier club competition" },
  { id: "cup-sudamericana", name: "Copa Sudamericana", shortName: "Sudamericana", continentId: "cont-sa", type: "club", tier: 2, description: "South America's second-tier club competition" },
  { id: "cup-recopa", name: "Recopa Sudamericana", shortName: "Recopa", continentId: "cont-sa", type: "club", tier: 1 },
  // South America - National Team Competitions
  { id: "cup-copaamerica", name: "Copa América", shortName: "Copa América", continentId: "cont-sa", type: "national", tier: 1, description: "South America's premier national team competition" },
  { id: "cup-conmebol-u20", name: "CONMEBOL U-20 Championship", shortName: "U20 SA", continentId: "cont-sa", type: "national", tier: 2 },
  { id: "cup-libfem", name: "Copa Libertadores Femenina", shortName: "Lib Fem", continentId: "cont-sa", type: "club", tier: 1 },

  // North America (CONCACAF) - Club Competitions
  { id: "cup-ccl", name: "CONCACAF Champions Cup", shortName: "CCL", continentId: "cont-na", type: "club", tier: 1, description: "CONCACAF's premier club competition" },
  { id: "cup-leaguescup", name: "Leagues Cup", shortName: "Leagues Cup", continentId: "cont-na", type: "club", tier: 2, description: "MLS vs Liga MX tournament" },
  { id: "cup-campeones", name: "Campeones Cup", shortName: "Campeones", continentId: "cont-na", type: "club", tier: 2 },
  { id: "cup-usopen", name: "U.S. Open Cup", shortName: "US Open", continentId: "cont-na", type: "club", tier: 3 },
  { id: "cup-canadachamp", name: "Canadian Championship", shortName: "Can Champ", continentId: "cont-na", type: "club", tier: 3 },
  // North America - National Team Competitions
  { id: "cup-goldcup", name: "CONCACAF Gold Cup", shortName: "Gold Cup", continentId: "cont-na", type: "national", tier: 1, description: "CONCACAF's premier national team competition" },
  { id: "cup-nationsl", name: "CONCACAF Nations League", shortName: "CNL", continentId: "cont-na", type: "national", tier: 2 },
  { id: "cup-wgoldcup", name: "CONCACAF W Gold Cup", shortName: "W Gold Cup", continentId: "cont-na", type: "national", tier: 1 },
  { id: "cup-u20concacaf", name: "CONCACAF U-20 Championship", shortName: "U20 CONCACAF", continentId: "cont-na", type: "national", tier: 2 },

  // Asia (AFC) - Club Competitions
  { id: "cup-acl", name: "AFC Champions League Elite", shortName: "ACL", continentId: "cont-as", type: "club", tier: 1, description: "Asia's premier club competition" },
  { id: "cup-acl2", name: "AFC Champions League Two", shortName: "ACL2", continentId: "cont-as", type: "club", tier: 2 },
  { id: "cup-afccup", name: "AFC Cup", shortName: "AFC Cup", continentId: "cont-as", type: "club", tier: 3 },
  // Asia - National Team Competitions
  { id: "cup-asiancup", name: "AFC Asian Cup", shortName: "Asian Cup", continentId: "cont-as", type: "national", tier: 1, description: "Asia's premier national team competition" },
  { id: "cup-wasiancup", name: "AFC Women's Asian Cup", shortName: "W Asian Cup", continentId: "cont-as", type: "national", tier: 1 },
  { id: "cup-u23asian", name: "AFC U-23 Asian Cup", shortName: "U23 Asian", continentId: "cont-as", type: "national", tier: 2 },

  // Africa (CAF) - Club Competitions
  { id: "cup-cafcl", name: "CAF Champions League", shortName: "CAF CL", continentId: "cont-af", type: "club", tier: 1, description: "Africa's premier club competition" },
  { id: "cup-cafcc", name: "CAF Confederation Cup", shortName: "CAF CC", continentId: "cont-af", type: "club", tier: 2, description: "Africa's second-tier club competition" },
  { id: "cup-cafsc", name: "CAF Super Cup", shortName: "CAF SC", continentId: "cont-af", type: "club", tier: 1 },
  // Africa - National Team Competitions
  { id: "cup-afcon", name: "Africa Cup of Nations", shortName: "AFCON", continentId: "cont-af", type: "national", tier: 1, description: "Africa's premier national team competition" },
  { id: "cup-wafcon", name: "Women's Africa Cup of Nations", shortName: "W AFCON", continentId: "cont-af", type: "national", tier: 1 },
  { id: "cup-chan", name: "African Nations Championship", shortName: "CHAN", continentId: "cont-af", type: "national", tier: 2, description: "Competition for home-based players" },
  { id: "cup-u23afcon", name: "CAF U-23 Africa Cup of Nations", shortName: "U23 AFCON", continentId: "cont-af", type: "national", tier: 2 },

  // Oceania (OFC) - Club Competitions
  { id: "cup-ofccl", name: "OFC Champions League", shortName: "OFC CL", continentId: "cont-oc", type: "club", tier: 1, description: "Oceania's premier club competition" },
  // Oceania - National Team Competitions
  { id: "cup-ofcnc", name: "OFC Nations Cup", shortName: "OFC NC", continentId: "cont-oc", type: "national", tier: 1, description: "Oceania's premier national team competition" },
  { id: "cup-wofcnc", name: "OFC Women's Nations Cup", shortName: "W OFC NC", continentId: "cont-oc", type: "national", tier: 1 },
  { id: "cup-u19ofc", name: "OFC U-19 Championship", shortName: "U19 OFC", continentId: "cont-oc", type: "national", tier: 2 },
];

const COUNTRIES: Country[] = [
  // Europe
  { id: "c-eng", name: "England", continentId: "cont-eu" },
  { id: "c-esp", name: "Spain", continentId: "cont-eu" },
  { id: "c-ger", name: "Germany", continentId: "cont-eu" },
  { id: "c-fra", name: "France", continentId: "cont-eu" },
  { id: "c-ita", name: "Italy", continentId: "cont-eu" },
  { id: "c-por", name: "Portugal", continentId: "cont-eu" },
  { id: "c-ned", name: "Netherlands", continentId: "cont-eu" },
  { id: "c-bel", name: "Belgium", continentId: "cont-eu" },
  { id: "c-sco", name: "Scotland", continentId: "cont-eu" },
  { id: "c-tur", name: "Turkey", continentId: "cont-eu" },
  { id: "c-gre", name: "Greece", continentId: "cont-eu" },
  { id: "c-aut", name: "Austria", continentId: "cont-eu" },
  { id: "c-sui", name: "Switzerland", continentId: "cont-eu" },
  { id: "c-ukr", name: "Ukraine", continentId: "cont-eu" },
  { id: "c-pol", name: "Poland", continentId: "cont-eu" },
  { id: "c-cze", name: "Czech Republic", continentId: "cont-eu" },
  { id: "c-den", name: "Denmark", continentId: "cont-eu" },
  { id: "c-nor", name: "Norway", continentId: "cont-eu" },
  { id: "c-swe", name: "Sweden", continentId: "cont-eu" },
  { id: "c-rus", name: "Russia", continentId: "cont-eu" },
  // North America
  { id: "c-usa", name: "USA", continentId: "cont-na" },
  { id: "c-mex", name: "Mexico", continentId: "cont-na" },
  { id: "c-can", name: "Canada", continentId: "cont-na" },
  { id: "c-crc", name: "Costa Rica", continentId: "cont-na" },
  { id: "c-jam", name: "Jamaica", continentId: "cont-na" },
  { id: "c-hon", name: "Honduras", continentId: "cont-na" },
  { id: "c-pan", name: "Panama", continentId: "cont-na" },
  { id: "c-slv", name: "El Salvador", continentId: "cont-na" },
  // South America
  { id: "c-bra", name: "Brazil", continentId: "cont-sa" },
  { id: "c-arg", name: "Argentina", continentId: "cont-sa" },
  { id: "c-col", name: "Colombia", continentId: "cont-sa" },
  { id: "c-chi", name: "Chile", continentId: "cont-sa" },
  { id: "c-uru", name: "Uruguay", continentId: "cont-sa" },
  { id: "c-per", name: "Peru", continentId: "cont-sa" },
  { id: "c-ecu", name: "Ecuador", continentId: "cont-sa" },
  { id: "c-par", name: "Paraguay", continentId: "cont-sa" },
  { id: "c-ven", name: "Venezuela", continentId: "cont-sa" },
  { id: "c-bol", name: "Bolivia", continentId: "cont-sa" },
  // Asia
  { id: "c-jpn", name: "Japan", continentId: "cont-as" },
  { id: "c-kor", name: "South Korea", continentId: "cont-as" },
  { id: "c-chn", name: "China", continentId: "cont-as" },
  { id: "c-sau", name: "Saudi Arabia", continentId: "cont-as" },
  { id: "c-uae", name: "UAE", continentId: "cont-as" },
  { id: "c-qat", name: "Qatar", continentId: "cont-as" },
  { id: "c-irn", name: "Iran", continentId: "cont-as" },
  { id: "c-aus", name: "Australia", continentId: "cont-as" },
  { id: "c-tha", name: "Thailand", continentId: "cont-as" },
  { id: "c-ind", name: "India", continentId: "cont-as" },
  // Africa
  { id: "c-egy", name: "Egypt", continentId: "cont-af" },
  { id: "c-mar", name: "Morocco", continentId: "cont-af" },
  { id: "c-nga", name: "Nigeria", continentId: "cont-af" },
  { id: "c-sen", name: "Senegal", continentId: "cont-af" },
  { id: "c-gha", name: "Ghana", continentId: "cont-af" },
  { id: "c-civ", name: "Ivory Coast", continentId: "cont-af" },
  { id: "c-cmr", name: "Cameroon", continentId: "cont-af" },
  { id: "c-alg", name: "Algeria", continentId: "cont-af" },
  { id: "c-tun", name: "Tunisia", continentId: "cont-af" },
  { id: "c-rsa", name: "South Africa", continentId: "cont-af" },
  // Oceania
  { id: "c-nzl", name: "New Zealand", continentId: "cont-oc" },
  { id: "c-fij", name: "Fiji", continentId: "cont-oc" },
  { id: "c-png", name: "Papua New Guinea", continentId: "cont-oc" },
  { id: "c-sol", name: "Solomon Islands", continentId: "cont-oc" },
  { id: "c-tah", name: "Tahiti", continentId: "cont-oc" },
  { id: "c-ncl", name: "New Caledonia", continentId: "cont-oc" },
];

const LEAGUES: League[] = [
  // England
  { id: "l-pl", name: "Premier League", countryId: "c-eng", tier: 1, type: "League" },
  { id: "l-efl", name: "EFL Championship", countryId: "c-eng", tier: 2, type: "League" },
  { id: "l-l1", name: "EFL League One", countryId: "c-eng", tier: 3, type: "League" },
  { id: "l-l2", name: "EFL League Two", countryId: "c-eng", tier: 4, type: "League" },
  { id: "l-facup", name: "FA Cup", countryId: "c-eng", tier: 1, type: "Cup" },
  { id: "l-eflcup", name: "EFL Cup", countryId: "c-eng", tier: 2, type: "Cup" },
  { id: "l-wsl", name: "Women's Super League", countryId: "c-eng", tier: 1, type: "League" },
  // Spain
  { id: "l-ll", name: "La Liga", countryId: "c-esp", tier: 1, type: "League" },
  { id: "l-ll2", name: "La Liga 2", countryId: "c-esp", tier: 2, type: "League" },
  { id: "l-copadelrey", name: "Copa del Rey", countryId: "c-esp", tier: 1, type: "Cup" },
  { id: "l-supercopaes", name: "Supercopa de España", countryId: "c-esp", tier: 1, type: "Cup" },
  // Germany
  { id: "l-bl", name: "Bundesliga", countryId: "c-ger", tier: 1, type: "League" },
  { id: "l-bl2", name: "2. Bundesliga", countryId: "c-ger", tier: 2, type: "League" },
  { id: "l-bl3", name: "3. Liga", countryId: "c-ger", tier: 3, type: "League" },
  { id: "l-dfbpokal", name: "DFB-Pokal", countryId: "c-ger", tier: 1, type: "Cup" },
  { id: "l-dflsc", name: "DFL-Supercup", countryId: "c-ger", tier: 1, type: "Cup" },
  // France
  { id: "l-l1fr", name: "Ligue 1", countryId: "c-fra", tier: 1, type: "League" },
  { id: "l-l2fr", name: "Ligue 2", countryId: "c-fra", tier: 2, type: "League" },
  { id: "l-coupedefr", name: "Coupe de France", countryId: "c-fra", tier: 1, type: "Cup" },
  // Italy
  { id: "l-seriea", name: "Serie A", countryId: "c-ita", tier: 1, type: "League" },
  { id: "l-serieb", name: "Serie B", countryId: "c-ita", tier: 2, type: "League" },
  { id: "l-copait", name: "Coppa Italia", countryId: "c-ita", tier: 1, type: "Cup" },
  // Portugal
  { id: "l-ligapt", name: "Primeira Liga", countryId: "c-por", tier: 1, type: "League" },
  { id: "l-tacapt", name: "Taça de Portugal", countryId: "c-por", tier: 1, type: "Cup" },
  // Netherlands
  { id: "l-ere", name: "Eredivisie", countryId: "c-ned", tier: 1, type: "League" },
  { id: "l-knvb", name: "KNVB Cup", countryId: "c-ned", tier: 1, type: "Cup" },
  // USA
  { id: "l-mls", name: "MLS", countryId: "c-usa", tier: 1, type: "League" },
  { id: "l-nwsl", name: "NWSL", countryId: "c-usa", tier: 1, type: "League" },
  { id: "l-usl", name: "USL Championship", countryId: "c-usa", tier: 2, type: "League" },
  { id: "l-usl1", name: "USL League One", countryId: "c-usa", tier: 3, type: "League" },
  { id: "l-usl2", name: "USL League Two", countryId: "c-usa", tier: 4, type: "League" },
  { id: "l-mlsnp", name: "MLS NEXT Pro", countryId: "c-usa", tier: 3, type: "League" },
  { id: "l-ncaa", name: "NCAA Division 1", countryId: "c-usa", tier: 4, type: "League" },
  { id: "l-upsl", name: "UPSL", countryId: "c-usa", tier: 5, type: "League" },
  { id: "l-npsl", name: "NPSL", countryId: "c-usa", tier: 5, type: "League" },
  // Mexico
  { id: "l-ligamx", name: "Liga MX", countryId: "c-mex", tier: 1, type: "League" },
  { id: "l-ligaexp", name: "Liga de Expansión MX", countryId: "c-mex", tier: 2, type: "League" },
  { id: "l-copamx", name: "Copa MX", countryId: "c-mex", tier: 1, type: "Cup" },
  { id: "l-ligamxfem", name: "Liga MX Femenil", countryId: "c-mex", tier: 1, type: "League" },
  // Brazil
  { id: "l-brasileirao", name: "Brasileirão Série A", countryId: "c-bra", tier: 1, type: "League" },
  { id: "l-brasileiraob", name: "Brasileirão Série B", countryId: "c-bra", tier: 2, type: "League" },
  { id: "l-copabra", name: "Copa do Brasil", countryId: "c-bra", tier: 1, type: "Cup" },
  // Argentina
  { id: "l-lpf", name: "Liga Profesional", countryId: "c-arg", tier: 1, type: "League" },
  { id: "l-coparg", name: "Copa Argentina", countryId: "c-arg", tier: 1, type: "Cup" },
  // Japan
  { id: "l-j1", name: "J1 League", countryId: "c-jpn", tier: 1, type: "League" },
  { id: "l-j2", name: "J2 League", countryId: "c-jpn", tier: 2, type: "League" },
  { id: "l-emperors", name: "Emperor's Cup", countryId: "c-jpn", tier: 1, type: "Cup" },
  // Saudi Arabia
  { id: "l-spl", name: "Saudi Pro League", countryId: "c-sau", tier: 1, type: "League" },
  { id: "l-kingscup", name: "King's Cup", countryId: "c-sau", tier: 1, type: "Cup" },
  // Egypt
  { id: "l-epl", name: "Egyptian Premier League", countryId: "c-egy", tier: 1, type: "League" },
  { id: "l-egyptcup", name: "Egypt Cup", countryId: "c-egy", tier: 1, type: "Cup" },
  // Morocco
  { id: "l-botola", name: "Botola Pro", countryId: "c-mar", tier: 1, type: "League" },
  { id: "l-thronecup", name: "Throne Cup", countryId: "c-mar", tier: 1, type: "Cup" },
  // New Zealand
  { id: "l-nzfootball", name: "New Zealand Football Championship", countryId: "c-nzl", tier: 1, type: "League" },
  { id: "l-chathamcup", name: "Chatham Cup", countryId: "c-nzl", tier: 1, type: "Cup" },
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
  
  getContinentalCups: (continentId?: string, type?: "club" | "national") => {
    let cups = CONTINENTAL_CUPS;
    if (continentId) cups = cups.filter(c => c.continentId === continentId);
    if (type) cups = cups.filter(c => c.type === type);
    return cups;
  },
  getContinentalCup: (id: string) => CONTINENTAL_CUPS.find(c => c.id === id),
  
  getMatch: (id: string) => MATCHES.find(m => m.id === id),
  getMatches: () => MATCHES,
  
  getTeam: (id: string) => TEAMS.find(t => t.id === id),
  getLeague: (id: string) => LEAGUES.find(l => l.id === id),
  getCountry: (id: string) => COUNTRIES.find(c => c.id === id),
  getContinent: (id: string) => CONTINENTS.find(c => c.id === id),
  
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
