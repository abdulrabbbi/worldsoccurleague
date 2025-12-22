import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { PLAN_TIERS, ROLE_PERMISSIONS, type PlanTier, type Role } from "@shared/plans";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  planTier: PlanTier;
  platformRole: string;
  primaryOrgId: string | null;
}

export interface RequestContext {
  user: AuthenticatedUser | null;
  orgId: string | null;
  permissions: {
    canAccessGrassroots: boolean;
    canManageOrg: boolean;
    canEditOrgData: boolean;
    isVerifiedPartner: boolean;
  };
}

declare global {
  namespace Express {
    interface Request {
      ctx?: RequestContext;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    req.ctx = {
      user: null,
      orgId: null,
      permissions: {
        canAccessGrassroots: false,
        canManageOrg: false,
        canEditOrgData: false,
        isVerifiedPartner: false,
      },
    };
    return next();
  }

  const user = await storage.getUser(userId);
  if (!user) {
    req.ctx = {
      user: null,
      orgId: null,
      permissions: {
        canAccessGrassroots: false,
        canManageOrg: false,
        canEditOrgData: false,
        isVerifiedPartner: false,
      },
    };
    return next();
  }

  const planFeatures = PLAN_TIERS[user.planTier as PlanTier]?.features;
  const canAccessGrassroots = planFeatures?.canAccessGrassroots ?? false;

  let isVerifiedPartner = false;
  let canManageOrg = false;
  let canEditOrgData = false;

  if (user.primaryOrgId) {
    const org = await storage.getOrganization(user.primaryOrgId);
    if (org && org.verificationStatus === "verified") {
      isVerifiedPartner = true;
    }

    const membership = await storage.getOrganizationMember(user.primaryOrgId, user.id);
    if (membership) {
      canManageOrg = ["owner", "admin"].includes(membership.role);
      canEditOrgData = ["owner", "admin", "editor"].includes(membership.role);
    }
  }

  req.ctx = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      planTier: user.planTier as PlanTier,
      platformRole: user.platformRole,
      primaryOrgId: user.primaryOrgId,
    },
    orgId: user.primaryOrgId,
    permissions: {
      canAccessGrassroots,
      canManageOrg,
      canEditOrgData,
      isVerifiedPartner,
    },
  };

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.ctx?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function requirePlan(...allowedPlans: PlanTier[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.ctx?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!allowedPlans.includes(req.ctx.user.planTier)) {
      return res.status(403).json({ 
        error: "Upgrade required",
        requiredPlan: allowedPlans[0],
        currentPlan: req.ctx.user.planTier,
      });
    }
    
    next();
  };
}

export function requireGrassrootsAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.ctx?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!req.ctx.permissions.canAccessGrassroots) {
    return res.status(403).json({ 
      error: "Partner subscription required for Grassroots API access",
      requiredPlan: "partner",
    });
  }
  
  next();
}

export function requireVerifiedPartner(req: Request, res: Response, next: NextFunction) {
  if (!req.ctx?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!req.ctx.permissions.isVerifiedPartner) {
    return res.status(403).json({ 
      error: "Verified partner status required",
      message: "Your organization must be verified to access this feature",
    });
  }
  
  next();
}

export function requireOrgAccess(requiredRole: "viewer" | "editor" | "admin" | "owner" = "viewer") {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.ctx?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const orgId = req.params.orgId || req.body.organizationId || req.ctx.orgId;
    if (!orgId) {
      return res.status(400).json({ error: "Organization ID required" });
    }

    if (req.ctx.user.platformRole === "platform_admin") {
      return next();
    }

    const membership = await storage.getOrganizationMember(orgId, req.ctx.user.id);
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this organization" });
    }

    const roleHierarchy = { owner: 4, admin: 3, editor: 2, viewer: 1 };
    const userRoleLevel = roleHierarchy[membership.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        required: requiredRole,
        current: membership.role,
      });
    }

    next();
  };
}

export function isPlatformAdmin(req: Request): boolean {
  return req.ctx?.user?.platformRole === "platform_admin";
}

export function canVerifyPartners(req: Request): boolean {
  const role = req.ctx?.user?.platformRole;
  return role === "platform_admin" || role === "platform_moderator";
}
