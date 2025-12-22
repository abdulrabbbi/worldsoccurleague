export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  logo?: string;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  level: number;
  gender: "male" | "female" | "mixed";
  teams: Team[];
}

export const nationalTeams: { men: Team[]; women: Team[] } = {
  men: [
    { id: "usmnt", name: "U.S. Men's National Team", shortName: "USMNT", city: "Chicago", state: "IL" },
    { id: "usmnt-u23", name: "U.S. Men's U-23", shortName: "U-23 MNT", city: "Chicago", state: "IL" },
    { id: "usmnt-u20", name: "U.S. Men's U-20", shortName: "U-20 MNT", city: "Chicago", state: "IL" },
    { id: "usmnt-u17", name: "U.S. Men's U-17", shortName: "U-17 MNT", city: "Chicago", state: "IL" },
  ],
  women: [
    { id: "uswnt", name: "U.S. Women's National Team", shortName: "USWNT", city: "Chicago", state: "IL" },
    { id: "uswnt-u23", name: "U.S. Women's U-23", shortName: "U-23 WNT", city: "Chicago", state: "IL" },
    { id: "uswnt-u20", name: "U.S. Women's U-20", shortName: "U-20 WNT", city: "Chicago", state: "IL" },
    { id: "uswnt-u17", name: "U.S. Women's U-17", shortName: "U-17 WNT", city: "Chicago", state: "IL" },
  ],
};

export const mlsTeams: Team[] = [
  { id: "atl-utd", name: "Atlanta United FC", shortName: "Atlanta", city: "Atlanta", state: "GA" },
  { id: "austin-fc", name: "Austin FC", shortName: "Austin", city: "Austin", state: "TX" },
  { id: "charlotte-fc", name: "Charlotte FC", shortName: "Charlotte", city: "Charlotte", state: "NC" },
  { id: "chi-fire", name: "Chicago Fire FC", shortName: "Chicago", city: "Chicago", state: "IL" },
  { id: "fc-cin", name: "FC Cincinnati", shortName: "Cincinnati", city: "Cincinnati", state: "OH" },
  { id: "col-rapids", name: "Colorado Rapids", shortName: "Colorado", city: "Commerce City", state: "CO" },
  { id: "columbus-crew", name: "Columbus Crew", shortName: "Columbus", city: "Columbus", state: "OH" },
  { id: "fc-dallas", name: "FC Dallas", shortName: "Dallas", city: "Frisco", state: "TX" },
  { id: "dc-united", name: "D.C. United", shortName: "D.C.", city: "Washington", state: "DC" },
  { id: "hou-dynamo", name: "Houston Dynamo FC", shortName: "Houston", city: "Houston", state: "TX" },
  { id: "inter-miami", name: "Inter Miami CF", shortName: "Miami", city: "Fort Lauderdale", state: "FL" },
  { id: "la-galaxy", name: "LA Galaxy", shortName: "LA Galaxy", city: "Carson", state: "CA" },
  { id: "lafc", name: "Los Angeles FC", shortName: "LAFC", city: "Los Angeles", state: "CA" },
  { id: "min-utd", name: "Minnesota United FC", shortName: "Minnesota", city: "Saint Paul", state: "MN" },
  { id: "cf-montreal", name: "CF Montréal", shortName: "Montréal", city: "Montréal", state: "QC" },
  { id: "nash-sc", name: "Nashville SC", shortName: "Nashville", city: "Nashville", state: "TN" },
  { id: "ne-rev", name: "New England Revolution", shortName: "New England", city: "Foxborough", state: "MA" },
  { id: "nycfc", name: "New York City FC", shortName: "NYCFC", city: "New York", state: "NY" },
  { id: "ny-red-bulls", name: "New York Red Bulls", shortName: "NY Red Bulls", city: "Harrison", state: "NJ" },
  { id: "orl-city", name: "Orlando City SC", shortName: "Orlando", city: "Orlando", state: "FL" },
  { id: "phi-union", name: "Philadelphia Union", shortName: "Philadelphia", city: "Chester", state: "PA" },
  { id: "por-timbers", name: "Portland Timbers", shortName: "Portland", city: "Portland", state: "OR" },
  { id: "real-sl", name: "Real Salt Lake", shortName: "RSL", city: "Sandy", state: "UT" },
  { id: "sj-earthquakes", name: "San Jose Earthquakes", shortName: "San Jose", city: "San Jose", state: "CA" },
  { id: "sea-sounders", name: "Seattle Sounders FC", shortName: "Seattle", city: "Seattle", state: "WA" },
  { id: "sporting-kc", name: "Sporting Kansas City", shortName: "SKC", city: "Kansas City", state: "KS" },
  { id: "stl-city", name: "St. Louis City SC", shortName: "St. Louis", city: "St. Louis", state: "MO" },
  { id: "tor-fc", name: "Toronto FC", shortName: "Toronto", city: "Toronto", state: "ON" },
  { id: "van-whitecaps", name: "Vancouver Whitecaps FC", shortName: "Vancouver", city: "Vancouver", state: "BC" },
];

export const nwslTeams: Team[] = [
  { id: "ang-city", name: "Angel City FC", shortName: "Angel City", city: "Los Angeles", state: "CA" },
  { id: "bay-fc", name: "Bay FC", shortName: "Bay FC", city: "San Francisco", state: "CA" },
  { id: "chi-red-stars", name: "Chicago Red Stars", shortName: "Chicago", city: "Chicago", state: "IL" },
  { id: "hou-dash", name: "Houston Dash", shortName: "Houston", city: "Houston", state: "TX" },
  { id: "kc-current", name: "Kansas City Current", shortName: "KC Current", city: "Kansas City", state: "MO" },
  { id: "nj-ny-gotham", name: "NJ/NY Gotham FC", shortName: "Gotham", city: "Harrison", state: "NJ" },
  { id: "nc-courage", name: "North Carolina Courage", shortName: "NC Courage", city: "Cary", state: "NC" },
  { id: "orl-pride", name: "Orlando Pride", shortName: "Orlando", city: "Orlando", state: "FL" },
  { id: "por-thorns", name: "Portland Thorns FC", shortName: "Portland", city: "Portland", state: "OR" },
  { id: "racing-lou", name: "Racing Louisville FC", shortName: "Racing Lou", city: "Louisville", state: "KY" },
  { id: "sd-wave", name: "San Diego Wave FC", shortName: "SD Wave", city: "San Diego", state: "CA" },
  { id: "sea-reign", name: "Seattle Reign FC", shortName: "Seattle", city: "Seattle", state: "WA" },
  { id: "utah-royals", name: "Utah Royals FC", shortName: "Utah", city: "Sandy", state: "UT" },
  { id: "wsh-spirit", name: "Washington Spirit", shortName: "Washington", city: "Washington", state: "DC" },
];

export const uslChampionshipTeams: Team[] = [
  { id: "uslc-birmingham", name: "Birmingham Legion FC", shortName: "Birmingham", city: "Birmingham", state: "AL" },
  { id: "uslc-charleston", name: "Charleston Battery", shortName: "Charleston", city: "Charleston", state: "SC" },
  { id: "uslc-colorado-springs", name: "Colorado Springs Switchbacks FC", shortName: "CO Springs", city: "Colorado Springs", state: "CO" },
  { id: "uslc-detroit", name: "Detroit City FC", shortName: "Detroit", city: "Detroit", state: "MI" },
  { id: "uslc-el-paso", name: "El Paso Locomotive FC", shortName: "El Paso", city: "El Paso", state: "TX" },
  { id: "uslc-hartford", name: "Hartford Athletic", shortName: "Hartford", city: "Hartford", state: "CT" },
  { id: "uslc-indy", name: "Indy Eleven", shortName: "Indy", city: "Indianapolis", state: "IN" },
  { id: "uslc-las-vegas", name: "Las Vegas Lights FC", shortName: "Las Vegas", city: "Las Vegas", state: "NV" },
  { id: "uslc-loudoun", name: "Loudoun United FC", shortName: "Loudoun", city: "Leesburg", state: "VA" },
  { id: "uslc-louisville", name: "Louisville City FC", shortName: "Louisville", city: "Louisville", state: "KY" },
  { id: "uslc-memphis", name: "Memphis 901 FC", shortName: "Memphis", city: "Memphis", state: "TN" },
  { id: "uslc-miami", name: "Miami FC", shortName: "Miami FC", city: "Miami", state: "FL" },
  { id: "uslc-monterey", name: "Monterey Bay FC", shortName: "Monterey Bay", city: "Seaside", state: "CA" },
  { id: "uslc-new-mexico", name: "New Mexico United", shortName: "New Mexico", city: "Albuquerque", state: "NM" },
  { id: "uslc-oakland", name: "Oakland Roots SC", shortName: "Oakland", city: "Oakland", state: "CA" },
  { id: "uslc-orange-county", name: "Orange County SC", shortName: "Orange County", city: "Irvine", state: "CA" },
  { id: "uslc-phoenix", name: "Phoenix Rising FC", shortName: "Phoenix", city: "Phoenix", state: "AZ" },
  { id: "uslc-pittsburgh", name: "Pittsburgh Riverhounds SC", shortName: "Pittsburgh", city: "Pittsburgh", state: "PA" },
  { id: "uslc-rhode-island", name: "Rhode Island FC", shortName: "Rhode Island", city: "Smithfield", state: "RI" },
  { id: "uslc-sacramento", name: "Sacramento Republic FC", shortName: "Sacramento", city: "Sacramento", state: "CA" },
  { id: "uslc-san-antonio", name: "San Antonio FC", shortName: "San Antonio", city: "San Antonio", state: "TX" },
  { id: "uslc-tampa-bay", name: "Tampa Bay Rowdies", shortName: "Tampa Bay", city: "St. Petersburg", state: "FL" },
  { id: "uslc-tulsa", name: "FC Tulsa", shortName: "Tulsa", city: "Tulsa", state: "OK" },
];

export const uslLeagueOneTeams: Team[] = [
  { id: "usl1-central-valley", name: "Central Valley Fuego FC", shortName: "Central Valley", city: "Fresno", state: "CA" },
  { id: "usl1-charlotte", name: "Charlotte Independence", shortName: "Charlotte", city: "Charlotte", state: "NC" },
  { id: "usl1-chattanooga", name: "Chattanooga Red Wolves SC", shortName: "Chattanooga", city: "Chattanooga", state: "TN" },
  { id: "usl1-forward-madison", name: "Forward Madison FC", shortName: "Madison", city: "Madison", state: "WI" },
  { id: "usl1-greenville", name: "Greenville Triumph SC", shortName: "Greenville", city: "Greenville", state: "SC" },
  { id: "usl1-lexington", name: "Lexington SC", shortName: "Lexington", city: "Lexington", state: "KY" },
  { id: "usl1-northern-colorado", name: "Northern Colorado Hailstorm FC", shortName: "N. Colorado", city: "Windsor", state: "CO" },
  { id: "usl1-omaha", name: "Union Omaha", shortName: "Omaha", city: "Omaha", state: "NE" },
  { id: "usl1-one-knoxville", name: "One Knoxville SC", shortName: "Knoxville", city: "Knoxville", state: "TN" },
  { id: "usl1-richmond", name: "Richmond Kickers", shortName: "Richmond", city: "Richmond", state: "VA" },
  { id: "usl1-spokane", name: "Spokane Velocity FC", shortName: "Spokane", city: "Spokane", state: "WA" },
  { id: "usl1-tormenta", name: "South Georgia Tormenta FC", shortName: "Tormenta", city: "Statesboro", state: "GA" },
];

export const mlsNextProTeams: Team[] = [
  { id: "mlsnp-atl2", name: "Atlanta United 2", shortName: "ATL UTD 2", city: "Atlanta", state: "GA" },
  { id: "mlsnp-austin2", name: "Austin FC II", shortName: "Austin II", city: "Austin", state: "TX" },
  { id: "mlsnp-carolina", name: "Carolina Core FC", shortName: "Carolina", city: "High Point", state: "NC" },
  { id: "mlsnp-chi2", name: "Chicago Fire FC II", shortName: "Chicago II", city: "Chicago", state: "IL" },
  { id: "mlsnp-cin2", name: "FC Cincinnati 2", shortName: "Cincy II", city: "Cincinnati", state: "OH" },
  { id: "mlsnp-col2", name: "Colorado Rapids 2", shortName: "Colorado II", city: "Commerce City", state: "CO" },
  { id: "mlsnp-columbus2", name: "Columbus Crew 2", shortName: "Crew 2", city: "Columbus", state: "OH" },
  { id: "mlsnp-crown-legacy", name: "Crown Legacy FC", shortName: "Crown Legacy", city: "Matthews", state: "NC" },
  { id: "mlsnp-dallas2", name: "North Texas SC", shortName: "North Texas", city: "Frisco", state: "TX" },
  { id: "mlsnp-hou2", name: "Houston Dynamo 2", shortName: "Houston II", city: "Houston", state: "TX" },
  { id: "mlsnp-huntsville", name: "Huntsville City FC", shortName: "Huntsville", city: "Huntsville", state: "AL" },
  { id: "mlsnp-inter2", name: "Inter Miami CF II", shortName: "Miami II", city: "Fort Lauderdale", state: "FL" },
  { id: "mlsnp-lag2", name: "LA Galaxy II", shortName: "Galaxy II", city: "Carson", state: "CA" },
  { id: "mlsnp-lafc2", name: "LAFC2", shortName: "LAFC2", city: "Los Angeles", state: "CA" },
  { id: "mlsnp-min2", name: "Minnesota United FC 2", shortName: "MNUFC2", city: "Blaine", state: "MN" },
  { id: "mlsnp-nash2", name: "Huntsville City FC", shortName: "Huntsville", city: "Huntsville", state: "AL" },
  { id: "mlsnp-ne2", name: "New England Revolution II", shortName: "Revs II", city: "Foxborough", state: "MA" },
  { id: "mlsnp-nycfc2", name: "New York City FC II", shortName: "NYCFC II", city: "New York", state: "NY" },
  { id: "mlsnp-nyrb2", name: "New York Red Bulls II", shortName: "NYRB II", city: "Harrison", state: "NJ" },
  { id: "mlsnp-orl2", name: "Orlando City B", shortName: "Orlando B", city: "Orlando", state: "FL" },
  { id: "mlsnp-phi2", name: "Philadelphia Union II", shortName: "Union II", city: "Chester", state: "PA" },
  { id: "mlsnp-por2", name: "Portland Timbers 2", shortName: "T2", city: "Portland", state: "OR" },
  { id: "mlsnp-rsl2", name: "Real Monarchs", shortName: "Monarchs", city: "Herriman", state: "UT" },
  { id: "mlsnp-sj2", name: "San Jose Earthquakes II", shortName: "Quakes II", city: "San Jose", state: "CA" },
  { id: "mlsnp-sea2", name: "Tacoma Defiance", shortName: "Tacoma", city: "Tacoma", state: "WA" },
  { id: "mlsnp-skc2", name: "Sporting Kansas City II", shortName: "SKC II", city: "Kansas City", state: "KS" },
  { id: "mlsnp-stl2", name: "St. Louis City SC 2", shortName: "STL II", city: "St. Louis", state: "MO" },
  { id: "mlsnp-tor2", name: "Toronto FC II", shortName: "TFC II", city: "Toronto", state: "ON" },
  { id: "mlsnp-van2", name: "Vancouver Whitecaps FC 2", shortName: "Whitecaps 2", city: "Langley", state: "BC" },
];

export const uslLeagueTwoTeams: Team[] = [
  { id: "usl2-albany", name: "Albany Rush", shortName: "Albany", city: "Albany", state: "NY" },
  { id: "usl2-asheville", name: "Asheville City SC", shortName: "Asheville", city: "Asheville", state: "NC" },
  { id: "usl2-austin", name: "Austin United", shortName: "Austin", city: "Austin", state: "TX" },
  { id: "usl2-ball-state", name: "Flint City Bucks", shortName: "Flint City", city: "Flint", state: "MI" },
  { id: "usl2-brooklyn", name: "Brooklyn FC", shortName: "Brooklyn", city: "Brooklyn", state: "NY" },
  { id: "usl2-cleveland", name: "Cleveland Force SC", shortName: "Cleveland", city: "Cleveland", state: "OH" },
  { id: "usl2-dayton", name: "Dayton Dutch Lions", shortName: "Dayton", city: "Dayton", state: "OH" },
  { id: "usl2-denton", name: "Denton Diablos", shortName: "Denton", city: "Denton", state: "TX" },
  { id: "usl2-des-moines", name: "Des Moines Menace", shortName: "Des Moines", city: "Des Moines", state: "IA" },
  { id: "usl2-florida-elite", name: "Florida Elite Soccer Academy", shortName: "Florida Elite", city: "Tampa", state: "FL" },
  { id: "usl2-kalamazoo", name: "Kalamazoo FC", shortName: "Kalamazoo", city: "Kalamazoo", state: "MI" },
  { id: "usl2-lane", name: "Lane United FC", shortName: "Lane", city: "Eugene", state: "OR" },
  { id: "usl2-lionsbridge", name: "Lionsbridge FC", shortName: "Lionsbridge", city: "Williamsburg", state: "VA" },
  { id: "usl2-long-island", name: "Long Island Rough Riders", shortName: "Long Island", city: "Stony Brook", state: "NY" },
  { id: "usl2-ocean-city", name: "Ocean City Nor'easters", shortName: "Ocean City", city: "Ocean City", state: "NJ" },
  { id: "usl2-path-valley", name: "Patuxent FC", shortName: "Patuxent", city: "Hollywood", state: "MD" },
  { id: "usl2-reading", name: "Reading United AC", shortName: "Reading", city: "Reading", state: "PA" },
  { id: "usl2-sandusky", name: "SandBarons FC", shortName: "SandBarons", city: "Sandusky", state: "OH" },
  { id: "usl2-seacoast", name: "Seacoast United Phantoms", shortName: "Seacoast", city: "Hampton", state: "NH" },
  { id: "usl2-south-bend", name: "South Bend Lions FC", shortName: "South Bend", city: "South Bend", state: "IN" },
  { id: "usl2-tri-cities", name: "Tri-Cities Otters", shortName: "Tri-Cities", city: "Kennewick", state: "WA" },
  { id: "usl2-ventura", name: "Ventura County FC", shortName: "Ventura", city: "Ventura", state: "CA" },
  { id: "usl2-westchester", name: "Westchester Flames", shortName: "Westchester", city: "White Plains", state: "NY" },
];

export const professionalLeagues: League[] = [
  {
    id: "mls",
    name: "Major League Soccer",
    shortName: "MLS",
    level: 1,
    gender: "male",
    teams: mlsTeams,
  },
  {
    id: "nwsl",
    name: "National Women's Soccer League",
    shortName: "NWSL",
    level: 1,
    gender: "female",
    teams: nwslTeams,
  },
  {
    id: "usl-championship",
    name: "USL Championship",
    shortName: "USL-C",
    level: 2,
    gender: "male",
    teams: uslChampionshipTeams,
  },
  {
    id: "mls-next-pro",
    name: "MLS Next Pro",
    shortName: "MLS NP",
    level: 3,
    gender: "male",
    teams: mlsNextProTeams,
  },
  {
    id: "usl-league-one",
    name: "USL League One",
    shortName: "USL1",
    level: 3,
    gender: "male",
    teams: uslLeagueOneTeams,
  },
  {
    id: "usl-league-two",
    name: "USL League Two",
    shortName: "USL2",
    level: 4,
    gender: "male",
    teams: uslLeagueTwoTeams,
  },
];

export function getLeagueById(id: string): League | undefined {
  return professionalLeagues.find(league => league.id === id);
}

export function getTeamById(teamId: string): Team | undefined {
  for (const league of professionalLeagues) {
    const team = league.teams.find(t => t.id === teamId);
    if (team) return team;
  }
  const menTeam = nationalTeams.men.find(t => t.id === teamId);
  if (menTeam) return menTeam;
  const womenTeam = nationalTeams.women.find(t => t.id === teamId);
  if (womenTeam) return womenTeam;
  return undefined;
}

export function getTeamsByState(stateCode: string): Team[] {
  const teams: Team[] = [];
  for (const league of professionalLeagues) {
    teams.push(...league.teams.filter(t => t.state === stateCode));
  }
  return teams;
}
