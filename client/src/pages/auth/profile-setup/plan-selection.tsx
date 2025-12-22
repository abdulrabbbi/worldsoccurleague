import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Crown, Sparkles, Building2 } from "lucide-react";
import { PLAN_TIERS, type PlanTier, type BillingCycle, formatPrice } from "@shared/plans";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";

interface PlanCardProps {
  planId: PlanTier;
  isSelected: boolean;
  billingCycle: BillingCycle;
  onSelect: () => void;
}

function PlanCard({ planId, isSelected, billingCycle, onSelect }: PlanCardProps) {
  const plan = PLAN_TIERS[planId];
  const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  
  const icons = {
    free: <Sparkles className="w-6 h-6" />,
    pro: <Crown className="w-6 h-6" />,
    partner: <Building2 className="w-6 h-6" />,
  };

  const highlights = {
    free: ["Follow teams & leagues", "Live scores & updates", "Community access"],
    pro: ["Everything in Free", "Ad-free experience", "Exclusive content", "Priority support"],
    partner: ["Everything in Pro", "Grassroots API access", "Create organizations", "Manage teams & events"],
  };

  return (
    <button
      onClick={onSelect}
      className={`relative w-full p-4 rounded-xl transition-all text-left ${
        isSelected
          ? "bg-gradient-to-b from-[#1a2d5c] to-[#0f1d3d] ring-2 ring-[#4a9eff] shadow-[0_0_20px_rgba(74,158,255,0.4)]"
          : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
      }`}
      data-testid={`plan-${planId}`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4a9eff] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
      
      {plan.badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded ${
          planId === "partner" ? "bg-[#C1153D] text-white" : "bg-[#4a9eff] text-white"
        }`}>
          {plan.badge}
        </span>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected ? "bg-[#4a9eff] text-white" : "bg-slate-700 text-slate-300"
        }`}>
          {icons[planId]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-bold text-white">{plan.name}</h3>
            <span className="text-lg font-bold text-white">
              {formatPrice(price, billingCycle)}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{plan.description}</p>
          
          <ul className="space-y-1.5">
            {highlights[planId].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-[#4a9eff]" : "text-slate-500"}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

export default function PlanSelectionSetup() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("free");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (selectedPlan !== "free" && user) {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/user/upgrade", {
          planTier: selectedPlan,
          billingCycle,
        });
        const data = await response.json();
        if (data.user) {
          const updatedUser = { ...data.user, planTier: selectedPlan };
          setUser(updatedUser);
          localStorage.setItem("wsl_user", JSON.stringify(updatedUser));
          if (data.subscription) {
            localStorage.setItem("wsl_subscription", JSON.stringify(data.subscription));
          }
        }
      } catch (error) {
        console.error("Failed to upgrade plan:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setLocation("/auth/profile-setup/continent");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <button
          onClick={() => setLocation("/auth/profile-setup/intro")}
          className="text-slate-400 hover:text-white transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-white font-display">Choose Your Plan</h1>
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="text-[#4a9eff] font-semibold text-sm hover:text-[#6ab0ff] transition-colors"
          data-testid="button-next"
        >
          {selectedPlan === "free" ? "Skip" : "Next"}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-800 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#1a2d5c] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="billing-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[#1a2d5c] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="billing-yearly"
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <PlanCard
            planId="free"
            isSelected={selectedPlan === "free"}
            billingCycle={billingCycle}
            onSelect={() => setSelectedPlan("free")}
          />
          <PlanCard
            planId="pro"
            isSelected={selectedPlan === "pro"}
            billingCycle={billingCycle}
            onSelect={() => setSelectedPlan("pro")}
          />
          <PlanCard
            planId="partner"
            isSelected={selectedPlan === "partner"}
            billingCycle={billingCycle}
            onSelect={() => setSelectedPlan("partner")}
          />
        </div>

        {selectedPlan === "partner" && (
          <div className="mt-4 p-4 bg-[#1a2d5c]/30 rounded-xl border border-[#1a2d5c]/50">
            <h4 className="font-semibold text-[#4a9eff] mb-2">Partner Benefits</h4>
            <p className="text-sm text-slate-300">
              As a Partner, you'll get access to the Grassroots API to manage your clubs, leagues, 
              tournaments, and more. Your organization will need to be verified before publishing data.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-[#C1153D] hover:bg-[#a01232] disabled:opacity-50 text-white py-3 rounded-full font-semibold transition-colors"
          data-testid="button-continue"
        >
          {isLoading ? "Processing..." : selectedPlan === "free" ? "Continue with Free" : `Continue with ${PLAN_TIERS[selectedPlan].name}`}
        </button>
        <p className="text-center text-xs text-slate-500 mt-3">
          {selectedPlan !== "free" 
            ? "You can change your plan anytime. Cancel anytime."
            : "You can upgrade anytime from settings."}
        </p>
      </div>
    </div>
  );
}
