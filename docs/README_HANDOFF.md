# World Soccer Leagues - Production Handoff

## Project Status

This is a **reference implementation** for the World Soccer Leagues (WSL) platform. It demonstrates subscription management, organization RBAC, permissions, API keys, and automation workflows. The production team will wire live services (payments, external APIs, integrations).

---

## Completed Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Core hierarchy (World > Continent > Country > League > Team) | Complete |
| **Phase 2** | Admin panel with multi-sport support, audit logs, grassroots queue | Complete |
| **Phase 3** | Partner Portal - org management, member RBAC, API key lifecycle | Complete |
| **Phase 4** | Integration stubs (BetterMode, Sharetribe, Kevel/AdButler, Affiliates) | Complete (Stubs Only) |

---

## Key Routes to Review

### Admin Panel (`/admin/*`)
- `/admin` - Dashboard with stats by sport
- `/admin/continents` - Continent management
- `/admin/countries` - Country management
- `/admin/leagues` - League management (enable/disable, sport filter)
- `/admin/teams` - Team management
- `/admin/grassroots` - Grassroots submission queue (approve/reject/promote)
- `/admin/api-mapping` - Provider mappings for external APIs
- `/admin/integrations` - Phase 4 integration stubs (scaffolding only)
- `/admin/audit-logs` - Full audit trail

### Partner Portal (`/partner/*`)
- `/partner` - Partner dashboard with org list and submission stats
- `/partner/organization/new` - Create new organization
- `/partner/organization/:orgId` - Organization detail with tabs:
  - Settings (name, type, slug, verification status)
  - Members (owner/admin/editor/viewer roles)
  - API Keys (create/revoke, shown once on creation)
  - Usage (rate limits: 60/min, 10k/day)
  - Audit (org-scoped activity log)
- `/partner/submit/*` - Data submission forms (league, team, venue)

### Public Hierarchy (`/world/*`)
- `/world` - Global entry point
- `/continent/:slug` - Region view
- `/country/:slug` - Country with league categories
- `/league/:id-:slug` - League detail (standings, fixtures, results)
- `/team/:id-:slug` - Team detail (overview, squad, fixtures)
- `/player/:id-:slug` - Player profile
- `/match/:id` - Match detail

---

## Core Logic Locations

| Area | Files/Folders |
|------|---------------|
| **Database Schema** | `shared/schema.ts` |
| **API Routes** | `server/routes.ts` |
| **Storage Layer** | `server/storage.ts` |
| **RBAC Middleware** | `server/rbac.ts` |
| **Plan/Tier Config** | `shared/plans.ts` |
| **Auth Context** | `client/src/lib/auth-context.tsx` |
| **Admin Pages** | `client/src/pages/admin/*` |
| **Partner Pages** | `client/src/pages/partner/*` |
| **Hierarchy Pages** | `client/src/pages/*.tsx` (world, continent, country, league, team) |

---

## Seed/Demo Data Assumptions

### Demo Accounts
```
Admin: admin@wsl-demo.test / demo123
Partner: partner@wsl-demo.test / demo123
```

### Seeded Data
- Continents: Europe, North America, South America, Asia, Africa, Oceania
- Countries: Major soccer nations (England, Spain, Germany, USA, Brazil, etc.)
- Sports: Soccer (default), NFL, NBA, MLB, NHL
- Leagues: Sample professional leagues per country

### Mock Data Provider
`server/sports-data-provider.ts` returns mock data. Production team will:
1. Wire SportMonks API for professional data
2. Wire custom Grassroots API for lower-tier data

---

## Known TODOs for Production

### Payment Processing
- [ ] Wire Stripe for subscription payments (currently uses tier flags only)
- [ ] Implement Stripe webhooks for subscription lifecycle
- [ ] Handle payment failures and grace periods

### External Integrations (Phase 4 Stubs)
- [ ] BetterMode community forums - wire actual API
- [ ] Sharetribe marketplace - wire actual API
- [ ] Kevel/AdButler ads - wire actual API
- [ ] Affiliate networks (Impact/CJ/Rakuten/ShareASale) - wire actual APIs

### Data Layer
- [ ] Replace mock data provider with SportMonks API
- [ ] Implement real-time WebSocket for live scores
- [ ] Add CDN/caching for public read-only routes

### Security
- [ ] Move all API secrets server-side (never store in frontend)
- [ ] Implement proper password hashing (currently plaintext for demo)
- [ ] Add rate limiting to public endpoints
- [ ] Configure CORS for production domain

### Infrastructure
- [ ] Database migrations for production (Drizzle Kit)
- [ ] Environment-specific configs
- [ ] Health checks and monitoring
- [ ] Error tracking (Sentry or similar)

---

## Public Read-Only Routes

These routes are intentionally unauthenticated for public sports data access:
- `GET /api/countries`
- `GET /api/leagues`
- `GET /api/leagues/:id`
- `GET /api/leagues/:id/teams`
- `GET /api/teams/:id`
- `GET /api/sports`
- `GET /api/sports/:slug`
- `GET /api/sports/:slug/leagues`

**Production Note:** Add CDN caching and rate limiting to these endpoints.

---

## Security Notes

1. **Secrets:** Do not store real API secrets in frontend. All credentials must be wired server-side.
2. **Demo passwords:** Currently plaintext for demo purposes. Implement bcrypt hashing for production.
3. **robots.txt:** Configured to block all crawlers. Remove or adjust for production SEO needs.
4. **HTTPS:** Ensure TLS is enforced in production.

---

## Quick Start

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Access at `http://localhost:5000`
