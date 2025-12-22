import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const planTierEnum = pgEnum("plan_tier", ["free", "pro", "partner"]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "past_due", "trialing"]);
export const organizationTypeEnum = pgEnum("organization_type", ["club", "league", "tournament", "fan_club", "pickup_group"]);
export const verificationStatusEnum = pgEnum("verification_status", ["draft", "review", "verified", "rejected"]);
export const orgMemberRoleEnum = pgEnum("org_member_role", ["owner", "admin", "editor", "viewer"]);
export const platformRoleEnum = pgEnum("platform_role", ["user", "partner_admin", "platform_moderator", "platform_admin"]);

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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertPartnerVerification = z.infer<typeof insertPartnerVerificationSchema>;
export type PartnerVerification = typeof partnerVerifications.$inferSelect;
