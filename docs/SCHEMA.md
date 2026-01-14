# World Soccer Leagues - Database Schema

## Overview

PostgreSQL database using Drizzle ORM. Schema defined in `shared/schema.ts`.

---

## Core Sports Tables

### `sports`
Root-level lookup for multi-sport support.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| code | varchar(20) | Unique code (soccer, nfl, nba, etc.) |
| name | text | Display name |
| slug | text | URL-safe identifier |
| icon | text | Icon reference |
| isActive | boolean | Enabled/disabled |
| sortOrder | integer | Display order |
| createdAt | timestamp | Created timestamp |
| updatedAt | timestamp | Updated timestamp |

### `continents`
Geographic regions.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| code | varchar(10) | Unique code (EU, NA, etc.) |
| name | text | Display name |
| slug | text | URL-safe identifier |
| flag | text | Flag emoji/icon |
| isActive | boolean | Enabled/disabled |
| sortOrder | integer | Display order |
| extApiIds | text[] | External API IDs |

### `countries`
Countries within continents.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| continentId | varchar | FK to continents |
| code | varchar(10) | ISO country code |
| name | text | Display name |
| slug | text | URL-safe identifier |
| flag | text | Flag emoji/icon |
| isActive | boolean | Enabled/disabled |
| extApiIds | text[] | External API IDs |

### `leagues`
Leagues/competitions.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| sportId | varchar | FK to sports (nullable, defaults to soccer) |
| countryId | varchar | FK to countries |
| name | text | League name |
| slug | text | URL-safe identifier |
| shortName | text | Abbreviated name |
| logo | text | Logo URL |
| type | text | League type |
| tier | integer | Competition tier (1 = top) |
| format | text | Competition format |
| gender | text | Gender category |
| ageGroup | text | Age group |
| governingBody | text | Governing organization |
| isActive | boolean | Enabled/disabled |
| currentSeasonId | varchar | FK to current season |
| extApiIds | text[] | External API IDs |

### `teams`
Teams/clubs.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| divisionId | varchar | FK to divisions (optional) |
| leagueId | varchar | FK to leagues |
| countryId | varchar | FK to countries |
| teamType | enum | club, national |
| name | text | Team name |
| slug | text | URL-safe identifier |
| shortName | text | Abbreviated name |
| logo | text | Logo URL |
| venue | text | Home venue name |
| city | text | City |
| stateCode | text | State/province code |
| isActive | boolean | Enabled/disabled |
| extApiIds | text[] | External API IDs |

### `seasons`
Season/year within a league.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| leagueId | varchar | FK to leagues |
| name | text | Season name (e.g., "2024-25") |
| slug | text | URL-safe identifier |
| startDate | timestamp | Season start |
| endDate | timestamp | Season end |
| isCurrent | boolean | Current season flag |
| isActive | boolean | Enabled/disabled |
| extApiIds | text[] | External API IDs |

### `players`
Player profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| teamId | varchar | FK to teams |
| name | text | Full name |
| slug | text | URL-safe identifier |
| firstName | text | First name |
| lastName | text | Last name |
| nationality | text | Country of nationality |
| position | text | Playing position |
| jerseyNumber | integer | Jersey number |
| birthDate | timestamp | Date of birth |
| height | integer | Height in cm |
| weight | integer | Weight in kg |
| photo | text | Photo URL |
| isActive | boolean | Active player flag |
| extApiIds | text[] | External API IDs |

---

## Organization & Partner Tables

### `organizations`
Partner organizations (clubs, leagues, fan clubs, etc.).

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| name | text | Organization name |
| slug | text | Unique URL-safe identifier |
| type | enum | club, league, tournament, fan_club, pickup_group |
| description | text | Description |
| logoUrl | text | Logo URL |
| website | text | Website URL |
| stateCode | text | State/province |
| city | text | City |
| verificationStatus | enum | draft, review, verified, rejected |
| createdById | varchar | FK to users |
| createdAt | timestamp | Created timestamp |
| updatedAt | timestamp | Updated timestamp |

### `organization_members`
Organization membership with roles.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| organizationId | varchar | FK to organizations |
| userId | varchar | FK to users |
| role | enum | owner, admin, editor, viewer |
| invitedById | varchar | FK to users (who invited) |
| joinedAt | timestamp | Join timestamp |

### `api_keys`
API keys for partner organizations.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| organizationId | varchar | FK to organizations |
| name | text | Key name/description |
| keyHash | text | Hashed key value |
| keyPrefix | text | First 8 chars (wsl_xxxx) |
| scopes | text[] | Allowed scopes |
| rateLimitPerMinute | integer | Requests/minute (default 60) |
| rateLimitPerDay | integer | Requests/day (default 10000) |
| lastUsedAt | timestamp | Last usage |
| expiresAt | timestamp | Expiration (optional) |
| isActive | boolean | Active flag |
| createdById | varchar | FK to users |
| createdAt | timestamp | Created timestamp |
| revokedAt | timestamp | Revoked timestamp |

### `partner_verifications`
Partner verification workflow.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| organizationId | varchar | FK to organizations |
| status | enum | draft, review, verified, rejected |
| submittedAt | timestamp | Submission timestamp |
| reviewedAt | timestamp | Review timestamp |
| reviewerId | varchar | FK to users (reviewer) |
| reviewNotes | text | Internal notes |
| rejectionReason | text | Reason for rejection |
| documents | text[] | Supporting docs |

---

## User & Subscription Tables

### `users`
User accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| email | text | Email (unique) |
| password | text | Password (plaintext in demo!) |
| name | text | Display name |
| planTier | enum | free, pro, partner |
| platformRole | enum | user, partner_admin, platform_moderator, platform_admin |
| primaryOrgId | varchar | Primary organization |
| stripeCustomerId | text | Stripe customer ID |
| createdAt | timestamp | Created timestamp |

### `user_subscriptions`
Subscription records.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | FK to users |
| planTier | enum | free, pro, partner |
| billingCycle | enum | monthly, yearly |
| status | enum | active, canceled, past_due, trialing |
| currentPeriodStart | timestamp | Billing period start |
| currentPeriodEnd | timestamp | Billing period end |
| trialEndsAt | timestamp | Trial end date |
| stripeSubscriptionId | text | Stripe subscription ID |
| stripePriceId | text | Stripe price ID |

### `user_preferences`
User settings and favorites.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | FK to users |
| locationEnabled | boolean | Location services |
| selectedContinent | text | Selected region |
| favoriteLeagues | text[] | Followed leagues |
| favoriteTeams | text[] | Followed teams |
| notificationsEnabled | boolean | Push notifications |
| scoreUpdatesEnabled | boolean | Live score alerts |
| communityPollsEnabled | boolean | Community polls |
| weeklyDigestEnabled | boolean | Email digest |

---

## Grassroots & Audit Tables

### `grassroots_submissions`
Community-submitted data.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| submittedById | varchar | FK to users |
| type | enum | college, high_school, youth, adult_amateur, pickup |
| entityType | text | league, division, team, venue, season |
| status | enum | draft, pending, review, approved, promoted, rejected |
| entityName | text | Entity name |
| slug | text | URL-safe identifier |
| shortName | text | Abbreviated name |
| logo | text | Logo URL |
| countryId | varchar | FK to countries |
| parentLeagueId | varchar | FK to leagues |
| parentDivisionId | varchar | FK to divisions |
| parentTeamId | varchar | FK to teams |
| stateCode | text | State/province |
| city | text | City |
| venue | text | Venue name |
| tier | integer | Competition tier |
| ageGroup | text | Age group |
| gender | text | Gender category |
| entityData | jsonb | Additional data |
| promotedEntityId | varchar | ID after promotion |
| promotedAt | timestamp | Promotion timestamp |
| reviewedById | varchar | FK to users |
| reviewedAt | timestamp | Review timestamp |
| reviewNotes | text | Review notes |
| rejectionReason | text | Rejection reason |

### `audit_logs`
Activity audit trail.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | FK to users |
| action | enum | create, update, delete, approve, reject, activate, deactivate, submit_for_review, promote, link_existing |
| entityType | text | Type of entity modified |
| entityId | varchar | ID of entity |
| entityName | text | Name of entity |
| previousData | jsonb | Before state |
| newData | jsonb | After state |
| ipAddress | text | Request IP |
| userAgent | text | User agent |
| createdAt | timestamp | Action timestamp |

### `provider_mappings`
External API ID mappings.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| providerName | text | Provider name (sportmonks, etc.) |
| providerEntityType | enum | continent, country, league, team, season, player, fixture |
| providerEntityId | text | External ID |
| internalEntityId | varchar | Internal UUID |
| providerEntityName | text | Name from provider |
| rawPayload | jsonb | Raw API response |
| lastSyncedAt | timestamp | Last sync |
| isActive | boolean | Active mapping |

---

## Enum Types

```sql
-- Plan tiers
plan_tier: free, pro, partner

-- Platform roles
platform_role: user, partner_admin, platform_moderator, platform_admin

-- Organization member roles
org_member_role: owner, admin, editor, viewer

-- Organization types
organization_type: club, league, tournament, fan_club, pickup_group

-- Verification status
verification_status: draft, review, verified, rejected

-- Grassroots types
grassroots_type: college, high_school, youth, adult_amateur, pickup

-- Grassroots status
grassroots_status: draft, pending, review, approved, promoted, rejected

-- Audit actions
audit_action: create, update, delete, approve, reject, activate, deactivate, submit_for_review, promote, link_existing

-- Team types
team_type: club, national

-- League types
league_type: professional, semi_pro, college, high_school, youth, adult_amateur, pickup, cup, tournament, national_team_competition

-- League formats
league_format: league, cup, tournament, playoff, friendly
```

---

## Entity Relationships

```
sports
  └── leagues (sportId)

continents
  └── countries (continentId)
        └── leagues (countryId)
              └── divisions (leagueId)
              └── teams (leagueId)
              └── seasons (leagueId)
                    └── fixtures (seasonId)
                    └── standings (seasonId)

users
  └── user_preferences (userId)
  └── user_subscriptions (userId)
  └── organizations (createdById)
  └── organization_members (userId)
  └── grassroots_submissions (submittedById)
  └── audit_logs (userId)

organizations
  └── organization_members (organizationId)
  └── api_keys (organizationId)
  └── partner_verifications (organizationId)

teams
  └── players (teamId)
```
