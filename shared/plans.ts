export type PlanTier = "free" | "pro" | "partner";
export type BillingCycle = "monthly" | "yearly";
export type VerificationStatus = "draft" | "review" | "verified" | "rejected";
export type OrganizationType = "club" | "league" | "tournament" | "fan_club" | "pickup_group";
export type OrgMemberRole = "owner" | "admin" | "editor" | "viewer";

export interface PlanFeatures {
  canAccessGrassroots: boolean;
  canCreateOrganization: boolean;
  canManageTeams: boolean;
  canManageCompetitions: boolean;
  canAccessAnalytics: boolean;
  maxOrganizations: number;
  maxTeamsPerOrg: number;
  requiresVerification: boolean;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: PlanFeatures;
  badge?: string;
}

export const PLAN_TIERS: Record<PlanTier, PlanConfig> = {
  free: {
    id: "free",
    name: "Fan Access",
    description: "Follow your favorite teams and leagues",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: "price_free_monthly_stub",
    stripePriceIdYearly: "price_free_yearly_stub",
    features: {
      canAccessGrassroots: false,
      canCreateOrganization: false,
      canManageTeams: false,
      canManageCompetitions: false,
      canAccessAnalytics: false,
      maxOrganizations: 0,
      maxTeamsPerOrg: 0,
      requiresVerification: false,
    },
  },
  pro: {
    id: "pro",
    name: "Player & Fan+",
    description: "Enhanced features for dedicated fans and players",
    priceMonthly: 2.99,
    priceYearly: 29.99,
    stripePriceIdMonthly: "price_pro_monthly_stub",
    stripePriceIdYearly: "price_pro_yearly_stub",
    badge: "PRO",
    features: {
      canAccessGrassroots: false,
      canCreateOrganization: false,
      canManageTeams: false,
      canManageCompetitions: false,
      canAccessAnalytics: false,
      maxOrganizations: 0,
      maxTeamsPerOrg: 0,
      requiresVerification: false,
    },
  },
  partner: {
    id: "partner",
    name: "Organizer & Data Partner",
    description: "Full Grassroots API access for organizers",
    priceMonthly: 9.99,
    priceYearly: 99,
    stripePriceIdMonthly: "price_partner_monthly_stub",
    stripePriceIdYearly: "price_partner_yearly_stub",
    badge: "PARTNER",
    features: {
      canAccessGrassroots: true,
      canCreateOrganization: true,
      canManageTeams: true,
      canManageCompetitions: true,
      canAccessAnalytics: true,
      maxOrganizations: 5,
      maxTeamsPerOrg: 50,
      requiresVerification: true,
    },
  },
};

export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  PLATFORM_MODERATOR: "platform_moderator",
  PARTNER_ADMIN: "partner_admin",
  ORG_OWNER: "org_owner",
  ORG_ADMIN: "org_admin",
  ORG_EDITOR: "org_editor",
  ORG_VIEWER: "org_viewer",
  USER: "user",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface RolePermissions {
  canManagePlatform: boolean;
  canVerifyPartners: boolean;
  canManageAnyOrg: boolean;
  canManageOwnOrg: boolean;
  canEditOrgData: boolean;
  canViewOrgData: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  [ROLES.PLATFORM_ADMIN]: {
    canManagePlatform: true,
    canVerifyPartners: true,
    canManageAnyOrg: true,
    canManageOwnOrg: true,
    canEditOrgData: true,
    canViewOrgData: true,
  },
  [ROLES.PLATFORM_MODERATOR]: {
    canManagePlatform: false,
    canVerifyPartners: true,
    canManageAnyOrg: false,
    canManageOwnOrg: false,
    canEditOrgData: false,
    canViewOrgData: true,
  },
  [ROLES.PARTNER_ADMIN]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: true,
    canEditOrgData: true,
    canViewOrgData: true,
  },
  [ROLES.ORG_OWNER]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: true,
    canEditOrgData: true,
    canViewOrgData: true,
  },
  [ROLES.ORG_ADMIN]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: true,
    canEditOrgData: true,
    canViewOrgData: true,
  },
  [ROLES.ORG_EDITOR]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: false,
    canEditOrgData: true,
    canViewOrgData: true,
  },
  [ROLES.ORG_VIEWER]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: false,
    canEditOrgData: false,
    canViewOrgData: true,
  },
  [ROLES.USER]: {
    canManagePlatform: false,
    canVerifyPartners: false,
    canManageAnyOrg: false,
    canManageOwnOrg: false,
    canEditOrgData: false,
    canViewOrgData: false,
  },
};

export function getPlanFeatures(tier: PlanTier): PlanFeatures {
  return PLAN_TIERS[tier].features;
}

export function hasFeature(tier: PlanTier, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(tier);
  const value = features[feature];
  return typeof value === "boolean" ? value : value > 0;
}

export function canAccessGrassrootsAPI(tier: PlanTier): boolean {
  return PLAN_TIERS[tier].features.canAccessGrassroots;
}

export function formatPrice(amount: number, cycle: BillingCycle): string {
  if (amount === 0) return "Free";
  return `$${amount.toFixed(2)}/${cycle === "monthly" ? "mo" : "yr"}`;
}
