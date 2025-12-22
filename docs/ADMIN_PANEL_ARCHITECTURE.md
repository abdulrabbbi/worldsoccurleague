# Admin Panel + Admin API Architecture Specification

## A) Information Architecture (Menu Structure)

```
ADMIN PANEL
├── Dashboard
│   ├── System Health Overview
│   ├── Active Alerts
│   ├── Key Metrics (users, submissions, syncs)
│   └── Quick Actions
│
├── Users & Access Control
│   ├── User Directory
│   ├── Roles & Permissions
│   ├── Scope Assignments
│   └── Audit Log
│
├── Data Contribution Hub
│   ├── Template Manager
│   ├── Submission Queue
│   ├── Bulk Import Tool
│   └── Submission History
│
├── Grassroots Data Management
│   ├── Organizations
│   ├── Competitions & Seasons
│   ├── Teams & Rosters
│   ├── Venues
│   ├── Matches & Scheduling
│   ├── Standings
│   ├── Verification Pipeline
│   └── Content (News/Events/Docs)
│
├── Pro Data Integrations
│   ├── SportMonks Configuration
│   ├── Mapping Rules
│   ├── Sync Jobs
│   └── Conflict Resolution
│
├── External Connectors
│   ├── Connector Catalog
│   ├── Active Connectors
│   ├── Field Mapping Editor
│   ├── Sync Schedules
│   └── Connector Logs
│
├── Content Studio
│   ├── News & Posts
│   ├── Match Reports
│   ├── Events Calendar
│   ├── Documents Library
│   ├── Media Library
│   └── Notification Hooks
│
├── Ads Management
│   ├── Ad Zones
│   ├── Placements
│   ├── Targeting Rules
│   ├── Campaign Scheduler
│   └── Performance Reports
│
├── Community Integration
│   ├── SSO Configuration
│   ├── Group Mapping
│   ├── Moderation Settings
│   └── Embed Configuration
│
├── Marketplace Control
│   ├── Vendor Management
│   ├── Item Moderation
│   ├── Categories
│   └── Fraud & Reporting
│
├── Shop & Affiliates
│   ├── Partner Management
│   ├── Offer Configuration
│   ├── Link & UTM Tracking
│   └── Performance Reports
│
├── Chatbot / AI Assistant
│   ├── Bot Instances
│   ├── Knowledge Sources
│   ├── Safety Policies
│   └── Usage Analytics
│
├── QA & Monitoring
│   ├── Health Dashboard
│   ├── Log Explorer
│   ├── Test Tools
│   └── Status Page
│
└── Settings
    ├── Environment Config
    ├── Feature Flags
    └── Secrets Vault
```

---

## B) RBAC Permission Matrix

### Role Definitions

| Role | Scope | Description |
|------|-------|-------------|
| **Super Admin** | Global | Platform owner. Full access to all modules, secrets, and configurations. |
| **Product Admin** | Global | Configure integrations, templates, ads, roles. Cannot manage secrets vault. |
| **Regional Admin** | State/City | Manage organizations, content, and submissions within assigned geographic scope. |
| **Data Partner Admin** | Organization(s) | Manage templates, data submissions, teams, and content for assigned org(s). |
| **Team Manager** | Team | Edit rosters, schedules, team content. Submit updates for approval. |
| **Fan Club Organizer** | Fan Club | Manage fan club events, watch parties, content. View analytics. |
| **Pickup Organizer** | Pickup Group | Manage pickup sessions, attendance, notifications. |
| **Content Editor** | Configurable | Manage news, events, documents, media within assigned scope. |
| **Support/Moderator** | Global Read | Read access across modules. Resolve queues, flag content, assist users. |
| **Read-only Auditor** | Global Read | View audit logs, dashboards, reports. No edit capabilities. |

### Permission Matrix

| Module | Super Admin | Product Admin | Regional Admin | Data Partner | Team Manager | Fan Club Org | Content Editor | Moderator | Auditor |
|--------|-------------|---------------|----------------|--------------|--------------|--------------|----------------|-----------|---------|
| **Dashboard** | Full | Full | Scoped | Scoped | Scoped | Scoped | Scoped | Read | Read |
| **Users & Roles** | CRUD | CRUD (not Super) | Read | - | - | - | - | Read | Read |
| **Scope Assignments** | CRUD | CRUD | Read own | Read own | Read own | Read own | Read own | Read | Read |
| **Audit Log** | Full | Full | Scoped | Scoped | Scoped | Scoped | Scoped | Read | Read |
| **Templates** | CRUD | CRUD | Read | Use assigned | - | - | - | Read | Read |
| **Submission Queue** | CRUD | CRUD | CRUD scoped | Create/Edit own | Create own | Create own | - | Review | Read |
| **Bulk Import** | Full | Full | Scoped | Scoped | - | - | - | - | - |
| **Organizations** | CRUD | CRUD | CRUD scoped | Edit assigned | - | - | - | Read | Read |
| **Teams** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | - | - | Read | Read |
| **Venues** | CRUD | CRUD | CRUD scoped | CRUD assigned | Edit own | Edit own | - | Read | Read |
| **Matches/Schedule** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | - | - | Read | Read |
| **Verification** | Approve all | Approve all | Approve scoped | - | - | - | - | Review | Read |
| **SportMonks Config** | Full | Full | - | - | - | - | - | Read | Read |
| **External Connectors** | Full | Full | Read | Read own | - | - | - | Read | Read |
| **Sync Jobs** | Full | Full | View scoped | View own | - | - | - | View | View |
| **News/Posts** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | CRUD own | CRUD scoped | Moderate | Read |
| **Events** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | CRUD own | CRUD scoped | Moderate | Read |
| **Documents** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | CRUD own | CRUD scoped | Moderate | Read |
| **Media Library** | CRUD | CRUD | CRUD scoped | CRUD assigned | CRUD own | CRUD own | CRUD scoped | Moderate | Read |
| **Ad Zones** | CRUD | CRUD | Read | - | - | - | - | Read | Read |
| **Ad Placements** | CRUD | CRUD | Read | - | - | - | - | Read | Read |
| **Ad Reports** | Full | Full | Scoped | - | - | - | - | Read | Read |
| **Community SSO** | Full | Full | - | - | - | - | - | - | Read |
| **Group Mapping** | Full | Full | View | - | - | - | - | View | Read |
| **Moderation** | Full | Full | Scoped | - | - | - | - | Full | Read |
| **Marketplace Vendors** | CRUD | CRUD | Read | - | - | - | - | Moderate | Read |
| **Shop Partners** | CRUD | CRUD | Read | - | - | - | - | Read | Read |
| **Affiliate Tracking** | Full | Full | Read | - | - | - | - | Read | Read |
| **Chatbot Instances** | CRUD | CRUD | - | - | - | - | - | - | Read |
| **Knowledge Sources** | CRUD | CRUD | - | - | - | - | - | - | Read |
| **Health Dashboard** | Full | Full | Read | Read | Read | Read | Read | Read | Read |
| **Log Explorer** | Full | Full | Scoped | Scoped | Scoped | Scoped | Scoped | Read | Read |
| **Test Tools** | Full | Full | - | - | - | - | - | - | - |
| **Secrets Vault** | Full | - | - | - | - | - | - | - | - |
| **Feature Flags** | Full | Full | - | - | - | - | - | - | Read |

---

## C) Admin Data Model

### User & Access Control Tables

```sql
-- Admin users (extends or links to main users table)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),  -- link to main app user
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,  -- for admin-only accounts
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret TEXT,  -- encrypted
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,  -- built-in roles cannot be deleted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, display_name, is_system) VALUES
  ('super_admin', 'Super Admin', true),
  ('product_admin', 'Product Admin', true),
  ('regional_admin', 'Regional Admin', true),
  ('data_partner_admin', 'Data Partner Admin', true),
  ('team_manager', 'Team Manager', true),
  ('fan_club_organizer', 'Fan Club Organizer', true),
  ('pickup_organizer', 'Pickup Organizer', true),
  ('content_editor', 'Content Editor', true),
  ('moderator', 'Support/Moderator', true),
  ('auditor', 'Read-only Auditor', true);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR(100) NOT NULL,  -- 'users', 'templates', 'organizations', etc.
  action VARCHAR(50) NOT NULL,   -- 'create', 'read', 'update', 'delete', 'approve', 'manage'
  description TEXT,
  UNIQUE(module, action)
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- User role assignments with scope
CREATE TABLE user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  
  -- Scope (all nullable; null = global for that dimension)
  country_id UUID REFERENCES countries(id),
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  org_id UUID REFERENCES organizations(id),
  team_id UUID REFERENCES teams(id),
  competition_id UUID REFERENCES competitions(id),
  
  assigned_by UUID REFERENCES admin_users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  UNIQUE(admin_user_id, role_id, state_id, city_id, org_id, team_id)
);

CREATE INDEX idx_user_roles_user ON user_role_assignments(admin_user_id);
CREATE INDEX idx_user_roles_scope ON user_role_assignments(state_id, city_id, org_id);

-- Session tokens for admin panel
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);
```

### Audit & Logging Tables

```sql
CREATE TYPE audit_action AS ENUM (
  'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 
  'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'SYNC'
);

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who
  admin_user_id UUID REFERENCES admin_users(id),
  role_at_action VARCHAR(100),
  
  -- What
  action audit_action NOT NULL,
  module VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  
  -- Changes
  previous_data JSONB,
  new_data JSONB,
  diff JSONB,  -- computed diff for quick viewing
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id UUID,
  
  -- When
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_date ON admin_audit_log(performed_at DESC);
CREATE INDEX idx_audit_module ON admin_audit_log(module);
```

### Template Management Tables

```sql
CREATE TYPE template_status AS ENUM ('DRAFT', 'PUBLISHED', 'DEPRECATED');

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,  -- 'COLLEGE', 'HIGH_SCHOOL', 'YOUTH', 'ADULT', 'PICKUP', 'FAN_CLUB'
  name VARCHAR(255) NOT NULL,
  version INTEGER DEFAULT 1,
  status template_status DEFAULT 'DRAFT',
  
  -- Template definition
  sections JSONB NOT NULL,  -- [{name, fields: [{name, type, required, validation, ...}]}]
  validation_rules JSONB DEFAULT '{}',
  
  -- UI hints
  layout_config JSONB DEFAULT '{}',
  help_text TEXT,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  UNIQUE(type, version)
);

CREATE TABLE template_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  org_id UUID REFERENCES organizations(id),
  admin_user_id UUID REFERENCES admin_users(id),  -- contributor
  
  assigned_by UUID REFERENCES admin_users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  completion_status INTEGER DEFAULT 0,  -- percentage
  last_submitted_at TIMESTAMPTZ,
  
  UNIQUE(template_id, org_id)
);
```

### Submission & Approval Tables

```sql
CREATE TYPE submission_status AS ENUM (
  'DRAFT', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES'
);

CREATE TABLE approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What's being submitted
  template_id UUID REFERENCES templates(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,  -- null for new entities
  
  -- Submitted data
  data JSONB NOT NULL,
  previous_data JSONB,  -- for updates
  
  -- Submitter
  submitted_by UUID REFERENCES admin_users(id),
  org_id UUID REFERENCES organizations(id),
  
  -- Review
  status submission_status DEFAULT 'PENDING',
  priority INTEGER DEFAULT 0,
  
  assigned_reviewer UUID REFERENCES admin_users(id),
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Validation
  validation_errors JSONB DEFAULT '[]',
  auto_validation_passed BOOLEAN,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON approval_queue(status);
CREATE INDEX idx_queue_org ON approval_queue(org_id);
CREATE INDEX idx_queue_reviewer ON approval_queue(assigned_reviewer);

CREATE TABLE submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID REFERENCES approval_queue(id),
  
  action VARCHAR(50) NOT NULL,  -- 'submitted', 'reviewed', 'approved', 'rejected', 'changes_requested'
  performed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  data_snapshot JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Bulk Import Tables

```sql
CREATE TYPE import_status AS ENUM (
  'PENDING', 'VALIDATING', 'VALIDATED', 'IMPORTING', 'COMPLETED', 'FAILED', 'PARTIAL'
);

CREATE TABLE bulk_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  template_id UUID REFERENCES templates(id),
  org_id UUID REFERENCES organizations(id),
  
  -- File info
  file_name VARCHAR(255),
  file_url TEXT,
  file_type VARCHAR(10),  -- 'CSV', 'JSON', 'XLSX'
  
  -- Mapping
  field_mapping JSONB,  -- {sourceColumn: targetField, ...}
  
  -- Stats
  total_rows INTEGER DEFAULT 0,
  validated_rows INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  
  status import_status DEFAULT 'PENDING',
  error_summary TEXT,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE bulk_import_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES bulk_import_jobs(id) ON DELETE CASCADE,
  
  row_number INTEGER,
  field_name VARCHAR(100),
  error_type VARCHAR(50),
  error_message TEXT,
  raw_value TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Connector & Integration Tables

```sql
CREATE TYPE connector_type AS ENUM ('API', 'IMPORT', 'WEBHOOK', 'SCRAPE');
CREATE TYPE connector_status AS ENUM ('ACTIVE', 'PAUSED', 'ERROR', 'DISABLED');

CREATE TABLE connector_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,  -- 'TeamPass', 'GotSoccer', etc.
  display_name VARCHAR(100) NOT NULL,
  type connector_type NOT NULL,
  
  -- Configuration schema
  config_schema JSONB NOT NULL,  -- JSON Schema for required fields
  
  -- Default mapping template
  default_field_mapping JSONB,
  
  documentation_url TEXT,
  logo_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE connector_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id UUID REFERENCES connector_definitions(id),
  
  name VARCHAR(255) NOT NULL,
  
  -- Scope: which org/league this connector serves
  org_id UUID REFERENCES organizations(id),
  competition_id UUID REFERENCES competitions(id),
  
  -- Configuration (credentials encrypted)
  config JSONB NOT NULL,  -- encrypted API keys, endpoints, etc.
  
  -- Field mapping overrides
  field_mapping JSONB,
  
  -- Sync settings
  sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_hours INTEGER DEFAULT 24,
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  
  status connector_status DEFAULT 'ACTIVE',
  error_message TEXT,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES connector_instances(id),
  
  -- Trigger
  trigger_type VARCHAR(50),  -- 'SCHEDULED', 'MANUAL', 'WEBHOOK'
  triggered_by UUID REFERENCES admin_users(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, RUNNING, SUCCESS, PARTIAL, FAILED
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Stats
  records_fetched INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Errors
  error_log JSONB DEFAULT '[]',
  error_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_connector ON sync_jobs(connector_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);

-- Integration configurations for third-party services
CREATE TABLE integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  service VARCHAR(50) NOT NULL UNIQUE,  -- 'sportmonks', 'adbutler', 'community', 'marketplace', 'chatbot'
  display_name VARCHAR(100) NOT NULL,
  
  -- Configuration (encrypted where needed)
  config JSONB NOT NULL,
  
  -- Status
  is_enabled BOOLEAN DEFAULT false,
  last_health_check TIMESTAMPTZ,
  health_status VARCHAR(50),  -- 'HEALTHY', 'DEGRADED', 'DOWN'
  
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Ads Management Tables

```sql
CREATE TYPE ad_zone_type AS ENUM ('GLOBAL', 'NATIONAL', 'STATE', 'CITY', 'CUSTOM');

CREATE TABLE ad_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,
  type ad_zone_type NOT NULL,
  
  -- Scope
  country_id UUID REFERENCES countries(id),
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  
  -- AdButler reference
  adbutler_zone_id VARCHAR(100),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES ad_zones(id),
  
  name VARCHAR(100) NOT NULL,
  app_section VARCHAR(100) NOT NULL,  -- 'home', 'league_page', 'team_page', 'community', etc.
  position VARCHAR(50),  -- 'header', 'sidebar', 'inline', 'footer'
  
  -- Dimensions
  width INTEGER,
  height INTEGER,
  format VARCHAR(50),  -- 'banner', 'native', 'interstitial'
  
  -- Targeting
  targeting_rules JSONB DEFAULT '{}',
  
  -- Schedule
  start_date DATE,
  end_date DATE,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ad_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID REFERENCES ad_placements(id),
  
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5, 4),  -- click-through rate
  revenue DECIMAL(10, 2),
  
  UNIQUE(placement_id, date)
);
```

### Community & Marketplace Tables

```sql
CREATE TABLE community_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- SSO
  sso_provider VARCHAR(50),  -- 'bettermode', 'discourse', etc.
  sso_endpoint TEXT,
  sso_api_key TEXT,  -- encrypted
  sso_secret TEXT,   -- encrypted
  
  -- Group mapping
  group_mapping_rules JSONB DEFAULT '{}',  -- {stateId: groupId, teamId: groupId}
  
  -- Moderation
  moderation_webhook_url TEXT,
  auto_moderation_enabled BOOLEAN DEFAULT false,
  
  -- Embedding
  embed_base_url TEXT,
  embed_token TEXT,
  
  is_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marketplace_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Provider
  provider VARCHAR(50),
  api_endpoint TEXT,
  api_key TEXT,  -- encrypted
  
  -- Categories
  enabled_categories TEXT[] DEFAULT '{}',
  
  -- Moderation
  require_vendor_approval BOOLEAN DEFAULT true,
  require_item_approval BOOLEAN DEFAULT true,
  
  -- Fees
  commission_rate DECIMAL(5, 4),
  
  is_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shop_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),  -- 'gear', 'apparel', 'tickets', 'travel', 'training'
  
  -- Affiliate details
  affiliate_network VARCHAR(100),
  affiliate_id VARCHAR(100),
  base_url TEXT,
  
  -- Tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Stats
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Chatbot / AI Tables

```sql
CREATE TABLE chatbot_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,
  scope VARCHAR(50),  -- 'global', 'league', 'team', 'community', 'help'
  
  -- Configuration
  model VARCHAR(100),  -- 'gpt-4', 'claude-3', etc.
  system_prompt TEXT,
  temperature DECIMAL(2, 1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  
  -- Safety
  safety_filters JSONB DEFAULT '{}',
  allowed_topics TEXT[],
  blocked_topics TEXT[],
  
  -- Escalation
  escalation_enabled BOOLEAN DEFAULT true,
  escalation_email VARCHAR(255),
  escalation_threshold INTEGER DEFAULT 3,  -- failed attempts before escalate
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chatbot_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES chatbot_instances(id),
  
  type VARCHAR(50),  -- 'document', 'faq', 'url', 'manual'
  name VARCHAR(255) NOT NULL,
  content TEXT,
  source_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chatbot_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES chatbot_instances(id),
  
  date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  escalations INTEGER DEFAULT 0,
  avg_satisfaction DECIMAL(3, 2),
  
  UNIQUE(instance_id, date)
);
```

### QA & Monitoring Tables

```sql
CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  service VARCHAR(100) NOT NULL,
  endpoint TEXT,
  
  status VARCHAR(50),  -- 'HEALTHY', 'DEGRADED', 'DOWN', 'UNKNOWN'
  response_time_ms INTEGER,
  error_message TEXT,
  
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_service ON health_checks(service, checked_at DESC);

CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  level VARCHAR(20) NOT NULL,  -- 'DEBUG', 'INFO', 'WARN', 'ERROR'
  module VARCHAR(100),
  message TEXT,
  context JSONB,
  stack_trace TEXT,
  
  request_id UUID,
  admin_user_id UUID REFERENCES admin_users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_logs_level ON admin_logs(level);
CREATE INDEX idx_logs_module ON admin_logs(module);
CREATE INDEX idx_logs_date ON admin_logs(created_at DESC);

CREATE TABLE qa_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),  -- 'data_mapping', 'api_response', 'sync_dry_run', 'integration'
  
  config JSONB,  -- test configuration
  
  last_run_at TIMESTAMPTZ,
  last_run_status VARCHAR(50),
  last_run_result JSONB,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  
  is_enabled BOOLEAN DEFAULT false,
  
  -- Targeting
  target_environments TEXT[] DEFAULT '{"production"}',
  target_user_percentage INTEGER DEFAULT 100,
  target_user_ids UUID[],
  
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## D) Core Workflows

### Workflow 1: Onboarding a New Data Partner

```
Step 1: Partner Request
├── Partner submits request via website OR
├── Super/Product Admin creates partner manually
└── Required info: org name, type, state, city, contact email

Step 2: Admin Review
├── Admin reviews request in Submission Queue
├── Validates organization legitimacy
└── Approves or rejects with notes

Step 3: Account Creation
├── System creates admin_user with 'data_partner_admin' role
├── Assigns scope (org_id, state_id, city_id)
└── Sends welcome email with login link

Step 4: Template Assignment
├── Admin assigns appropriate template (College/HS/Youth/Adult/etc.)
├── System creates template_assignment record
└── Partner sees assigned template in their dashboard

Step 5: Initial Data Entry
├── Partner fills out template sections
├── System validates required fields in real-time
├── Partner submits for review

Step 6: Data Approval
├── Submission enters approval_queue
├── Regional/Product Admin reviews
├── Approves → Data published, verification tier upgraded
└── Rejects → Partner notified with feedback

Step 7: Ongoing Access
├── Partner can edit their org/teams/schedule/content
├── Major changes require re-approval
└── Template completion % tracked on dashboard
```

### Workflow 2: Approving a Submission/Edit

```
Step 1: Submission Created
├── Contributor submits new data or edits existing
├── System runs auto-validation (required fields, formats)
├── Creates approval_queue record with status 'PENDING'
└── Triggers notification to reviewers

Step 2: Auto-Validation
├── Check required fields present
├── Validate field formats (email, phone, URL, etc.)
├── Check for duplicates
├── Flag any validation_errors
└── Set auto_validation_passed = true/false

Step 3: Assignment
├── System assigns to appropriate reviewer based on:
│   ├── Scope (state/city match)
│   ├── Workload balancing
│   └── Priority
└── Reviewer notified

Step 4: Review
├── Reviewer opens submission detail
├── Views data + previous_data diff
├── Checks validation errors
├── Options:
│   ├── APPROVE → Proceed to Step 5
│   ├── REJECT → Add notes, notify submitter, close
│   └── NEEDS_CHANGES → Add notes, return to submitter

Step 5: Approval Execution
├── Write data to target entity table
├── Update verification_tier (e.g., UNVERIFIED → COMMUNITY_VERIFIED)
├── Create audit_log entry with diff
├── Update submission_history
└── Notify submitter of approval

Step 6: Rollback (if needed)
├── Admin can view audit_log for entity
├── Select previous version
├── Confirm rollback
└── System restores previous_data
```

### Workflow 3: Setting Up TeamPass Connector

```
Step 1: Create Connector Instance
├── Admin navigates to External Connectors > Add New
├── Selects "TeamPass" from connector_definitions
└── Enters instance name

Step 2: Configure Authentication
├── Enter API credentials (encrypted storage)
├── Enter API endpoint URL
└── Test connection (system verifies credentials)

Step 3: Select Scope
├── Choose which org/league this connector serves
├── Select entities to sync:
│   ├── Teams ☑
│   ├── Players/Roster ☑
│   ├── Matches ☑
│   ├── Venues ☑
│   └── Standings ☑

Step 4: Map Fields
├── System shows default mapping from connector_definitions
├── Admin reviews/adjusts mappings:
│   ├── TeamPass.organization → organizations.name
│   ├── TeamPass.team → teams.name
│   ├── TeamPass.player → players.display_name
│   └── ... etc
└── Save field_mapping

Step 5: Configure Sync Schedule
├── Enable/disable automatic sync
├── Set frequency (hourly/daily/weekly)
├── Set specific time if daily
└── Save sync settings

Step 6: Run Initial Sync
├── Admin clicks "Sync Now"
├── Creates sync_job record
├── System fetches data from TeamPass
├── Transforms via field_mapping
├── De-duplicates (match by external_id or fuzzy name)
├── Creates/updates entities
├── Sets data_source = 'TEAMPASS', external_id = TeamPass ID
└── Updates sync stats and logs

Step 7: Monitor
├── View sync_jobs history
├── Check error_log for failures
├── Set up alerts for failed syncs
└── Review data freshness on dashboard
```

### Workflow 4: Configuring AdButler Zones

```
Step 1: Add API Configuration
├── Navigate to Ads Management > Settings
├── Enter AdButler API key (encrypted)
├── Test connection
└── Save

Step 2: Define Ad Zones
├── Create zone: "Global Banner"
│   ├── Type: GLOBAL
│   ├── AdButler Zone ID: 123456
│   └── Active: Yes
├── Create zone: "South Carolina State"
│   ├── Type: STATE
│   ├── State: SC
│   ├── AdButler Zone ID: 123457
│   └── Active: Yes
└── ... repeat for needed zones

Step 3: Create Placements
├── Create placement:
│   ├── Zone: "Global Banner"
│   ├── App Section: "home"
│   ├── Position: "header"
│   ├── Dimensions: 728x90
│   ├── Format: "banner"
│   └── Active: Yes
├── Create placement:
│   ├── Zone: "South Carolina State"
│   ├── App Section: "league_page"
│   ├── Position: "sidebar"
│   └── Targeting: {state: "SC"}
└── ... repeat for sections

Step 4: Set Targeting Rules
├── For each placement:
│   ├── Geographic targeting (state/city)
│   ├── User segment (if available)
│   ├── Time-based schedule
│   └── Fallback ad if no match

Step 5: Preview
├── Use preview tool to see ad in context
├── Test different geo scenarios
└── Verify fallbacks work

Step 6: Enable Reporting
├── Configure daily stats import from AdButler
├── Set up ad_performance table population
└── View reports in dashboard
```

### Workflow 5: Enabling Community SSO

```
Step 1: Configure SSO Provider
├── Navigate to Community Integration > SSO
├── Select provider (e.g., BetterMode)
├── Enter SSO endpoint URL
├── Enter API key and secret (encrypted)
└── Save

Step 2: Test Connection
├── Click "Test SSO"
├── System makes test API call
├── Verify response is valid
└── Confirm connection healthy

Step 3: Map Groups
├── Define mapping rules:
│   ├── State "SC" → Community Group ID 101
│   ├── State "CA" → Community Group ID 102
│   ├── Team "Charleston Battery" → Group ID 201
│   ├── Fan Club "American Outlaws Charleston" → Group ID 301
│   └── ... etc
└── Save group_mapping_rules

Step 4: Configure Moderation
├── Enable/disable auto-moderation
├── Set moderation webhook URL (receive reports)
├── Configure escalation rules
└── Save

Step 5: Configure Embedding
├── Enter embed base URL
├── Generate/enter embed token
├── Configure which pages show community embed
└── Save

Step 6: Test Login Flow
├── Click "Test SSO Login"
├── System redirects to community provider
├── Login with test user
├── Verify user lands in correct group
└── Confirm roles/permissions transfer correctly

Step 7: Enable
├── Set is_enabled = true
├── Community features now live in app
└── Monitor usage in dashboard
```

---

## E) Admin API Endpoints

### Authentication

```
POST /admin/api/v1/auth/login
Request: { email, password, mfa_code? }
Response: { token, refresh_token, user: {...}, expires_at }

POST /admin/api/v1/auth/refresh
Request: { refresh_token }
Response: { token, expires_at }

POST /admin/api/v1/auth/logout
Headers: Authorization: Bearer <token>
Response: { success: true }

POST /admin/api/v1/auth/mfa/setup
Response: { secret, qr_code_url }

POST /admin/api/v1/auth/mfa/verify
Request: { code }
Response: { success: true }
```

### User Management

```
GET /admin/api/v1/users
Query: ?page=1&limit=20&role=regional_admin&state=SC
Response: { 
  data: [{ id, email, name, roles: [...], scopes: [...], last_login }],
  pagination: { page, limit, total }
}

POST /admin/api/v1/users
Request: { 
  email: "coach@school.edu",
  first_name: "John",
  last_name: "Smith",
  role_assignments: [
    { role_id: "uuid", org_id: "uuid", state_id: "uuid" }
  ]
}
Response: { id, email, ... }

PATCH /admin/api/v1/users/:id
Request: { first_name?, last_name?, is_active? }
Response: { id, ... updated user }

DELETE /admin/api/v1/users/:id
Response: { success: true }

POST /admin/api/v1/users/:id/roles
Request: { 
  role_id: "uuid",
  scope: { state_id?, city_id?, org_id?, team_id? }
}
Response: { assignment_id, ... }

DELETE /admin/api/v1/users/:id/roles/:assignmentId
Response: { success: true }
```

### Roles & Permissions

```
GET /admin/api/v1/roles
Response: { data: [{ id, name, display_name, permissions: [...] }] }

POST /admin/api/v1/roles
Request: { name, display_name, description, permissions: ["uuid", ...] }
Response: { id, ... }

PATCH /admin/api/v1/roles/:id
Request: { display_name?, description? }
Response: { id, ... }

GET /admin/api/v1/permissions
Response: { data: [{ id, module, action, description }] }

POST /admin/api/v1/roles/:id/permissions
Request: { permission_ids: ["uuid", ...] }
Response: { success: true }
```

### Templates

```
GET /admin/api/v1/templates
Query: ?type=YOUTH&status=PUBLISHED
Response: { data: [{ id, type, name, version, status, sections }] }

GET /admin/api/v1/templates/:id
Response: { id, type, name, version, sections, validation_rules, ... }

POST /admin/api/v1/templates
Request: {
  type: "YOUTH",
  name: "Youth Club Template v2",
  sections: [
    {
      name: "Club Information",
      fields: [
        { name: "name", type: "text", required: true, max_length: 255 },
        { name: "state_id", type: "select", required: true, options: "states" },
        { name: "city_id", type: "select", required: true, depends_on: "state_id" }
      ]
    }
  ],
  validation_rules: {
    "website": { pattern: "^https?://.*" }
  }
}
Response: { id, ... }

POST /admin/api/v1/templates/:id/publish
Response: { id, status: "PUBLISHED", published_at }

POST /admin/api/v1/templates/:id/clone
Request: { name: "Youth Club Template v3" }
Response: { id, ... new template }

POST /admin/api/v1/templates/:id/assign
Request: { org_id: "uuid", admin_user_id: "uuid" }
Response: { assignment_id, ... }
```

### Submissions & Approvals

```
GET /admin/api/v1/submissions
Query: ?status=PENDING&org_id=uuid&entity_type=team
Response: { 
  data: [{ id, entity_type, status, submitted_by, org, created_at }],
  pagination: { ... }
}

GET /admin/api/v1/submissions/:id
Response: { 
  id, entity_type, entity_id, data, previous_data, 
  validation_errors, history: [...], submitted_by, ...
}

POST /admin/api/v1/submissions/:id/approve
Request: { notes?: "Looks good" }
Response: { id, status: "APPROVED", entity_id: "uuid" }

POST /admin/api/v1/submissions/:id/reject
Request: { notes: "Missing required coach information" }
Response: { id, status: "REJECTED" }

POST /admin/api/v1/submissions/:id/request-changes
Request: { notes: "Please add venue address" }
Response: { id, status: "NEEDS_CHANGES" }

POST /admin/api/v1/submissions/:id/assign
Request: { reviewer_id: "uuid" }
Response: { id, assigned_reviewer: "uuid" }
```

### Connectors & Sync

```
GET /admin/api/v1/connectors/definitions
Response: { data: [{ id, name, type, config_schema }] }

GET /admin/api/v1/connectors/instances
Query: ?org_id=uuid&status=ACTIVE
Response: { data: [{ id, name, definition, org, status, last_sync }] }

POST /admin/api/v1/connectors/instances
Request: {
  definition_id: "uuid",
  name: "Charleston Youth TeamPass",
  org_id: "uuid",
  config: { api_key: "xxx", endpoint: "https://..." },
  field_mapping: { ... },
  sync_frequency_hours: 24
}
Response: { id, ... }

PATCH /admin/api/v1/connectors/instances/:id
Request: { config?, field_mapping?, sync_frequency_hours?, sync_enabled? }
Response: { id, ... }

POST /admin/api/v1/connectors/instances/:id/test
Response: { success: true, message: "Connection successful" }

POST /admin/api/v1/connectors/instances/:id/sync
Request: { dry_run?: false }
Response: { job_id: "uuid" }

GET /admin/api/v1/sync-jobs
Query: ?connector_id=uuid&status=FAILED
Response: { data: [{ id, connector, status, stats, created_at }] }

GET /admin/api/v1/sync-jobs/:id
Response: { id, ..., error_log: [...] }
```

### Integrations

```
GET /admin/api/v1/integrations
Response: { 
  data: [
    { service: "sportmonks", is_enabled: true, health: "HEALTHY" },
    { service: "adbutler", is_enabled: true, health: "HEALTHY" },
    ...
  ]
}

GET /admin/api/v1/integrations/:service
Response: { service, config: {...}, is_enabled, health_status }

PATCH /admin/api/v1/integrations/:service
Request: { config?: {...}, is_enabled?: true }
Response: { service, ... }

POST /admin/api/v1/integrations/:service/test
Response: { success: true, response_time_ms: 150 }
```

### Ads

```
GET /admin/api/v1/ads/zones
Response: { data: [{ id, name, type, state, city, adbutler_zone_id }] }

POST /admin/api/v1/ads/zones
Request: { name, type, state_id?, city_id?, adbutler_zone_id }
Response: { id, ... }

GET /admin/api/v1/ads/placements
Query: ?zone_id=uuid&app_section=home
Response: { data: [{ id, zone, app_section, position, dimensions }] }

POST /admin/api/v1/ads/placements
Request: { zone_id, app_section, position, width, height, targeting_rules }
Response: { id, ... }

GET /admin/api/v1/ads/reports
Query: ?start_date=2025-01-01&end_date=2025-01-31&zone_id=uuid
Response: { 
  summary: { impressions, clicks, ctr, revenue },
  daily: [{ date, impressions, clicks, ctr, revenue }]
}
```

### Audit & Logs

```
GET /admin/api/v1/audit-log
Query: ?entity_type=team&entity_id=uuid&admin_user_id=uuid&start_date=...
Response: { 
  data: [{ id, action, module, entity_type, entity_id, user, performed_at, diff }],
  pagination: { ... }
}

GET /admin/api/v1/logs
Query: ?level=ERROR&module=connectors&start_date=...
Response: { data: [{ id, level, module, message, context, created_at }] }

GET /admin/api/v1/health
Response: {
  status: "HEALTHY",
  services: [
    { name: "database", status: "HEALTHY", response_ms: 5 },
    { name: "sportmonks", status: "HEALTHY", response_ms: 150 },
    { name: "adbutler", status: "DEGRADED", response_ms: 2500 },
    ...
  ]
}
```

---

## F) UI Page List

### Dashboard
- **System Health Cards**: Service status indicators (green/yellow/red)
- **Key Metrics**: Active users, pending submissions, sync status, ad impressions
- **Recent Activity Feed**: Latest actions across platform
- **Alerts Panel**: Critical issues requiring attention
- **Quick Actions**: Common tasks (approve submission, run sync, etc.)

### Users & Access
| Page | Key Fields/Actions |
|------|-------------------|
| User Directory | Table: name, email, roles, scopes, last login, status. Actions: Add, Edit, Deactivate |
| User Detail | Edit form: name, email, avatar. Role assignments table. Activity log. |
| Roles & Permissions | List of roles. Click to edit permissions. Create custom role. |
| Role Editor | Checkboxes: module × action matrix. Save/cancel. |
| Audit Log | Filters: user, module, action, date range. Table: timestamp, user, action, entity, diff viewer |

### Data Contribution
| Page | Key Fields/Actions |
|------|-------------------|
| Template Manager | Cards: template name, type, version, status. Actions: View, Edit, Clone, Publish |
| Template Editor | Drag-drop section builder. Field config: name, type, required, validation. Preview. |
| Submission Queue | Tabs: Pending, In Review, Needs Changes. Table: entity, org, submitter, date. Actions: Review |
| Submission Detail | Data form (read/edit), previous data comparison, validation errors, history timeline. Approve/Reject/Request Changes |
| Bulk Import | Step wizard: Upload file → Map fields → Validate → Import. Error report download. |

### Grassroots Data
| Page | Key Fields/Actions |
|------|-------------------|
| Organizations | Filters: type, state, city, verification. Table with quick edit. |
| Organization Detail | All org fields. Tabs: Teams, Competitions, Staff, Venues, Content. |
| Competitions | Filter by org, state. Table: name, type, season, teams count. |
| Teams | Filter by org, state, age group. Table: name, org, coach, roster count. |
| Team Detail | Team fields. Tabs: Roster, Schedule, Standings, Content. |
| Venues | Map view + table. Add/edit form with geocoding. |
| Verification Pipeline | Kanban: Unverified → Community → Partner → Admin. Drag to upgrade. |

### Integrations
| Page | Key Fields/Actions |
|------|-------------------|
| Integration Dashboard | Cards per service: status, last sync, error count. Quick actions. |
| SportMonks Config | API key (masked), mapping rules editor, sync controls, conflict resolution settings. |
| Connector Catalog | Available connectors with setup buttons. |
| Connector Instances | Table: name, org, status, last sync. Actions: Edit, Sync, Logs, Delete. |
| Connector Editor | Config form, field mapping builder (source → target), schedule settings. |
| Sync Jobs | Table: job ID, connector, status, stats, duration. Click for details. |
| Sync Job Detail | Stats summary, error log table, retry button. |

### Content Studio
| Page | Key Fields/Actions |
|------|-------------------|
| News & Posts | Table: title, type, org/team, status, date. Actions: Add, Edit, Publish. |
| Post Editor | Rich text editor, featured image, tags, org/team selector, publish schedule. |
| Events Calendar | Calendar view + list view. Add/edit modal. Filter by type/org. |
| Documents | Table: title, type, org, file. Upload with metadata. |
| Media Library | Grid of images/videos. Upload, organize, delete. Usage tracking. |

### Ads
| Page | Key Fields/Actions |
|------|-------------------|
| Ad Zones | Table: name, type, scope, AdButler ID, status. CRUD. |
| Placements | Table: zone, section, position, dimensions. CRUD. |
| Targeting Rules | Per-placement targeting editor: geo, schedule, fallback. |
| Performance | Date range picker. Charts: impressions, clicks, CTR, revenue. Breakdown by zone/placement. |

### Community
| Page | Key Fields/Actions |
|------|-------------------|
| SSO Config | Provider settings, endpoint, API keys. Test button. |
| Group Mapping | Table: WSL entity → Community group. Add/edit mappings. |
| Moderation | Queue of flagged content (from webhook). Actions: Approve, Remove, Warn user. |

### Shop & Affiliates
| Page | Key Fields/Actions |
|------|-------------------|
| Affiliate Partners | Table: name, category, network, clicks, conversions. CRUD. |
| Link Manager | Generate tracked links. UTM builder. Copy to clipboard. |
| Performance Report | Date range. Table: partner, clicks, conversions, revenue. |

### Chatbot
| Page | Key Fields/Actions |
|------|-------------------|
| Bot Instances | Cards: name, scope, status. Actions: Configure, View Usage. |
| Bot Config | System prompt editor, model selection, temperature slider, safety filters. |
| Knowledge Sources | Table: name, type, last updated. Add/edit/delete. |
| Usage Analytics | Charts: conversations, messages, escalations, satisfaction. |

### QA & Monitoring
| Page | Key Fields/Actions |
|------|-------------------|
| Health Dashboard | Grid of service status cards with response times. |
| Log Explorer | Filters: level, module, date. Table: timestamp, level, message. Click for detail. |
| Test Tools | Buttons: Validate Mappings, Simulate API, Dry-run Sync. Results panel. |
| Status Page | Public-facing status for users. Toggle visibility. |

### Settings
| Page | Key Fields/Actions |
|------|-------------------|
| Environment | Toggle: Dev/Staging/Prod. View current env settings. |
| Feature Flags | Table: flag name, enabled, targeting. Toggle on/off. |
| Secrets Vault | List of secrets (masked). Add/rotate. (Super Admin only) |

---

## G) Implementation Notes

### Recommended Stack

**Primary (Postgres-based)**
```
Database:       PostgreSQL 15+
ORM:            Drizzle ORM (shared with main app) or Prisma
Backend:        Node.js + Express or Fastify
Auth:           JWT + refresh tokens, optional MFA via TOTP
API Style:      REST (OpenAPI documented) or tRPC for type-safe clients
Admin UI:       React + shadcn/ui (same as main app)
State:          TanStack Query for server state
```

**Alternative (NoSQL option)**
```
Database:       MongoDB with Mongoose
Pros:           Flexible schema for templates, faster iteration
Cons:           Less relational integrity, harder joins
Recommendation: Only if team has strong MongoDB experience
```

### Multi-Tenant Considerations

```sql
-- Add continent/country scoping for future expansion
ALTER TABLE user_role_assignments ADD COLUMN continent_id UUID REFERENCES continents(id);
ALTER TABLE user_role_assignments ADD COLUMN country_id UUID REFERENCES countries(id);

-- Scope hierarchy: Continent > Country > State > City > Org > Team
-- Example: European admin can manage all countries in Europe
-- Example: England admin can manage all states/regions in England
```

### Security Practices

1. **Secrets Management**
   - Use AWS KMS / Vault / Replit Secrets for encryption
   - Envelope encryption for stored API keys
   - Rotate secrets on schedule
   - Never log secrets, even partially

2. **Authentication**
   - JWT with short expiry (15 min) + refresh tokens (7 days)
   - MFA required for Super Admin, Product Admin
   - Session invalidation on password change
   - Rate limit login attempts (5 per minute)

3. **Authorization**
   - Check permissions on EVERY request
   - Scope-filter ALL queries (never trust client-provided scope)
   - Audit all privileged actions
   - Least privilege by default

4. **API Security**
   - HTTPS only
   - CORS restricted to admin domain
   - IP allowlist for sensitive endpoints (optional)
   - Request signing for webhook endpoints

### Scalability & Caching

```
Read Caching:
- Redis for frequently accessed data:
  - States/cities list (TTL: 24h)
  - Template definitions (TTL: 1h)
  - User permissions (TTL: 5min)
  - Dashboard metrics (TTL: 1min)

Write Queues:
- BullMQ for background jobs:
  - Sync jobs (connector pulls)
  - Bulk imports
  - Report generation
  - Email notifications

Database:
- Read replicas for dashboard/reporting queries
- Partition audit_log by month
- Index all foreign keys and frequently filtered columns
- Consider TimescaleDB for time-series metrics
```

### Deployment

```
Environments:
- Development: Local/Replit, mock integrations
- Staging: Full integrations, test data
- Production: Full integrations, real data

Feature Flags:
- Use for gradual rollout of new modules
- Enable per-environment
- Track flag state in audit log

Monitoring:
- OpenTelemetry for traces
- Structured JSON logging
- Error tracking (Sentry or similar)
- Uptime monitoring for health endpoints
```

---

This architecture specification provides a complete blueprint for building a production-ready Admin Panel + Admin API that scales across all U.S. states and can expand globally.
