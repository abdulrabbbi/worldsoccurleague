# Grassroots Submissions System

This document explains the grassroots submission workflow, schema alignment with the admin panel, and the promotion process from community submissions to official entities.

## Overview

The grassroots system allows community members (Partner tier subscribers) to submit soccer entities (leagues, teams, divisions, venues) that don't exist in the official hierarchy. These submissions use the same canonical schema as official entities, enabling seamless promotion without data re-entry.

## Architecture Principle

**"APIs populate predefined containers, they don't create structure"**

Grassroots submissions must fit into one of the canonical entity types:
- `league` - A league organization
- `division` - A subdivision within a league
- `team` - A soccer team
- `venue` - A playing venue/field

## Submission Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Submit    │ --> │   Pending   │ --> │  Approved   │ --> │  Promoted   │
│  (Partner)  │     │  (Review)   │     │  (Verified) │     │  (Official) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           v
                    ┌─────────────┐
                    │  Rejected   │
                    │ (Feedback)  │
                    └─────────────┘
```

### Status Definitions

| Status | Description |
|--------|-------------|
| `pending` | Awaiting admin review |
| `approved` | Verified as legitimate, ready for promotion |
| `rejected` | Declined with feedback for revision |
| `promoted` | Created as official entity (tracked via `promotedEntityId`) |

## Schema Alignment

### Field Mappings

Grassroots submissions use the same field names as their target official entities:

| Submission Field | Official Entity Field | Description |
|-----------------|----------------------|-------------|
| `entityName` | `name` | Display name of the entity |
| `slug` | `slug` | URL-friendly identifier |
| `shortName` | `shortName` | Abbreviated name (optional) |
| `logo` | `logo` | Logo URL (optional) |
| `countryId` | `countryId` | Reference to country |
| `tier` | `tier` | Competition tier level |
| `city` | `city` | City location |
| `stateCode` | `stateCode` | State/province code |
| `venue` | `venue` | Home venue name (for teams) |
| `ageGroup` | `ageGroup` | Age category (youth leagues) |
| `gender` | `gender` | Gender category |

### Hierarchical References

| Submission Field | Purpose |
|-----------------|---------|
| `parentLeagueId` | Links teams/divisions to their league |
| `parentDivisionId` | Links teams to their division |
| `parentTeamId` | Links venues to their primary team |

## Submission Types

| Type | Description | Common Entity Types |
|------|-------------|-------------------|
| `college` | NCAA/College soccer | leagues, teams |
| `high_school` | High school soccer | leagues, teams, divisions |
| `youth` | Youth soccer (club, travel, rec) | leagues, teams, divisions |
| `adult_amateur` | Adult recreational/amateur | leagues, teams |
| `pickup` | Informal pickup games | venues |

## API Endpoints

### Partner Endpoints (Requires Grassroots Access)

```
POST   /api/grassroots/submissions     Create new submission
GET    /api/grassroots/submissions     List user's submissions
```

### Admin Endpoints (Requires Platform Admin)

```
GET    /api/admin/grassroots/submissions           List all submissions
GET    /api/admin/grassroots/submissions/:id       Get submission details
POST   /api/admin/grassroots/submissions/:id/approve   Approve submission
POST   /api/admin/grassroots/submissions/:id/reject    Reject submission
POST   /api/admin/grassroots/submissions/:id/promote   Promote to official entity
```

## Promotion Process

When a submission is promoted:

1. Admin clicks "Promote" on an approved submission
2. System creates the appropriate official entity based on `entityType`:
   - `league` -> Creates entry in `leagues` table
   - `team` -> Creates entry in `teams` table
   - `division` -> Creates entry in `divisions` table
   - `venue` -> Creates entry in `venues` table
3. Submission is updated with:
   - `promotedEntityId` = ID of the new official entity
   - `promotedAt` = Timestamp of promotion
4. The new official entity inherits all mapped fields from the submission

## Example Submission

```json
{
  "type": "youth",
  "entityType": "team",
  "entityName": "Riverside FC U14",
  "slug": "riverside-fc-u14",
  "shortName": "RFC U14",
  "city": "Riverside",
  "stateCode": "CA",
  "countryId": "us",
  "parentLeagueId": "cal-south-youth",
  "ageGroup": "U14",
  "gender": "male",
  "venue": "Riverside Sports Complex"
}
```

After promotion, this creates:

```json
{
  "id": "generated-uuid",
  "leagueId": "cal-south-youth",
  "name": "Riverside FC U14",
  "slug": "riverside-fc-u14",
  "shortName": "RFC U14",
  "city": "Riverside",
  "stateCode": "CA",
  "venue": "Riverside Sports Complex",
  "isActive": true
}
```

## Database Schema

### grassrootsSubmissions Table

```typescript
grassrootsSubmissions = pgTable("grassroots_submissions", {
  id: varchar("id").primaryKey(),
  
  // Categorization
  type: varchar("type").notNull(),           // college, high_school, youth, etc.
  entityType: varchar("entity_type").notNull(), // league, team, division, venue
  
  // Canonical fields (match official entity schemas)
  entityName: varchar("entity_name").notNull(),
  slug: varchar("slug").notNull(),
  shortName: varchar("short_name"),
  logo: varchar("logo"),
  countryId: varchar("country_id"),
  tier: integer("tier"),
  ageGroup: varchar("age_group"),
  gender: varchar("gender"),
  city: varchar("city"),
  stateCode: varchar("state_code"),
  venue: varchar("venue"),
  
  // Hierarchical references
  parentLeagueId: varchar("parent_league_id"),
  parentDivisionId: varchar("parent_division_id"),
  parentTeamId: varchar("parent_team_id"),
  
  // Extensible data for edge cases
  entityData: jsonb("entity_data"),
  
  // Workflow tracking
  submittedById: varchar("submitted_by_id").notNull(),
  status: varchar("status").default("pending"),
  reviewedById: varchar("reviewed_by_id"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  
  // Promotion tracking
  promotedEntityId: varchar("promoted_entity_id"),
  promotedAt: timestamp("promoted_at"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
```

## Best Practices

1. **Always use canonical entity types** - Don't create custom entity types
2. **Validate parent references** - Ensure parentLeagueId/parentDivisionId exist before promotion
3. **Use consistent slugs** - Follow the pattern: `lowercase-hyphenated-name`
4. **Include location data** - City and stateCode help with deduplication
5. **Review before promoting** - Verify the entity doesn't already exist in official data
