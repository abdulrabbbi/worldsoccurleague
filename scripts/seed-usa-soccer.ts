import { db } from "../server/db";
import { countries, leagues, teams, seasons, continents } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedUSASoccer() {
  console.log("Seeding USA Soccer entities...");

  let usaCountry = await db.select().from(countries).where(eq(countries.code, "USA")).then(r => r[0]);
  
  if (!usaCountry) {
    let northAmerica = await db.select().from(continents).where(eq(continents.slug, "north-america")).then(r => r[0]);
    
    if (!northAmerica) {
      const [continent] = await db.insert(continents).values({
        code: "NA",
        name: "North America",
        slug: "north-america",
      }).returning();
      northAmerica = continent;
      console.log("Created North America continent");
    }

    const [country] = await db.insert(countries).values({
      continentId: northAmerica.id,
      code: "USA",
      name: "United States",
      slug: "united-states",
      flag: "🇺🇸",
    }).returning();
    usaCountry = country;
    console.log("Created USA country");
  }

  const usaSoccerLeagues = [
    { name: "Major League Soccer", slug: "mls", shortName: "MLS", type: "professional", tier: 1, format: "league", gender: "male" },
    { name: "National Women's Soccer League", slug: "nwsl", shortName: "NWSL", type: "professional", tier: 1, format: "league", gender: "female" },
    { name: "USL Championship", slug: "usl-championship", shortName: "USLC", type: "professional", tier: 2, format: "league", gender: "male" },
    { name: "USL League One", slug: "usl-league-one", shortName: "USL1", type: "semi_pro", tier: 3, format: "league", gender: "male" },
    { name: "MLS NEXT Pro", slug: "mls-next-pro", shortName: "MLS NP", type: "semi_pro", tier: 3, format: "league", gender: "male" },
    { name: "USL League Two", slug: "usl-league-two", shortName: "USL2", type: "semi_pro", tier: 4, format: "league", gender: "male" },
    { name: "United Premier Soccer League", slug: "upsl", shortName: "UPSL", type: "semi_pro", tier: 4, format: "league", gender: "male" },
    { name: "National Premier Soccer League", slug: "npsl", shortName: "NPSL", type: "semi_pro", tier: 4, format: "league", gender: "male" },
    { name: "Lamar Hunt U.S. Open Cup", slug: "us-open-cup", shortName: "US Open Cup", type: "cup", tier: 1, format: "cup", gender: "male" },
    { name: "NWSL Challenge Cup", slug: "nwsl-challenge-cup", shortName: "Challenge Cup", type: "cup", tier: 1, format: "cup", gender: "female" },
    { name: "Supporters' Shield", slug: "supporters-shield", shortName: "Shield", type: "cup", tier: 1, format: "tournament", gender: "male" },
    { name: "MLS Cup", slug: "mls-cup", shortName: "MLS Cup", type: "cup", tier: 1, format: "cup", gender: "male" },
    { name: "NCAA Division I Men's Soccer", slug: "ncaa-d1-mens", shortName: "NCAA D1 M", type: "college", tier: 1, format: "league", gender: "male" },
    { name: "NCAA Division I Women's Soccer", slug: "ncaa-d1-womens", shortName: "NCAA D1 W", type: "college", tier: 1, format: "league", gender: "female" },
    { name: "NCAA Division II Men's Soccer", slug: "ncaa-d2-mens", shortName: "NCAA D2 M", type: "college", tier: 2, format: "league", gender: "male" },
    { name: "NCAA Division III Men's Soccer", slug: "ncaa-d3-mens", shortName: "NCAA D3 M", type: "college", tier: 3, format: "league", gender: "male" },
    { name: "USA National Team Competitions", slug: "usa-national-teams", shortName: "USA NT", type: "national_team_competition", tier: 1, format: "league", gender: "male" },
    { name: "CONCACAF Gold Cup", slug: "concacaf-gold-cup", shortName: "Gold Cup", type: "cup", tier: 1, format: "tournament", gender: "male" },
    { name: "CONCACAF Nations League", slug: "concacaf-nations-league", shortName: "CNL", type: "cup", tier: 1, format: "league", gender: "male" },
  ];

  const createdLeagues: Record<string, string> = {};

  for (const leagueData of usaSoccerLeagues) {
    const existing = await db.select().from(leagues).where(eq(leagues.slug, leagueData.slug)).then(r => r[0]);
    if (!existing) {
      const [league] = await db.insert(leagues).values({
        countryId: usaCountry.id,
        name: leagueData.name,
        slug: leagueData.slug,
        shortName: leagueData.shortName,
        type: leagueData.type,
        tier: leagueData.tier,
        format: leagueData.format,
        gender: leagueData.gender,
      }).returning();
      createdLeagues[leagueData.slug] = league.id;
      console.log(`Created league: ${leagueData.name}`);
    } else {
      createdLeagues[leagueData.slug] = existing.id;
      console.log(`League already exists: ${leagueData.name}`);
    }
  }

  const mlsTeams = [
    { name: "Atlanta United FC", shortName: "ATL", city: "Atlanta", stateCode: "GA" },
    { name: "Austin FC", shortName: "ATX", city: "Austin", stateCode: "TX" },
    { name: "Charlotte FC", shortName: "CLT", city: "Charlotte", stateCode: "NC" },
    { name: "Chicago Fire FC", shortName: "CHI", city: "Chicago", stateCode: "IL" },
    { name: "FC Cincinnati", shortName: "CIN", city: "Cincinnati", stateCode: "OH" },
    { name: "Colorado Rapids", shortName: "COL", city: "Commerce City", stateCode: "CO" },
    { name: "Columbus Crew", shortName: "CLB", city: "Columbus", stateCode: "OH" },
    { name: "FC Dallas", shortName: "DAL", city: "Frisco", stateCode: "TX" },
    { name: "D.C. United", shortName: "DC", city: "Washington", stateCode: "DC" },
    { name: "Houston Dynamo FC", shortName: "HOU", city: "Houston", stateCode: "TX" },
    { name: "Sporting Kansas City", shortName: "SKC", city: "Kansas City", stateCode: "KS" },
    { name: "LA Galaxy", shortName: "LA", city: "Carson", stateCode: "CA" },
    { name: "Los Angeles FC", shortName: "LAFC", city: "Los Angeles", stateCode: "CA" },
    { name: "Inter Miami CF", shortName: "MIA", city: "Fort Lauderdale", stateCode: "FL" },
    { name: "Minnesota United FC", shortName: "MIN", city: "Saint Paul", stateCode: "MN" },
    { name: "CF Montréal", shortName: "MTL", city: "Montréal", stateCode: "QC" },
    { name: "Nashville SC", shortName: "NSH", city: "Nashville", stateCode: "TN" },
    { name: "New England Revolution", shortName: "NE", city: "Foxborough", stateCode: "MA" },
    { name: "New York City FC", shortName: "NYC", city: "New York", stateCode: "NY" },
    { name: "New York Red Bulls", shortName: "RBNY", city: "Harrison", stateCode: "NJ" },
    { name: "Orlando City SC", shortName: "ORL", city: "Orlando", stateCode: "FL" },
    { name: "Philadelphia Union", shortName: "PHI", city: "Chester", stateCode: "PA" },
    { name: "Portland Timbers", shortName: "POR", city: "Portland", stateCode: "OR" },
    { name: "Real Salt Lake", shortName: "RSL", city: "Sandy", stateCode: "UT" },
    { name: "San Jose Earthquakes", shortName: "SJ", city: "San Jose", stateCode: "CA" },
    { name: "Seattle Sounders FC", shortName: "SEA", city: "Seattle", stateCode: "WA" },
    { name: "St. Louis City SC", shortName: "STL", city: "St. Louis", stateCode: "MO" },
    { name: "Toronto FC", shortName: "TOR", city: "Toronto", stateCode: "ON" },
    { name: "Vancouver Whitecaps FC", shortName: "VAN", city: "Vancouver", stateCode: "BC" },
  ];

  const mlsLeagueId = createdLeagues["mls"];
  if (mlsLeagueId) {
    for (const teamData of mlsTeams) {
      const slug = teamData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const existing = await db.select().from(teams).where(eq(teams.slug, slug)).then(r => r[0]);
      if (!existing) {
        await db.insert(teams).values({
          leagueId: mlsLeagueId,
          countryId: usaCountry.id,
          teamType: "club",
          name: teamData.name,
          slug,
          shortName: teamData.shortName,
          city: teamData.city,
          stateCode: teamData.stateCode,
        });
        console.log(`Created team: ${teamData.name}`);
      }
    }
  }

  const nationalTeams = [
    { name: "United States Men's National Team", shortName: "USMNT", slug: "usmnt", gender: "male" },
    { name: "United States Women's National Team", shortName: "USWNT", slug: "uswnt", gender: "female" },
    { name: "United States U-23 Men's National Team", shortName: "USMNT U-23", slug: "usmnt-u23", gender: "male" },
    { name: "United States U-20 Men's National Team", shortName: "USMNT U-20", slug: "usmnt-u20", gender: "male" },
    { name: "United States U-17 Men's National Team", shortName: "USMNT U-17", slug: "usmnt-u17", gender: "male" },
  ];

  for (const ntData of nationalTeams) {
    const existing = await db.select().from(teams).where(eq(teams.slug, ntData.slug)).then(r => r[0]);
    if (!existing) {
      await db.insert(teams).values({
        countryId: usaCountry.id,
        teamType: "national",
        name: ntData.name,
        slug: ntData.slug,
        shortName: ntData.shortName,
      });
      console.log(`Created national team: ${ntData.name}`);
    }
  }

  if (mlsLeagueId) {
    const seasonData = { name: "MLS 2025", slug: "mls-2025", leagueId: mlsLeagueId, isCurrent: true };
    const existing = await db.select().from(seasons).where(eq(seasons.slug, seasonData.slug)).then(r => r[0]);
    if (!existing) {
      await db.insert(seasons).values(seasonData);
      console.log(`Created season: ${seasonData.name}`);
    }
  }

  console.log("USA Soccer seeding complete!");
}

seedUSASoccer()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
