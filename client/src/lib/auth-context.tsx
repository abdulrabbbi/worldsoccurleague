import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";
import { PLAN_TIERS, type PlanTier, type PlanFeatures, type PlanConfig } from "@shared/plans";

interface AuthenticatedUser extends Omit<User, "password"> {
  planTier: PlanTier;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
  isAuthenticated: boolean;
  plan: PlanConfig | null;
  features: PlanFeatures | null;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  canAccessGrassroots: boolean;
  isPartner: boolean;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const stored = localStorage.getItem("wsl_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("wsl_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("wsl_user");
    }
  }, [user]);

  const plan = user ? PLAN_TIERS[user.planTier as PlanTier] || PLAN_TIERS.free : null;
  const features = plan?.features || null;

  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    if (!features) return false;
    const value = features[feature];
    return typeof value === "boolean" ? value : value > 0;
  };

  const canAccessGrassroots = features?.canAccessGrassroots ?? false;
  const isPartner = user?.planTier === "partner";
  const isPro = user?.planTier === "pro" || user?.planTier === "partner";

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user,
      plan,
      features,
      hasFeature,
      canAccessGrassroots,
      isPartner,
      isPro,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function RequireFeature({ 
  feature, 
  children, 
  fallback 
}: { 
  feature: keyof PlanFeatures; 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  const { hasFeature } = useAuth();
  
  if (!hasFeature(feature)) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}

export function RequirePlan({ 
  plans, 
  children, 
  fallback 
}: { 
  plans: PlanTier[]; 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  const { user } = useAuth();
  
  if (!user || !plans.includes(user.planTier as PlanTier)) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}
