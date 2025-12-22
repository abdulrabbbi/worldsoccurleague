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
    free: <Sparkles className="w-8 h-8" />,
    pro: <Crown className="w-8 h-8" />,
    partner: <Building2 className="w-8 h-8" />,
  };

  const highlights = {
    free: ["Follow teams & leagues", "Live scores & updates", "Community access"],
    pro: ["Everything in Free", "Ad-free experience", "Exclusive content", "Priority support"],
    partner: ["Everything in Pro", "Grassroots API access", "Create organizations", "Manage teams & events", "Analytics dashboard"],
  };

  return (
    <button
      onClick={onSelect}
      className={`relative w-full p-4 rounded-2xl border-2 transition-all text-left ${
        isSelected
          ? "border-[#C1153D] bg-[#C1153D]/5"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
      data-testid={`plan-${planId}`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C1153D] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
      
      {plan.badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded ${
          planId === "partner" ? "bg-[#1a2d5c] text-white" : "bg-[#C1153D] text-white"
        }`}>
          {plan.badge}
        </span>
      )}
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        isSelected ? "bg-[#C1153D] text-white" : "bg-slate-100 text-slate-600"
      }`}>
        {icons[planId]}
      </div>
      
      <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
      <p className="text-sm text-slate-500 mb-3">{plan.description}</p>
      
      <div className="mb-3">
        <span className="text-2xl font-bold text-slate-900">
          {formatPrice(price, billingCycle)}
        </span>
        {planId !== "free" && (
          <span className="text-sm text-slate-500 ml-1">
            {billingCycle === "yearly" && "(save " + Math.round((1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100) + "%)"}
          </span>
        )}
      </div>
      
      <ul className="space-y-2">
        {highlights[planId].map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <Check className={`w-4 h-4 ${isSelected ? "text-[#C1153D]" : "text-slate-400"}`} />
            {feature}
          </li>
        ))}
      </ul>
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={() => setLocation("/auth/profile-setup/intro")}
          className="text-slate-600 hover:text-slate-800"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-slate-900">Choose Your Plan</h1>
        <button
          onClick={handleNext}
          className="text-[#C1153D] font-semibold text-sm"
          data-testid="button-next"
        >
          {selectedPlan === "free" ? "Skip" : "Next"}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600"
              }`}
              data-testid="billing-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600"
              }`}
              data-testid="billing-yearly"
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="space-y-4">
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
          <div className="mt-4 p-4 bg-[#1a2d5c]/5 rounded-xl border border-[#1a2d5c]/20">
            <h4 className="font-semibold text-[#1a2d5c] mb-2">Partner Benefits</h4>
            <p className="text-sm text-slate-600">
              As a Partner, you'll get access to the Grassroots API to manage your clubs, leagues, 
              tournaments, and more. Your organization will need to be verified before publishing data.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleNext}
          className="w-full bg-[#C1153D] hover:bg-[#a01232] text-white py-3 rounded-full font-semibold transition-colors"
          data-testid="button-continue"
        >
          {selectedPlan === "free" ? "Continue with Free" : `Continue with ${PLAN_TIERS[selectedPlan].name}`}
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
