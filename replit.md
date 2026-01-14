# World Soccer Leagues

## Overview

World Soccer Leagues is a mobile-first web application designed to be the "soccer version of ESPN + Kicker.de" - a comprehensive platform for browsing global soccer content organized in a continuous hierarchy: World → Continent → Country → League → Team → Player → Match. The application supports real-time match information, standings, squads, player profiles, and match stats with a clean, fast UI familiar to soccer fans.

**Key Principle:** No teams, players, leagues, or stats are hardcoded. All content populates dynamically from APIs (SportMonks for professional data, custom Grassroots API for lower tiers).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React with TypeScript, using Vite as the build tool
- **Routing:** Wouter for client-side routing with dynamic slug/ID-based routes
- **State Management:** TanStack React Query for server state, React Context for auth and profile setup state
- **Styling:** Tailwind CSS with shadcn/ui component library (New York style), custom CSS variables for theming
- **Fonts:** Inter (body) and Oswald (display/headings)

### Design Pattern - Dynamic Route Structure
Routes follow a hierarchy pattern with ID + slug combinations for SEO and API-readiness:
- `/world` - Global entry point
- `/continent/:slug` - Region selection
- `/country/:slug` - Country with league categories
- `/country/:slug/category/:category` - League categories (Professional, College, Youth, etc.)
- `/league/:id-:slug` - Individual league with tabs (Standings, Fixtures, Results)
- `/team/:id-:slug` - Team details with tabs (Overview, Squad, Fixtures)
- `/player/:id-:slug` - Player profiles
- `/match/:id` - Match details with live scores

### Backend Architecture
- **Runtime:** Node.js with Express
- **API Pattern:** RESTful JSON API at `/api/*` endpoints
- **Authentication:** Custom auth with signup/login endpoints, session stored in localStorage
- **Database ORM:** Drizzle ORM with PostgreSQL

### Data Layer
- **Sports Data Provider:** Abstraction layer (`sports-data-provider.ts`) that wraps API calls, currently using mock data but designed to swap in SportMonks or custom Grassroots API
- **Schema:** Drizzle schema defines users, userPreferences, organizations, organizationMembers, userSubscriptions, partnerVerifications, sports, continents, countries, leagues (with sportId), teams, seasons, fixtures, standings, venues, players, divisions, grassrootsSubmissions, providerMappings, and auditLogs tables with Zod validation via drizzle-zod

### Multi-Sport Architecture
- **Sports Lookup Table:** Root-level `sports` table (soccer, nfl, nba, mlb, nhl) enables multi-sport support
- **Sport Context:** `leagues.sportId` (nullable FK) links leagues to sports; null defaults to soccer for backward compatibility
- **Shared Tables:** All sports use the same canonical tables (leagues, teams, fixtures, standings) - no sport-specific tables
- **Sport Hub Routing:** `/sport/:slug` pattern enables reusable Sport Hub template for non-soccer sports
- **Soccer Priority:** Soccer remains the primary sport with dedicated hierarchy routes (/world, /continent, /country, /league)

### Subscription Tiers
- **Free (Fan Access):** $0 - Follow teams and leagues, live scores, community access
- **Pro (Player & Fan+):** $2.99/mo or $29.99/yr - Ad-free experience, exclusive content, priority support
- **Partner (Organizer & Data Partner):** $9.99/mo or $99/yr - Grassroots API access, create/manage organizations (clubs, leagues, tournaments, fan clubs, pickup groups)

### RBAC & Permissions
- **Platform Roles:** platform_admin, platform_moderator, partner_admin, user
- **Org Member Roles:** owner, admin, editor, viewer
- **Feature Gating:** Plan-based feature flags in shared/plans.ts, checked via AuthContext and server middleware
- **Org Scope Enforcement:** Partners can only manage their own organization data

### Partner Verification Workflow
- **Draft:** Organization created, partner can edit freely
- **Review:** Submitted for verification, locked for editing
- **Verified:** Partner approved, gains full Grassroots API publishing rights
- **Rejected:** Returned to draft with feedback, partner can revise and resubmit

### Component Architecture
- **Layout Components:** AppShell with TopBar, BottomNav, and NavDrawer for mobile-first navigation
- **UI Components:** Full shadcn/ui component library with Radix UI primitives
- **Page Components:** Each hierarchy level has its own page component with loading states and data fetching

### Admin Panel Architecture
- **Layout:** AdminLayout with collapsible sidebar, sport selector header bar
- **Sport Context:** AdminSportContext provides selectedSportSlug to child pages via `useAdminSport()` hook
- **Sport Selector:** Persistent header bar with Soccer first/default, then NFL/NBA/MLB/NHL icons, plus "All Sports" button
- **Persistence:** Selected sport stored in localStorage with key `wsl_admin_sport`
- **Admin API Endpoints:**
  - `GET /api/admin/leagues?sport=:slug` - Fetches leagues filtered by sport with team counts
  - `PATCH /api/admin/leagues/:id` - Enable/disable league with audit logging
  - `GET /api/admin/audit-logs` - Fetch audit trail for admin actions
  - `GET /api/admin/stats?sport=:slug` - Dashboard stats filtered by sport

### Partner Portal Architecture (Phase 3)
- **Routes:**
  - `/partner` - Dashboard with org list, submission stats, submit data actions
  - `/partner/organization/new` - Create new organization (club, league, tournament, fan club, pickup)
  - `/partner/organization/:orgId` - Organization detail with tabbed UI
- **Organization Detail Tabs:**
  - Settings: Name, type, slug, location, verification status, plan info
  - Members: Add/remove members, role management (owner/admin/editor/viewer)
  - API Keys: Create/list/revoke keys, single-view secret on creation, verification required
  - Usage: Rate limit display (60/min, 10k/day), usage stats placeholder
  - Audit: Org-scoped audit log with action history
- **RBAC Enforcement:** Built into API routes - owners have full control, admins can manage members, editors can submit data, viewers read-only
- **Payment-Agnostic:** Subscription tiers (free/pro/partner) are flags only; Stripe fields optional for future webhook integration
- **Partner API Endpoints:**
  - `GET /api/partner/organizations` - List user's organizations
  - `GET /api/partner/organizations/:orgId` - Get single organization
  - `POST /api/partner/organizations` - Create organization (Partner tier required)
  - `GET/POST/PATCH/DELETE /api/partner/organizations/:orgId/members` - Member CRUD
  - `GET/POST/DELETE /api/partner/organizations/:orgId/api-keys` - API key lifecycle
  - `GET /api/partner/organizations/:orgId/audit-logs` - Org-scoped audit logs
  - `POST /api/subscriptions/upgrade` - Upgrade plan tier (payment-agnostic placeholder)
  - `GET /api/subscriptions/current` - Get current subscription

## External Dependencies

### Database
- **PostgreSQL:** Primary database, connected via `DATABASE_URL` environment variable
- **Drizzle Kit:** Database migrations stored in `/migrations`

### Third-Party UI Libraries
- **Radix UI:** Complete primitive set for accessible UI components
- **Lucide React:** Icon library
- **Embla Carousel:** Carousel functionality
- **cmdk:** Command palette component

### API Integrations (Planned)
- **SportMonks API:** Professional soccer data (leagues, teams, players, matches, standings)
- **Custom Grassroots API:** Lower-tier and youth soccer data with admin/contributor tools
- **Stripe:** Payment processing for subscription tiers (not yet configured - user dismissed Replit integration; when ready, either use Replit Stripe connector or request STRIPE_SECRET_KEY as secret)

### Documentation
- **docs/HIERARCHY_SPEC.md:** Complete hierarchy specification (Continent → Country → State → City → League → Team) with field names, IDs, required/optional fields, and mapping layer details
- **docs/API_CONTRACT.md:** Canonical API contract with field mappings, JSON payloads, and type mappings for all systems

### Build & Development
- **Vite:** Frontend build tool with React plugin and Tailwind CSS integration
- **esbuild:** Server bundling for production
- **TypeScript:** Full type safety across client, server, and shared code

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal:** Error overlay in development
- **@replit/vite-plugin-cartographer:** Development tooling
- **@replit/vite-plugin-dev-banner:** Development environment indicator