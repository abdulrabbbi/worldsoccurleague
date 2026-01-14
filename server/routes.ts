import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserPreferencesSchema,
  insertOrganizationSchema,
  insertOrganizationMemberSchema,
  insertGrassrootsSubmissionSchema
} from "@shared/schema";
import { PLAN_TIERS, type PlanTier } from "@shared/plans";
import { 
  authMiddleware, 
  requireAuth, 
  requirePlan, 
  requireGrassrootsAccess,
  requireVerifiedPartner,
  requireOrgAccess,
  canVerifyPartners
} from "./rbac";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(authMiddleware);
  
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(data);
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      const planConfig = PLAN_TIERS[user.planTier as PlanTier];
      
      res.json({ 
        user: userWithoutPassword,
        plan: planConfig,
        features: planConfig.features,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const userId = req.ctx?.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      const planConfig = PLAN_TIERS[user.planTier as PlanTier];
      
      res.json({ 
        user: userWithoutPassword,
        plan: planConfig,
        features: planConfig.features,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const prefs = await storage.getUserPreferences(req.params.userId);
      res.json({ preferences: prefs || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", async (req, res) => {
    try {
      const data = insertUserPreferencesSchema.parse(req.body);
      const prefs = await storage.upsertUserPreferences(data);
      res.json({ preferences: prefs });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save preferences" });
    }
  });

  app.get("/api/plans", (req, res) => {
    res.json({ plans: Object.values(PLAN_TIERS) });
  });

  app.get("/api/user/plan", requireAuth, async (req, res) => {
    const user = req.ctx!.user!;
    const planConfig = PLAN_TIERS[user.planTier];
    const subscription = await storage.getUserSubscription(user.id);
    
    res.json({
      plan: planConfig,
      features: planConfig.features,
      subscription: subscription || null,
    });
  });

  app.post("/api/user/upgrade", requireAuth, async (req, res) => {
    try {
      const { planTier, billingCycle } = req.body as { planTier: PlanTier; billingCycle: "monthly" | "yearly" };
      const user = req.ctx!.user!;
      
      if (!PLAN_TIERS[planTier]) {
        return res.status(400).json({ error: "Invalid plan tier" });
      }
      
      const updatedUser = await storage.updateUserPlan(user.id, planTier);
      
      let subscription = await storage.getUserSubscription(user.id);
      if (subscription) {
        subscription = await storage.updateSubscription(subscription.id, {
          planTier,
          billingCycle,
          status: "active",
          stripePriceId: billingCycle === "monthly" 
            ? PLAN_TIERS[planTier].stripePriceIdMonthly 
            : PLAN_TIERS[planTier].stripePriceIdYearly,
        }) || subscription;
      } else {
        subscription = await storage.createSubscription({
          userId: user.id,
          planTier,
          billingCycle,
          status: "active",
          stripeSubscriptionId: `sub_stub_${Date.now()}`,
          stripePriceId: billingCycle === "monthly" 
            ? PLAN_TIERS[planTier].stripePriceIdMonthly 
            : PLAN_TIERS[planTier].stripePriceIdYearly,
        });
      }
      
      res.json({
        user: updatedUser,
        subscription,
        plan: PLAN_TIERS[planTier],
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade plan" });
    }
  });

  app.get("/api/grassroots/organizations", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const orgs = await storage.getOrganizationsByUser(user.id);
      res.json({ organizations: orgs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.post("/api/grassroots/organizations", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const data = insertOrganizationSchema.parse({
        ...req.body,
        createdById: user.id,
      });
      
      const existing = await storage.getOrganizationBySlug(data.slug);
      if (existing) {
        return res.status(400).json({ error: "Organization slug already exists" });
      }
      
      const org = await storage.createOrganization(data);
      
      await storage.addOrganizationMember({
        organizationId: org.id,
        userId: user.id,
        role: "owner",
      });
      
      await storage.createPartnerVerification({
        organizationId: org.id,
        status: "draft",
      });
      
      res.json({ organization: org });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.get("/api/grassroots/organizations/:orgId", requireAuth, requireGrassrootsAccess, requireOrgAccess("viewer"), async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      const verification = await storage.getPartnerVerification(org.id);
      const members = await storage.getOrganizationMembers(org.id);
      
      res.json({ 
        organization: org,
        verification,
        members,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.put("/api/grassroots/organizations/:orgId", requireAuth, requireGrassrootsAccess, requireOrgAccess("editor"), async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      if (org.verificationStatus === "review") {
        return res.status(400).json({ error: "Cannot edit organization while under review" });
      }
      
      const { name, description, website, logoUrl, stateCode, city } = req.body;
      const updated = await storage.updateOrganization(req.params.orgId, {
        name,
        description,
        website,
        logoUrl,
        stateCode,
        city,
      });
      
      res.json({ organization: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  app.delete("/api/grassroots/organizations/:orgId", requireAuth, requireGrassrootsAccess, requireOrgAccess("owner"), async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      if (org.verificationStatus === "verified") {
        return res.status(400).json({ error: "Cannot delete verified organization" });
      }
      
      await storage.deleteOrganization(req.params.orgId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  app.post("/api/grassroots/organizations/:orgId/members", requireAuth, requireGrassrootsAccess, requireOrgAccess("admin"), async (req, res) => {
    try {
      const { userId, role } = req.body;
      const user = req.ctx!.user!;
      
      const existing = await storage.getOrganizationMember(req.params.orgId, userId);
      if (existing) {
        return res.status(400).json({ error: "User is already a member" });
      }
      
      const member = await storage.addOrganizationMember({
        organizationId: req.params.orgId,
        userId,
        role: role || "viewer",
        invitedById: user.id,
      });
      
      res.json({ member });
    } catch (error) {
      res.status(500).json({ error: "Failed to add member" });
    }
  });

  app.post("/api/grassroots/organizations/:orgId/submit-verification", requireAuth, requireGrassrootsAccess, requireOrgAccess("owner"), async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      if (org.verificationStatus !== "draft" && org.verificationStatus !== "rejected") {
        return res.status(400).json({ error: "Organization cannot be submitted for verification" });
      }
      
      const verification = await storage.submitForVerification(req.params.orgId);
      await storage.updateOrganization(req.params.orgId, { verificationStatus: "review" });
      
      res.json({ verification, message: "Submitted for verification" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit verification" });
    }
  });

  app.get("/api/admin/verifications/pending", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    res.json({ verifications: [] });
  });

  app.post("/api/admin/verifications/:id/approve", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const { notes } = req.body;
      
      const verification = await storage.approveVerification(req.params.id, user.id, notes);
      if (!verification) {
        return res.status(404).json({ error: "Verification not found" });
      }
      
      res.json({ verification, message: "Partner verified successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve verification" });
    }
  });

  app.post("/api/admin/verifications/:id/reject", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ error: "Rejection reason required" });
      }
      
      const verification = await storage.rejectVerification(req.params.id, user.id, reason);
      if (!verification) {
        return res.status(404).json({ error: "Verification not found" });
      }
      
      res.json({ verification, message: "Verification rejected" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject verification" });
    }
  });

  app.get("/api/admin/grassroots/submissions", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const { status, type, entityType } = req.query;
      const submissions = await storage.getGrassrootsSubmissions({
        status: status as string | undefined,
        type: type as string | undefined,
        entityType: entityType as string | undefined,
      });
      
      const submissionsWithUser = await Promise.all(
        submissions.map(async (s) => {
          const submittedBy = await storage.getUser(s.submittedById);
          return {
            ...s,
            submittedByName: submittedBy?.name || submittedBy?.email || "Unknown",
          };
        })
      );
      
      res.json({ submissions: submissionsWithUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grassroots submissions" });
    }
  });

  app.get("/api/admin/grassroots/submissions/:id", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const submission = await storage.getGrassrootsSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      const submittedBy = await storage.getUser(submission.submittedById);
      res.json({ 
        submission: {
          ...submission,
          submittedByName: submittedBy?.name || submittedBy?.email || "Unknown",
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/admin/grassroots/submissions/:id/approve", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const { notes } = req.body;
      
      const submission = await storage.approveGrassrootsSubmission(req.params.id, user.id, notes);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ submission, message: "Submission approved" });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  app.post("/api/admin/grassroots/submissions/:id/reject", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ error: "Rejection reason is required" });
      }
      
      const submission = await storage.rejectGrassrootsSubmission(req.params.id, user.id, reason);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ submission, message: "Submission rejected" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  app.post("/api/admin/grassroots/submissions/:id/promote", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const result = await storage.promoteGrassrootsSubmission(req.params.id, user.id);
      if (!result) {
        return res.status(400).json({ error: "Submission must be approved before promotion" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "promote",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: result.submission.entityName,
        newData: { 
          promotedEntityId: result.promotedEntity.id,
          promotedEntityType: result.submission.entityType,
        },
      });
      
      res.json({ 
        submission: result.submission, 
        promotedEntity: result.promotedEntity,
        message: `Successfully promoted to ${result.submission.entityType}` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to promote submission" });
    }
  });

  app.post("/api/admin/grassroots/submissions/:id/submit", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const submission = await storage.submitGrassrootsForReview(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found or already submitted" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "submit_for_review",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
        newData: { status: "review" },
      });
      
      res.json({ submission, message: "Submitted for review" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit for review" });
    }
  });

  app.get("/api/admin/grassroots/submissions/:id/duplicates", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const submission = await storage.getGrassrootsSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      const duplicates = await storage.findDuplicateEntities(submission);
      res.json({ duplicates });
    } catch (error) {
      res.status(500).json({ error: "Failed to find duplicates" });
    }
  });

  app.post("/api/admin/grassroots/submissions/:id/link", requireAuth, async (req, res) => {
    if (!canVerifyPartners(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const user = req.ctx!.user!;
      const { existingEntityId } = req.body;
      
      if (!existingEntityId) {
        return res.status(400).json({ error: "existingEntityId is required" });
      }
      
      const submission = await storage.linkSubmissionToExisting(req.params.id, existingEntityId, user.id);
      if (!submission) {
        return res.status(400).json({ error: "Submission must be approved before linking" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "link_existing",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
        newData: { linkedEntityId: existingEntityId },
      });
      
      res.json({ submission, message: "Linked to existing entity" });
    } catch (error) {
      res.status(500).json({ error: "Failed to link submission" });
    }
  });

  app.post("/api/grassroots/submissions", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const data = insertGrassrootsSubmissionSchema.parse({
        ...req.body,
        submittedById: user.id,
      });
      
      const submission = await storage.createGrassrootsSubmission(data);
      res.json({ submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  app.get("/api/grassroots/submissions", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const allSubmissions = await storage.getGrassrootsSubmissions();
      const userSubmissions = allSubmissions.filter(s => s.submittedById === user.id);
      res.json({ submissions: userSubmissions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/partner/organizations", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const orgs = await storage.getOrganizationsForUser(user.id);
      res.json(orgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.post("/api/partner/organizations", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      if (user.planTier !== "partner") {
        return res.status(403).json({ error: "Partner tier required" });
      }
      
      const data = insertOrganizationSchema.parse({
        ...req.body,
        createdById: user.id,
      });
      
      const org = await storage.createOrganization(data);
      await storage.addOrganizationMember({
        organizationId: org.id,
        userId: user.id,
        role: "owner",
      });
      
      await storage.createAuditLog({
        userId: user.id,
        action: "create",
        entityType: "organization",
        entityId: org.id,
        entityName: org.name,
        newData: { type: org.type, slug: org.slug },
      });
      
      res.json({ organization: org });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.get("/api/partner/organizations/:orgId/members", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      
      if (!userMember && !canVerifyPartners(req)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json({ members });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.post("/api/partner/organizations/:orgId/members", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      
      if (!userMember || !["owner", "admin"].includes(userMember.role)) {
        return res.status(403).json({ error: "Only owners and admins can add members" });
      }
      
      const { userId, role } = req.body;
      if (!userId || !role) {
        return res.status(400).json({ error: "userId and role are required" });
      }
      
      const newMember = await storage.addOrganizationMember({
        organizationId: req.params.orgId,
        userId,
        role,
        invitedById: user.id,
      });
      
      await storage.createAuditLog({
        userId: user.id,
        action: "create",
        entityType: "organization_member",
        entityId: newMember.id,
        entityName: `Member ${userId}`,
        newData: { organizationId: req.params.orgId, role },
      });
      
      res.json({ member: newMember });
    } catch (error) {
      res.status(500).json({ error: "Failed to add member" });
    }
  });

  app.patch("/api/partner/organizations/:orgId/members/:memberId", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      const targetMember = members.find(m => m.id === req.params.memberId);
      
      if (!userMember || userMember.role !== "owner") {
        return res.status(403).json({ error: "Only owners can change member roles" });
      }
      
      if (!targetMember) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      const { role } = req.body;
      const previousRole = targetMember.role;
      const updated = await storage.updateOrganizationMemberRole(req.params.memberId, role);
      
      await storage.createAuditLog({
        userId: user.id,
        action: "update",
        entityType: "organization_member",
        entityId: req.params.memberId,
        entityName: `Member role change`,
        previousData: { role: previousRole },
        newData: { role },
      });
      
      res.json({ member: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to update member role" });
    }
  });

  app.delete("/api/partner/organizations/:orgId/members/:memberId", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      const targetMember = members.find(m => m.id === req.params.memberId);
      
      if (!targetMember) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      const canRemove = userMember?.role === "owner" || 
                        (userMember?.role === "admin" && targetMember.role !== "owner") ||
                        targetMember.userId === user.id;
      
      if (!canRemove) {
        return res.status(403).json({ error: "Permission denied" });
      }
      
      await storage.removeOrganizationMember(req.params.memberId);
      
      await storage.createAuditLog({
        userId: user.id,
        action: "delete",
        entityType: "organization_member",
        entityId: req.params.memberId,
        entityName: `Member removed`,
        previousData: { role: targetMember.role },
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove member" });
    }
  });

  app.get("/api/partner/organizations/:orgId/api-keys", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      
      if (!userMember || !["owner", "admin"].includes(userMember.role)) {
        return res.status(403).json({ error: "Only owners and admins can view API keys" });
      }
      
      const keys = await storage.getApiKeys(req.params.orgId);
      const safeKeys = keys.map(k => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        scopes: k.scopes,
        rateLimitPerMinute: k.rateLimitPerMinute,
        rateLimitPerDay: k.rateLimitPerDay,
        lastUsedAt: k.lastUsedAt,
        isActive: k.isActive,
        createdAt: k.createdAt,
      }));
      
      res.json({ apiKeys: safeKeys });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/partner/organizations/:orgId/api-keys", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const org = await storage.getOrganization(req.params.orgId);
      
      if (!org || org.verificationStatus !== "verified") {
        return res.status(403).json({ error: "Organization must be verified to create API keys" });
      }
      
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      
      if (!userMember || userMember.role !== "owner") {
        return res.status(403).json({ error: "Only owners can create API keys" });
      }
      
      const { name, scopes } = req.body;
      const rawKey = `wsl_${crypto.randomUUID().replace(/-/g, '')}`;
      const keyPrefix = rawKey.substring(0, 12);
      const keyHash = rawKey;
      
      const apiKey = await storage.createApiKey({
        organizationId: req.params.orgId,
        name: name || "API Key",
        keyHash,
        keyPrefix,
        scopes: scopes || ["read"],
        createdById: user.id,
      });
      
      await storage.createAuditLog({
        userId: user.id,
        action: "create",
        entityType: "api_key",
        entityId: apiKey.id,
        entityName: name || "API Key",
        newData: { scopes, organizationId: req.params.orgId },
      });
      
      res.json({ 
        apiKey: {
          id: apiKey.id,
          name: apiKey.name,
          key: rawKey,
          keyPrefix: apiKey.keyPrefix,
          scopes: apiKey.scopes,
        },
        message: "Save this key securely - it will not be shown again"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create API key" });
    }
  });

  app.delete("/api/partner/organizations/:orgId/api-keys/:keyId", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const members = await storage.getOrganizationMembers(req.params.orgId);
      const userMember = members.find(m => m.userId === user.id);
      
      if (!userMember || userMember.role !== "owner") {
        return res.status(403).json({ error: "Only owners can revoke API keys" });
      }
      
      await storage.revokeApiKey(req.params.keyId);
      
      await storage.createAuditLog({
        userId: user.id,
        action: "delete",
        entityType: "api_key",
        entityId: req.params.keyId,
        entityName: "API Key revoked",
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to revoke API key" });
    }
  });

  app.post("/api/subscriptions/upgrade", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { planTier, billingCycle } = req.body;
      
      if (!["pro", "partner"].includes(planTier)) {
        return res.status(400).json({ error: "Invalid plan tier" });
      }
      
      if (!["monthly", "yearly"].includes(billingCycle)) {
        return res.status(400).json({ error: "Invalid billing cycle" });
      }
      
      const result = await storage.upgradeUserToPlan(user.id, planTier, billingCycle);
      
      await storage.createAuditLog({
        userId: user.id,
        action: "update",
        entityType: "subscription",
        entityId: result.subscription.id,
        entityName: `Plan upgrade to ${planTier}`,
        previousData: { planTier: user.planTier },
        newData: { planTier, billingCycle },
      });
      
      res.json({ 
        user: result.user, 
        subscription: result.subscription,
        message: `Successfully upgraded to ${planTier}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade subscription" });
    }
  });

  app.get("/api/subscriptions/current", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const subscription = await storage.getUserSubscription(user.id);
      res.json({ subscription, planTier: user.planTier });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  app.get("/api/countries", async (_req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/leagues", async (_req, res) => {
    try {
      const leagues = await storage.getLeagues();
      res.json(leagues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leagues" });
    }
  });

  app.get("/api/sports", async (_req, res) => {
    try {
      const sportsList = await storage.getSports();
      res.json(sportsList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sports" });
    }
  });

  app.get("/api/sports/:slug", async (req, res) => {
    try {
      const sport = await storage.getSportBySlug(req.params.slug);
      if (!sport) {
        return res.status(404).json({ error: "Sport not found" });
      }
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sport" });
    }
  });

  app.get("/api/sports/:slug/leagues", async (req, res) => {
    try {
      const sport = await storage.getSportBySlug(req.params.slug);
      if (!sport) {
        return res.status(404).json({ error: "Sport not found" });
      }
      const leagueList = await storage.getLeaguesBySport(sport.id);
      res.json({ sport, leagues: leagueList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sport leagues" });
    }
  });

  app.get("/api/leagues/:id", async (req, res) => {
    try {
      const league = await storage.getLeague(req.params.id);
      if (!league) {
        return res.status(404).json({ error: "League not found" });
      }
      res.json(league);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch league" });
    }
  });

  app.get("/api/leagues/:id/teams", async (req, res) => {
    try {
      const teamList = await storage.getTeamsByLeague(req.params.id);
      res.json(teamList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/sports/seed", async (_req, res) => {
    try {
      const existingSports = await storage.getSports();
      if (existingSports.length > 0) {
        return res.json({ message: "Sports already seeded", sports: existingSports });
      }

      const sportsToSeed = [
        { code: "soccer", name: "Soccer", slug: "soccer", icon: "⚽", sortOrder: 0 },
        { code: "nfl", name: "NFL Football", slug: "nfl", icon: "🏈", sortOrder: 1 },
        { code: "nba", name: "NBA Basketball", slug: "nba", icon: "🏀", sortOrder: 2 },
        { code: "mlb", name: "MLB Baseball", slug: "mlb", icon: "⚾", sortOrder: 3 },
        { code: "nhl", name: "NHL Hockey", slug: "nhl", icon: "🏒", sortOrder: 4 },
      ];

      const createdSports = [];
      for (const sportData of sportsToSeed) {
        const sport = await storage.createSport(sportData);
        createdSports.push(sport);
      }

      res.json({ message: "Sports seeded successfully", sports: createdSports });
    } catch (error) {
      console.error("Failed to seed sports:", error);
      res.status(500).json({ error: "Failed to seed sports" });
    }
  });

  // Admin API endpoints
  app.get("/api/admin/leagues", requireAuth, async (req, res) => {
    try {
      const sportSlug = req.query.sport as string | undefined;
      const leagueList = await storage.getAdminLeagues(sportSlug);
      res.json(leagueList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin leagues" });
    }
  });

  app.patch("/api/admin/leagues/:id", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const leagueId = req.params.id;
      const { isActive } = req.body;
      
      const existingLeague = await storage.getLeague(leagueId);
      if (!existingLeague) {
        return res.status(404).json({ error: "League not found" });
      }
      
      const updatedLeague = await storage.updateLeague(leagueId, { isActive });
      
      await storage.createAuditLog({
        userId: user.id,
        action: isActive ? "activate" : "deactivate",
        entityType: "league",
        entityId: leagueId,
        entityName: existingLeague.name,
        previousData: { isActive: existingLeague.isActive },
        newData: { isActive },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      
      res.json(updatedLeague);
    } catch (error) {
      console.error("Failed to update league:", error);
      res.status(500).json({ error: "Failed to update league" });
    }
  });

  app.get("/api/admin/audit-logs", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs({ limit });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const sportSlug = req.query.sport as string | undefined;
      const allLeagues = await storage.getAdminLeagues(sportSlug);
      const allCountries = await storage.getCountries();
      const allSports = await storage.getSports();
      
      res.json({
        leagues: allLeagues.length,
        teams: allLeagues.reduce((sum, l) => sum + (l.teamCount || 0), 0),
        countries: allCountries.length,
        sports: allSports.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/provider-mappings", requireAuth, async (req, res) => {
    try {
      const { provider, entityType, sport } = req.query;
      const mappings = await storage.getProviderMappings({
        providerName: provider as string,
        entityType: entityType as string,
        sportSlug: sport as string,
      });
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider mappings" });
    }
  });

  app.post("/api/admin/provider-mappings", requireAuth, async (req, res) => {
    try {
      const { providerName, providerEntityType, providerEntityId, internalEntityId, providerEntityName, rawPayload } = req.body;
      
      if (!providerName || !providerEntityType || !providerEntityId || !internalEntityId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const conflict = await storage.checkMappingConflict(providerName, providerEntityType, providerEntityId, internalEntityId);
      if (conflict) {
        return res.status(409).json({
          error: conflict.type === 'provider_conflict' 
            ? `Provider ID "${providerEntityId}" is already mapped to another entity`
            : `This entity already has a different mapping from ${providerName}`,
          conflictType: conflict.type,
          existingMapping: conflict.existingMapping,
        });
      }

      const mapping = await storage.createProviderMapping({
        providerName,
        providerEntityType,
        providerEntityId,
        internalEntityId,
        providerEntityName,
        rawPayload,
      });

      const user = req.ctx?.user;
      await storage.createAuditLog({
        action: "create",
        entityType: "provider_mapping",
        entityId: mapping.id,
        entityName: `${providerName}:${providerEntityId} -> ${internalEntityId}`,
        userId: user?.id || "system",
        newData: { mapping },
      });

      res.status(201).json(mapping);
    } catch (error) {
      console.error("Failed to create provider mapping:", error);
      res.status(500).json({ error: "Failed to create provider mapping" });
    }
  });

  app.patch("/api/admin/provider-mappings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { providerName, providerEntityType, providerEntityId, providerEntityName, rawPayload } = req.body;
      
      const existing = await storage.getProviderMapping(id);
      if (!existing) {
        return res.status(404).json({ error: "Mapping not found" });
      }

      if (providerEntityId && providerEntityId !== existing.providerEntityId) {
        const conflict = await storage.checkMappingConflict(
          providerName || existing.providerName,
          providerEntityType || existing.providerEntityType,
          providerEntityId,
          existing.internalEntityId,
          id
        );
        if (conflict) {
          return res.status(409).json({
            error: conflict.type === 'provider_conflict'
              ? `Provider ID "${providerEntityId}" is already mapped to another entity`
              : `This entity already has a different mapping from ${providerName || existing.providerName}`,
            conflictType: conflict.type,
            existingMapping: conflict.existingMapping,
          });
        }
      }

      const mapping = await storage.updateProviderMapping(id, {
        providerName,
        providerEntityType,
        providerEntityId,
        providerEntityName,
        rawPayload,
      });

      res.json(mapping);
    } catch (error) {
      res.status(500).json({ error: "Failed to update provider mapping" });
    }
  });

  app.delete("/api/admin/provider-mappings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProviderMapping(id);
      if (!deleted) {
        return res.status(404).json({ error: "Mapping not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete provider mapping" });
    }
  });

  app.get("/api/admin/coverage", requireAuth, async (req, res) => {
    try {
      const sportSlug = req.query.sport as string | undefined;
      const source = req.query.source as string | undefined;
      const stats = await storage.getCoverageStats(sportSlug, source);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coverage stats" });
    }
  });

  app.get("/api/admin/unmapped", requireAuth, async (req, res) => {
    try {
      const { entityType, sport, limit } = req.query;
      
      if (!entityType || (entityType !== 'league' && entityType !== 'team' && entityType !== 'season')) {
        return res.status(400).json({ error: "entityType must be 'league', 'team', or 'season'" });
      }

      const unmapped = await storage.getUnmappedEntities(
        entityType as 'league' | 'team' | 'season',
        sport as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(unmapped);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unmapped entities" });
    }
  });

  app.get("/api/admin/internal-entities", requireAuth, async (req, res) => {
    try {
      const { entityType, sport, search } = req.query;
      
      if (entityType === 'league') {
        let results = await storage.getAdminLeagues(sport as string);
        if (search) {
          const searchLower = (search as string).toLowerCase();
          results = results.filter(l => l.name.toLowerCase().includes(searchLower));
        }
        res.json(results.slice(0, 50));
      } else if (entityType === 'team') {
        const sportSlug = sport as string;
        let teamResults = await storage.getAllTeams();
        
        if (sportSlug && sportSlug !== "all") {
          const leagueList = await storage.getAdminLeagues(sportSlug);
          const leagueIds = new Set(leagueList.map(l => l.id));
          teamResults = teamResults.filter(t => t.leagueId && leagueIds.has(t.leagueId));
        }
        
        if (search) {
          const searchLower = (search as string).toLowerCase();
          teamResults = teamResults.filter(t => t.name.toLowerCase().includes(searchLower));
        }
        res.json(teamResults.slice(0, 50));
      } else if (entityType === 'season') {
        const sportSlug = sport as string;
        let seasonResults = await storage.getAllSeasons(sportSlug);
        
        if (search) {
          const searchLower = (search as string).toLowerCase();
          seasonResults = seasonResults.filter(s => s.name.toLowerCase().includes(searchLower));
        }
        res.json(seasonResults.slice(0, 50));
      } else {
        res.status(400).json({ error: "entityType must be 'league', 'team', or 'season'" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch internal entities" });
    }
  });

  app.post("/api/grassroots/bulk/teams", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { teams } = req.body;
      
      if (!Array.isArray(teams) || teams.length === 0) {
        return res.status(400).json({ error: "Teams array required" });
      }
      
      const submissions = [];
      for (const team of teams) {
        const data = insertGrassrootsSubmissionSchema.parse({
          ...team,
          entityType: "team",
          submittedById: user.id,
        });
        const submission = await storage.createGrassrootsSubmission(data);
        submissions.push(submission);
      }
      
      res.json({ submissions, count: submissions.length });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create bulk submissions" });
    }
  });

  app.post("/api/grassroots/bulk/fixtures", requireAuth, requireGrassrootsAccess, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { fixtures } = req.body;
      
      if (!Array.isArray(fixtures) || fixtures.length === 0) {
        return res.status(400).json({ error: "Fixtures array required" });
      }
      
      const results = [];
      for (const fixture of fixtures) {
        results.push({
          ...fixture,
          submittedById: user.id,
          status: "pending",
        });
      }
      
      res.json({ fixtures: results, count: results.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to create bulk fixtures" });
    }
  });

  app.get("/api/admin/grassroots", requireAuth, async (req, res) => {
    try {
      const { status, type, entityType } = req.query;
      const submissions = await storage.getGrassrootsSubmissions({
        status: status as string,
        type: type as string,
        entityType: entityType as string,
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grassroots submissions" });
    }
  });

  app.get("/api/admin/grassroots/:id", requireAuth, async (req, res) => {
    try {
      const submission = await storage.getGrassrootsSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/admin/grassroots/:id/submit-review", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const submission = await storage.submitGrassrootsForReview(req.params.id);
      if (!submission) {
        return res.status(400).json({ error: "Cannot submit for review" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "submit_for_review",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
      });
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit for review" });
    }
  });

  app.post("/api/admin/grassroots/:id/approve", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { notes } = req.body;
      const submission = await storage.approveGrassrootsSubmission(req.params.id, user.id, notes);
      if (!submission) {
        return res.status(400).json({ error: "Cannot approve submission" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "approve",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
        newData: { notes },
      });
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  app.post("/api/admin/grassroots/:id/reject", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ error: "Rejection reason required" });
      }
      
      const submission = await storage.rejectGrassrootsSubmission(req.params.id, user.id, reason);
      if (!submission) {
        return res.status(400).json({ error: "Cannot reject submission" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "reject",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
        newData: { reason },
      });
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  app.get("/api/admin/grassroots/:id/duplicates", requireAuth, async (req, res) => {
    try {
      const submission = await storage.getGrassrootsSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      const duplicates = await storage.findDuplicateEntities(submission);
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ error: "Failed to find duplicates" });
    }
  });

  app.post("/api/admin/grassroots/:id/promote", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const result = await storage.promoteGrassrootsSubmission(req.params.id, user.id);
      if (!result) {
        return res.status(400).json({ error: "Cannot promote submission" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "promote",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: result.submission.entityName,
        newData: { 
          promotedEntityId: result.promotedEntity.id,
          promotedEntityType: result.submission.entityType,
        },
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to promote submission" });
    }
  });

  app.post("/api/admin/grassroots/:id/link", requireAuth, async (req, res) => {
    try {
      const user = req.ctx!.user!;
      const { existingEntityId } = req.body;
      if (!existingEntityId) {
        return res.status(400).json({ error: "Existing entity ID required" });
      }
      
      const submission = await storage.linkSubmissionToExisting(req.params.id, existingEntityId, user.id);
      if (!submission) {
        return res.status(400).json({ error: "Cannot link submission" });
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "link_existing",
        entityType: "grassroots_submission",
        entityId: req.params.id,
        entityName: submission.entityName,
        newData: { linkedEntityId: existingEntityId },
      });
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to link submission" });
    }
  });

  return httpServer;
}
