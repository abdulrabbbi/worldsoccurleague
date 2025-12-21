import { useLocation } from "wouter";
import { api } from "@/lib/mock-data";
import { ArrowLeft, Globe } from "lucide-react";

export default function ContinentSetup() {
  const [, setLocation] = useLocation();
  // Using hardcoded continents from the mock data hook or provider
  const continents = api.getContinents(); 

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setLocation("/auth/profile-setup/location")}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 font-medium text-sm"
          data-testid="button-back"
        >
          <ArrowLeft size={20} />
          Choose Continent
        </button>
        <button
          onClick={() => setLocation("/auth/profile-setup/leagues")}
          className="bg-[#1a2d5c] hover:bg-[#152347] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm"
          data-testid="button-next"
        >
          Next
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2d5c] focus:border-transparent text-sm"
          data-testid="input-search"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">World Soccer Leagues</h3>
        <div className="space-y-3">
          {continents.map((continent) => (
            <button
              key={continent.id}
              onClick={() => setLocation("/auth/profile-setup/leagues")} // For now, all go to leagues
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-[#1a2d5c] hover:bg-slate-50 transition-all text-left bg-white shadow-sm"
              data-testid={`continent-${continent.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xl">
                <Globe className="text-slate-400 w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 flex-1">{continent.name} Soccer Leagues</span>
              <div className={`w-5 h-5 rounded-full border-2 border-slate-300`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
