import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const planTierEnum = pgEnum("plan_tier", ["free", "pro", "partner"]);

export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin", 
  "platform_admin", 
  "regional_admin", 
  "state_admin", 
  "league_operator", 
  "club_admin", 
  "data_contributor", 
  "advertiser", 
  "affiliate_partner", 
  "api_license_holder", 
  "internal_staff", 
  "viewer"
]);

export const grassrootsTypeEnum = pgEnum("grassroots_type", [
  "college", 
  "high_school", 
  "youth", 
  "adult_amateur", 
  "pickup"
]);

export const grassrootsStatusEnum = pgEnum("grassroots_status", [
  "pending", 
  "approved", 
  "rejected"
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create", 
  "update", 
  "delete", 
  "approve", 
  "reject",
  "activate",
  "deactivate"
]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "past_due", "trialing"]);
export const organizationTypeEnum = pgEnum("organization_type", ["club", "league", "tournament", "fan_club", "pickup_group"]);
export const verificationStatusEnum = pgEnum("verification_status", ["draft", "review", "verified", "rejected"]);
export const orgMemberRoleEnum = pgEnum("org_member_role", ["owner", "admin", "editor", "viewer"]);
export const platformRoleEnum = pgEnum("platform_role", ["user", "partner_admin", "platform_moderator", "platform_admin"]);
export const teamTypeEnum = pgEnum("team_type", ["club", "national"]);
export const leagueTypeEnum = pgEnum("league_type", ["professional", "semi_pro", "college", "high_school", "youth", "adult_amateur", "pickup", "cup", "tournament", "national_team_competition"]);
export const leagueFormatEnum = pgEnum("league_format", ["league", "cup", "tournament", "playoff", "friendly"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  planTier: planTierEnum("plan_tier").default("free").notNull(),
  platformRole: platformRoleEnum("platform_role").default("user").notNull(),
  primaryOrgId: varchar("primary_org_id"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  locationEnabled: boolean("location_enabled").default(false),
  selectedContinent: text("selected_continent"),
  favoriteLeagues: text("favorite_leagues").array(),
  favoriteTeams: text("favorite_teams").array(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  scoreUpdatesEnabled: boolean("score_updates_enabled").default(true),
  communityPollsEnabled: boolean("community_polls_enabled").default(true),
  weeklyDigestEnabled: boolean("weekly_digest_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planTier: planTierEnum("plan_tier").notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  trialEndsAt: timestamp("trial_ends_at"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: organizationTypeEnum("type").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  stateCode: text("state_code"),
  city: text("city"),
  verificationStatus: verificationStatusEnum("verification_status").default("draft").notNull(),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: orgMemberRoleEnum("role").default("viewer").notNull(),
  invitedById: varchar("invited_by_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const partnerVerifications = pgTable("partner_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  status: verificationStatusEnum("status").default("draft").notNull(),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewerId: varchar("reviewer_id").references(() => users.id),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  documents: text("documents").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sports = pgTable("sports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const continents = pgTable("continents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  flag: text("flag"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const countries = pgTable("countries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  continentId: varchar("continent_id").notNull().references(() => continents.id),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  flag: text("flag"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leagues = pgTable("leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sportId: varchar("sport_id").references(() => sports.id),
  countryId: varchar("country_id").notNull().references(() => countries.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortName: text("short_name"),
  logo: text("logo"),
  type: text("type"),
  tier: integer("tier").default(1),
  format: text("format"),
  gender: text("gender"),
  ageGroup: text("age_group"),
  governingBody: text("governing_body"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  currentSeasonId: varchar("current_season_id"),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const divisions = pgTable("divisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leagueId: varchar("league_id").notNull().references(() => leagues.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  tier: integer("tier").default(1),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  divisionId: varchar("division_id").references(() => divisions.id),
  leagueId: varchar("league_id").references(() => leagues.id),
  countryId: varchar("country_id").references(() => countries.id),
  teamType: teamTypeEnum("team_type").default("club"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  shortName: text("short_name"),
  logo: text("logo"),
  venue: text("venue"),
  city: text("city"),
  stateCode: text("state_code"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seasons = pgTable("seasons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leagueId: varchar("league_id").notNull().references(() => leagues.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isCurrent: boolean("is_current").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fixtures = pgTable("fixtures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id").notNull().references(() => seasons.id),
  homeTeamId: varchar("home_team_id").notNull().references(() => teams.id),
  awayTeamId: varchar("away_team_id").notNull().references(() => teams.id),
  matchday: integer("matchday"),
  kickoff: timestamp("kickoff"),
  status: text("status").default("scheduled"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  venue: text("venue"),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const standings = pgTable("standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id").notNull().references(() => seasons.id),
  teamId: varchar("team_id").notNull().references(() => teams.id),
  position: integer("position").default(0),
  played: integer("played").default(0),
  won: integer("won").default(0),
  drawn: integer("drawn").default(0),
  lost: integer("lost").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  goalDifference: integer("goal_difference").default(0),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const venues = pgTable("venues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  address: text("address"),
  city: text("city"),
  stateCode: text("state_code"),
  countryId: varchar("country_id").references(() => countries.id),
  capacity: integer("capacity"),
  surface: text("surface"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  photo: text("photo"),
  isActive: boolean("is_active").default(true).notNull(),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grassrootsSubmissions = pgTable("grassroots_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submittedById: varchar("submitted_by_id").notNull().references(() => users.id),
  type: grassrootsTypeEnum("type").notNull(),
  entityType: text("entity_type").notNull(),
  status: grassrootsStatusEnum("status").default("pending").notNull(),
  
  entityName: text("entity_name").notNull(),
  slug: text("slug").notNull(),
  shortName: text("short_name"),
  logo: text("logo"),
  
  countryId: varchar("country_id").references(() => countries.id),
  parentLeagueId: varchar("parent_league_id").references(() => leagues.id),
  parentDivisionId: varchar("parent_division_id").references(() => divisions.id),
  parentTeamId: varchar("parent_team_id").references(() => teams.id),
  
  stateCode: text("state_code"),
  city: text("city"),
  venue: text("venue"),
  
  tier: integer("tier").default(1),
  ageGroup: text("age_group"),
  gender: text("gender"),
  
  address: text("address"),
  capacity: integer("capacity"),
  surface: text("surface"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  
  entityData: jsonb("entity_data"),
  
  promotedEntityId: varchar("promoted_entity_id"),
  promotedAt: timestamp("promoted_at"),
  
  reviewedById: varchar("reviewed_by_id").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: auditActionEnum("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  entityName: text("entity_name"),
  previousData: jsonb("previous_data"),
  newData: jsonb("new_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const providerEntityTypeEnum = pgEnum("provider_entity_type", [
  "continent",
  "country", 
  "league",
  "team",
  "season",
  "player",
  "fixture"
]);

export const providerMappings = pgTable("provider_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerName: text("provider_name").notNull(),
  providerEntityType: providerEntityTypeEnum("provider_entity_type").notNull(),
  providerEntityId: text("provider_entity_id").notNull(),
  internalEntityId: varchar("internal_entity_id").notNull(),
  providerEntityName: text("provider_entity_name"),
  rawPayload: jsonb("raw_payload"),
  lastSyncedAt: timestamp("last_synced_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").references(() => teams.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  nationality: text("nationality"),
  position: text("position"),
  jerseyNumber: integer("jersey_number"),
  birthDate: timestamp("birth_date"),
  height: integer("height"),
  weight: integer("weight"),
  photo: text("photo"),
  isActive: boolean("is_active").default(true).notNull(),
  extApiIds: text("ext_api_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verificationStatus: true,
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertPartnerVerificationSchema = createInsertSchema(partnerVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSportSchema = createInsertSchema(sports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContinentSchema = createInsertSchema(continents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDivisionSchema = createInsertSchema(divisions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeasonSchema = createInsertSchema(seasons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFixtureSchema = createInsertSchema(fixtures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStandingSchema = createInsertSchema(standings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGrassrootsSubmissionSchema = createInsertSchema(grassrootsSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  reviewedById: true,
  reviewedAt: true,
  reviewNotes: true,
  rejectionReason: true,
  promotedEntityId: true,
  promotedAt: true,
}).extend({
  entityType: z.enum(["league", "division", "team", "venue", "season"]),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertProviderMappingSchema = createInsertSchema(providerMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertSport = z.infer<typeof insertSportSchema>;
export type Sport = typeof sports.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertPartnerVerification = z.infer<typeof insertPartnerVerificationSchema>;
export type PartnerVerification = typeof partnerVerifications.$inferSelect;
export type InsertContinent = z.infer<typeof insertContinentSchema>;
export type Continent = typeof continents.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;
export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type League = typeof leagues.$inferSelect;
export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type Division = typeof divisions.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertSeason = z.infer<typeof insertSeasonSchema>;
export type Season = typeof seasons.$inferSelect;
export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type Fixture = typeof fixtures.$inferSelect;
export type InsertStanding = z.infer<typeof insertStandingSchema>;
export type Standing = typeof standings.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertGrassrootsSubmission = z.infer<typeof insertGrassrootsSubmissionSchema>;
export type GrassrootsSubmission = typeof grassrootsSubmissions.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertProviderMapping = z.infer<typeof insertProviderMappingSchema>;
export type ProviderMapping = typeof providerMappings.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
