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
- **Schema:** Drizzle schema defines users and user preferences tables with Zod validation via drizzle-zod

### Component Architecture
- **Layout Components:** AppShell with TopBar, BottomNav, and NavDrawer for mobile-first navigation
- **UI Components:** Full shadcn/ui component library with Radix UI primitives
- **Page Components:** Each hierarchy level has its own page component with loading states and data fetching

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

### Build & Development
- **Vite:** Frontend build tool with React plugin and Tailwind CSS integration
- **esbuild:** Server bundling for production
- **TypeScript:** Full type safety across client, server, and shared code

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal:** Error overlay in development
- **@replit/vite-plugin-cartographer:** Development tooling
- **@replit/vite-plugin-dev-banner:** Development environment indicator