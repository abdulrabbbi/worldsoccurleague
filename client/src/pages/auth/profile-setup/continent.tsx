import { useLocation } from "wouter";
import { api } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

export default function ContinentSetup() {
  const [, setLocation] = useLocation();
  const continents = api.getContinents();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setLocation("/auth/login")}
            className="text-muted-foreground hover:text-foreground text-sm"
            data-testid="button-back"
          >
            ← Choose Continent
          </button>
          <button
            onClick={() => setLocation("/auth/profile-setup/leagues")}
            className="bg-sidebar hover:bg-sidebar/90 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
            data-testid="button-next"
          >
            Next
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-search"
          />
        </div>

        {/* Continents Grid */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {continents.map((continent) => (
            <button
              key={continent.id}
              onClick={() => setLocation("/auth/profile-setup/leagues")}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left border border-transparent hover:border-primary/30"
              data-testid={`continent-${continent.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">🌍</span>
              </div>
              <span className="font-medium text-foreground flex-1">{continent.name}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
