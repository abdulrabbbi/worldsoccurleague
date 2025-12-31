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
  { id: "cont-oc", name: "Aussie", slug: "aussie" },
];

const MOCK_COUNTRIES: Country[] = [
  // Europe
  { id: "c-eng", name: "England", code: "ENG", slug: "england", continentId: "cont-eu" },
  { id: "c-esp", name: "Spain", code: "ESP", slug: "spain", continentId: "cont-eu" },
  { id: "c-ger", name: "Germany", code: "GER", slug: "germany", continentId: "cont-eu" },
  { id: "c-fra", name: "France", code: "FRA", slug: "france", continentId: "cont-eu" },
  { id: "c-ita", name: "Italy", code: "ITA", slug: "italy", continentId: "cont-eu" },
  { id: "c-por", name: "Portugal", code: "POR", slug: "portugal", continentId: "cont-eu" },
  { id: "c-ned", name: "Netherlands", code: "NED", slug: "netherlands", continentId: "cont-eu" },
  { id: "c-bel", name: "Belgium", code: "BEL", slug: "belgium", continentId: "cont-eu" },
  { id: "c-sco", name: "Scotland", code: "SCO", slug: "scotland", continentId: "cont-eu" },
  { id: "c-tur", name: "Turkey", code: "TUR", slug: "turkey", continentId: "cont-eu" },
  { id: "c-gre", name: "Greece", code: "GRE", slug: "greece", continentId: "cont-eu" },
  { id: "c-aut", name: "Austria", code: "AUT", slug: "austria", continentId: "cont-eu" },
  { id: "c-sui", name: "Switzerland", code: "SUI", slug: "switzerland", continentId: "cont-eu" },
  { id: "c-ukr", name: "Ukraine", code: "UKR", slug: "ukraine", continentId: "cont-eu" },
  { id: "c-pol", name: "Poland", code: "POL", slug: "poland", continentId: "cont-eu" },
  { id: "c-cze", name: "Czech Republic", code: "CZE", slug: "czech-republic", continentId: "cont-eu" },
  { id: "c-den", name: "Denmark", code: "DEN", slug: "denmark", continentId: "cont-eu" },
  { id: "c-nor", name: "Norway", code: "NOR", slug: "norway", continentId: "cont-eu" },
  { id: "c-swe", name: "Sweden", code: "SWE", slug: "sweden", continentId: "cont-eu" },
  { id: "c-rus", name: "Russia", code: "RUS", slug: "russia", continentId: "cont-eu" },
  { id: "c-cro", name: "Croatia", code: "CRO", slug: "croatia", continentId: "cont-eu" },
  { id: "c-srb", name: "Serbia", code: "SRB", slug: "serbia", continentId: "cont-eu" },
  // North America
  { id: "c-usa", name: "USA", code: "USA", slug: "usa", continentId: "cont-na" },
  { id: "c-can", name: "Canada", code: "CAN", slug: "canada", continentId: "cont-na" },
  { id: "c-mex", name: "Mexico", code: "MEX", slug: "mexico", continentId: "cont-na" },
  { id: "c-crc", name: "Costa Rica", code: "CRC", slug: "costa-rica", continentId: "cont-na" },
  { id: "c-jam", name: "Jamaica", code: "JAM", slug: "jamaica", continentId: "cont-na" },
  { id: "c-hon", name: "Honduras", code: "HON", slug: "honduras", continentId: "cont-na" },
  { id: "c-pan", name: "Panama", code: "PAN", slug: "panama", continentId: "cont-na" },
  { id: "c-slv", name: "El Salvador", code: "SLV", slug: "el-salvador", continentId: "cont-na" },
  { id: "c-gua", name: "Guatemala", code: "GUA", slug: "guatemala", continentId: "cont-na" },
  // South America
  { id: "c-bra", name: "Brazil", code: "BRA", slug: "brazil", continentId: "cont-sa" },
  { id: "c-arg", name: "Argentina", code: "ARG", slug: "argentina", continentId: "cont-sa" },
  { id: "c-col", name: "Colombia", code: "COL", slug: "colombia", continentId: "cont-sa" },
  { id: "c-chi", name: "Chile", code: "CHI", slug: "chile", continentId: "cont-sa" },
  { id: "c-uru", name: "Uruguay", code: "URU", slug: "uruguay", continentId: "cont-sa" },
  { id: "c-per", name: "Peru", code: "PER", slug: "peru", continentId: "cont-sa" },
  { id: "c-ecu", name: "Ecuador", code: "ECU", slug: "ecuador", continentId: "cont-sa" },
  { id: "c-par", name: "Paraguay", code: "PAR", slug: "paraguay", continentId: "cont-sa" },
  { id: "c-ven", name: "Venezuela", code: "VEN", slug: "venezuela", continentId: "cont-sa" },
  { id: "c-bol", name: "Bolivia", code: "BOL", slug: "bolivia", continentId: "cont-sa" },
  // Asia
  { id: "c-jpn", name: "Japan", code: "JPN", slug: "japan", continentId: "cont-as" },
  { id: "c-kor", name: "South Korea", code: "KOR", slug: "south-korea", continentId: "cont-as" },
  { id: "c-chn", name: "China", code: "CHN", slug: "china", continentId: "cont-as" },
  { id: "c-sau", name: "Saudi Arabia", code: "SAU", slug: "saudi-arabia", continentId: "cont-as" },
  { id: "c-uae", name: "UAE", code: "UAE", slug: "uae", continentId: "cont-as" },
  { id: "c-qat", name: "Qatar", code: "QAT", slug: "qatar", continentId: "cont-as" },
  { id: "c-irn", name: "Iran", code: "IRN", slug: "iran", continentId: "cont-as" },
  { id: "c-aus", name: "Australia", code: "AUS", slug: "australia", continentId: "cont-as" },
  { id: "c-tha", name: "Thailand", code: "THA", slug: "thailand", continentId: "cont-as" },
  { id: "c-ind", name: "India", code: "IND", slug: "india", continentId: "cont-as" },
  { id: "c-idn", name: "Indonesia", code: "IDN", slug: "indonesia", continentId: "cont-as" },
  { id: "c-mys", name: "Malaysia", code: "MYS", slug: "malaysia", continentId: "cont-as" },
  // Africa
  { id: "c-egy", name: "Egypt", code: "EGY", slug: "egypt", continentId: "cont-af" },
  { id: "c-mar", name: "Morocco", code: "MAR", slug: "morocco", continentId: "cont-af" },
  { id: "c-nga", name: "Nigeria", code: "NGA", slug: "nigeria", continentId: "cont-af" },
  { id: "c-sen", name: "Senegal", code: "SEN", slug: "senegal", continentId: "cont-af" },
  { id: "c-gha", name: "Ghana", code: "GHA", slug: "ghana", continentId: "cont-af" },
  { id: "c-civ", name: "Ivory Coast", code: "CIV", slug: "ivory-coast", continentId: "cont-af" },
  { id: "c-cmr", name: "Cameroon", code: "CMR", slug: "cameroon", continentId: "cont-af" },
  { id: "c-alg", name: "Algeria", code: "ALG", slug: "algeria", continentId: "cont-af" },
  { id: "c-tun", name: "Tunisia", code: "TUN", slug: "tunisia", continentId: "cont-af" },
  { id: "c-rsa", name: "South Africa", code: "RSA", slug: "south-africa", continentId: "cont-af" },
  // Oceania
  { id: "c-nzl", name: "New Zealand", code: "NZL", slug: "new-zealand", continentId: "cont-oc" },
  { id: "c-fij", name: "Fiji", code: "FIJ", slug: "fiji", continentId: "cont-oc" },
  { id: "c-png", name: "Papua New Guinea", code: "PNG", slug: "papua-new-guinea", continentId: "cont-oc" },
  { id: "c-sol", name: "Solomon Islands", code: "SOL", slug: "solomon-islands", continentId: "cont-oc" },
  { id: "c-tah", name: "Tahiti", code: "TAH", slug: "tahiti", continentId: "cont-oc" },
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
  // ============ ENGLAND ============
  // Leagues
  { id: "l-eng-pl", name: "Premier League", slug: "premier-league", countryId: "c-eng", category: "Professional Leagues", tier: 1 },
  { id: "l-eng-champ", name: "EFL Championship", slug: "efl-championship", countryId: "c-eng", category: "Professional Leagues", tier: 2 },
  { id: "l-eng-l1", name: "EFL League One", slug: "efl-league-one", countryId: "c-eng", category: "Professional Leagues", tier: 3 },
  { id: "l-eng-l2", name: "EFL League Two", slug: "efl-league-two", countryId: "c-eng", category: "Professional Leagues", tier: 4 },
  { id: "l-eng-natl", name: "National League", slug: "national-league", countryId: "c-eng", category: "Professional Leagues", tier: 5 },
  { id: "l-eng-wsl", name: "Women's Super League", slug: "womens-super-league", countryId: "c-eng", category: "Professional Leagues", tier: 1 },
  // Domestic Cups
  { id: "l-eng-facup", name: "FA Cup", slug: "fa-cup", countryId: "c-eng", category: "Domestic Cups", tier: 1 },
  { id: "l-eng-eflcup", name: "EFL Cup (Carabao Cup)", slug: "efl-cup", countryId: "c-eng", category: "Domestic Cups", tier: 2 },
  { id: "l-eng-comshield", name: "Community Shield", slug: "community-shield", countryId: "c-eng", category: "Domestic Cups", tier: 3 },
  { id: "l-eng-fatrophy", name: "FA Trophy", slug: "fa-trophy", countryId: "c-eng", category: "Domestic Cups", tier: 4 },

  // ============ SPAIN ============
  { id: "l-esp-laliga", name: "La Liga", slug: "la-liga", countryId: "c-esp", category: "Professional Leagues", tier: 1 },
  { id: "l-esp-segunda", name: "La Liga 2", slug: "la-liga-2", countryId: "c-esp", category: "Professional Leagues", tier: 2 },
  { id: "l-esp-primera", name: "Primera Federación", slug: "primera-federacion", countryId: "c-esp", category: "Professional Leagues", tier: 3 },
  { id: "l-esp-segunda-rfef", name: "Segunda Federación", slug: "segunda-federacion", countryId: "c-esp", category: "Professional Leagues", tier: 4 },
  { id: "l-esp-ligaf", name: "Liga F (Women)", slug: "liga-f", countryId: "c-esp", category: "Professional Leagues", tier: 1 },
  { id: "l-esp-copa", name: "Copa del Rey", slug: "copa-del-rey", countryId: "c-esp", category: "Domestic Cups", tier: 1 },
  { id: "l-esp-supercopa", name: "Supercopa de España", slug: "supercopa-espana", countryId: "c-esp", category: "Domestic Cups", tier: 2 },

  // ============ GERMANY ============
  { id: "l-ger-buli", name: "Bundesliga", slug: "bundesliga", countryId: "c-ger", category: "Professional Leagues", tier: 1 },
  { id: "l-ger-buli2", name: "2. Bundesliga", slug: "2-bundesliga", countryId: "c-ger", category: "Professional Leagues", tier: 2 },
  { id: "l-ger-3liga", name: "3. Liga", slug: "3-liga", countryId: "c-ger", category: "Professional Leagues", tier: 3 },
  { id: "l-ger-regl", name: "Regionalliga", slug: "regionalliga", countryId: "c-ger", category: "Professional Leagues", tier: 4 },
  { id: "l-ger-frauen", name: "Frauen-Bundesliga", slug: "frauen-bundesliga", countryId: "c-ger", category: "Professional Leagues", tier: 1 },
  { id: "l-ger-dfb", name: "DFB-Pokal", slug: "dfb-pokal", countryId: "c-ger", category: "Domestic Cups", tier: 1 },
  { id: "l-ger-super", name: "DFL-Supercup", slug: "dfl-supercup", countryId: "c-ger", category: "Domestic Cups", tier: 2 },

  // ============ FRANCE ============
  { id: "l-fra-l1", name: "Ligue 1", slug: "ligue-1", countryId: "c-fra", category: "Professional Leagues", tier: 1 },
  { id: "l-fra-l2", name: "Ligue 2", slug: "ligue-2", countryId: "c-fra", category: "Professional Leagues", tier: 2 },
  { id: "l-fra-national", name: "Championnat National", slug: "championnat-national", countryId: "c-fra", category: "Professional Leagues", tier: 3 },
  { id: "l-fra-d1f", name: "Division 1 Féminine", slug: "division-1-feminine", countryId: "c-fra", category: "Professional Leagues", tier: 1 },
  { id: "l-fra-coupe", name: "Coupe de France", slug: "coupe-de-france", countryId: "c-fra", category: "Domestic Cups", tier: 1 },
  { id: "l-fra-ligue", name: "Coupe de la Ligue", slug: "coupe-de-la-ligue", countryId: "c-fra", category: "Domestic Cups", tier: 2 },
  { id: "l-fra-trophee", name: "Trophée des Champions", slug: "trophee-des-champions", countryId: "c-fra", category: "Domestic Cups", tier: 3 },

  // ============ ITALY ============
  { id: "l-ita-seriea", name: "Serie A", slug: "serie-a", countryId: "c-ita", category: "Professional Leagues", tier: 1 },
  { id: "l-ita-serieb", name: "Serie B", slug: "serie-b", countryId: "c-ita", category: "Professional Leagues", tier: 2 },
  { id: "l-ita-seriec", name: "Serie C", slug: "serie-c", countryId: "c-ita", category: "Professional Leagues", tier: 3 },
  { id: "l-ita-seried", name: "Serie D", slug: "serie-d", countryId: "c-ita", category: "Professional Leagues", tier: 4 },
  { id: "l-ita-serieaf", name: "Serie A Femminile", slug: "serie-a-femminile", countryId: "c-ita", category: "Professional Leagues", tier: 1 },
  { id: "l-ita-coppa", name: "Coppa Italia", slug: "coppa-italia", countryId: "c-ita", category: "Domestic Cups", tier: 1 },
  { id: "l-ita-supercoppa", name: "Supercoppa Italiana", slug: "supercoppa-italiana", countryId: "c-ita", category: "Domestic Cups", tier: 2 },

  // ============ PORTUGAL ============
  { id: "l-por-primeira", name: "Primeira Liga", slug: "primeira-liga", countryId: "c-por", category: "Professional Leagues", tier: 1 },
  { id: "l-por-segunda", name: "Liga Portugal 2", slug: "liga-portugal-2", countryId: "c-por", category: "Professional Leagues", tier: 2 },
  { id: "l-por-terceira", name: "Liga 3", slug: "liga-3", countryId: "c-por", category: "Professional Leagues", tier: 3 },
  { id: "l-por-taca", name: "Taça de Portugal", slug: "taca-de-portugal", countryId: "c-por", category: "Domestic Cups", tier: 1 },
  { id: "l-por-supertaca", name: "Supertaça", slug: "supertaca", countryId: "c-por", category: "Domestic Cups", tier: 2 },

  // ============ NETHERLANDS ============
  { id: "l-ned-ere", name: "Eredivisie", slug: "eredivisie", countryId: "c-ned", category: "Professional Leagues", tier: 1 },
  { id: "l-ned-eerste", name: "Eerste Divisie", slug: "eerste-divisie", countryId: "c-ned", category: "Professional Leagues", tier: 2 },
  { id: "l-ned-knvb", name: "KNVB Cup", slug: "knvb-cup", countryId: "c-ned", category: "Domestic Cups", tier: 1 },
  { id: "l-ned-super", name: "Johan Cruyff Shield", slug: "johan-cruyff-shield", countryId: "c-ned", category: "Domestic Cups", tier: 2 },

  // ============ BELGIUM ============
  { id: "l-bel-proa", name: "Pro League", slug: "belgian-pro-league", countryId: "c-bel", category: "Professional Leagues", tier: 1 },
  { id: "l-bel-first", name: "Challenger Pro League", slug: "challenger-pro-league", countryId: "c-bel", category: "Professional Leagues", tier: 2 },
  { id: "l-bel-cup", name: "Croky Cup", slug: "croky-cup", countryId: "c-bel", category: "Domestic Cups", tier: 1 },
  { id: "l-bel-super", name: "Belgian Super Cup", slug: "belgian-super-cup", countryId: "c-bel", category: "Domestic Cups", tier: 2 },

  // ============ SCOTLAND ============
  { id: "l-sco-prem", name: "Scottish Premiership", slug: "scottish-premiership", countryId: "c-sco", category: "Professional Leagues", tier: 1 },
  { id: "l-sco-champ", name: "Scottish Championship", slug: "scottish-championship", countryId: "c-sco", category: "Professional Leagues", tier: 2 },
  { id: "l-sco-l1", name: "Scottish League One", slug: "scottish-league-one", countryId: "c-sco", category: "Professional Leagues", tier: 3 },
  { id: "l-sco-l2", name: "Scottish League Two", slug: "scottish-league-two", countryId: "c-sco", category: "Professional Leagues", tier: 4 },
  { id: "l-sco-cup", name: "Scottish Cup", slug: "scottish-cup", countryId: "c-sco", category: "Domestic Cups", tier: 1 },
  { id: "l-sco-league", name: "Scottish League Cup", slug: "scottish-league-cup", countryId: "c-sco", category: "Domestic Cups", tier: 2 },

  // ============ TURKEY ============
  { id: "l-tur-super", name: "Süper Lig", slug: "super-lig", countryId: "c-tur", category: "Professional Leagues", tier: 1 },
  { id: "l-tur-1lig", name: "TFF 1. Lig", slug: "tff-1-lig", countryId: "c-tur", category: "Professional Leagues", tier: 2 },
  { id: "l-tur-2lig", name: "TFF 2. Lig", slug: "tff-2-lig", countryId: "c-tur", category: "Professional Leagues", tier: 3 },
  { id: "l-tur-cup", name: "Turkish Cup", slug: "turkish-cup", countryId: "c-tur", category: "Domestic Cups", tier: 1 },
  { id: "l-tur-super-cup", name: "Turkish Super Cup", slug: "turkish-super-cup", countryId: "c-tur", category: "Domestic Cups", tier: 2 },

  // ============ AUSTRIA ============
  { id: "l-aut-buli", name: "Austrian Bundesliga", slug: "austrian-bundesliga", countryId: "c-aut", category: "Professional Leagues", tier: 1 },
  { id: "l-aut-2liga", name: "2. Liga", slug: "austrian-2-liga", countryId: "c-aut", category: "Professional Leagues", tier: 2 },
  { id: "l-aut-regl", name: "Regionalliga", slug: "austrian-regionalliga", countryId: "c-aut", category: "Professional Leagues", tier: 3 },
  { id: "l-aut-cup", name: "ÖFB-Cup", slug: "oefb-cup", countryId: "c-aut", category: "Domestic Cups", tier: 1 },
  { id: "l-aut-super", name: "Austrian Super Cup", slug: "austrian-super-cup", countryId: "c-aut", category: "Domestic Cups", tier: 2 },

  // ============ SWITZERLAND ============
  { id: "l-sui-super", name: "Swiss Super League", slug: "swiss-super-league", countryId: "c-sui", category: "Professional Leagues", tier: 1 },
  { id: "l-sui-chal", name: "Swiss Challenge League", slug: "swiss-challenge-league", countryId: "c-sui", category: "Professional Leagues", tier: 2 },
  { id: "l-sui-prom", name: "Promotion League", slug: "swiss-promotion-league", countryId: "c-sui", category: "Professional Leagues", tier: 3 },
  { id: "l-sui-cup", name: "Swiss Cup", slug: "swiss-cup", countryId: "c-sui", category: "Domestic Cups", tier: 1 },

  // ============ GREECE ============
  { id: "l-gre-super", name: "Super League Greece", slug: "super-league-greece", countryId: "c-gre", category: "Professional Leagues", tier: 1 },
  { id: "l-gre-super2", name: "Super League 2", slug: "super-league-2", countryId: "c-gre", category: "Professional Leagues", tier: 2 },
  { id: "l-gre-cup", name: "Greek Cup", slug: "greek-cup", countryId: "c-gre", category: "Domestic Cups", tier: 1 },
  { id: "l-gre-super-cup", name: "Greek Super Cup", slug: "greek-super-cup", countryId: "c-gre", category: "Domestic Cups", tier: 2 },

  // ============ POLAND ============
  { id: "l-pol-ekstra", name: "Ekstraklasa", slug: "ekstraklasa", countryId: "c-pol", category: "Professional Leagues", tier: 1 },
  { id: "l-pol-1liga", name: "I Liga", slug: "i-liga", countryId: "c-pol", category: "Professional Leagues", tier: 2 },
  { id: "l-pol-2liga", name: "II Liga", slug: "ii-liga", countryId: "c-pol", category: "Professional Leagues", tier: 3 },
  { id: "l-pol-cup", name: "Polish Cup", slug: "polish-cup", countryId: "c-pol", category: "Domestic Cups", tier: 1 },
  { id: "l-pol-super", name: "Polish Super Cup", slug: "polish-super-cup", countryId: "c-pol", category: "Domestic Cups", tier: 2 },

  // ============ CZECH REPUBLIC ============
  { id: "l-cze-1liga", name: "Czech First League", slug: "czech-first-league", countryId: "c-cze", category: "Professional Leagues", tier: 1 },
  { id: "l-cze-fnl", name: "Czech National League", slug: "czech-national-league", countryId: "c-cze", category: "Professional Leagues", tier: 2 },
  { id: "l-cze-cup", name: "Czech Cup", slug: "czech-cup", countryId: "c-cze", category: "Domestic Cups", tier: 1 },

  // ============ DENMARK ============
  { id: "l-den-super", name: "Danish Superliga", slug: "danish-superliga", countryId: "c-den", category: "Professional Leagues", tier: 1 },
  { id: "l-den-1div", name: "1. Division", slug: "danish-1-division", countryId: "c-den", category: "Professional Leagues", tier: 2 },
  { id: "l-den-cup", name: "Danish Cup", slug: "danish-cup", countryId: "c-den", category: "Domestic Cups", tier: 1 },

  // ============ NORWAY ============
  { id: "l-nor-elite", name: "Eliteserien", slug: "eliteserien", countryId: "c-nor", category: "Professional Leagues", tier: 1 },
  { id: "l-nor-obos", name: "OBOS-ligaen", slug: "obos-ligaen", countryId: "c-nor", category: "Professional Leagues", tier: 2 },
  { id: "l-nor-cup", name: "Norwegian Cup", slug: "norwegian-cup", countryId: "c-nor", category: "Domestic Cups", tier: 1 },

  // ============ SWEDEN ============
  { id: "l-swe-alls", name: "Allsvenskan", slug: "allsvenskan", countryId: "c-swe", category: "Professional Leagues", tier: 1 },
  { id: "l-swe-super", name: "Superettan", slug: "superettan", countryId: "c-swe", category: "Professional Leagues", tier: 2 },
  { id: "l-swe-cup", name: "Svenska Cupen", slug: "svenska-cupen", countryId: "c-swe", category: "Domestic Cups", tier: 1 },

  // ============ RUSSIA ============
  { id: "l-rus-premier", name: "Russian Premier League", slug: "russian-premier-league", countryId: "c-rus", category: "Professional Leagues", tier: 1 },
  { id: "l-rus-fnl", name: "Russian FNL", slug: "russian-fnl", countryId: "c-rus", category: "Professional Leagues", tier: 2 },
  { id: "l-rus-cup", name: "Russian Cup", slug: "russian-cup", countryId: "c-rus", category: "Domestic Cups", tier: 1 },
  { id: "l-rus-super", name: "Russian Super Cup", slug: "russian-super-cup", countryId: "c-rus", category: "Domestic Cups", tier: 2 },

  // ============ UKRAINE ============
  { id: "l-ukr-premier", name: "Ukrainian Premier League", slug: "ukrainian-premier-league", countryId: "c-ukr", category: "Professional Leagues", tier: 1 },
  { id: "l-ukr-first", name: "Ukrainian First League", slug: "ukrainian-first-league", countryId: "c-ukr", category: "Professional Leagues", tier: 2 },
  { id: "l-ukr-cup", name: "Ukrainian Cup", slug: "ukrainian-cup", countryId: "c-ukr", category: "Domestic Cups", tier: 1 },
  { id: "l-ukr-super", name: "Ukrainian Super Cup", slug: "ukrainian-super-cup", countryId: "c-ukr", category: "Domestic Cups", tier: 2 },

  // ============ CROATIA ============
  { id: "l-cro-hnl", name: "Croatian First League", slug: "croatian-first-league", countryId: "c-cro", category: "Professional Leagues", tier: 1 },
  { id: "l-cro-2hnl", name: "Croatian Second League", slug: "croatian-second-league", countryId: "c-cro", category: "Professional Leagues", tier: 2 },
  { id: "l-cro-cup", name: "Croatian Cup", slug: "croatian-cup", countryId: "c-cro", category: "Domestic Cups", tier: 1 },
  { id: "l-cro-super", name: "Croatian Super Cup", slug: "croatian-super-cup", countryId: "c-cro", category: "Domestic Cups", tier: 2 },

  // ============ SERBIA ============
  { id: "l-srb-super", name: "Serbian SuperLiga", slug: "serbian-superliga", countryId: "c-srb", category: "Professional Leagues", tier: 1 },
  { id: "l-srb-first", name: "Serbian First League", slug: "serbian-first-league", countryId: "c-srb", category: "Professional Leagues", tier: 2 },
  { id: "l-srb-cup", name: "Serbian Cup", slug: "serbian-cup", countryId: "c-srb", category: "Domestic Cups", tier: 1 },

  // ============ USA ============
  { id: "l-usa-mls", name: "MLS", slug: "mls", countryId: "c-usa", category: "Professional Leagues", tier: 1 },
  { id: "l-usa-nwsl", name: "NWSL", slug: "nwsl", countryId: "c-usa", category: "Professional Leagues", tier: 1 },
  { id: "l-usa-uslc", name: "USL Championship", slug: "usl-championship", countryId: "c-usa", category: "Professional Leagues", tier: 2 },
  { id: "l-usa-usl1", name: "USL League One", slug: "usl-league-one", countryId: "c-usa", category: "Professional Leagues", tier: 3 },
  { id: "l-usa-usl2", name: "USL League Two", slug: "usl-league-two", countryId: "c-usa", category: "Professional Leagues", tier: 4 },
  { id: "l-usa-mlsnp", name: "MLS NEXT Pro", slug: "mls-next-pro", countryId: "c-usa", category: "Professional Leagues", tier: 3 },
  { id: "l-usa-npsl", name: "NPSL", slug: "npsl", countryId: "c-usa", category: "Sanctioned Leagues", tier: 5 },
  { id: "l-usa-upsl", name: "UPSL", slug: "upsl", countryId: "c-usa", category: "Sanctioned Leagues", tier: 5 },
  { id: "l-usa-ncaa", name: "NCAA Division I", slug: "ncaa-d1", countryId: "c-usa", category: "College Soccer", tier: 1 },
  { id: "l-usa-ncaa2", name: "NCAA Division II", slug: "ncaa-d2", countryId: "c-usa", category: "College Soccer", tier: 2 },
  { id: "l-usa-ncaa3", name: "NCAA Division III", slug: "ncaa-d3", countryId: "c-usa", category: "College Soccer", tier: 3 },
  { id: "l-usa-naia", name: "NAIA", slug: "naia", countryId: "c-usa", category: "College Soccer", tier: 2 },
  { id: "l-usa-njcaa", name: "NJCAA", slug: "njcaa", countryId: "c-usa", category: "College Soccer", tier: 3 },
  { id: "l-usa-usopen", name: "U.S. Open Cup", slug: "us-open-cup", countryId: "c-usa", category: "Domestic Cups", tier: 1 },
  { id: "l-usa-mlscup", name: "MLS Cup", slug: "mls-cup", countryId: "c-usa", category: "Domestic Cups", tier: 1 },
  { id: "l-usa-supportsshield", name: "Supporters' Shield", slug: "supporters-shield", countryId: "c-usa", category: "Domestic Cups", tier: 2 },

  // ============ MEXICO ============
  { id: "l-mex-ligamx", name: "Liga MX", slug: "liga-mx", countryId: "c-mex", category: "Professional Leagues", tier: 1 },
  { id: "l-mex-expansion", name: "Liga de Expansión MX", slug: "liga-expansion-mx", countryId: "c-mex", category: "Professional Leagues", tier: 2 },
  { id: "l-mex-liga2", name: "Liga Premier", slug: "liga-premier", countryId: "c-mex", category: "Professional Leagues", tier: 3 },
  { id: "l-mex-femenil", name: "Liga MX Femenil", slug: "liga-mx-femenil", countryId: "c-mex", category: "Professional Leagues", tier: 1 },
  { id: "l-mex-copa", name: "Copa MX", slug: "copa-mx", countryId: "c-mex", category: "Domestic Cups", tier: 1 },
  { id: "l-mex-campeon", name: "Campeón de Campeones", slug: "campeon-de-campeones", countryId: "c-mex", category: "Domestic Cups", tier: 2 },

  // ============ BRAZIL ============
  { id: "l-bra-seriea", name: "Brasileirão Série A", slug: "brasileirao-serie-a", countryId: "c-bra", category: "Professional Leagues", tier: 1 },
  { id: "l-bra-serieb", name: "Brasileirão Série B", slug: "brasileirao-serie-b", countryId: "c-bra", category: "Professional Leagues", tier: 2 },
  { id: "l-bra-seriec", name: "Brasileirão Série C", slug: "brasileirao-serie-c", countryId: "c-bra", category: "Professional Leagues", tier: 3 },
  { id: "l-bra-seried", name: "Brasileirão Série D", slug: "brasileirao-serie-d", countryId: "c-bra", category: "Professional Leagues", tier: 4 },
  { id: "l-bra-braf", name: "Brasileirão Feminino A1", slug: "brasileirao-feminino", countryId: "c-bra", category: "Professional Leagues", tier: 1 },
  { id: "l-bra-copa", name: "Copa do Brasil", slug: "copa-do-brasil", countryId: "c-bra", category: "Domestic Cups", tier: 1 },
  { id: "l-bra-super", name: "Supercopa do Brasil", slug: "supercopa-do-brasil", countryId: "c-bra", category: "Domestic Cups", tier: 2 },
  // State Championships
  { id: "l-bra-paulista", name: "Campeonato Paulista", slug: "campeonato-paulista", countryId: "c-bra", category: "Professional Leagues", tier: 2 },
  { id: "l-bra-carioca", name: "Campeonato Carioca", slug: "campeonato-carioca", countryId: "c-bra", category: "Professional Leagues", tier: 2 },
  { id: "l-bra-gaucho", name: "Campeonato Gaúcho", slug: "campeonato-gaucho", countryId: "c-bra", category: "Professional Leagues", tier: 2 },
  { id: "l-bra-mineiro", name: "Campeonato Mineiro", slug: "campeonato-mineiro", countryId: "c-bra", category: "Professional Leagues", tier: 2 },

  // ============ ARGENTINA ============
  { id: "l-arg-primera", name: "Liga Profesional", slug: "liga-profesional-argentina", countryId: "c-arg", category: "Professional Leagues", tier: 1 },
  { id: "l-arg-nacional", name: "Primera Nacional", slug: "primera-nacional", countryId: "c-arg", category: "Professional Leagues", tier: 2 },
  { id: "l-arg-metro", name: "Primera B Metropolitana", slug: "primera-b-metropolitana", countryId: "c-arg", category: "Professional Leagues", tier: 3 },
  { id: "l-arg-copa", name: "Copa Argentina", slug: "copa-argentina", countryId: "c-arg", category: "Domestic Cups", tier: 1 },
  { id: "l-arg-trofeo", name: "Trofeo de Campeones", slug: "trofeo-de-campeones", countryId: "c-arg", category: "Domestic Cups", tier: 2 },

  // ============ JAPAN ============
  { id: "l-jpn-j1", name: "J1 League", slug: "j1-league", countryId: "c-jpn", category: "Professional Leagues", tier: 1 },
  { id: "l-jpn-j2", name: "J2 League", slug: "j2-league", countryId: "c-jpn", category: "Professional Leagues", tier: 2 },
  { id: "l-jpn-j3", name: "J3 League", slug: "j3-league", countryId: "c-jpn", category: "Professional Leagues", tier: 3 },
  { id: "l-jpn-we", name: "WE League", slug: "we-league", countryId: "c-jpn", category: "Professional Leagues", tier: 1 },
  { id: "l-jpn-emperor", name: "Emperor's Cup", slug: "emperors-cup", countryId: "c-jpn", category: "Domestic Cups", tier: 1 },
  { id: "l-jpn-league", name: "J.League Cup", slug: "j-league-cup", countryId: "c-jpn", category: "Domestic Cups", tier: 2 },
  { id: "l-jpn-super", name: "Japanese Super Cup", slug: "japanese-super-cup", countryId: "c-jpn", category: "Domestic Cups", tier: 3 },

  // ============ SAUDI ARABIA ============
  { id: "l-sau-spl", name: "Saudi Pro League", slug: "saudi-pro-league", countryId: "c-sau", category: "Professional Leagues", tier: 1 },
  { id: "l-sau-first", name: "Saudi First Division", slug: "saudi-first-division", countryId: "c-sau", category: "Professional Leagues", tier: 2 },
  { id: "l-sau-king", name: "King Cup", slug: "kings-cup", countryId: "c-sau", category: "Domestic Cups", tier: 1 },
  { id: "l-sau-crown", name: "Crown Prince Cup", slug: "crown-prince-cup", countryId: "c-sau", category: "Domestic Cups", tier: 2 },
  { id: "l-sau-super", name: "Saudi Super Cup", slug: "saudi-super-cup", countryId: "c-sau", category: "Domestic Cups", tier: 3 },

  // ============ EGYPT ============
  { id: "l-egy-premier", name: "Egyptian Premier League", slug: "egyptian-premier-league", countryId: "c-egy", category: "Professional Leagues", tier: 1 },
  { id: "l-egy-second", name: "Egyptian Second Division", slug: "egyptian-second-division", countryId: "c-egy", category: "Professional Leagues", tier: 2 },
  { id: "l-egy-cup", name: "Egypt Cup", slug: "egypt-cup", countryId: "c-egy", category: "Domestic Cups", tier: 1 },
  { id: "l-egy-super", name: "Egyptian Super Cup", slug: "egyptian-super-cup", countryId: "c-egy", category: "Domestic Cups", tier: 2 },

  // ============ MOROCCO ============
  { id: "l-mar-botola", name: "Botola Pro", slug: "botola-pro", countryId: "c-mar", category: "Professional Leagues", tier: 1 },
  { id: "l-mar-botola2", name: "Botola 2", slug: "botola-2", countryId: "c-mar", category: "Professional Leagues", tier: 2 },
  { id: "l-mar-throne", name: "Throne Cup", slug: "throne-cup", countryId: "c-mar", category: "Domestic Cups", tier: 1 },
];

const MOCK_TEAMS: Team[] = [
  // MLS
  { id: "t-mia", name: "Inter Miami CF", slug: "inter-miami-cf", leagueId: "l-usa-mls", countryId: "c-usa", city: "Miami", type: "Club" },
  { id: "t-lafc", name: "LAFC", slug: "lafc", leagueId: "l-usa-mls", countryId: "c-usa", city: "Los Angeles", type: "Club" },
  // Premier League
  { id: "t-mci", name: "Manchester City", slug: "manchester-city", leagueId: "l-eng-pl", countryId: "c-eng", city: "Manchester", type: "Club" },
  { id: "t-liv", name: "Liverpool", slug: "liverpool", leagueId: "l-eng-pl", countryId: "c-eng", city: "Liverpool", type: "Club" },
  { id: "t-ars", name: "Arsenal", slug: "arsenal", leagueId: "l-eng-pl", countryId: "c-eng", city: "London", type: "Club" },
  // La Liga
  { id: "t-rma", name: "Real Madrid", slug: "real-madrid", leagueId: "l-esp-laliga", countryId: "c-esp", city: "Madrid", type: "Club" },
  { id: "t-bar", name: "Barcelona", slug: "barcelona", leagueId: "l-esp-laliga", countryId: "c-esp", city: "Barcelona", type: "Club" },
  // High School
  { id: "t-woodlands", name: "The Woodlands HS", slug: "the-woodlands-hs", leagueId: "l-usa-ncaa", countryId: "c-usa", city: "The Woodlands", type: "School" },
  // Pickup
  { id: "t-urban-soccer", name: "Urban Soccer Group", slug: "urban-soccer-group", leagueId: "l-usa-upsl", countryId: "c-usa", city: "Houston", type: "Pickup Group" },
];

const MOCK_MATCHES: Match[] = [
  {
    id: "m-1",
    leagueId: "l-eng-pl",
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

  async getCategories(countryId: string): Promise<LeagueCategory[]> {
    return [
      "Domestic Cups",
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

  async getLeaguesByTier(countryId: string, category: "league" | "cup"): Promise<League[]> {
    const leagues = MOCK_LEAGUES.filter(l => l.countryId === countryId);
    if (category === "cup") {
      return leagues.filter(l => l.category === "Domestic Cups").sort((a, b) => a.tier - b.tier);
    }
    return leagues.filter(l => l.category === "Professional Leagues").sort((a, b) => a.tier - b.tier);
  }

  async getLeague(id: string): Promise<League | null> {
    return MOCK_LEAGUES.find((l) => l.id === id) || null;
  }

  async getLeagueBySlug(slug: string): Promise<League | null> {
    return MOCK_LEAGUES.find((l) => l.slug === slug) || null;
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
