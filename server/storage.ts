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
  sports
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
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
  promoteGrassrootsSubmission(id: string): Promise<{ submission: GrassrootsSubmission; promotedEntity: League | Team | Division | Venue } | undefined>;
  
  getSports(): Promise<Sport[]>;
  getSport(id: string): Promise<Sport | undefined>;
  getSportBySlug(slug: string): Promise<Sport | undefined>;
  createSport(sport: InsertSport): Promise<Sport>;
  getLeaguesBySport(sportId: string): Promise<League[]>;
  getLeaguesBySportSlug(sportSlug: string): Promise<League[]>;
  
  getTeam(id: string): Promise<Team | undefined>;
  getTeamsByLeague(leagueId: string): Promise<Team[]>;
  getLeague(id: string): Promise<League | undefined>;
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

  async promoteGrassrootsSubmission(id: string): Promise<{ submission: GrassrootsSubmission; promotedEntity: League | Team | Division | Venue } | undefined> {
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

    const updatedSubmission = await this.updateGrassrootsSubmission(id, {
      promotedEntityId: promotedEntity.id,
      promotedAt: new Date(),
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
}

export const storage = new DatabaseStorage();
