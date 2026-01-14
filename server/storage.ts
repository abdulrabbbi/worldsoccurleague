import { 
  type User, 
  type InsertUser,
  type UserPreferences,
  type InsertUserPreferences,
  type UserSubscription,
  type InsertUserSubscription,
  type Organization,
  type InsertOrganization,
  type OrganizationMember,
  type InsertOrganizationMember,
  type PartnerVerification,
  type InsertPartnerVerification,
  type GrassrootsSubmission,
  type InsertGrassrootsSubmission,
  type League,
  type InsertLeague,
  type Team,
  type InsertTeam,
  type Division,
  type InsertDivision,
  type Venue,
  type InsertVenue,
  type Country,
  type Sport,
  type InsertSport,
  type AuditLog,
  type InsertAuditLog,
  type ProviderMapping,
  type InsertProviderMapping,
  type ApiKey,
  type ApiKeyUsage,
  users,
  userPreferences,
  userSubscriptions,
  organizations,
  organizationMembers,
  partnerVerifications,
  grassrootsSubmissions,
  leagues,
  teams,
  divisions,
  venues,
  countries,
  sports,
  seasons,
  auditLogs,
  providerMappings,
  apiKeys,
  apiKeyUsage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or, sql, count } from "drizzle-orm";
import type { PlanTier } from "@shared/plans";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPlan(userId: string, planTier: PlanTier): Promise<User | undefined>;
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
  
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription | undefined>;
  
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  getOrganizationsByUser(userId: string): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;
  
  getOrganizationMembers(orgId: string): Promise<OrganizationMember[]>;
  getOrganizationMember(orgId: string, userId: string): Promise<OrganizationMember | undefined>;
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  updateOrganizationMemberRole(id: string, role: string): Promise<OrganizationMember | undefined>;
  removeOrganizationMember(id: string): Promise<boolean>;
  
  getPartnerVerification(orgId: string): Promise<PartnerVerification | undefined>;
  createPartnerVerification(verification: InsertPartnerVerification): Promise<PartnerVerification>;
  updatePartnerVerification(id: string, updates: Partial<PartnerVerification>): Promise<PartnerVerification | undefined>;
  submitForVerification(orgId: string): Promise<PartnerVerification | undefined>;
  approveVerification(id: string, reviewerId: string, notes?: string): Promise<PartnerVerification | undefined>;
  rejectVerification(id: string, reviewerId: string, reason: string): Promise<PartnerVerification | undefined>;
  
  getGrassrootsSubmissions(filters?: { status?: string; type?: string; entityType?: string }): Promise<GrassrootsSubmission[]>;
  getGrassrootsSubmission(id: string): Promise<GrassrootsSubmission | undefined>;
  createGrassrootsSubmission(submission: InsertGrassrootsSubmission): Promise<GrassrootsSubmission>;
  updateGrassrootsSubmission(id: string, updates: Partial<GrassrootsSubmission>): Promise<GrassrootsSubmission | undefined>;
  approveGrassrootsSubmission(id: string, reviewerId: string, notes?: string): Promise<GrassrootsSubmission | undefined>;
  rejectGrassrootsSubmission(id: string, reviewerId: string, reason: string): Promise<GrassrootsSubmission | undefined>;
  promoteGrassrootsSubmission(id: string, reviewerId: string): Promise<{ submission: GrassrootsSubmission; promotedEntity: League | Team | Division | Venue } | undefined>;
  submitGrassrootsForReview(id: string): Promise<GrassrootsSubmission | undefined>;
  findDuplicateEntities(submission: GrassrootsSubmission): Promise<{ id: string; name: string; type: string; matchScore: number; confidencePercent: number; whyMatched: string[]; details?: string }[]>;
  linkSubmissionToExisting(submissionId: string, existingEntityId: string, reviewerId: string): Promise<GrassrootsSubmission | undefined>;
  
  getSports(): Promise<Sport[]>;
  getSport(id: string): Promise<Sport | undefined>;
  getSportBySlug(slug: string): Promise<Sport | undefined>;
  createSport(sport: InsertSport): Promise<Sport>;
  getLeaguesBySport(sportId: string): Promise<League[]>;
  getLeaguesBySportSlug(sportSlug: string): Promise<League[]>;
  
  getTeam(id: string): Promise<Team | undefined>;
  getTeamsByLeague(leagueId: string): Promise<Team[]>;
  getLeague(id: string): Promise<League | undefined>;
  
  updateLeague(id: string, updates: Partial<League>): Promise<League | undefined>;
  getAdminLeagues(sportSlug?: string): Promise<(League & { sportCode?: string; teamCount?: number })[]>;
  
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { entityType?: string; sportId?: string; limit?: number }): Promise<AuditLog[]>;

  getProviderMappings(filters?: { providerName?: string; entityType?: string; sportSlug?: string }): Promise<ProviderMapping[]>;
  getProviderMapping(id: string): Promise<ProviderMapping | undefined>;
  createProviderMapping(mapping: InsertProviderMapping): Promise<ProviderMapping>;
  updateProviderMapping(id: string, updates: Partial<ProviderMapping>): Promise<ProviderMapping | undefined>;
  deleteProviderMapping(id: string): Promise<boolean>;
  checkMappingConflict(providerName: string, providerEntityType: string, providerEntityId: string, internalEntityId: string, excludeId?: string): Promise<{ type: 'provider_conflict' | 'internal_conflict'; existingMapping: ProviderMapping } | null>;
  getCoverageStats(sportSlug?: string): Promise<{ entityType: string; total: number; mapped: number; percentage: number }[]>;
  getUnmappedEntities(entityType: 'league' | 'team' | 'season', sportSlug?: string, limit?: number): Promise<{ id: string; name: string; entityType: string; sportCode?: string }[]>;
  getAllTeams(): Promise<Team[]>;
  getAllSeasons(sportSlug?: string): Promise<{ id: string; name: string; leagueId: string }[]>;
  
  createApiKey(data: { organizationId: string; name: string; keyHash: string; keyPrefix: string; scopes?: string[]; createdById: string }): Promise<ApiKey>;
  getApiKeys(organizationId: string): Promise<ApiKey[]>;
  getApiKeyByPrefix(prefix: string): Promise<ApiKey | undefined>;
  revokeApiKey(id: string): Promise<boolean>;
  updateApiKeyLastUsed(id: string): Promise<void>;
  logApiKeyUsage(usage: { apiKeyId: string; endpoint: string; method: string; statusCode?: number; responseTimeMs?: number; ipAddress?: string }): Promise<void>;
  
  upgradeUserToPlan(userId: string, planTier: PlanTier, billingCycle: 'monthly' | 'yearly', stripeSubscriptionId?: string): Promise<{ user: User; subscription: UserSubscription }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name,
    }).returning();
    return result[0];
  }

  async updateUserPlan(userId: string, planTier: PlanTier): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ planTier })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0];
  }

  async upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    if (existing) {
      const result = await db.update(userPreferences)
        .set({
          locationEnabled: prefs.locationEnabled ?? existing.locationEnabled,
          selectedContinent: prefs.selectedContinent ?? existing.selectedContinent,
          favoriteLeagues: prefs.favoriteLeagues ?? existing.favoriteLeagues,
          favoriteTeams: prefs.favoriteTeams ?? existing.favoriteTeams,
          notificationsEnabled: prefs.notificationsEnabled ?? existing.notificationsEnabled,
          scoreUpdatesEnabled: prefs.scoreUpdatesEnabled ?? existing.scoreUpdatesEnabled,
          communityPollsEnabled: prefs.communityPollsEnabled ?? existing.communityPollsEnabled,
          weeklyDigestEnabled: prefs.weeklyDigestEnabled ?? existing.weeklyDigestEnabled,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, prefs.userId))
        .returning();
      return result[0];
    }
    
    const result = await db.insert(userPreferences).values({
      userId: prefs.userId,
      locationEnabled: prefs.locationEnabled,
      selectedContinent: prefs.selectedContinent,
      favoriteLeagues: prefs.favoriteLeagues,
      favoriteTeams: prefs.favoriteTeams,
      notificationsEnabled: prefs.notificationsEnabled,
      scoreUpdatesEnabled: prefs.scoreUpdatesEnabled,
      communityPollsEnabled: prefs.communityPollsEnabled,
      weeklyDigestEnabled: prefs.weeklyDigestEnabled,
    }).returning();
    return result[0];
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const result = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
    return result[0];
  }

  async createSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const result = await db.insert(userSubscriptions).values(subscription).returning();
    return result[0];
  }

  async updateSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription | undefined> {
    const result = await db.update(userSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSubscriptions.id, id))
      .returning();
    return result[0];
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.id, id));
    return result[0];
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return result[0];
  }

  async getOrganizationsByUser(userId: string): Promise<Organization[]> {
    const memberships = await db.select().from(organizationMembers).where(eq(organizationMembers.userId, userId));
    const orgIds = memberships.map(m => m.organizationId);
    if (orgIds.length === 0) return [];
    
    const orgs: Organization[] = [];
    for (const orgId of orgIds) {
      const org = await this.getOrganization(orgId);
      if (org) orgs.push(org);
    }
    return orgs;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const result = await db.insert(organizations).values(org).returning();
    const newOrg = result[0];
    
    const user = await this.getUser(org.createdById);
    if (user && !user.primaryOrgId) {
      await db.update(users)
        .set({ primaryOrgId: newOrg.id })
        .where(eq(users.id, org.createdById));
    }
    
    return newOrg;
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined> {
    const result = await db.update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return result[0];
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id)).returning();
    return result.length > 0;
  }

  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    return await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, orgId));
  }

  async getOrganizationMember(orgId: string, userId: string): Promise<OrganizationMember | undefined> {
    const result = await db.select().from(organizationMembers)
      .where(and(
        eq(organizationMembers.organizationId, orgId),
        eq(organizationMembers.userId, userId)
      ));
    return result[0];
  }

  async addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember> {
    const result = await db.insert(organizationMembers).values(member).returning();
    return result[0];
  }

  async updateOrganizationMemberRole(id: string, role: string): Promise<OrganizationMember | undefined> {
    const result = await db.update(organizationMembers)
      .set({ role: role as any })
      .where(eq(organizationMembers.id, id))
      .returning();
    return result[0];
  }

  async removeOrganizationMember(id: string): Promise<boolean> {
    const result = await db.delete(organizationMembers).where(eq(organizationMembers.id, id)).returning();
    return result.length > 0;
  }

  async getPartnerVerification(orgId: string): Promise<PartnerVerification | undefined> {
    const result = await db.select().from(partnerVerifications)
      .where(eq(partnerVerifications.organizationId, orgId));
    return result[0];
  }

  async createPartnerVerification(verification: InsertPartnerVerification): Promise<PartnerVerification> {
    const result = await db.insert(partnerVerifications).values(verification).returning();
    return result[0];
  }

  async updatePartnerVerification(id: string, updates: Partial<PartnerVerification>): Promise<PartnerVerification | undefined> {
    const result = await db.update(partnerVerifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(partnerVerifications.id, id))
      .returning();
    return result[0];
  }

  async submitForVerification(orgId: string): Promise<PartnerVerification | undefined> {
    const existing = await this.getPartnerVerification(orgId);
    if (!existing) return undefined;
    
    return await this.updatePartnerVerification(existing.id, {
      status: "review",
      submittedAt: new Date(),
    });
  }

  async approveVerification(id: string, reviewerId: string, notes?: string): Promise<PartnerVerification | undefined> {
    const verification = await this.updatePartnerVerification(id, {
      status: "verified",
      reviewedAt: new Date(),
      reviewerId,
      reviewNotes: notes,
    });
    
    if (verification) {
      const org = await this.getOrganization(verification.organizationId);
      if (org) {
        await db.update(organizations)
          .set({ verificationStatus: "verified" })
          .where(eq(organizations.id, verification.organizationId));
        
        await db.update(users)
          .set({ primaryOrgId: org.id, platformRole: "partner_admin" })
          .where(eq(users.id, org.createdById));
      }
    }
    
    return verification;
  }

  async rejectVerification(id: string, reviewerId: string, reason: string): Promise<PartnerVerification | undefined> {
    const verification = await this.updatePartnerVerification(id, {
      status: "rejected",
      reviewedAt: new Date(),
      reviewerId,
      rejectionReason: reason,
    });
    
    if (verification) {
      await db.update(organizations)
        .set({ verificationStatus: "rejected" })
        .where(eq(organizations.id, verification.organizationId));
    }
    
    return verification;
  }

  async getGrassrootsSubmissions(filters?: { status?: string; type?: string; entityType?: string }): Promise<GrassrootsSubmission[]> {
    let query = db.select().from(grassrootsSubmissions).orderBy(desc(grassrootsSubmissions.createdAt));
    
    const results = await query;
    
    return results.filter(s => {
      if (filters?.status && s.status !== filters.status) return false;
      if (filters?.type && s.type !== filters.type) return false;
      if (filters?.entityType && s.entityType !== filters.entityType) return false;
      return true;
    });
  }

  async getGrassrootsSubmission(id: string): Promise<GrassrootsSubmission | undefined> {
    const result = await db.select().from(grassrootsSubmissions).where(eq(grassrootsSubmissions.id, id));
    return result[0];
  }

  async createGrassrootsSubmission(submission: InsertGrassrootsSubmission): Promise<GrassrootsSubmission> {
    const result = await db.insert(grassrootsSubmissions).values(submission as any).returning();
    return result[0];
  }

  async updateGrassrootsSubmission(id: string, updates: Partial<GrassrootsSubmission>): Promise<GrassrootsSubmission | undefined> {
    const result = await db.update(grassrootsSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(grassrootsSubmissions.id, id))
      .returning();
    return result[0];
  }

  async approveGrassrootsSubmission(id: string, reviewerId: string, notes?: string): Promise<GrassrootsSubmission | undefined> {
    return await this.updateGrassrootsSubmission(id, {
      status: "approved",
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      reviewNotes: notes,
    });
  }

  async rejectGrassrootsSubmission(id: string, reviewerId: string, reason: string): Promise<GrassrootsSubmission | undefined> {
    return await this.updateGrassrootsSubmission(id, {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      rejectionReason: reason,
    });
  }

  async submitGrassrootsForReview(id: string): Promise<GrassrootsSubmission | undefined> {
    const submission = await this.getGrassrootsSubmission(id);
    if (!submission || (submission.status !== "draft" && submission.status !== "pending")) {
      return undefined;
    }
    return await this.updateGrassrootsSubmission(id, {
      status: "review",
    });
  }

  async findDuplicateEntities(submission: GrassrootsSubmission): Promise<{ id: string; name: string; type: string; matchScore: number; confidencePercent: number; whyMatched: string[]; details?: string }[]> {
    const duplicates: { id: string; name: string; type: string; matchScore: number; confidencePercent: number; whyMatched: string[]; details?: string }[] = [];
    const searchName = submission.entityName.toLowerCase().trim();
    
    if (submission.entityType === "league") {
      const allLeagues = await db.select().from(leagues);
      for (const league of allLeagues) {
        const leagueName = league.name.toLowerCase().trim();
        let matchScore = 0;
        const whyMatched: string[] = [];
        
        if (leagueName === searchName) {
          matchScore = 60;
          whyMatched.push("Exact name match");
        } else if (leagueName.includes(searchName) || searchName.includes(leagueName)) {
          matchScore = 30;
          whyMatched.push("Partial name match");
        }
        
        if (matchScore > 0) {
          if (submission.countryId && league.countryId === submission.countryId) {
            matchScore += 20;
            whyMatched.push("Same country");
          }
          if (submission.type && league.type === submission.type) {
            matchScore += 15;
            whyMatched.push(`Same type (${league.type})`);
          }
          if (submission.tier && league.tier === submission.tier) {
            matchScore += 5;
            whyMatched.push(`Same tier (${league.tier})`);
          }
          
          duplicates.push({ 
            id: league.id, 
            name: league.name, 
            type: matchScore >= 80 ? "exact" : "partial", 
            matchScore: Math.min(matchScore, 100),
            confidencePercent: Math.min(matchScore, 100),
            whyMatched,
            details: `Type: ${league.type || 'unknown'}, Tier: ${league.tier || 'unknown'}`
          });
        }
      }
    } else if (submission.entityType === "team") {
      const allTeams = await db.select().from(teams);
      for (const team of allTeams) {
        const teamName = team.name.toLowerCase().trim();
        let matchScore = 0;
        const whyMatched: string[] = [];
        
        if (teamName === searchName) {
          matchScore = 50;
          whyMatched.push("Exact name match");
        } else if (teamName.includes(searchName) || searchName.includes(teamName)) {
          matchScore = 25;
          whyMatched.push("Partial name match");
        }
        
        if (matchScore > 0) {
          if (submission.stateCode && team.stateCode === submission.stateCode) {
            matchScore += 25;
            whyMatched.push(`Same state (${team.stateCode})`);
          }
          if (submission.city && team.city?.toLowerCase() === submission.city.toLowerCase()) {
            matchScore += 15;
            whyMatched.push(`Same city (${team.city})`);
          }
          if (submission.countryId && team.countryId === submission.countryId) {
            matchScore += 10;
            whyMatched.push("Same country");
          }
          
          duplicates.push({ 
            id: team.id, 
            name: team.name, 
            type: matchScore >= 80 ? "exact" : "partial", 
            matchScore: Math.min(matchScore, 100),
            confidencePercent: Math.min(matchScore, 100),
            whyMatched,
            details: `${team.city || ''}, ${team.stateCode || ''}`
          });
        }
      }
    }
    
    return duplicates.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  }

  async linkSubmissionToExisting(submissionId: string, existingEntityId: string, reviewerId: string): Promise<GrassrootsSubmission | undefined> {
    const submission = await this.getGrassrootsSubmission(submissionId);
    if (!submission || submission.status !== "approved") {
      return undefined;
    }
    
    await this.createProviderMapping({
      providerName: "grassroots",
      providerEntityType: submission.entityType as any,
      providerEntityId: submissionId,
      internalEntityId: existingEntityId,
      providerEntityName: submission.entityName,
    });
    
    return await this.updateGrassrootsSubmission(submissionId, {
      status: "promoted",
      promotedEntityId: existingEntityId,
      promotedAt: new Date(),
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    });
  }

  async promoteGrassrootsSubmission(id: string, reviewerId: string): Promise<{ submission: GrassrootsSubmission; promotedEntity: League | Team | Division | Venue } | undefined> {
    const submission = await this.getGrassrootsSubmission(id);
    if (!submission || submission.status !== "approved") {
      return undefined;
    }

    let promotedEntity: League | Team | Division | Venue;

    switch (submission.entityType) {
      case "league": {
        const canonicalTypes = new Set(["professional", "college", "youth", "amateur", "pickup"]);
        const grassrootsToCanonical: Record<string, string> = {
          "high_school": "youth",
          "adult_amateur": "amateur",
        };
        
        let canonicalType: string;
        if (canonicalTypes.has(submission.type)) {
          canonicalType = submission.type;
        } else if (grassrootsToCanonical[submission.type]) {
          canonicalType = grassrootsToCanonical[submission.type];
        } else {
          canonicalType = "amateur";
        }
        
        const [newLeague] = await db.insert(leagues).values({
          countryId: submission.countryId!,
          name: submission.entityName,
          slug: submission.slug,
          shortName: submission.shortName,
          logo: submission.logo,
          tier: submission.tier,
          type: canonicalType,
          isActive: true,
        }).returning();
        promotedEntity = newLeague;
        break;
      }
      case "team": {
        const [newTeam] = await db.insert(teams).values({
          leagueId: submission.parentLeagueId,
          divisionId: submission.parentDivisionId,
          name: submission.entityName,
          slug: submission.slug,
          shortName: submission.shortName,
          logo: submission.logo,
          city: submission.city,
          stateCode: submission.stateCode,
          venue: submission.venue,
          isActive: true,
        }).returning();
        promotedEntity = newTeam;
        break;
      }
      case "division": {
        const [newDivision] = await db.insert(divisions).values({
          leagueId: submission.parentLeagueId!,
          name: submission.entityName,
          slug: submission.slug,
          tier: submission.tier,
          isActive: true,
        }).returning();
        promotedEntity = newDivision;
        break;
      }
      case "venue": {
        const [newVenue] = await db.insert(venues).values({
          name: submission.entityName,
          slug: submission.slug,
          address: submission.address,
          city: submission.city,
          stateCode: submission.stateCode,
          countryId: submission.countryId,
          capacity: submission.capacity,
          surface: submission.surface,
          latitude: submission.latitude,
          longitude: submission.longitude,
          isActive: true,
        }).returning();
        promotedEntity = newVenue;
        break;
      }
      default:
        return undefined;
    }

    await this.createProviderMapping({
      providerName: "grassroots",
      providerEntityType: submission.entityType as any,
      providerEntityId: id,
      internalEntityId: promotedEntity.id,
      providerEntityName: submission.entityName,
    });

    const updatedSubmission = await this.updateGrassrootsSubmission(id, {
      status: "promoted",
      promotedEntityId: promotedEntity.id,
      promotedAt: new Date(),
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    });

    return {
      submission: updatedSubmission!,
      promotedEntity,
    };
  }

  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries);
  }

  async getLeagues(): Promise<League[]> {
    return await db.select().from(leagues);
  }

  async getOrganizationsForUser(userId: string): Promise<Organization[]> {
    const memberships = await db.select().from(organizationMembers).where(eq(organizationMembers.userId, userId));
    const orgIds = memberships.map(m => m.organizationId);
    
    if (orgIds.length === 0) return [];
    
    const orgs = [];
    for (const orgId of orgIds) {
      const org = await this.getOrganization(orgId);
      if (org) orgs.push(org);
    }
    return orgs;
  }

  async getSports(): Promise<Sport[]> {
    return await db.select().from(sports).orderBy(sports.sortOrder);
  }

  async getSport(id: string): Promise<Sport | undefined> {
    const result = await db.select().from(sports).where(eq(sports.id, id));
    return result[0];
  }

  async getSportBySlug(slug: string): Promise<Sport | undefined> {
    const result = await db.select().from(sports).where(eq(sports.slug, slug));
    return result[0];
  }

  async createSport(sport: InsertSport): Promise<Sport> {
    const result = await db.insert(sports).values(sport).returning();
    return result[0];
  }

  async getLeaguesBySport(sportId: string): Promise<League[]> {
    return await db.select().from(leagues).where(eq(leagues.sportId, sportId));
  }

  async getLeaguesBySportSlug(sportSlug: string): Promise<League[]> {
    const sport = await this.getSportBySlug(sportSlug);
    if (!sport) return [];
    return await this.getLeaguesBySport(sport.id);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const result = await db.select().from(teams).where(eq(teams.id, id));
    return result[0];
  }

  async getTeamsByLeague(leagueId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.leagueId, leagueId));
  }

  async getLeague(id: string): Promise<League | undefined> {
    const result = await db.select().from(leagues).where(eq(leagues.id, id));
    return result[0];
  }

  async updateLeague(id: string, updates: Partial<League>): Promise<League | undefined> {
    const result = await db.update(leagues)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leagues.id, id))
      .returning();
    return result[0];
  }

  async getAdminLeagues(sportSlug?: string): Promise<(League & { sportCode?: string; teamCount?: number })[]> {
    let leagueList: League[];
    
    if (sportSlug && sportSlug !== "all") {
      if (sportSlug === "soccer") {
        const soccerSport = await this.getSportBySlug("soccer");
        const allLeagues = await db.select().from(leagues);
        leagueList = allLeagues.filter(l => 
          l.sportId === null || (soccerSport && l.sportId === soccerSport.id)
        );
      } else {
        const sport = await this.getSportBySlug(sportSlug);
        if (sport) {
          leagueList = await db.select().from(leagues).where(eq(leagues.sportId, sport.id));
        } else {
          leagueList = [];
        }
      }
    } else {
      leagueList = await db.select().from(leagues);
    }

    const result = await Promise.all(leagueList.map(async (league) => {
      const teamList = await db.select().from(teams).where(eq(teams.leagueId, league.id));
      let sportCode: string | undefined;
      if (league.sportId) {
        const sport = await this.getSport(league.sportId);
        sportCode = sport?.code;
      } else {
        sportCode = "soccer";
      }
      return {
        ...league,
        sportCode,
        teamCount: teamList.length,
      };
    }));
    
    return result;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  }

  async getAuditLogs(filters?: { entityType?: string; sportId?: string; limit?: number }): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    
    return await query;
  }

  async getProviderMappings(filters?: { providerName?: string; entityType?: string; sportSlug?: string }): Promise<ProviderMapping[]> {
    let result = await db.select().from(providerMappings).orderBy(desc(providerMappings.createdAt));
    
    if (filters?.providerName) {
      result = result.filter(m => m.providerName === filters.providerName);
    }
    if (filters?.entityType) {
      result = result.filter(m => m.providerEntityType === filters.entityType);
    }
    
    if (filters?.sportSlug && filters.sportSlug !== "all") {
      const leagueList = await this.getAdminLeagues(filters.sportSlug);
      const leagueIds = new Set(leagueList.map(l => l.id));
      const allTeams = await db.select().from(teams);
      const teamIds = new Set(allTeams.filter(t => t.leagueId && leagueIds.has(t.leagueId)).map(t => t.id));
      
      result = result.filter(m => {
        if (m.providerEntityType === "league") {
          return leagueIds.has(m.internalEntityId);
        } else if (m.providerEntityType === "team") {
          return teamIds.has(m.internalEntityId);
        }
        return true;
      });
    }
    
    return result;
  }

  async getProviderMapping(id: string): Promise<ProviderMapping | undefined> {
    const result = await db.select().from(providerMappings).where(eq(providerMappings.id, id));
    return result[0];
  }

  async createProviderMapping(mapping: InsertProviderMapping): Promise<ProviderMapping> {
    const result = await db.insert(providerMappings).values(mapping).returning();
    return result[0];
  }

  async updateProviderMapping(id: string, updates: Partial<ProviderMapping>): Promise<ProviderMapping | undefined> {
    const result = await db.update(providerMappings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(providerMappings.id, id))
      .returning();
    return result[0];
  }

  async deleteProviderMapping(id: string): Promise<boolean> {
    const result = await db.delete(providerMappings).where(eq(providerMappings.id, id)).returning();
    return result.length > 0;
  }

  async checkMappingConflict(
    providerName: string, 
    providerEntityType: string, 
    providerEntityId: string, 
    internalEntityId: string,
    excludeId?: string
  ): Promise<{ type: 'provider_conflict' | 'internal_conflict'; existingMapping: ProviderMapping } | null> {
    const allMappings = await db.select().from(providerMappings);
    
    for (const mapping of allMappings) {
      if (excludeId && mapping.id === excludeId) continue;
      
      if (mapping.providerName === providerName && 
          mapping.providerEntityType === providerEntityType && 
          mapping.providerEntityId === providerEntityId &&
          mapping.internalEntityId !== internalEntityId) {
        return { type: 'provider_conflict', existingMapping: mapping };
      }
      
      if (mapping.providerName === providerName &&
          mapping.providerEntityType === providerEntityType &&
          mapping.internalEntityId === internalEntityId &&
          mapping.providerEntityId !== providerEntityId) {
        return { type: 'internal_conflict', existingMapping: mapping };
      }
    }
    
    return null;
  }

  async getCoverageStats(sportSlug?: string, source?: string): Promise<{ entityType: string; total: number; mapped: number; percentage: number }[]> {
    const leagueList = await this.getAdminLeagues(sportSlug);
    const leagueIds = new Set(leagueList.map(l => l.id));
    const allTeams = await db.select().from(teams);
    const allSeasons = await db.select().from(seasons);
    let allMappings = await db.select().from(providerMappings);
    
    if (source && source !== "all") {
      const providerSources = ["sportmonks", "opta", "wyscout", "api-football", "flashscore"];
      const grassrootsSources = ["grassroots", "community", "submission"];
      const adminSources = ["manual", "admin", "seed"];
      
      if (source === "provider") {
        allMappings = allMappings.filter(m => providerSources.includes(m.providerName));
      } else if (source === "grassroots") {
        allMappings = allMappings.filter(m => grassrootsSources.includes(m.providerName));
      } else if (source === "admin") {
        allMappings = allMappings.filter(m => adminSources.includes(m.providerName));
      } else {
        allMappings = allMappings.filter(m => m.providerName === source);
      }
    }
    
    let relevantTeams = allTeams;
    let relevantSeasons = allSeasons;
    if (sportSlug && sportSlug !== "all") {
      relevantTeams = allTeams.filter(t => t.leagueId && leagueIds.has(t.leagueId));
      relevantSeasons = allSeasons.filter(s => leagueIds.has(s.leagueId));
    }
    
    const leagueMappings = allMappings.filter(m => m.providerEntityType === "league");
    const teamMappings = allMappings.filter(m => m.providerEntityType === "team");
    const seasonMappings = allMappings.filter(m => m.providerEntityType === "season");
    
    const mappedLeagueIds = new Set(leagueMappings.map(m => m.internalEntityId));
    const mappedTeamIds = new Set(teamMappings.map(m => m.internalEntityId));
    const mappedSeasonIds = new Set(seasonMappings.map(m => m.internalEntityId));
    
    const mappedLeaguesCount = leagueList.filter(l => mappedLeagueIds.has(l.id)).length;
    const mappedTeamsCount = relevantTeams.filter(t => mappedTeamIds.has(t.id)).length;
    const mappedSeasonsCount = relevantSeasons.filter(s => mappedSeasonIds.has(s.id)).length;
    
    return [
      {
        entityType: "league",
        total: leagueList.length,
        mapped: mappedLeaguesCount,
        percentage: leagueList.length > 0 ? Math.round((mappedLeaguesCount / leagueList.length) * 100) : 0,
      },
      {
        entityType: "team",
        total: relevantTeams.length,
        mapped: mappedTeamsCount,
        percentage: relevantTeams.length > 0 ? Math.round((mappedTeamsCount / relevantTeams.length) * 100) : 0,
      },
      {
        entityType: "season",
        total: relevantSeasons.length,
        mapped: mappedSeasonsCount,
        percentage: relevantSeasons.length > 0 ? Math.round((mappedSeasonsCount / relevantSeasons.length) * 100) : 0,
      },
    ];
  }

  async getUnmappedEntities(entityType: 'league' | 'team' | 'season', sportSlug?: string, limit?: number): Promise<{ id: string; name: string; entityType: string; sportCode?: string }[]> {
    const allMappings = await db.select().from(providerMappings);
    const mappedIds = new Set(allMappings.filter(m => m.providerEntityType === entityType).map(m => m.internalEntityId));
    
    if (entityType === "league") {
      const leagueList = await this.getAdminLeagues(sportSlug);
      let unmapped = leagueList
        .filter(l => !mappedIds.has(l.id))
        .map(l => ({ id: l.id, name: l.name, entityType: "league", sportCode: l.sportCode }));
      if (limit) unmapped = unmapped.slice(0, limit);
      return unmapped;
    } else if (entityType === "team") {
      const leagueList = await this.getAdminLeagues(sportSlug);
      const leagueIds = new Set(leagueList.map(l => l.id));
      const allTeams = await db.select().from(teams);
      
      let relevantTeams = sportSlug && sportSlug !== "all" 
        ? allTeams.filter(t => t.leagueId && leagueIds.has(t.leagueId))
        : allTeams;
      
      let unmapped = relevantTeams
        .filter(t => !mappedIds.has(t.id))
        .map(t => {
          const league = leagueList.find(l => l.id === t.leagueId);
          return { id: t.id, name: t.name, entityType: "team", sportCode: league?.sportCode };
        });
      if (limit) unmapped = unmapped.slice(0, limit);
      return unmapped;
    } else {
      const leagueList = await this.getAdminLeagues(sportSlug);
      const leagueIds = new Set(leagueList.map(l => l.id));
      const allSeasons = await db.select().from(seasons);
      
      let relevantSeasons = sportSlug && sportSlug !== "all"
        ? allSeasons.filter(s => leagueIds.has(s.leagueId))
        : allSeasons;
      
      let unmapped = relevantSeasons
        .filter(s => !mappedIds.has(s.id))
        .map(s => {
          const league = leagueList.find(l => l.id === s.leagueId);
          return { id: s.id, name: s.name, entityType: "season", sportCode: league?.sportCode };
        });
      if (limit) unmapped = unmapped.slice(0, limit);
      return unmapped;
    }
  }

  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getAllSeasons(sportSlug?: string): Promise<{ id: string; name: string; leagueId: string }[]> {
    const allSeasons = await db.select().from(seasons);
    
    if (sportSlug && sportSlug !== "all") {
      const leagueList = await this.getAdminLeagues(sportSlug);
      const leagueIds = new Set(leagueList.map(l => l.id));
      return allSeasons.filter(s => leagueIds.has(s.leagueId));
    }
    
    return allSeasons;
  }

  async createApiKey(data: { organizationId: string; name: string; keyHash: string; keyPrefix: string; scopes?: string[]; createdById: string }): Promise<ApiKey> {
    const result = await db.insert(apiKeys).values({
      organizationId: data.organizationId,
      name: data.name,
      keyHash: data.keyHash,
      keyPrefix: data.keyPrefix,
      scopes: data.scopes || [],
      createdById: data.createdById,
    }).returning();
    return result[0];
  }

  async getApiKeys(organizationId: string): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.organizationId, organizationId));
  }

  async getApiKeyByPrefix(prefix: string): Promise<ApiKey | undefined> {
    const result = await db.select().from(apiKeys).where(eq(apiKeys.keyPrefix, prefix));
    return result[0];
  }

  async revokeApiKey(id: string): Promise<boolean> {
    const result = await db.update(apiKeys)
      .set({ isActive: false, revokedAt: new Date() })
      .where(eq(apiKeys.id, id))
      .returning();
    return result.length > 0;
  }

  async updateApiKeyLastUsed(id: string): Promise<void> {
    await db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, id));
  }

  async logApiKeyUsage(usage: { apiKeyId: string; endpoint: string; method: string; statusCode?: number; responseTimeMs?: number; ipAddress?: string }): Promise<void> {
    await db.insert(apiKeyUsage).values({
      apiKeyId: usage.apiKeyId,
      endpoint: usage.endpoint,
      method: usage.method,
      statusCode: usage.statusCode,
      responseTimeMs: usage.responseTimeMs,
      ipAddress: usage.ipAddress,
    });
  }

  async upgradeUserToPlan(userId: string, planTier: PlanTier, billingCycle: 'monthly' | 'yearly', stripeSubscriptionId?: string): Promise<{ user: User; subscription: UserSubscription }> {
    const user = await db.update(users)
      .set({ planTier })
      .where(eq(users.id, userId))
      .returning();

    const existingSub = await this.getUserSubscription(userId);
    let subscription: UserSubscription;
    
    if (existingSub) {
      subscription = (await db.update(userSubscriptions)
        .set({ 
          planTier, 
          billingCycle,
          stripeSubscriptionId,
          status: "active",
          currentPeriodStart: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.id, existingSub.id))
        .returning())[0];
    } else {
      subscription = await this.createSubscription({
        userId,
        planTier,
        billingCycle,
        status: "active",
        currentPeriodStart: new Date(),
        stripeSubscriptionId,
      });
    }

    return { user: user[0], subscription };
  }
}

export const storage = new DatabaseStorage();
