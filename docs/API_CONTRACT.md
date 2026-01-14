# World Soccer Leagues - API Contract & Field Map

> Single source of truth for canonical field names used across Admin Panel, App UI, and Grassroots API.

## Architecture Principle

**"APIs populate predefined containers, they don't create structure"**

All data sources (SportMonks, Grassroots API, Partner submissions) must map their data to WSL's canonical schema. The hierarchy is immutable:

```
World → Continent → Country → League → Division → Team → Player
                                   ↓
                              Season → Fixture → Standings
                                   ↓
                                Venue
```

---

## Canonical Entity Schemas

### 1. League

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `countryId` | string | ✓ | FK to countries.id |
| `name` | string | ✓ | Full league name |
| `slug` | string | ✓ | URL-safe slug (unique) |
| `shortName` | string | | Abbreviated name |
| `logo` | string | | Logo URL |
| `type` | string | | "professional", "college", "youth", "amateur", "pickup" |
| `tier` | number | | 1 = top tier, 2 = second tier, etc. |
| `isActive` | boolean | | Default: true |
| `sortOrder` | number | | Display ordering |
| `currentSeasonId` | string | | FK to seasons.id |
| `extApiIds` | string[] | | External provider IDs (SportMonks, etc.) |

**JSON Payload Example:**
```json
{
  "countryId": "c-usa",
  "name": "Holy City Soccer League",
  "slug": "holy-city-soccer-league",
  "shortName": "HCSL",
  "type": "amateur",
  "tier": 4,
  "isActive": true
}
```

---

### 2. Division

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `leagueId` | string | ✓ | FK to leagues.id |
| `name` | string | ✓ | Division name (e.g., "Division 1", "U-15 Boys") |
| `slug` | string | ✓ | URL-safe slug |
| `tier` | number | | 1 = top division, 2 = second, etc. |
| `isActive` | boolean | | Default: true |
| `sortOrder` | number | | Display ordering |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "leagueId": "league-hcsl",
  "name": "Premier Division",
  "slug": "premier-division",
  "tier": 1,
  "isActive": true
}
```

---

### 3. Team

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `leagueId` | string | | FK to leagues.id (optional if divisionId set) |
| `divisionId` | string | | FK to divisions.id |
| `name` | string | ✓ | Full team name |
| `slug` | string | ✓ | URL-safe slug |
| `shortName` | string | | Abbreviated name |
| `logo` | string | | Logo/crest URL |
| `venue` | string | | Home venue name (legacy string) |
| `city` | string | | City name |
| `stateCode` | string | | State/province code (e.g., "SC", "TX") |
| `isActive` | boolean | | Default: true |
| `sortOrder` | number | | Display ordering |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "leagueId": "league-hcsl",
  "divisionId": "div-premier",
  "name": "Charleston United FC",
  "slug": "charleston-united-fc",
  "shortName": "CUFC",
  "city": "Charleston",
  "stateCode": "SC",
  "isActive": true
}
```

---

### 4. Venue

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `name` | string | ✓ | Venue name |
| `slug` | string | ✓ | URL-safe slug |
| `address` | string | | Street address |
| `city` | string | | City name |
| `stateCode` | string | | State/province code |
| `countryId` | string | | FK to countries.id |
| `capacity` | number | | Seating capacity |
| `surface` | string | | "grass", "turf", "hybrid" |
| `latitude` | string | | GPS latitude |
| `longitude` | string | | GPS longitude |
| `photo` | string | | Photo URL |
| `isActive` | boolean | | Default: true |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "name": "Blackbaud Stadium",
  "slug": "blackbaud-stadium",
  "address": "1990 Daniel Island Dr",
  "city": "Charleston",
  "stateCode": "SC",
  "countryId": "c-usa",
  "capacity": 5000,
  "surface": "grass",
  "isActive": true
}
```

---

### 5. Season

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `leagueId` | string | ✓ | FK to leagues.id |
| `name` | string | ✓ | Season name (e.g., "2024-25", "Spring 2025") |
| `slug` | string | ✓ | URL-safe slug |
| `startDate` | timestamp | | Season start date |
| `endDate` | timestamp | | Season end date |
| `isCurrent` | boolean | | Is this the current/active season? |
| `isActive` | boolean | | Default: true |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "leagueId": "league-hcsl",
  "name": "Spring 2025",
  "slug": "spring-2025",
  "startDate": "2025-03-01T00:00:00Z",
  "endDate": "2025-06-30T00:00:00Z",
  "isCurrent": true
}
```

---

### 6. Fixture (Match)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `seasonId` | string | ✓ | FK to seasons.id |
| `homeTeamId` | string | ✓ | FK to teams.id |
| `awayTeamId` | string | ✓ | FK to teams.id |
| `matchday` | number | | Matchweek/round number |
| `kickoff` | timestamp | | Match kickoff time |
| `status` | string | | "scheduled", "live", "finished", "postponed", "cancelled" |
| `homeScore` | number | | Home team score |
| `awayScore` | number | | Away team score |
| `venue` | string | | Venue name (override if different from home team) |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "seasonId": "season-spring-2025",
  "homeTeamId": "team-charleston-utd",
  "awayTeamId": "team-summerville-fc",
  "matchday": 1,
  "kickoff": "2025-03-08T15:00:00Z",
  "status": "scheduled"
}
```

---

### 7. Standing

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `seasonId` | string | ✓ | FK to seasons.id |
| `teamId` | string | ✓ | FK to teams.id |
| `position` | number | | League position |
| `played` | number | | Matches played |
| `won` | number | | Matches won |
| `drawn` | number | | Matches drawn |
| `lost` | number | | Matches lost |
| `goalsFor` | number | | Goals scored |
| `goalsAgainst` | number | | Goals conceded |
| `goalDifference` | number | | GF - GA |
| `points` | number | | Total points |

**JSON Payload Example:**
```json
{
  "seasonId": "season-spring-2025",
  "teamId": "team-charleston-utd",
  "position": 1,
  "played": 10,
  "won": 8,
  "drawn": 1,
  "lost": 1,
  "goalsFor": 24,
  "goalsAgainst": 8,
  "goalDifference": 16,
  "points": 25
}
```

---

### 8. Player

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | auto | Internal stable ID |
| `teamId` | string | | FK to teams.id |
| `name` | string | ✓ | Full display name |
| `slug` | string | ✓ | URL-safe slug |
| `firstName` | string | | First name |
| `lastName` | string | | Last name |
| `nationality` | string | | Country code or name |
| `position` | string | | "GK", "DEF", "MID", "FWD" |
| `jerseyNumber` | number | | Shirt number |
| `birthDate` | timestamp | | Date of birth |
| `height` | number | | Height in cm |
| `weight` | number | | Weight in kg |
| `photo` | string | | Photo URL |
| `isActive` | boolean | | Default: true |
| `extApiIds` | string[] | | External provider IDs |

**JSON Payload Example:**
```json
{
  "teamId": "team-charleston-utd",
  "name": "John Smith",
  "slug": "john-smith",
  "firstName": "John",
  "lastName": "Smith",
  "nationality": "USA",
  "position": "MID",
  "jerseyNumber": 10,
  "isActive": true
}
```

---

## Grassroots Submission Schema

Partners submit data through `grassrootsSubmissions` which uses **identical field names** to canonical entities:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | auto |
| `submittedById` | string | FK to users.id (the Partner) |
| `type` | enum | "college", "high_school", "youth", "adult_amateur", "pickup" |
| `entityType` | enum | "league", "division", "team", "venue", "season" |
| `status` | enum | "pending", "approved", "rejected" |
| **Canonical Fields** | | |
| `entityName` | string | Maps to `name` on promotion |
| `slug` | string | Same as canonical |
| `shortName` | string | Same as canonical |
| `logo` | string | Same as canonical |
| **Hierarchy Links** | | |
| `countryId` | string | FK to countries.id |
| `parentLeagueId` | string | FK to leagues.id |
| `parentDivisionId` | string | FK to divisions.id |
| `parentTeamId` | string | FK to teams.id (for players) |
| **Location** | | |
| `stateCode` | string | State/province code |
| `city` | string | City name |
| `venue` | string | Venue name |
| **Additional** | | |
| `tier` | number | League/division tier |
| `ageGroup` | string | "U-10", "U-12", "Adult", etc. |
| `gender` | string | "M", "F", "Coed" |
| `entityData` | jsonb | Extra fields specific to entity type |
| **Promotion** | | |
| `promotedEntityId` | string | ID of created official entity |
| `promotedAt` | timestamp | When promoted |

---

## Provider Mapping Schema

External data providers (SportMonks, etc.) map to internal IDs via `providerMappings`:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | auto |
| `providerName` | string | "sportmonks", "grassroots", "partner-{orgId}" |
| `providerEntityType` | enum | "continent", "country", "league", "team", "season", "player", "fixture" |
| `providerEntityId` | string | External ID from provider |
| `internalEntityId` | string | Internal WSL entity ID |
| `providerEntityName` | string | Name from provider (for display) |
| `rawPayload` | jsonb | Original API response for debugging |
| `lastSyncedAt` | timestamp | Last sync time |
| `isActive` | boolean | Whether mapping is active |

---

## API Endpoints

### Public API (Read-only)
- `GET /api/continents` - List continents
- `GET /api/countries/:countryId` - Get country with leagues
- `GET /api/leagues/:leagueId` - Get league details
- `GET /api/teams/:teamId` - Get team details
- `GET /api/players/:playerId` - Get player profile
- `GET /api/fixtures/:fixtureId` - Get match details

### Partner API (Authenticated, Partner tier)
- `POST /api/grassroots/submissions` - Create submission
- `GET /api/grassroots/submissions` - List own submissions
- `PUT /api/grassroots/submissions/:id` - Update draft submission
- `DELETE /api/grassroots/submissions/:id` - Delete draft submission

### Admin API (Authenticated, Admin role)
- `GET /api/admin/grassroots/submissions` - List all pending submissions
- `POST /api/admin/grassroots/submissions/:id/approve` - Approve submission
- `POST /api/admin/grassroots/submissions/:id/reject` - Reject with reason
- `POST /api/admin/grassroots/submissions/:id/promote` - Promote to official entity

### Bulk Import API (Partner tier)
- `POST /api/grassroots/bulk/teams` - Bulk upload teams
- `POST /api/grassroots/bulk/fixtures` - Bulk upload fixtures
- `POST /api/grassroots/bulk/standings` - Bulk upload standings

---

## Field Mapping: Submission → Official Entity

When a submission is promoted, fields map 1:1:

| Submission Field | Official Entity Field |
|------------------|----------------------|
| `entityName` | `name` |
| `slug` | `slug` |
| `shortName` | `shortName` |
| `logo` | `logo` |
| `countryId` | `countryId` |
| `parentLeagueId` | `leagueId` |
| `parentDivisionId` | `divisionId` |
| `stateCode` | `stateCode` |
| `city` | `city` |
| `venue` | `venue` |
| `tier` | `tier` |

The `promotedEntityId` field in submissions stores the newly created official entity's ID for audit trail.

---

## Validation Rules

1. **Slug uniqueness**: All slugs must be unique within their entity type
2. **Hierarchy integrity**: Every entity must link to valid parent (countryId, leagueId, etc.)
3. **Required fields**: `name` and `slug` are always required
4. **Status flow**: pending → approved → promoted (or pending → rejected)

---

## Translation Layer

The frontend `types.ts` uses slightly different field names for UI convenience. The `sports-data-provider.ts` handles translation:

| DB Field | Frontend Field | Notes |
|----------|---------------|-------|
| `logo` | `logoUrl` / `crestUrl` | UI naming preference |
| `kickoff` | `kickoffTime` | String format for display |
| `photo` | `photoUrl` | UI naming preference |

All API responses use canonical DB field names. Frontend components can alias as needed.
