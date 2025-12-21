# Grassroots API Architecture Specification

## A) Architecture Overview

The Grassroots API is a comprehensive backend system designed to populate the World Soccer Leagues platform with lower-tier U.S. soccer data. It mirrors SportMonks' architecture but focuses on:

- **College Soccer** (NCAA D1/D2/D3, NAIA, NJCAA)
- **High School Soccer** (by state/city/school)
- **Youth Soccer** (clubs, leagues, age groups)
- **Adult Sanctioned Leagues** (recreational, competitive, co-ed, age groups)
- **Pickup Soccer** (events, groups, recurring sessions)
- **Fan Clubs** (supporter groups, watch parties, meeting spots)

### Core Design Principles
1. **Location-First**: All data indexed by State → City for fast geographic queries
2. **Template-Driven Input**: Contributors use scoped templates for their organization only
3. **Verification Tiers**: Data quality managed through Unverified → Community → Partner → Admin verified pipeline
4. **Content + Operations**: Beyond standings/schedules, supports news, events, registrations, documents, media
5. **External Integration**: Connectors for TeamPass and similar platforms

---

## B) Data Model (PostgreSQL Schema)

### Core Location Tables

```sql
-- Geographic hierarchy with fast lookups
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) NOT NULL UNIQUE,  -- 'USA'
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id),
  code VARCHAR(2) NOT NULL,  -- 'SC', 'CA', etc.
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  UNIQUE(country_id, code)
);
CREATE INDEX idx_states_code ON states(code);
CREATE INDEX idx_states_country ON states(country_id);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  population INTEGER,
  UNIQUE(state_id, slug)
);
CREATE INDEX idx_cities_state ON cities(state_id);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_geo ON cities(latitude, longitude);
```

### Organization Tables

```sql
-- Organization types: COLLEGE, HIGH_SCHOOL, YOUTH_CLUB, ADULT_LEAGUE, FAN_CLUB, PICKUP_GROUP
CREATE TYPE org_type AS ENUM (
  'COLLEGE', 'HIGH_SCHOOL', 'YOUTH_CLUB', 'ADULT_LEAGUE', 
  'FAN_CLUB', 'PICKUP_GROUP', 'STATE_ASSOCIATION', 'NATIONAL_BODY'
);

CREATE TYPE verification_tier AS ENUM (
  'UNVERIFIED', 'COMMUNITY_VERIFIED', 'PARTNER_VERIFIED', 'ADMIN_VERIFIED'
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type org_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(50),
  
  -- Location
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7),  -- hex
  secondary_color VARCHAR(7),
  
  -- Contact
  website TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  social_links JSONB DEFAULT '{}',  -- {twitter, instagram, facebook, tiktok}
  
  -- Affiliation
  parent_org_id UUID REFERENCES organizations(id),  -- e.g., state association
  sanctioning_body VARCHAR(100),  -- USSF, USYS, USASA, state assoc
  conference VARCHAR(100),
  division VARCHAR(100),
  
  -- Verification
  verification_tier verification_tier DEFAULT 'UNVERIFIED',
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  
  -- Metadata
  description TEXT,
  founded_year INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Data provenance
  data_source VARCHAR(50) DEFAULT 'MANUAL',  -- MANUAL, TEAMPASS, IMPORT, SCRAPE
  external_id VARCHAR(255),
  last_synced_at TIMESTAMPTZ
);

CREATE INDEX idx_orgs_type ON organizations(type);
CREATE INDEX idx_orgs_state ON organizations(state_id);
CREATE INDEX idx_orgs_city ON organizations(city_id);
CREATE INDEX idx_orgs_state_type ON organizations(state_id, type);
CREATE INDEX idx_orgs_verification ON organizations(verification_tier);
CREATE INDEX idx_orgs_geo ON organizations(latitude, longitude);
```

### Competition & Season Tables

```sql
CREATE TYPE competition_type AS ENUM (
  'LEAGUE', 'TOURNAMENT', 'CUP', 'FRIENDLY', 'SCRIMMAGE', 'SHOWCASE'
);

CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'COED');

CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  type competition_type NOT NULL,
  gender gender,
  age_group VARCHAR(20),  -- 'U12', 'U14', 'OPEN', 'O30', 'O40', 'VARSITY', 'JV'
  division VARCHAR(50),
  
  -- For tournaments
  format VARCHAR(50),  -- 'ROUND_ROBIN', 'KNOCKOUT', 'GROUP_KNOCKOUT'
  
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

CREATE INDEX idx_competitions_org ON competitions(org_id);
CREATE INDEX idx_competitions_state ON competitions(state_id);

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id),
  name VARCHAR(100) NOT NULL,  -- 'Fall 2024', 'Spring 2025'
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  registration_open BOOLEAN DEFAULT false,
  registration_deadline DATE,
  registration_url TEXT,
  fee_range VARCHAR(50),  -- '$50-$100'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seasons_competition ON seasons(competition_id);
CREATE INDEX idx_seasons_current ON seasons(is_current) WHERE is_current = true;
```

### Team & Roster Tables

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  
  gender gender,
  age_group VARCHAR(20),
  division VARCHAR(50),
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  
  -- Location (may differ from org)
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  home_venue_id UUID,
  
  -- Contact
  head_coach VARCHAR(255),
  coach_email VARCHAR(255),
  coach_phone VARCHAR(20),
  
  -- Sponsors
  sponsors JSONB DEFAULT '[]',
  
  verification_tier verification_tier DEFAULT 'UNVERIFIED',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  data_source VARCHAR(50) DEFAULT 'MANUAL',
  external_id VARCHAR(255),
  
  UNIQUE(org_id, slug)
);

CREATE INDEX idx_teams_org ON teams(org_id);
CREATE INDEX idx_teams_state ON teams(state_id);
CREATE INDEX idx_teams_city ON teams(city_id);
CREATE INDEX idx_teams_state_age ON teams(state_id, age_group);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(200),
  jersey_number VARCHAR(5),
  position VARCHAR(50),
  birth_year INTEGER,
  
  -- For college recruiting
  graduation_year INTEGER,
  high_school VARCHAR(255),
  club_team VARCHAR(255),
  
  -- Privacy: minimal PII stored
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id),
  season_id UUID REFERENCES seasons(id),
  player_id UUID REFERENCES players(id),
  jersey_number VARCHAR(5),
  position VARCHAR(50),
  is_captain BOOLEAN DEFAULT false,
  joined_date DATE,
  
  data_source VARCHAR(50) DEFAULT 'MANUAL',
  external_id VARCHAR(255),
  
  UNIQUE(team_id, season_id, player_id)
);

CREATE INDEX idx_rosters_team_season ON rosters(team_id, season_id);

CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  team_id UUID REFERENCES teams(id),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),  -- 'Head Coach', 'Assistant Coach', 'Manager', 'Trainer'
  email VARCHAR(255),
  phone VARCHAR(20),
  photo_url TEXT,
  bio TEXT,
  credentials TEXT,  -- licenses, certifications
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_org ON staff(org_id);
CREATE INDEX idx_staff_team ON staff(team_id);
```

### Venue Tables

```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  
  -- Location
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Details
  field_count INTEGER DEFAULT 1,
  surface VARCHAR(50),  -- 'GRASS', 'TURF', 'INDOOR'
  has_lights BOOLEAN DEFAULT false,
  capacity INTEGER,
  parking_notes TEXT,
  
  -- Contact
  phone VARCHAR(20),
  website TEXT,
  
  -- For fan club meeting spots
  is_bar_restaurant BOOLEAN DEFAULT false,
  
  photos JSONB DEFAULT '[]',
  
  org_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(state_id, slug)
);

CREATE INDEX idx_venues_state ON venues(state_id);
CREATE INDEX idx_venues_city ON venues(city_id);
CREATE INDEX idx_venues_geo ON venues(latitude, longitude);
```

### Match & Schedule Tables

```sql
CREATE TYPE match_status AS ENUM (
  'SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id),
  season_id UUID REFERENCES seasons(id),
  
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  
  venue_id UUID REFERENCES venues(id),
  
  scheduled_at TIMESTAMPTZ,
  kickoff_at TIMESTAMPTZ,
  
  status match_status DEFAULT 'SCHEDULED',
  
  home_score INTEGER,
  away_score INTEGER,
  
  -- For tournaments
  round VARCHAR(50),
  group_name VARCHAR(50),
  
  -- External links
  live_stream_url TEXT,
  highlights_url TEXT,
  
  notes TEXT,
  
  data_source VARCHAR(50) DEFAULT 'MANUAL',
  external_id VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_competition ON matches(competition_id);
CREATE INDEX idx_matches_season ON matches(season_id);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);
CREATE INDEX idx_matches_date ON matches(scheduled_at);
CREATE INDEX idx_matches_status ON matches(status);
```

### Standings & Stats Tables

```sql
CREATE TABLE standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES seasons(id),
  team_id UUID REFERENCES teams(id),
  
  position INTEGER,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INTEGER DEFAULT 0,
  
  -- Optional group for group stages
  group_name VARCHAR(50),
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(season_id, team_id)
);

CREATE INDEX idx_standings_season ON standings(season_id);

CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  season_id UUID REFERENCES seasons(id),
  team_id UUID REFERENCES teams(id),
  
  appearances INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  clean_sheets INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, season_id, team_id)
);
```

### Content Tables (News, Events, Documents)

```sql
CREATE TYPE content_type AS ENUM (
  'NEWS', 'ANNOUNCEMENT', 'MATCH_REPORT', 'RECAP', 'PRESS_RELEASE'
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  team_id UUID REFERENCES teams(id),
  
  type content_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  body TEXT,
  excerpt TEXT,
  
  featured_image_url TEXT,
  
  tags TEXT[] DEFAULT '{}',
  
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  author_name VARCHAR(255),
  
  verification_tier verification_tier DEFAULT 'UNVERIFIED',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_org ON posts(org_id);
CREATE INDEX idx_posts_team ON posts(team_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

CREATE TYPE event_type AS ENUM (
  'TRYOUT', 'TOURNAMENT', 'TRAINING', 'CAMP', 'MEETING', 
  'FUNDRAISER', 'WATCH_PARTY', 'SOCIAL', 'REGISTRATION', 'OTHER'
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  team_id UUID REFERENCES teams(id),
  
  type event_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  venue_id UUID REFERENCES venues(id),
  location_text TEXT,  -- fallback if no venue
  
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,  -- iCal RRULE format
  
  -- Registration
  registration_url TEXT,
  registration_deadline TIMESTAMPTZ,
  cost VARCHAR(100),
  capacity INTEGER,
  
  -- For tryouts/recruiting
  age_groups TEXT[] DEFAULT '{}',
  eligibility_notes TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  is_published BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_org ON events(org_id);
CREATE INDEX idx_events_team ON events(team_id);
CREATE INDEX idx_events_date ON events(start_at);
CREATE INDEX idx_events_type ON events(type);

CREATE TYPE document_type AS ENUM (
  'RULES', 'WAIVER', 'HANDBOOK', 'SCHEDULE', 'ROSTER', 
  'REGISTRATION_FORM', 'MEDICAL_FORM', 'OTHER'
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  
  type document_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),  -- 'PDF', 'DOC', 'XLS'
  file_size INTEGER,
  
  season_id UUID REFERENCES seasons(id),
  
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_org ON documents(org_id);
```

### Pickup Soccer Tables

```sql
CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

CREATE TABLE pickup_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),  -- pickup group
  
  name VARCHAR(255),
  description TEXT,
  
  venue_id UUID REFERENCES venues(id),
  location_text TEXT,
  
  -- Schedule
  day_of_week INTEGER,  -- 0=Sunday, 6=Saturday
  start_time TIME,
  end_time TIME,
  is_recurring BOOLEAN DEFAULT true,
  next_session_at TIMESTAMPTZ,
  
  -- Details
  skill_level skill_level DEFAULT 'ALL_LEVELS',
  gender gender DEFAULT 'COED',
  cost VARCHAR(50),  -- 'Free', '$5', '$10'
  max_players INTEGER,
  current_rsvps INTEGER DEFAULT 0,
  
  -- Contact
  organizer_name VARCHAR(255),
  organizer_email VARCHAR(255),
  organizer_phone VARCHAR(20),
  chat_link TEXT,  -- WhatsApp, Discord, etc.
  
  rules TEXT,
  safety_guidelines TEXT,
  
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  
  is_active BOOLEAN DEFAULT true,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pickup_state ON pickup_sessions(state_id);
CREATE INDEX idx_pickup_city ON pickup_sessions(city_id);
CREATE INDEX idx_pickup_day ON pickup_sessions(day_of_week);
CREATE INDEX idx_pickup_active ON pickup_sessions(is_active);
```

### Fan Club Tables

```sql
CREATE TABLE fan_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  
  -- What they support
  supported_team_ids UUID[] DEFAULT '{}',  -- internal team IDs
  supported_team_names TEXT[] DEFAULT '{}',  -- external teams (Man United, etc.)
  supported_countries TEXT[] DEFAULT '{}',  -- for World Cup
  
  -- Location
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  
  -- Contact
  website TEXT,
  email VARCHAR(255),
  social_links JSONB DEFAULT '{}',
  
  -- Membership
  membership_url TEXT,
  membership_cost VARCHAR(100),
  member_count INTEGER,
  
  logo_url TEXT,
  photos JSONB DEFAULT '[]',
  
  founded_year INTEGER,
  is_active BOOLEAN DEFAULT true,
  
  verification_tier verification_tier DEFAULT 'UNVERIFIED',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fanclubs_state ON fan_clubs(state_id);
CREATE INDEX idx_fanclubs_city ON fan_clubs(city_id);
CREATE INDEX idx_fanclubs_supported ON fan_clubs USING GIN(supported_team_names);
CREATE INDEX idx_fanclubs_countries ON fan_clubs USING GIN(supported_countries);

CREATE TABLE fan_club_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_club_id UUID REFERENCES fan_clubs(id),
  venue_id UUID REFERENCES venues(id),
  
  is_primary BOOLEAN DEFAULT false,
  meeting_schedule TEXT,  -- "Every Saturday match day"
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE watch_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_club_id UUID REFERENCES fan_clubs(id),
  venue_id UUID REFERENCES venues(id),
  
  match_description VARCHAR(255),  -- "USA vs Mexico - World Cup Qualifier"
  opponent VARCHAR(255),
  competition VARCHAR(255),
  
  event_at TIMESTAMPTZ NOT NULL,
  
  notes TEXT,
  rsvp_link TEXT,
  expected_attendance INTEGER,
  
  is_published BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_watch_parties_fanclub ON watch_parties(fan_club_id);
CREATE INDEX idx_watch_parties_date ON watch_parties(event_at);
```

### Data Submission & Verification Tables

```sql
CREATE TYPE submission_status AS ENUM (
  'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES'
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What's being submitted
  entity_type VARCHAR(50) NOT NULL,  -- 'organization', 'team', 'event', etc.
  entity_id UUID,  -- NULL for new, populated for updates
  
  template_type VARCHAR(50),  -- 'COLLEGE', 'HIGH_SCHOOL', 'YOUTH', etc.
  
  data JSONB NOT NULL,  -- the submitted data
  
  -- Submitter
  submitted_by UUID,
  submitter_email VARCHAR(255),
  submitter_name VARCHAR(255),
  submitter_role VARCHAR(100),
  
  -- Review
  status submission_status DEFAULT 'PENDING',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- For updates, store diff
  previous_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_entity ON submissions(entity_type, entity_id);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  
  action VARCHAR(50) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'VERIFY'
  
  previous_data JSONB,
  new_data JSONB,
  
  performed_by UUID,
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_log(performed_at DESC);

CREATE TABLE external_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,  -- 'TeamPass', 'GotSoccer', etc.
  type VARCHAR(50),  -- 'API', 'IMPORT', 'SCRAPE'
  
  api_endpoint TEXT,
  credentials_encrypted TEXT,  -- encrypted API keys
  
  last_sync_at TIMESTAMPTZ,
  sync_frequency_hours INTEGER DEFAULT 24,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES external_sources(id),
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  status VARCHAR(50),  -- 'RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED'
  
  records_fetched INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  error_log JSONB DEFAULT '[]'
);
```

---

## C) Templates with Required Fields

### Template A: College Soccer

```json
{
  "template": "COLLEGE",
  "sections": [
    {
      "name": "School Information",
      "required": ["name", "state_id", "city_id", "division", "conference"],
      "optional": ["address", "website", "logo_url", "founded_year"]
    },
    {
      "name": "Teams",
      "required": ["gender", "head_coach"],
      "optional": ["assistant_coaches", "home_venue_id", "team_colors"]
    },
    {
      "name": "Schedule",
      "required": ["season_name", "start_date"],
      "optional": ["matches", "end_date"]
    },
    {
      "name": "Roster",
      "required": [],
      "optional": ["players"]
    },
    {
      "name": "Recruiting",
      "required": [],
      "optional": ["tryout_dates", "contact_email", "eligibility_requirements", "recruiting_questionnaire_url"]
    },
    {
      "name": "Content",
      "required": [],
      "optional": ["news_posts", "events", "documents", "streaming_links"]
    }
  ],
  "example_payload": {
    "name": "College of Charleston",
    "short_name": "CofC",
    "state_id": "SC",
    "city_id": "charleston",
    "division": "NCAA Division I",
    "conference": "CAA",
    "website": "https://cofcsports.com/soccer",
    "teams": [
      {
        "gender": "MALE",
        "head_coach": "John Smith",
        "coach_email": "jsmith@cofc.edu"
      },
      {
        "gender": "FEMALE",
        "head_coach": "Jane Doe",
        "coach_email": "jdoe@cofc.edu"
      }
    ],
    "recruiting": {
      "contact_email": "recruiting@cofc.edu",
      "questionnaire_url": "https://forms.cofc.edu/soccer"
    }
  }
}
```

### Template B: High School Soccer

```json
{
  "template": "HIGH_SCHOOL",
  "sections": [
    {
      "name": "School Information",
      "required": ["name", "state_id", "city_id", "district"],
      "optional": ["address", "website", "logo_url", "conference"]
    },
    {
      "name": "Teams",
      "required": ["gender", "level"],
      "optional": ["head_coach", "assistant_coach", "home_venue_id"]
    },
    {
      "name": "Season",
      "required": ["season_name"],
      "optional": ["start_date", "end_date", "schedule"]
    },
    {
      "name": "Roster",
      "optional": ["players"]
    },
    {
      "name": "Content",
      "optional": ["news", "events", "tryout_info", "documents"]
    }
  ],
  "example_payload": {
    "name": "Wando High School",
    "state_id": "SC",
    "city_id": "mount-pleasant",
    "district": "Charleston County School District",
    "conference": "Region 7-AAAAA",
    "teams": [
      {
        "gender": "MALE",
        "level": "VARSITY",
        "head_coach": "Coach Williams"
      },
      {
        "gender": "FEMALE",
        "level": "VARSITY",
        "head_coach": "Coach Johnson"
      }
    ]
  }
}
```

### Template C: Youth Club/League

```json
{
  "template": "YOUTH",
  "sections": [
    {
      "name": "Club Information",
      "required": ["name", "state_id", "city_id"],
      "optional": ["address", "website", "logo_url", "sanctioning_body", "founded_year"]
    },
    {
      "name": "Teams",
      "required": ["age_group", "gender"],
      "optional": ["team_name", "head_coach", "division"]
    },
    {
      "name": "Registration",
      "optional": ["registration_url", "registration_deadline", "fee_range", "age_groups_offered"]
    },
    {
      "name": "Tournaments",
      "optional": ["hosted_tournaments", "entry_fees", "dates"]
    },
    {
      "name": "Staff",
      "optional": ["coaches", "directors", "credentials"]
    },
    {
      "name": "Content",
      "optional": ["news", "events", "tryouts", "camps", "documents", "sponsors"]
    }
  ],
  "example_payload": {
    "name": "Charleston Battery Youth",
    "state_id": "SC",
    "city_id": "charleston",
    "sanctioning_body": "US Youth Soccer / SC Youth Soccer",
    "website": "https://charlestonbatteryyouth.com",
    "teams": [
      { "age_group": "U12", "gender": "MALE", "division": "ECNL" },
      { "age_group": "U14", "gender": "FEMALE", "division": "GA" }
    ],
    "registration": {
      "url": "https://register.charlestonbatteryyouth.com",
      "deadline": "2025-08-01",
      "fee_range": "$1,500 - $2,500"
    }
  }
}
```

### Template D: Adult Sanctioned League

```json
{
  "template": "ADULT",
  "sections": [
    {
      "name": "League Information",
      "required": ["name", "state_id", "city_id"],
      "optional": ["website", "logo_url", "sanctioning_body"]
    },
    {
      "name": "Divisions",
      "required": ["division_name"],
      "optional": ["gender", "age_group", "skill_level"]
    },
    {
      "name": "Teams",
      "optional": ["team_name", "captain_name", "captain_email"]
    },
    {
      "name": "Schedule & Standings",
      "optional": ["season_name", "matches", "standings"]
    },
    {
      "name": "Registration",
      "optional": ["registration_url", "deadline", "team_fee", "individual_fee"]
    },
    {
      "name": "Rules & Documents",
      "optional": ["rules_pdf_url", "waiver_url", "handbook_url"]
    },
    {
      "name": "Discipline",
      "optional": ["card_tracking", "suspensions"]
    },
    {
      "name": "Content",
      "optional": ["news", "events", "sponsors"]
    }
  ],
  "example_payload": {
    "name": "Charleston Adult Soccer League",
    "state_id": "SC",
    "city_id": "charleston",
    "sanctioning_body": "USASA",
    "divisions": [
      { "name": "Open Men's D1", "gender": "MALE", "skill_level": "COMPETITIVE" },
      { "name": "Over 30 Coed", "gender": "COED", "age_group": "O30" },
      { "name": "Women's Recreational", "gender": "FEMALE", "skill_level": "RECREATIONAL" }
    ],
    "registration": {
      "url": "https://casl.com/register",
      "team_fee": "$850",
      "deadline": "2025-03-01"
    }
  }
}
```

### Template E: Pickup Soccer

```json
{
  "template": "PICKUP",
  "sections": [
    {
      "name": "Session Information",
      "required": ["name", "state_id", "city_id", "day_of_week", "start_time"],
      "optional": ["end_time", "venue_id", "location_text"]
    },
    {
      "name": "Details",
      "required": ["skill_level"],
      "optional": ["gender", "cost", "max_players"]
    },
    {
      "name": "Organizer",
      "required": ["organizer_name"],
      "optional": ["organizer_email", "organizer_phone", "chat_link"]
    },
    {
      "name": "Rules & Safety",
      "optional": ["rules", "safety_guidelines"]
    }
  ],
  "example_payload": {
    "name": "Sunday Morning Pickup at Hampton Park",
    "state_id": "SC",
    "city_id": "charleston",
    "location_text": "Hampton Park, Upper Field",
    "day_of_week": 0,
    "start_time": "09:00",
    "end_time": "11:00",
    "skill_level": "ALL_LEVELS",
    "gender": "COED",
    "cost": "Free",
    "max_players": 22,
    "organizer_name": "Mike Thompson",
    "chat_link": "https://chat.whatsapp.com/abc123"
  }
}
```

### Template F: Fan Club

```json
{
  "template": "FAN_CLUB",
  "sections": [
    {
      "name": "Club Information",
      "required": ["name", "state_id", "city_id"],
      "optional": ["description", "logo_url", "website", "founded_year"]
    },
    {
      "name": "Supported Teams/Countries",
      "required": [],
      "optional": ["supported_team_names", "supported_countries"]
    },
    {
      "name": "Meeting Spots",
      "optional": ["primary_venue", "secondary_venues", "meeting_schedule"]
    },
    {
      "name": "Contact & Social",
      "optional": ["email", "twitter", "instagram", "facebook"]
    },
    {
      "name": "Membership",
      "optional": ["membership_url", "membership_cost", "member_count"]
    },
    {
      "name": "Events",
      "optional": ["watch_parties", "social_events"]
    }
  ],
  "example_payload": {
    "name": "American Outlaws - Charleston",
    "state_id": "SC",
    "city_id": "charleston",
    "description": "Official Charleston chapter of American Outlaws supporters",
    "supported_team_names": ["USMNT", "USWNT"],
    "supported_countries": ["USA"],
    "primary_venue": {
      "name": "The Windjammer",
      "address": "1008 Ocean Blvd, Isle of Palms, SC",
      "meeting_schedule": "All USMNT/USWNT matches"
    },
    "social_links": {
      "twitter": "@AOCharleston",
      "instagram": "@aocharleston"
    },
    "membership_url": "https://americanoutlaws.com/chapters/charleston"
  }
}
```

---

## D) API Endpoints

### Location Endpoints

```
GET /api/v1/states
Response: { states: [{ id, code, name, slug }] }

GET /api/v1/states/:stateCode/cities
Response: { cities: [{ id, name, slug, latitude, longitude }] }

GET /api/v1/cities/:cityId
Response: { id, name, state, latitude, longitude }
```

### Browse by Category

```
GET /api/v1/college/schools?state=SC&city=charleston&division=D1
Response: {
  data: [{ id, name, slug, division, conference, teams: [...] }],
  pagination: { page, limit, total }
}

GET /api/v1/highschool/schools?state=SC&city=charleston
Response: {
  data: [{ id, name, district, teams: [...] }],
  pagination: { ... }
}

GET /api/v1/youth/clubs?state=SC&city=charleston
Response: {
  data: [{ id, name, age_groups, registration_open, ... }],
  pagination: { ... }
}

GET /api/v1/adult/leagues?state=SC&city=charleston
Response: {
  data: [{ id, name, divisions: [...], registration: {...} }],
  pagination: { ... }
}

GET /api/v1/pickup/sessions?state=SC&city=charleston&day=0
Response: {
  data: [{ id, name, venue, time, skill_level, organizer, ... }],
  pagination: { ... }
}

GET /api/v1/fanclubs?state=SC&city=charleston&supportedCountry=USA
Response: {
  data: [{ id, name, supported_teams, meeting_spot, ... }],
  pagination: { ... }
}
```

### Entity Detail

```
GET /api/v1/teams/:id
GET /api/v1/leagues/:id
GET /api/v1/organizations/:id
GET /api/v1/venues/:id
```

### Schedule & Standings

```
GET /api/v1/teams/:id/matches?season=2024-fall
GET /api/v1/leagues/:id/standings?season=2024-fall
GET /api/v1/leagues/:id/schedule?season=2024-fall
```

### Content

```
GET /api/v1/organizations/:id/news
GET /api/v1/organizations/:id/events
GET /api/v1/organizations/:id/documents
GET /api/v1/teams/:id/news
```

### Submissions

```
POST /api/v1/submissions
Body: { template_type, data, submitter_email, submitter_name }

GET /api/v1/submissions/:id
PATCH /api/v1/submissions/:id  (update draft)
POST /api/v1/submissions/:id/submit  (finalize)

# Admin only:
POST /api/v1/submissions/:id/approve
POST /api/v1/submissions/:id/reject
Body: { review_notes }
```

---

## E) Verification Workflow

### Tiers
1. **UNVERIFIED** - User-submitted, not reviewed
2. **COMMUNITY_VERIFIED** - Reviewed by community moderators, basic checks passed
3. **PARTNER_VERIFIED** - Submitted by verified partner organization
4. **ADMIN_VERIFIED** - Reviewed and verified by WSL admin team

### Workflow
```
[Submit] → PENDING → [Auto-validation] → 
  ├─ PASS → UNVERIFIED (visible, flagged)
  └─ FAIL → NEEDS_CHANGES (returned to submitter)

[Community Review] → COMMUNITY_VERIFIED (visible, trusted)

[Partner Badge] → PARTNER_VERIFIED (automatic for verified orgs)

[Admin Review] → ADMIN_VERIFIED (highest trust)
```

### Data Freshness
- `last_updated_at` on all entities
- `stale_threshold` configurable per entity type (7 days for events, 30 days for orgs)
- Automated reminders to contributors for stale data

---

## F) Integration Plan (TeamPass Connector)

### ExternalSourceConnector Pattern

```typescript
interface ExternalSourceConnector {
  name: string;
  type: 'API' | 'IMPORT' | 'SCRAPE';
  
  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  // Fetch
  fetchTeams(params: FetchParams): Promise<ExternalTeam[]>;
  fetchPlayers(params: FetchParams): Promise<ExternalPlayer[]>;
  fetchMatches(params: FetchParams): Promise<ExternalMatch[]>;
  fetchStandings(params: FetchParams): Promise<ExternalStanding[]>;
  
  // Transform
  mapToInternal<T>(externalData: any, entityType: string): T;
  
  // Sync
  sync(options: SyncOptions): Promise<SyncResult>;
}
```

### TeamPass Mapping

| TeamPass Entity | Grassroots Entity |
|----------------|-------------------|
| Organization | organizations |
| Team | teams |
| Player/Registration | players + rosters |
| Event/Game | matches |
| Standings | standings |
| Venue | venues |
| Registration Info | seasons (fee metadata) |
| News/Posts | posts (if available) |

### Sync Strategy
- **Webhook** (preferred): Real-time updates if TeamPass supports
- **Scheduled Pull**: Daily sync at 3 AM for full refresh
- **On-Demand**: Manual trigger for specific org

### De-duplication
- Match by `external_id` first
- Fuzzy match by name + location if no external_id
- Store `data_source` and `external_id` for traceability

---

## G) Admin Panel Backend Requirements

### Contributor Management
- CRUD for users with role assignment
- Scope assignment (which orgs/states can they manage)
- Activity log per contributor

### Template Assignment
- Assign templates to organizations
- Track completion status
- Send reminders for incomplete profiles

### Approval Queue
- List all pending submissions
- Filter by type, state, date
- Bulk approve/reject
- Assign to reviewers

### Edit History
- Full audit trail per entity
- Diff view between versions
- One-click rollback

### Data Export
- Export by org, state, or entity type
- CSV, JSON formats
- Scheduled exports

### Moderation Tools
- Flag content for review
- User warnings/bans
- Content removal with reason

### Partner Onboarding
- Onboarding checklist
- Verification document upload
- API key generation for partners

---

## H) Implementation Notes

### PostgreSQL (Recommended)
- Use UUID for all IDs
- JSONB for flexible fields (social_links, sponsors, etc.)
- GIN indexes for array/JSONB searches
- PostGIS extension for geo queries if needed
- Partitioning by state for large tables

### Caching Strategy
- Redis for:
  - Session data
  - API rate limiting
  - Frequently accessed lists (states, cities)
  - Search results (5-minute TTL)

### Search
- PostgreSQL full-text search for basic needs
- Elasticsearch/Meilisearch for advanced search across all entities

### File Storage
- Store URLs only in database
- Actual files in S3/Cloudflare R2
- CDN for logo/image delivery

### API Rate Limiting
- 100 requests/minute for public endpoints
- 1000 requests/minute for authenticated users
- 10000 requests/minute for verified partners

---

This architecture is designed to scale to all 50 states while keeping onboarding friction minimal for individual organizations.
