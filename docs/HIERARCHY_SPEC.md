# World Soccer Leagues - Hierarchy Specification

> Complete specification for the browsing/favorites hierarchy used across App UI, Admin Panel, and Grassroots API.

---

## Step 1: Drop-down Hierarchy Spec (Front-End Contract)

### Complete Hierarchy

```
World (Entry Point)
  └── Continent (6 continents)
        └── Country (200+ countries)
              ├── [State] (optional - for USA, Brazil, etc.)
              │     └── [City] (optional)
              └── League (within country)
                    └── Division (optional sub-groupings)
                          └── Team
                                └── Player
                                      └── Match (Fixture)
```

### Entity Definitions

---

#### 1. Continent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `code` | string | ✓ | Short code: "EUR", "NAM", "SAM", "AFR", "ASI", "OCE" |
| `name` | string | ✓ | Full name: "Europe", "North America", etc. |
| `slug` | string | ✓ | URL-safe: "europe", "north-america" |
| `flag` | string | | Flag emoji or URL |
| `isActive` | boolean | | Default: true |
| `sortOrder` | integer | | Display order (0 = first) |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: None (top of hierarchy)
- Children: Countries

**App Route:** `/continent/:slug`

---

#### 2. Country

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `continentId` | string | ✓ | FK to continents.id |
| `code` | string | ✓ | ISO 3166-1 alpha-2: "US", "GB", "DE" |
| `name` | string | ✓ | Full name: "United States", "Germany" |
| `slug` | string | ✓ | URL-safe: "usa", "germany" |
| `flag` | string | | Flag emoji or URL |
| `isActive` | boolean | | Default: true |
| `sortOrder` | integer | | Display order within continent |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: Continent (via `continentId`)
- Children: Leagues

**App Route:** `/country/:slug`

---

#### 3. State (Virtual/Inline - Not a separate table)

States are **not** stored as a separate entity. Instead, they are derived from `stateCode` fields on Teams and Venues.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `stateCode` | string (2 chars) | **Optional** | teams.stateCode, venues.stateCode | ISO 3166-2 subdivision code: "TX", "CA", "SC" |
| `stateName` | string | Derived | Lookup table | "Texas", "California", "South Carolina" |

**Canonical Identifier:** `stateCode` (2-letter code)

**Parent/Child:**
- Parent: Country (implicit via team/venue's country)
- Children: Cities (virtual grouping)

**Required/Optional per Country:**
- **USA, Brazil, Australia, Germany:** Recommended (large countries with state/province subdivisions)
- **Other countries:** Optional (many countries don't have meaningful state-level divisions)

**UI Behavior:**
- If `stateCode` is null/empty, team/venue appears directly under country
- State filter only appears in UI if at least one team/venue in that country has a `stateCode`

**API Behavior:**
- Submissions with missing `stateCode` are accepted (field is optional)
- When filtering by state, null values are excluded from state-based views

---

#### 4. City (Virtual/Inline - Not a separate table)

Cities are derived from `city` fields on Teams and Venues.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `city` | string | **Optional** | teams.city, venues.city | City name: "Charleston", "Los Angeles" |

**Canonical Identifier:** `city` (string, no normalization - case-sensitive match)

**Parent/Child:**
- Parent: State (if stateCode exists) or Country (if no stateCode)
- Children: Teams, Venues

**Required/Optional:**
- **Recommended for all:** Helps with local discovery and filtering
- **Not required:** Teams/venues without city appear in generic "Other" grouping

**UI Behavior:**
- City filter appears within state (or country if no state)
- If `city` is null/empty, team/venue appears in "Other" or ungrouped

**API Behavior:**
- Submissions with missing `city` are accepted (field is optional)
- City matching is case-sensitive ("Charleston" ≠ "charleston")

---

#### 5. League

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `countryId` | string | ✓ | FK to countries.id |
| `name` | string | ✓ | Full name: "Premier League", "Major League Soccer" |
| `slug` | string | ✓ | URL-safe: "premier-league", "mls" |
| `shortName` | string | | Abbreviation: "EPL", "MLS" |
| `logo` | string | | Logo URL |
| `type` | string | | **Canonical:** "professional", "college", "youth", "amateur", "pickup" |
| `tier` | integer | | 1 = top tier, 2 = second, etc. |
| `isActive` | boolean | | Default: true |
| `sortOrder` | integer | | Display order within country |
| `currentSeasonId` | string | | FK to current active season |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: Country (via `countryId`)
- Children: Divisions, Teams, Seasons

**App Route:** `/league/:id-:slug`

**Canonical League Types:**
```
professional  - Top-flight pro leagues (MLS, EPL, La Liga)
college       - NCAA, NAIA, etc.
youth         - Youth/junior leagues (includes high school)
amateur       - Adult recreational, semi-pro
pickup        - Informal/drop-in games
```

---

#### 6. Division (Optional)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `leagueId` | string | ✓ | FK to leagues.id |
| `name` | string | ✓ | "Division 1", "U-15 Boys", "Conference A" |
| `slug` | string | ✓ | URL-safe: "division-1", "u15-boys" |
| `tier` | integer | | 1 = top division within league |
| `isActive` | boolean | | Default: true |
| `sortOrder` | integer | | Display order |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: League (via `leagueId`)
- Children: Teams

**Note:** Divisions are optional. Teams can belong directly to a League.

---

#### 7. Team

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `leagueId` | string | | FK to leagues.id (optional if divisionId set) |
| `divisionId` | string | | FK to divisions.id (optional) |
| `name` | string | ✓ | "Charleston Battery", "Manchester United" |
| `slug` | string | ✓ | URL-safe: "charleston-battery" |
| `shortName` | string | | "Battery", "Man Utd" |
| `logo` | string | | Logo/crest URL |
| `venue` | string | | Home venue name (legacy string) |
| `city` | string | | City name: "Charleston" |
| `stateCode` | string | | State code: "SC", "TX" |
| `isActive` | boolean | | Default: true |
| `sortOrder` | integer | | Display order |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: League (via `leagueId`) or Division (via `divisionId`)
- Children: Players, Fixtures (as home/away team)

**App Route:** `/team/:id-:slug`

---

#### 8. Player

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable identifier |
| `teamId` | string | | FK to teams.id |
| `name` | string | ✓ | Full display name |
| `slug` | string | ✓ | URL-safe slug |
| `firstName` | string | | First name |
| `lastName` | string | | Last name |
| `nationality` | string | | Country code or name |
| `position` | string | | "GK", "DEF", "MID", "FWD" |
| `jerseyNumber` | integer | | Shirt number |
| `birthDate` | timestamp | | Date of birth |
| `height` | integer | | Height in cm |
| `weight` | integer | | Weight in kg |
| `photo` | string | | Photo URL |
| `isActive` | boolean | | Default: true |
| `extApiIds` | string[] | | External provider IDs |

**Parent/Child:**
- Parent: Team (via `teamId`)
- Children: None

**App Route:** `/player/:id-:slug`

---

### Required vs Optional Fields Summary

| Entity | Field | Required | Notes |
|--------|-------|----------|-------|
| **Continent** | `id` | auto | UUID, auto-generated |
| | `code` | ✓ Required | "EUR", "NAM", etc. |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe, unique |
| | `flag` | Optional | Emoji or URL |
| | `isActive` | Default true | |
| | `sortOrder` | Default 0 | |
| **Country** | `id` | auto | UUID, auto-generated |
| | `continentId` | ✓ Required | FK to continent |
| | `code` | ✓ Required | ISO 3166-1 alpha-2 |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe, unique |
| | `flag` | Optional | |
| **State** | `stateCode` | Optional | 2-letter code, derived from teams/venues |
| | `stateName` | Derived | Lookup from code |
| **City** | `city` | Optional | String, derived from teams/venues |
| **League** | `id` | auto | UUID, auto-generated |
| | `countryId` | ✓ Required | FK to country |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe, unique |
| | `shortName` | Optional | Abbreviation |
| | `logo` | Optional | URL |
| | `type` | Optional | Canonical type |
| | `tier` | Default 1 | |
| **Division** | `id` | auto | UUID, auto-generated |
| | `leagueId` | ✓ Required | FK to league |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe |
| | `tier` | Default 1 | |
| **Team** | `id` | auto | UUID, auto-generated |
| | `leagueId` | Conditional | Required if no divisionId |
| | `divisionId` | Conditional | Required if no leagueId |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe |
| | `shortName` | Optional | |
| | `logo` | Optional | |
| | `venue` | Optional | Home venue name |
| | `city` | Optional | For filtering |
| | `stateCode` | Optional | For filtering |
| **Player** | `id` | auto | UUID, auto-generated |
| | `teamId` | Optional | Can be unattached |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe |
| | `position` | Optional | GK/DEF/MID/FWD |
| **Venue** | `id` | auto | UUID, auto-generated |
| | `name` | ✓ Required | Display name |
| | `slug` | ✓ Required | URL-safe |
| | `address` | Optional | Street address |
| | `city` | Optional | |
| | `stateCode` | Optional | |
| | `countryId` | Optional | FK to country |
| | `capacity` | Optional | Seating |
| | `surface` | Optional | grass/turf/hybrid |

---

### Favorites Selection Hierarchy

When users select favorites, they use this simplified flow:

```
1. Select Continent (e.g., "North America")
      ↓
2. Select Country (e.g., "USA")
      ↓
3. Select League Type (e.g., "Professional", "College", "Youth")
      ↓
4. Select League (e.g., "MLS")
      ↓
5. Select Team (e.g., "Charleston Battery")
```

**Stored in `userPreferences`:**
- `selectedContinent`: string (continent slug)
- `favoriteLeagues`: string[] (array of league IDs)
- `favoriteTeams`: string[] (array of team IDs)

---

## Step 2: Canonical API / Database Schema

### Unified Schema Used By All Systems

The following entities are the **single source of truth** used by:
- **Admin Panel** - CRUD operations
- **App UI** - Read-only browsing
- **Grassroots API** - Submissions that promote into these tables
- **External APIs** - Data imports that populate these tables

```
┌─────────────────────────────────────────────────────────────────┐
│                     CANONICAL DATABASE TABLES                   │
├─────────────────────────────────────────────────────────────────┤
│  continents        │  id, code, name, slug, flag, isActive     │
│  countries         │  id, continentId, code, name, slug, flag  │
│  leagues           │  id, countryId, name, slug, type, tier    │
│  divisions         │  id, leagueId, name, slug, tier           │
│  teams             │  id, leagueId/divisionId, name, slug      │
│  players           │  id, teamId, name, slug, position         │
│  seasons           │  id, leagueId, name, startDate, endDate   │
│  fixtures          │  id, seasonId, homeTeamId, awayTeamId     │
│  standings         │  id, seasonId, teamId, points, position   │
│  venues            │  id, name, address, city, capacity        │
└─────────────────────────────────────────────────────────────────┘
```

### Example API Response: Country with Leagues

**Endpoint:** `GET /api/countries/usa`

```json
{
  "id": "c-usa-uuid",
  "continentId": "c-nam-uuid",
  "code": "US",
  "name": "United States",
  "slug": "usa",
  "flag": "🇺🇸",
  "isActive": true,
  "leagues": [
    {
      "id": "l-mls-uuid",
      "countryId": "c-usa-uuid",
      "name": "Major League Soccer",
      "slug": "mls",
      "shortName": "MLS",
      "logo": "https://...",
      "type": "professional",
      "tier": 1,
      "isActive": true
    },
    {
      "id": "l-uslc-uuid",
      "countryId": "c-usa-uuid",
      "name": "USL Championship",
      "slug": "usl-championship",
      "shortName": "USLC",
      "type": "professional",
      "tier": 2,
      "isActive": true
    }
  ]
}
```

### Example API Response: Team Details

**Endpoint:** `GET /api/teams/:id`

```json
{
  "id": "t-battery-uuid",
  "leagueId": "l-uslc-uuid",
  "divisionId": null,
  "name": "Charleston Battery",
  "slug": "charleston-battery",
  "shortName": "Battery",
  "logo": "https://...",
  "venue": "Patriots Point",
  "city": "Charleston",
  "stateCode": "SC",
  "isActive": true,
  "league": {
    "id": "l-uslc-uuid",
    "name": "USL Championship",
    "slug": "usl-championship",
    "type": "professional"
  },
  "country": {
    "id": "c-usa-uuid",
    "name": "United States",
    "code": "US"
  }
}
```

---

## Step 3: Mapping Layer (External + Grassroots)

### Provider Mapping Table

All external data is tracked via `providerMappings`:

```sql
providerMappings {
  id               UUID PRIMARY KEY
  providerName     TEXT    -- "sportmonks", "grassroots", "partner-{orgId}"
  providerEntityType ENUM  -- "continent", "country", "league", "team", "fixture"
  providerEntityId TEXT    -- External ID from provider
  internalEntityId UUID    -- Internal WSL entity ID
  providerEntityName TEXT  -- Name from provider (for debugging)
  rawPayload       JSONB   -- Original API response
  lastSyncedAt     TIMESTAMP
  isActive         BOOLEAN
}
```

### SportMonks → WSL Mapping Flow

```
┌──────────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│   SportMonks     │    │   Mapping Layer     │    │   WSL Database   │
│   API Response   │───▶│   (Translation)     │───▶│   Canonical      │
└──────────────────┘    └─────────────────────┘    └──────────────────┘

SportMonks:                       WSL:
{                                 {
  "id": 8,              ───▶       "id": "l-epl-uuid",
  "name": "Premier L",  ───▶       "name": "Premier League",
  "short_code": "EPL",  ───▶       "shortName": "EPL",
  "logo_path": "...",   ───▶       "logo": "...",
  "type": "league"      ───▶       "type": "professional"
}                                 }

Provider Mapping Created:
{
  "providerName": "sportmonks",
  "providerEntityType": "league",
  "providerEntityId": "8",
  "internalEntityId": "l-epl-uuid"
}
```

### SportMonks Field Mapping

| SportMonks Field | WSL Field | Notes |
|------------------|-----------|-------|
| `id` | stored in `providerMappings` | External ID |
| `name` | `name` | May need cleaning |
| `short_code` | `shortName` | Abbreviation |
| `logo_path` | `logo` | Full URL |
| `country_id` | `countryId` | Lookup via providerMappings |
| `type` | `type` | Map to canonical: "league" → "professional" |

### Grassroots/Partner → WSL Mapping Flow

```
┌──────────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│   Partner Portal │    │   Submission        │    │   WSL Database   │
│   or API         │───▶│   + Review          │───▶│   Canonical      │
└──────────────────┘    └─────────────────────┘    └──────────────────┘

Partner Submission:               Promoted Entity:
{                                 {
  "entityType": "league",          "id": "l-hcsl-uuid",
  "entityName": "Holy City SL", ───▶ "name": "Holy City SL",
  "slug": "holy-city-sl",          "slug": "holy-city-sl",
  "type": "adult_amateur",   ───▶  "type": "amateur",    // MAPPED
  "countryId": "c-usa-uuid",       "countryId": "c-usa-uuid",
  "stateCode": "SC",               "tier": 4,
  "tier": 4                        "isActive": true
}                                 }
```

### Grassroots Type Mapping (Canonical Enforcement)

| Submission Type | Canonical Type | Notes |
|-----------------|----------------|-------|
| `professional` | `professional` | Pass-through |
| `college` | `college` | Pass-through |
| `youth` | `youth` | Pass-through |
| `amateur` | `amateur` | Pass-through |
| `pickup` | `pickup` | Pass-through |
| `high_school` | `youth` | Mapped to canonical |
| `adult_amateur` | `amateur` | Mapped to canonical |
| (unknown) | `amateur` | Fallback default |

### Hierarchy Placement Example

**Scenario:** Partner submits a new amateur league in Charleston, SC

```
1. Partner submits:
   {
     "entityType": "league",
     "entityName": "Holy City Soccer League",
     "type": "adult_amateur",
     "countryId": "c-usa-uuid",
     "stateCode": "SC",
     "city": "Charleston"
   }

2. Admin reviews & approves

3. Promotion creates:
   leagues: {
     "id": "l-hcsl-uuid",
     "countryId": "c-usa-uuid",     // USA
     "name": "Holy City Soccer League",
     "type": "amateur",              // Mapped from adult_amateur
     "tier": 4,
     "isActive": true
   }

4. App hierarchy shows:
   World → North America → USA → Amateur → Holy City Soccer League
```

---

## Alignment Confirmation

### Systems Using Canonical Schema

| System | Reads From | Writes To | Notes |
|--------|------------|-----------|-------|
| **App UI** | Canonical tables | userPreferences only | Read-only for soccer data |
| **Admin Panel** | Canonical tables | Canonical tables | Full CRUD |
| **Grassroots API** | grassrootsSubmissions | grassrootsSubmissions → Canonical | Via promotion |
| **SportMonks Sync** | External API | Canonical tables | Via provider mappings |

### Field Name Consistency

All systems use identical field names:

| Field | Continents | Countries | Leagues | Teams | Venues |
|-------|------------|-----------|---------|-------|--------|
| `id` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `name` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `slug` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `isActive` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `sortOrder` | ✓ | ✓ | ✓ | ✓ | - |
| `extApiIds` | ✓ | ✓ | ✓ | ✓ | ✓ |

### ID Generation

All internal IDs are **UUIDs** generated by PostgreSQL:
```sql
id: varchar("id").primaryKey().default(sql`gen_random_uuid()`)
```

External provider IDs are stored in:
- `extApiIds` array on entities (quick lookup)
- `providerMappings` table (detailed mapping with raw payload)

---

## Summary

1. **Hierarchy is fixed:** World → Continent → Country → [State] → [City] → League → [Division] → Team → Player
2. **State/City are virtual:** Derived from `stateCode` and `city` fields on Teams/Venues
3. **Canonical schema is the single source:** Admin Panel, App UI, and Grassroots API all read/write the same tables
4. **Type mapping enforces canonical values:** Grassroots types like `high_school` → `youth`, `adult_amateur` → `amateur`
5. **Provider mappings track external IDs:** SportMonks IDs, Partner org IDs all map to internal UUIDs
