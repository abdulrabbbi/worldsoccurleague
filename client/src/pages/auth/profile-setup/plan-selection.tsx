import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { PLAN_TIERS, type PlanTier, type BillingCycle, formatPrice } from "@shared/plans";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

interface PlanCardProps {
  planId: PlanTier;
  isSelected: boolean;
  billingCycle: BillingCycle;
  onSelect: () => void;
}

function PlanCard({ planId, isSelected, billingCycle, onSelect }: PlanCardProps) {
  const plan = PLAN_TIERS[planId];
  const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  const highlights = {
    free: ["Follow teams & leagues", "Live scores & updates", "Community access"],
    pro: ["Everything in Free", "Ad-free experience", "Exclusive content", "Priority support"],
    partner: ["Everything in Pro", "Grassroots API access", "Create organizations", "Manage teams & events"],
  };

  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-2xl transition-all text-left overflow-hidden ${
        isSelected
          ? "ring-2 ring-[#C1153D] shadow-lg"
          : "ring-1 ring-slate-200 hover:ring-[#1a2d5c]"
      }`}
      data-testid={`plan-${planId}`}
    >
      <div className="bg-gradient-to-r from-[#1a2d5c] to-[#2a4a8c] p-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg font-display">{plan.name}</span>
        <img src={logoUrl} alt="WSL" className="h-8 w-auto" />
      </div>
      
      <div className="bg-white p-4">
        {isSelected && (
          <div className="absolute top-12 right-3 w-6 h-6 bg-[#C1153D] rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}
        
        {plan.badge && (
          <span className="inline-block text-xs font-bold px-2 py-0.5 rounded bg-[#C1153D] text-white mb-2">
            {plan.badge}
          </span>
        )}
        
        <p className="text-sm text-slate-600 mb-3">{plan.description}</p>
        
        <div className="mb-3">
          <span className="text-2xl font-bold text-[#1a2d5c]">
            {formatPrice(price, billingCycle)}
          </span>
          {planId !== "free" && billingCycle === "yearly" && (
            <span className="text-sm text-green-600 ml-2 font-medium">
              Save {Math.round((1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%
            </span>
          )}
        </div>
        
        <ul className="space-y-2">
          {highlights[planId].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-[#1a2d5c] flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <button
          onClick={() => setLocation("/auth/profile-setup/intro")}
          className="text-[#1a2d5c] hover:text-[#C1153D] transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-[#1a2d5c] font-display text-lg">Choose Your Plan</h1>
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="text-[#C1153D] font-semibold text-sm hover:text-[#a01232] transition-colors"
          data-testid="button-next"
        >
          {selectedPlan === "free" ? "Skip" : "Next"}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm ring-1 ring-slate-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#1a2d5c] text-white"
                  : "text-slate-600 hover:text-[#1a2d5c]"
              }`}
              data-testid="billing-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[#1a2d5c] text-white"
                  : "text-slate-600 hover:text-[#1a2d5c]"
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

      <div className="p-4 border-t border-slate-200 bg-white">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-[#C1153D] hover:bg-[#a01232] disabled:opacity-50 text-white py-3.5 rounded-full font-bold transition-colors shadow-sm"
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
