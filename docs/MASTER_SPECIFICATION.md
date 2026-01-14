# World Soccer Leagues - Master Specification

> Admin Panel, API & Data Architecture Alignment

**Version:** 1.0  
**Status:** Canonical Reference  
**Last Updated:** January 2026

---

## Table of Contents

1. [Canonical Data Contract](#1-canonical-data-contract)
2. [UI → Data Mapping](#2-ui--data-mapping)
3. [Grassroots Submission & Promotion Rules](#3-grassroots-submission--promotion-rules)
4. [Provider Mapping Specification](#4-provider-mapping-specification)
5. [End-to-End Validation Scenarios](#5-end-to-end-validation-scenarios)
6. [Schema Freeze Confirmation](#6-schema-freeze-confirmation)
7. [Multi-Sport Architecture](#7-multi-sport-architecture)

---

## 1. Canonical Data Contract

### Architecture Principle

**All systems write to and read from the same canonical entities.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANONICAL DATABASE TABLES                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  sports     │ continents │ countries │ leagues │ teams │ venues │ players  │
│  fixtures   │ divisions  │ seasons   │ standings │ organizations           │
│  grassrootsSubmissions   │ providerMappings                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
    ┌──────┴──────┐          ┌──────┴──────┐          ┌──────┴──────┐
    │ Admin Panel │          │ Grassroots  │          │ SportMonks  │
    │   (CRUD)    │          │     API     │          │    Sync     │
    └─────────────┘          └─────────────┘          └─────────────┘
```

---

### Entity: Sport

The sports table is the root-level lookup for multi-sport support. Soccer is the default/primary sport.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `code` | varchar(20) | ✓ | Sport code: "soccer", "nfl", "nba", "mlb", "nhl" |
| `name` | text | ✓ | Full name: "Soccer", "NFL Football" |
| `slug` | text | ✓ | URL-safe, unique: "soccer", "nfl" |
| `icon` | text | Optional | Emoji or icon URL |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order (default: 0, soccer = 0) |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** None → Leagues (via sportId)

**Default Sports:**
- `soccer` (code: "soccer", sortOrder: 0) - Primary sport, default
- `nfl` (code: "nfl") - NFL Football
- `nba` (code: "nba") - NBA Basketball
- `mlb` (code: "mlb") - MLB Baseball
- `nhl` (code: "nhl") - NHL Hockey

**Example JSON:**
```json
{
  "id": "sport-soccer-uuid",
  "code": "soccer",
  "name": "Soccer",
  "slug": "soccer",
  "icon": "⚽",
  "isActive": true,
  "sortOrder": 0,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Continent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `code` | varchar(10) | ✓ | Short code: "EUR", "NAM", "SAM", "AFR", "ASI", "OCE" |
| `name` | text | ✓ | Full name: "Europe", "North America" |
| `slug` | text | ✓ | URL-safe, unique: "europe", "north-america" |
| `flag` | text | Optional | Flag emoji or URL |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order (default: 0) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** None → Countries

**Example JSON:**
```json
{
  "id": "cont-nam-uuid",
  "code": "NAM",
  "name": "North America",
  "slug": "north-america",
  "flag": "🌎",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Country

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `continentId` | varchar | ✓ | FK to continents.id |
| `code` | varchar(10) | ✓ | ISO 3166-1 alpha-2: "US", "GB", "DE" |
| `name` | text | ✓ | Full name: "United States" |
| `slug` | text | ✓ | URL-safe, unique: "usa" |
| `flag` | text | Optional | Flag emoji or URL |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order within continent (default: 0) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** Continent → Leagues, Teams, Venues

**Example JSON:**
```json
{
  "id": "c-usa-uuid",
  "continentId": "cont-nam-uuid",
  "code": "US",
  "name": "United States",
  "slug": "usa",
  "flag": "🇺🇸",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: State (Virtual - Inline Field)

States are **not a separate table**. They are derived from `stateCode` fields on Teams and Venues.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `stateCode` | text | Optional | teams.stateCode, venues.stateCode | ISO 3166-2: "TX", "CA", "SC" |

**Usage:** Filter teams/venues by state within a country.

---

### Entity: City (Virtual - Inline Field)

Cities are **not a separate table**. They are derived from `city` fields on Teams and Venues.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `city` | text | Optional | teams.city, venues.city | City name: "Charleston" |

**Usage:** Filter teams/venues by city within a state.

---

### Entity: Organization

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `name` | text | ✓ | Organization name |
| `slug` | text | ✓ | URL-safe, unique |
| `type` | enum | ✓ | "club", "league", "tournament", "fan_club", "pickup_group" |
| `description` | text | Optional | Description |
| `logoUrl` | text | Optional | Logo URL |
| `website` | text | Optional | Website URL |
| `stateCode` | text | Optional | State/province code |
| `city` | text | Optional | City name |
| `verificationStatus` | enum | ✓ | "draft", "review", "verified", "rejected" (default: draft, NOT NULL) |
| `createdById` | varchar | ✓ | FK to users.id |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** User → Organization Members

**Example JSON:**
```json
{
  "id": "org-hcsl-uuid",
  "name": "Holy City Soccer League",
  "slug": "holy-city-soccer-league",
  "type": "league",
  "stateCode": "SC",
  "city": "Charleston",
  "verificationStatus": "verified",
  "createdById": "user-123-uuid",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: League

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `sportId` | varchar | Optional | FK to sports.id (nullable for backward compat, defaults to soccer) |
| `countryId` | varchar | ✓ | FK to countries.id |
| `name` | text | ✓ | Full name: "Major League Soccer" |
| `slug` | text | ✓ | URL-safe, unique: "mls" |
| `shortName` | text | | Abbreviation: "MLS" |
| `logo` | text | | Logo URL |
| `type` | text | | **Canonical:** "professional", "college", "youth", "amateur", "pickup" |
| `tier` | integer | | 1 = top tier, 2 = second, etc. |
| `format` | text | | "11v11", "futsal", "indoor", "7v7", "5v5" |
| `gender` | text | | "M", "F", "coed" |
| `ageGroup` | text | | "U-10", "U-12", "U-15", "adult", "senior" |
| `governingBody` | text | Optional | "USSF", "NCAA", "NAIA", "US_Youth_Soccer" |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order (default: 0) |
| `currentSeasonId` | varchar | Optional | FK to current active season |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** Country → Divisions, Teams, Seasons

**Canonical League Types:**
- `professional` - Top-flight pro leagues (MLS, EPL, La Liga)
- `college` - NCAA, NAIA, etc.
- `youth` - Youth/junior leagues (includes high school)
- `amateur` - Adult recreational, semi-pro
- `pickup` - Informal/drop-in games

**Example JSON:**
```json
{
  "id": "l-mls-uuid",
  "countryId": "c-usa-uuid",
  "name": "Major League Soccer",
  "slug": "mls",
  "shortName": "MLS",
  "type": "professional",
  "tier": 1,
  "format": "11v11",
  "gender": "M",
  "governingBody": "USSF",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Team

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `leagueId` | varchar | Conditional | FK to leagues.id (required if no divisionId) |
| `divisionId` | varchar | Conditional | FK to divisions.id |
| `name` | text | ✓ | Full name: "Charleston Battery" |
| `slug` | text | ✓ | URL-safe: "charleston-battery" |
| `shortName` | text | | Abbreviation: "Battery" |
| `logo` | text | | Logo/crest URL |
| `venue` | text | | Home venue name (legacy string) |
| `city` | text | | City name: "Charleston" |
| `stateCode` | text | Optional | State code: "SC" |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order (default: 0) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** League/Division → Players, Fixtures

**Example JSON:**
```json
{
  "id": "t-battery-uuid",
  "leagueId": "l-uslc-uuid",
  "name": "Charleston Battery",
  "slug": "charleston-battery",
  "shortName": "Battery",
  "city": "Charleston",
  "stateCode": "SC",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Competition (Season / Cup / Tournament)

Represented by the `seasons` table with extended metadata:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `leagueId` | varchar | ✓ | FK to leagues.id |
| `name` | text | ✓ | "2024-25 Season", "US Open Cup 2025" |
| `slug` | text | ✓ | URL-safe: "2024-25", "us-open-cup-2025" |
| `startDate` | timestamp | | Competition start |
| `endDate` | timestamp | Optional | Competition end |
| `isCurrent` | boolean | Optional | Is this active? (default: false) |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Note:** Competition type (league season, cup, tournament) is determined by the parent league's `format` field or stored in league metadata.

**Example JSON:**
```json
{
  "id": "s-mls-2025-uuid",
  "leagueId": "l-mls-uuid",
  "name": "2025 MLS Season",
  "slug": "2025-mls-season",
  "startDate": "2025-02-22T00:00:00Z",
  "endDate": "2025-12-07T00:00:00Z",
  "isCurrent": true,
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Division

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `leagueId` | varchar | ✓ | FK to leagues.id |
| `name` | text | ✓ | Division name: "Division 1", "U-15 Boys" |
| `slug` | text | ✓ | URL-safe: "division-1" |
| `tier` | integer | Optional | 1 = top division within league (default: 1) |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `sortOrder` | integer | Optional | Display order (default: 0) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Parent/Child:** League → Teams

**Note:** Divisions are optional. Teams can belong directly to a League.

**Example JSON:**
```json
{
  "id": "div-premier-uuid",
  "leagueId": "l-hcsl-uuid",
  "name": "Premier Division",
  "slug": "premier-division",
  "tier": 1,
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Venue

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `name` | text | ✓ | Venue name: "Blackbaud Stadium" |
| `slug` | text | ✓ | URL-safe: "blackbaud-stadium" |
| `address` | text | Optional | Street address |
| `city` | text | Optional | City name |
| `stateCode` | text | Optional | State code |
| `countryId` | varchar | Optional | FK to countries.id |
| `capacity` | integer | Optional | Seating capacity |
| `surface` | text | Optional | "grass", "turf", "hybrid" |
| `latitude` | text | Optional | GPS latitude |
| `longitude` | text | Optional | GPS longitude |
| `photo` | text | Optional | Photo URL |
| `isActive` | boolean | ✓ | Default: true (NOT NULL) |
| `extApiIds` | text[] | Optional | External provider IDs |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Example JSON:**
```json
{
  "id": "v-blackbaud-uuid",
  "name": "Blackbaud Stadium",
  "slug": "blackbaud-stadium",
  "address": "1990 Daniel Island Dr",
  "city": "Charleston",
  "stateCode": "SC",
  "countryId": "c-usa-uuid",
  "capacity": 5000,
  "surface": "grass",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### Entity: Grassroots Submission

This table stores all Partner submissions before promotion to canonical entities.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | varchar (UUID) | auto | Primary key |
| `submittedById` | varchar | ✓ | FK to users.id |
| `type` | enum | ✓ | "college", "high_school", "youth", "adult_amateur", "pickup" |
| `entityType` | text | ✓ | "league", "division", "team", "venue", "season" |
| `status` | enum | ✓ | "pending", "approved", "rejected" (default: pending) |
| `entityName` | text | ✓ | Entity name |
| `slug` | text | ✓ | URL-safe slug |
| `shortName` | text | Optional | Abbreviation |
| `logo` | text | Optional | Logo URL |
| `countryId` | varchar | Optional | FK to countries.id |
| `parentLeagueId` | varchar | Optional | FK to leagues.id |
| `parentDivisionId` | varchar | Optional | FK to divisions.id |
| `parentTeamId` | varchar | Optional | FK to teams.id |
| `stateCode` | text | Optional | State code |
| `city` | text | Optional | City |
| `venue` | text | Optional | Venue name |
| `tier` | integer | Optional | League/division tier (default: 1) |
| `ageGroup` | text | Optional | Age bracket |
| `gender` | text | Optional | M/F/coed |
| `address` | text | Optional | Venue address |
| `capacity` | integer | Optional | Venue capacity |
| `surface` | text | Optional | Venue surface |
| `latitude` | text | Optional | GPS latitude |
| `longitude` | text | Optional | GPS longitude |
| `entityData` | jsonb | Optional | Extra fields |
| `promotedEntityId` | varchar | Optional | ID of created official entity |
| `promotedAt` | timestamp | Optional | When promoted |
| `reviewedById` | varchar | Optional | FK to admin who reviewed |
| `reviewedAt` | timestamp | Optional | When reviewed |
| `reviewNotes` | text | Optional | Admin notes |
| `rejectionReason` | text | Optional | Why rejected |
| `createdAt` | timestamp | ✓ | Auto-set on creation (NOT NULL) |
| `updatedAt` | timestamp | ✓ | Auto-set on update (NOT NULL) |

**Confirmation:** Grassroots submissions write into the same canonical tables as Admin-created data upon promotion.

---

## 2. UI → Data Mapping

### Navigation Contract

**The Home page sections are UX grouping layers (filters/views), NOT separate database tables.**

| Navigation Section | Filter Query | Example Data |
|--------------------|--------------|--------------|
| **Professional Leagues** | `leagues.type = 'professional'` | MLS, EPL, La Liga |
| **College Soccer** | `leagues.type = 'college'` | NCAA D1, NAIA |
| | `leagues.governingBody = 'NCAA'` | |
| **Youth Soccer** | `leagues.type = 'youth'` | US Youth Soccer, ECNL |
| **Adult Soccer** | `leagues.type = 'amateur'` | Holy City Soccer League |
| **Pick-up Soccer** | `leagues.type = 'pickup'` | Saturday Pickup |
| **Fan Clubs** | `organizations.type = 'fan_club'` | Arsenal Supporters |
| **Cups & Trophies** | `leagues.format = 'tournament'` | US Open Cup |
| | OR `seasons.name LIKE '%Cup%'` | |
| **Tournaments** | `leagues.format = 'tournament'` | Summer Invitational |

### "Find in Your Area" Filter

Uses location fields on the same entities:

```sql
-- Find leagues/teams near user
SELECT l.*, t.* 
FROM leagues l
LEFT JOIN teams t ON t.league_id = l.id
WHERE l.country_id = :countryId
  AND (t.state_code = :stateCode OR :stateCode IS NULL)
  AND (t.city = :city OR :city IS NULL)
ORDER BY l.tier ASC, l.name ASC
```

### Favorites Flow

Users select favorites using canonical IDs:

```json
{
  "userId": "user-123-uuid",
  "selectedContinent": "north-america",
  "favoriteLeagues": ["l-mls-uuid", "l-epl-uuid"],
  "favoriteTeams": ["t-battery-uuid", "t-arsenal-uuid"]
}
```

---

## 3. Grassroots Submission & Promotion Rules

### Submission Lifecycle

The `grassroots_status` enum defines submission states:

```
┌──────────┐    ┌───────────────────┐
│ PENDING  │───▶│ APPROVED/REJECTED │
│ (Partner │    │ (Admin decision)  │
│ submits) │    │                   │
└──────────┘    └───────────────────┘
                         │
                         ▼ (if approved)
                ┌───────────────────┐
                │    PROMOTED       │
                │ (Official entity  │
                │    created)       │
                └───────────────────┘
```

**Status Values:**
- `pending` - Awaiting admin review
- `approved` - Admin approved, entity promoted to canonical table
- `rejected` - Admin rejected with reason

### Required Fields by Entity Type

#### League Submission
| Field | Required | Description |
|-------|----------|-------------|
| `entityName` | ✓ | League name |
| `slug` | ✓ | URL-safe slug |
| `type` | ✓ | Grassroots type (mapped to canonical) |
| `countryId` | ✓ | FK to country |
| `stateCode` | Recommended | State/province |
| `city` | Recommended | City |
| `tier` | Optional | League tier (default: 4) |

#### Team Submission
| Field | Required | Description |
|-------|----------|-------------|
| `entityName` | ✓ | Team name |
| `slug` | ✓ | URL-safe slug |
| `parentLeagueId` | ✓ | FK to parent league |
| `city` | Recommended | City |
| `stateCode` | Recommended | State |

#### Venue Submission
| Field | Required | Description |
|-------|----------|-------------|
| `entityName` | ✓ | Venue name |
| `slug` | ✓ | URL-safe slug |
| `address` | Recommended | Street address |
| `city` | Recommended | City |
| `stateCode` | Recommended | State |
| `capacity` | Optional | Seating |
| `surface` | Optional | grass/turf/hybrid |

#### Match/Fixture Submission
| Field | Required | Description |
|-------|----------|-------------|
| `seasonId` | ✓ | FK to season |
| `homeTeamId` | ✓ | FK to home team |
| `awayTeamId` | ✓ | FK to away team |
| `kickoff` | ✓ | Match date/time |
| `matchday` | Optional | Round/matchweek number |
| `venue` | Optional | Override venue name |

#### Organization Submission
| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✓ | Organization name |
| `slug` | ✓ | URL-safe slug |
| `type` | ✓ | club, league, tournament, fan_club, pickup_group |
| `stateCode` | Recommended | State |
| `city` | Recommended | City |
| `description` | Optional | Description |
| `website` | Optional | Website URL |

### Promotion Logic

When an admin approves a submission:

1. **Type Mapping** (for leagues):
   - Canonical types pass through unchanged: `professional`, `college`, `youth`, `amateur`, `pickup`
   - Grassroots-specific types are mapped:
     - `high_school` → `youth`
     - `adult_amateur` → `amateur`
   - Unknown types default to `amateur`

2. **Entity Creation:**
   ```sql
   INSERT INTO leagues (
     id,           -- New UUID generated
     country_id,   -- From submission.countryId
     name,         -- From submission.entityName
     slug,         -- From submission.slug
     type,         -- Mapped canonical type
     tier,         -- From submission.tier
     is_active     -- true
   ) VALUES (...) RETURNING id;
   ```

3. **Audit Trail:**
   ```sql
   UPDATE grassroots_submissions SET
     status = 'approved',
     promoted_entity_id = :newEntityId,
     promoted_at = NOW(),
     reviewed_by_id = :adminUserId,
     reviewed_at = NOW()
   WHERE id = :submissionId;
   ```

### Duplicate Prevention

- **Slug uniqueness:** All slugs must be unique within entity type
- **Name similarity check:** Admin review includes fuzzy matching against existing entities
- **extApiIds lookup:** If submission includes external IDs, check for existing mappings

### Confirmation: Same Canonical Tables

✓ Grassroots submissions promote directly into the same `leagues`, `teams`, `venues` tables used by Admin Panel and SportMonks sync.

---

## 4. Provider Mapping Specification

### Provider Mapping Table

```sql
CREATE TABLE provider_mappings (
  id                  VARCHAR PRIMARY KEY,
  provider_name       TEXT NOT NULL,      -- "sportmonks", "grassroots", "partner-{orgId}"
  provider_entity_type TEXT NOT NULL,     -- "league", "team", "fixture", etc.
  provider_entity_id  TEXT NOT NULL,      -- External ID from provider
  internal_entity_id  VARCHAR NOT NULL,   -- Internal WSL UUID
  provider_entity_name TEXT,              -- Name from provider (debugging)
  raw_payload         JSONB,              -- Original API response
  last_synced_at      TIMESTAMP,
  is_active           BOOLEAN DEFAULT true
);
```

### Mapping Flow

```
┌──────────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│   External API   │    │   Mapping Layer     │    │   WSL Canonical  │
│   (SportMonks)   │───▶│   (Translation)     │───▶│   Database       │
└──────────────────┘    └─────────────────────┘    └──────────────────┘
```

### Example: MLS League Mapping

**SportMonks API Response:**
```json
{
  "id": 779,
  "name": "MLS",
  "short_code": "MLS",
  "logo_path": "https://cdn.sportmonks.com/images/soccer/leagues/11/779.png",
  "country_id": 320,
  "type": "league"
}
```

**WSL Canonical Entity:**
```json
{
  "id": "l-mls-uuid",
  "countryId": "c-usa-uuid",
  "name": "Major League Soccer",
  "slug": "mls",
  "shortName": "MLS",
  "logo": "https://cdn.sportmonks.com/images/soccer/leagues/11/779.png",
  "type": "professional",
  "tier": 1,
  "governingBody": "USSF"
}
```

**Provider Mapping Record:**
```json
{
  "id": "pm-mls-uuid",
  "providerName": "sportmonks",
  "providerEntityType": "league",
  "providerEntityId": "779",
  "internalEntityId": "l-mls-uuid",
  "providerEntityName": "MLS",
  "lastSyncedAt": "2025-01-14T12:00:00Z"
}
```

### Example: Team Mapping

**SportMonks:**
```json
{
  "id": 7890,
  "name": "LA Galaxy",
  "short_code": "LAG",
  "logo_path": "https://cdn.sportmonks.com/images/soccer/teams/6/7890.png",
  "country_id": 320
}
```

**WSL Canonical:**
```json
{
  "id": "t-lagalaxy-uuid",
  "leagueId": "l-mls-uuid",
  "name": "LA Galaxy",
  "slug": "la-galaxy",
  "shortName": "LAG",
  "city": "Los Angeles",
  "stateCode": "CA"
}
```

**Provider Mapping:**
```json
{
  "providerName": "sportmonks",
  "providerEntityType": "team",
  "providerEntityId": "7890",
  "internalEntityId": "t-lagalaxy-uuid"
}
```

### Example: Season/Competition Mapping

**SportMonks:**
```json
{
  "id": 21644,
  "name": "MLS 2025",
  "league_id": 779,
  "is_current": true
}
```

**WSL Canonical:**
```json
{
  "id": "s-mls-2025-uuid",
  "leagueId": "l-mls-uuid",
  "name": "2025 MLS Season",
  "slug": "2025-mls-season",
  "isCurrent": true
}
```

### Hierarchy Placement

External data is placed into the correct hierarchy via country and league mappings:

```
USA (c-usa-uuid)
  └── Professional (type filter)
        └── MLS (l-mls-uuid) ← SportMonks league_id: 779
              └── LA Galaxy (t-lagalaxy-uuid) ← SportMonks team_id: 7890
                    └── 2025 Season (s-mls-2025-uuid) ← SportMonks season_id: 21644
```

---

## 5. End-to-End Validation Scenarios

### Scenario 1: Admin Creates League and Team

**Steps:**
1. Admin creates league via Admin Panel:
   ```json
   POST /api/admin/leagues
   {
     "countryId": "c-usa-uuid",
     "name": "USL League One",
     "slug": "usl-league-one",
     "type": "professional",
     "tier": 3
   }
   ```

2. Admin creates team:
   ```json
   POST /api/admin/teams
   {
     "leagueId": "l-usl1-uuid",
     "name": "Forward Madison FC",
     "slug": "forward-madison-fc",
     "city": "Madison",
     "stateCode": "WI"
   }
   ```

**Expected Result:**
- ✓ League appears under Home → Professional Leagues (filtered by `type = 'professional'`)
- ✓ Team appears when browsing USL League One
- ✓ Team appears in favorites selection under USA → Professional → USL League One
- ✓ Team appears in "Find in Your Area" when filtering by Wisconsin

---

### Scenario 2: Partner Submits Grassroots League

**Steps:**
1. Partner submits via Partner Portal:
   ```json
   POST /api/grassroots/submissions
   {
     "entityType": "league",
     "entityName": "Holy City Soccer League",
     "slug": "holy-city-soccer-league",
     "type": "adult_amateur",
     "countryId": "c-usa-uuid",
     "stateCode": "SC",
     "city": "Charleston",
     "tier": 4
   }
   ```

2. Admin reviews and approves via Admin Panel

3. System promotes to official entity:
   - Creates league in `leagues` table with `type = 'amateur'` (mapped from `adult_amateur`)
   - Records `promotedEntityId` in submission

**Expected Result:**
- ✓ League appears under Home → Adult Soccer (filtered by `type = 'amateur'`)
- ✓ League appears in "Find in Your Area" when filtering by Charleston, SC
- ✓ League is browseable via hierarchy: USA → South Carolina → Charleston → Holy City Soccer League
- ✓ Submission audit trail preserved in `grassrootsSubmissions` table

---

### Scenario 3: External Provider Sync (SportMonks)

**Steps:**
1. SportMonks sync fetches MLS data:
   ```json
   {
     "id": 779,
     "name": "MLS",
     "country_id": 320,
     "teams": [...]
   }
   ```

2. System checks `providerMappings` for existing record

3. If exists: Update existing entity
   If new: Create entity + mapping record

**Expected Result:**
- ✓ MLS appears correctly under USA → Professional
- ✓ Teams populate under MLS without duplication
- ✓ `providerMappings` table tracks all external IDs
- ✓ `extApiIds` array on entities enables quick lookups
- ✓ Future syncs update existing records (no duplicates)

---

## 6. Schema Freeze Confirmation

### Frozen Elements

The following are considered **frozen** as of this specification:

#### Entity Structure
- ✓ `sports` - Multi-sport lookup table (soccer, nfl, nba, mlb, nhl)
- ✓ `continents` - 6 fixed continents
- ✓ `countries` - ISO 3166-1 country list
- ✓ `leagues` - Core league entity with classification fields and sportId
- ✓ `teams` - Core team entity
- ✓ `venues` - Core venue entity
- ✓ `seasons` / Competitions
- ✓ `organizations` - Partner organizations

#### Field Names (Canonical)
| Entity | Frozen Fields |
|--------|---------------|
| All | `id`, `name`, `slug`, `isActive`, `createdAt`, `updatedAt` |
| Sport | `code`, `icon`, `sortOrder` |
| Continent/Country | `code`, `flag`, `sortOrder`, `extApiIds` |
| League | `sportId`, `countryId`, `type`, `tier`, `format`, `gender`, `ageGroup`, `governingBody`, `extApiIds` |
| Team | `leagueId`, `divisionId`, `city`, `stateCode`, `logo`, `venue`, `extApiIds` |
| Venue | `address`, `capacity`, `surface`, `latitude`, `longitude`, `extApiIds` |

#### Relationships
- ✓ Sport → League (via `sportId`) - nullable, defaults to soccer
- ✓ Continent → Country (via `continentId`)
- ✓ Country → League (via `countryId`)
- ✓ League → Division (via `leagueId`)
- ✓ League/Division → Team (via `leagueId`/`divisionId`)
- ✓ Team → Player (via `teamId`)
- ✓ League → Season (via `leagueId`)
- ✓ Season → Fixture (via `seasonId`)

### Change Control Process

Future schema changes require:

1. **Proposal:** Written proposal with rationale
2. **Impact Analysis:** Review of affected systems (App, Admin, API, Integrations)
3. **Migration Plan:** How existing data will be handled
4. **Approval:** Explicit sign-off before implementation
5. **Versioning:** API version bump if breaking change

### Acknowledgment

This specification serves as the **canonical reference** for all development. All systems (Admin Panel, App UI, Grassroots API, External Integrations) must conform to this schema.

---

## 7. Multi-Sport Architecture

### Overview

The platform supports multiple professional sports (NFL, NBA, MLB, NHL, etc.) via a **generic Sport Hub model**. This enables API-driven rendering without creating sport-specific tables for each league.

### Core Principle

**Sport context flows from the `sports` table through `leagues.sportId`.**

```
┌────────────┐
│   sports   │  ← Root lookup table (soccer, nfl, nba, mlb, nhl)
└─────┬──────┘
      │ sportId
      ▼
┌────────────┐
│  leagues   │  ← All sports share the same leagues table
└─────┬──────┘
      │ leagueId
      ▼
┌────────────────────────────────────────┐
│  teams │ seasons │ fixtures │ standings │
└────────────────────────────────────────┘
```

Teams, fixtures, standings, and all other child entities **inherit sport context** through their league relationship. No separate tables per sport.

### Sport Hub Routing

The Sport Hub uses a reusable template pattern:

| Route | Purpose | Component Reuse |
|-------|---------|-----------------|
| `/sport/:slug` | Sport Hub landing (e.g., `/sport/nfl`) | Reuses LeagueGrid |
| `/sport/:slug/league/:id-:leagueSlug` | League detail within sport | Reuses LeaguePage |
| `/sport/:slug/team/:id-:teamSlug` | Team detail within sport | Reuses TeamPage |
| `/sport/:slug/match/:id` | Match/game details | Reuses MatchPage |

**Soccer-specific routes remain unchanged:**
- `/world`, `/continent/:slug`, `/country/:slug` - Soccer hierarchy
- `/league/:id-:slug`, `/team/:id-:slug`, `/match/:id` - Soccer entities

### API Response Requirements

For Sport Hub to render correctly, API responses must include:

```json
{
  "league": {
    "id": "league-nfl-uuid",
    "sportId": "sport-nfl-uuid",
    "sportCode": "nfl",
    "name": "National Football League",
    "teams": [...],
    "currentSeason": {...},
    "standings": [...],
    "fixtures": [...]
  }
}
```

The `sportCode` field enables frontend filtering and route generation.

### "More Sports" Section (Home Page)

The Home page "More Sports" section displays:

```
┌────────────────────────────────────────────┐
│  More Sports                                │
├────────────────────────────────────────────┤
│  🏈 NFL  │  🏀 NBA  │  ⚾ MLB  │  🏒 NHL   │
└────────────────────────────────────────────┘
```

**Data Source:** `SELECT * FROM sports WHERE isActive = true AND code != 'soccer' ORDER BY sortOrder`

**Click Action:** Navigate to `/sport/:slug` (e.g., `/sport/nfl`)

### Implementation Notes

1. **Backward Compatibility:** `sportId` on leagues is nullable. Existing soccer leagues with `sportId = null` continue working; null implies soccer by default.

2. **No Sport-Specific Tables:** NFL, NBA, MLB, NHL all use:
   - Same `leagues` table (filtered by `sportId`)
   - Same `teams` table (linked via `leagueId`)
   - Same `seasons`, `fixtures`, `standings` tables

3. **API Sync:** SportMonks and other multi-sport APIs populate the generic tables. The `providerMappings` table tracks external IDs across all sports.

4. **UI Components:** LeagueCard, TeamCard, FixtureCard, StandingsTable components work for all sports. Sport-specific styling (if needed) uses `sportCode` CSS classes.

### Default Sports Seed Data

| code | name | slug | icon | sortOrder |
|------|------|------|------|-----------|
| soccer | Soccer | soccer | ⚽ | 0 |
| nfl | NFL Football | nfl | 🏈 | 1 |
| nba | NBA Basketball | nba | 🏀 | 2 |
| mlb | MLB Baseball | mlb | ⚾ | 3 |
| nhl | NHL Hockey | nhl | 🏒 | 4 |

### Schema Freeze - Multi-Sport Foundation

**Validated: January 2026**

The following checklist items have been validated and the multi-sport foundation is frozen:

| # | Validation Item | Status | Notes |
|---|-----------------|--------|-------|
| 1 | `/sport/nfl` Sport Hub renders correctly using API-driven data | ✓ Validated | API returns sport + leagues correctly |
| 2 | League → Team → Fixtures/Standings navigation works under `/sport/nfl` | ✓ Validated | Routes and API endpoints functional |
| 3 | Existing soccer routes (`/world`, `/favorites`, hierarchy) are unaffected | ✓ Validated | Null `sportId` defaults to soccer |
| 4 | All non-soccer sports reuse canonical tables (no sport-specific tables) | ✓ Validated | Single set of tables for all sports |
| 5 | API responses consistently resolve sport context via `sportId`/`sportCode` | ✓ Validated | All responses include sport context |

**Frozen Components:**
- `sports` table schema
- `leagues.sportId` nullable FK pattern
- Sport Hub routing (`/sport/:slug`, `/sport/:slug/league/:id-:slug`, `/sport/:slug/team/:id-:slug`)
- API endpoints (`/api/sports`, `/api/sports/:slug`, `/api/sports/:slug/leagues`)
- "More Sports" section on Home page

**Change Control:** Future modifications to multi-sport architecture require proposal + approval per Section 6 change control process.

---

## Deliverables Checklist

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Canonical Data Contract (schema + JSON) | ✓ Complete |
| 2 | UI → Data Mapping table | ✓ Complete |
| 3 | Grassroots submission & promotion docs | ✓ Complete |
| 4 | Provider Mapping specification | ✓ Complete |
| 5 | End-to-end validation scenarios | ✓ Complete |
| 6 | Schema freeze acknowledgment | ✓ Complete |
| 7 | Multi-Sport Architecture | ✓ Complete |

---

## Final Confirmation

This specification ensures that:

- ✓ **Admin Panel** creates data in canonical tables
- ✓ **Grassroots API** promotes submissions into same canonical tables
- ✓ **App UI** reads from canonical tables with filter views
- ✓ **External providers** (SportMonks) map into canonical tables via provider mappings

All systems operate on **one shared data language**, enabling the platform to scale cleanly.
