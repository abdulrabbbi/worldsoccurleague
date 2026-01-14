# World Soccer Leagues - Route Reference

## Frontend Routes

### Admin Panel (`/admin/*`)

| Route | Description | Access |
|-------|-------------|--------|
| `/admin` | Admin dashboard with stats | platform_admin, platform_moderator |
| `/admin/continents` | Continent management | platform_admin, platform_moderator |
| `/admin/countries` | Country management | platform_admin, platform_moderator |
| `/admin/leagues` | League management (enable/disable) | platform_admin, platform_moderator |
| `/admin/teams` | Team management | platform_admin, platform_moderator |
| `/admin/grassroots` | Grassroots submission queue | platform_admin, platform_moderator |
| `/admin/api-mapping` | Provider mappings for external APIs | platform_admin, platform_moderator |
| `/admin/integrations` | Phase 4 integration stubs | platform_admin, platform_moderator |
| `/admin/audit-logs` | Full audit trail | platform_admin, platform_moderator |

### Partner Portal (`/partner/*`)

| Route | Description | Access |
|-------|-------------|--------|
| `/partner` | Partner dashboard | Partner tier |
| `/partner/organization/new` | Create new organization | Partner tier |
| `/partner/organization/:orgId` | Organization detail (tabbed) | Org member |
| `/partner/submit/league` | Submit new league | Partner tier |
| `/partner/submit/team` | Submit new team | Partner tier |
| `/partner/submit/venue` | Submit new venue | Partner tier |

### Public Hierarchy

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home / landing | Public |
| `/world` | Global soccer entry point | Public |
| `/continent/:slug` | Region view | Public |
| `/country/:slug` | Country with categories | Public |
| `/country/:slug/category/:category` | League category | Public |
| `/league/:id-:slug` | League detail | Public |
| `/team/:id-:slug` | Team detail | Public |
| `/player/:id-:slug` | Player profile | Public |
| `/match/:id` | Match detail | Public |
| `/sport/:slug` | Sport hub (non-soccer) | Public |

### User Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Login page | Public |
| `/signup` | Registration page | Public |
| `/settings` | User settings | Authenticated |
| `/profile/setup` | Profile setup wizard | Authenticated |
| `/subscription` | Subscription management | Authenticated |

---

## API Routes

### Authentication (`/api/auth/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### User & Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preferences/:userId` | Get user preferences |
| POST | `/api/preferences` | Save user preferences |
| GET | `/api/plans` | List available plans |
| GET | `/api/user/plan` | Get current user plan |
| POST | `/api/user/upgrade` | Upgrade subscription tier |

### Subscriptions (`/api/subscriptions/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions/current` | Get current subscription |
| POST | `/api/subscriptions/upgrade` | Upgrade plan tier |

### Public Read-Only (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/countries` | List all countries |
| GET | `/api/leagues` | List all leagues |
| GET | `/api/leagues/:id` | Get league by ID |
| GET | `/api/leagues/:id/teams` | Get teams in league |
| GET | `/api/teams/:id` | Get team by ID |
| GET | `/api/sports` | List all sports |
| GET | `/api/sports/:slug` | Get sport by slug |
| GET | `/api/sports/:slug/leagues` | Get leagues for sport |
| POST | `/api/sports/seed` | Seed default sports data |

---

## Admin API (`/api/admin/*`)

### Leagues & Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/leagues` | List leagues (with sport filter) |
| PATCH | `/api/admin/leagues/:id` | Update league (enable/disable) |
| GET | `/api/admin/stats` | Dashboard stats by sport |

### Audit Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/audit-logs` | Get audit logs |
| POST | `/api/admin/audit-logs` | Create audit log entry |

### Partner Verifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/verifications/pending` | Pending partner verifications |
| POST | `/api/admin/verifications/:id/approve` | Approve partner verification |
| POST | `/api/admin/verifications/:id/reject` | Reject partner verification |

### Provider Mappings (`/api/admin/provider-mappings/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/provider-mappings` | List mappings (filter by provider, entityType, sport) |
| POST | `/api/admin/provider-mappings` | Create new mapping |
| PATCH | `/api/admin/provider-mappings/:id` | Update mapping |
| DELETE | `/api/admin/provider-mappings/:id` | Delete mapping |

### Coverage & Unmapped

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/coverage` | Get coverage stats by sport/source |
| GET | `/api/admin/unmapped` | Get unmapped entities (league/team/season) |
| GET | `/api/admin/internal-entities` | Search internal entities for mapping |

### Grassroots Submissions (`/api/admin/grassroots/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/grassroots` | List all submissions |
| GET | `/api/admin/grassroots/:id` | Get submission detail |
| POST | `/api/admin/grassroots/:id/submit-review` | Submit for review |
| POST | `/api/admin/grassroots/:id/approve` | Approve submission |
| POST | `/api/admin/grassroots/:id/reject` | Reject submission |
| GET | `/api/admin/grassroots/:id/duplicates` | Find duplicate entities |
| POST | `/api/admin/grassroots/:id/promote` | Promote to canonical |
| POST | `/api/admin/grassroots/:id/link` | Link to existing entity |

### Legacy Grassroots Submissions (`/api/admin/grassroots/submissions/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/grassroots/submissions` | List grassroots submissions |
| GET | `/api/admin/grassroots/submissions/:id` | Get submission detail |
| POST | `/api/admin/grassroots/submissions/:id/approve` | Approve submission |
| POST | `/api/admin/grassroots/submissions/:id/reject` | Reject submission |
| POST | `/api/admin/grassroots/submissions/:id/promote` | Promote to canonical |
| POST | `/api/admin/grassroots/submissions/:id/submit` | Submit for review |
| GET | `/api/admin/grassroots/submissions/:id/duplicates` | Find duplicates |
| POST | `/api/admin/grassroots/submissions/:id/link` | Link to existing |

---

## Partner API (`/api/partner/*`)

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/organizations` | List user's organizations |
| GET | `/api/partner/organizations/:orgId` | Get organization detail |

### Members (`/api/partner/organizations/:orgId/members/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/organizations/:orgId/members` | List org members |
| POST | `/api/partner/organizations/:orgId/members` | Add org member |
| PATCH | `/api/partner/organizations/:orgId/members/:memberId` | Update member role |
| DELETE | `/api/partner/organizations/:orgId/members/:memberId` | Remove member |

### API Keys (`/api/partner/organizations/:orgId/api-keys/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/organizations/:orgId/api-keys` | List API keys |
| POST | `/api/partner/organizations/:orgId/api-keys` | Create API key |
| DELETE | `/api/partner/organizations/:orgId/api-keys/:keyId` | Revoke API key |

### Audit Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/organizations/:orgId/audit-logs` | Org-scoped audit logs |

---

## Grassroots API (`/api/grassroots/*`)

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grassroots/organizations` | List user's orgs |
| POST | `/api/grassroots/organizations` | Create organization |
| GET | `/api/grassroots/organizations/:orgId` | Get org detail |
| PUT | `/api/grassroots/organizations/:orgId` | Update org |
| DELETE | `/api/grassroots/organizations/:orgId` | Delete org (owner only) |
| POST | `/api/grassroots/organizations/:orgId/members` | Add member |
| POST | `/api/grassroots/organizations/:orgId/submit-verification` | Submit for verification |

### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grassroots/submissions` | Create submission |
| GET | `/api/grassroots/submissions` | List user's submissions |

### Bulk Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grassroots/bulk/teams` | Bulk create team submissions |
| POST | `/api/grassroots/bulk/fixtures` | Bulk create fixture submissions |

---

## RBAC Roles

### Platform Roles
- `platform_admin` - Full platform access
- `platform_moderator` - Admin panel access, cannot delete
- `partner_admin` - Partner portal access
- `user` - Standard user

### Organization Member Roles
- `owner` - Full org control, can delete
- `admin` - Manage members, create API keys
- `editor` - Submit data, edit org
- `viewer` - Read-only access

### Plan Tiers
- `free` - Basic access ($0)
- `pro` - Ad-free, priority support ($2.99/mo or $29.99/yr)
- `partner` - Org creation, API access ($9.99/mo or $99/yr)
