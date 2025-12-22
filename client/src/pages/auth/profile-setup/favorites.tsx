import { useLocation } from "wouter";
import { ArrowLeft, Heart, Plus, X } from "lucide-react";
import { useProfileSetup } from "@/lib/profile-setup-context";
import { getTeamById, Team } from "@/lib/data/us-soccer-teams";

function FavoriteCard({ 
  team, 
  onRemove,
  isPrimary = false
}: { 
  team: Team; 
  onRemove?: () => void;
  isPrimary?: boolean;
}) {
  return (
    <div className={`relative flex flex-col items-center p-4 rounded-2xl transition-all ${
      isPrimary 
        ? "bg-gradient-to-b from-[#C1153D] to-[#8a0f2c] ring-2 ring-[#C1153D]/50"
        : "bg-slate-800 border border-slate-700"
    }`}>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center"
          data-testid={`remove-${team.id}`}
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      {isPrimary && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#C1153D] rounded-full flex items-center justify-center">
          <Heart className="w-3 h-3 text-white fill-white" />
        </div>
      )}
      <div className="w-16 h-16 flex items-center justify-center text-4xl mb-2 rounded-xl bg-white/10">
        {team.icon || team.shortName.charAt(0)}
      </div>
      <span className="text-sm font-medium text-white text-center leading-tight">
        {team.shortName}
      </span>
    </div>
  );
}

function AddMoreCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-600 hover:border-slate-500 transition-colors h-full min-h-[120px]"
      data-testid="button-add-more"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 mb-2">
        <Plus className="w-6 h-6 text-slate-400" />
      </div>
      <span className="text-sm text-slate-400">Add more</span>
    </button>
  );
}

function EmptyState({ onAddTeams }: { onAddTeams: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 flex items-center justify-center text-5xl mb-4 rounded-full bg-slate-800">
        ⚽
      </div>
      <h2 className="text-white text-lg font-semibold mb-2">No teams selected yet</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-xs">
        Select your favorite teams to get personalized content and updates
      </p>
      <button
        onClick={onAddTeams}
        className="bg-[#C1153D] hover:bg-[#a01232] text-white px-6 py-3 rounded-full font-semibold transition-colors"
        data-testid="button-select-teams"
      >
        Select Teams
      </button>
    </div>
  );
}

export default function FavoritesSetup() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useProfileSetup();

  const selectedTeamIds = state.selectedTeams;
  const selectedTeams = selectedTeamIds
    .map(id => getTeamById(id))
    .filter((team): team is Team => team !== undefined);

  const handleBack = () => {
    setLocation("/auth/profile-setup/leagues");
  };

  const handleNext = () => {
    setLocation("/auth/profile-setup/notifications");
  };

  const handleAddMore = () => {
    setLocation("/auth/profile-setup/leagues");
  };

  const handleRemoveTeam = (teamId: string) => {
    const newSelectedTeams = selectedTeamIds.filter(id => id !== teamId);
    updateState({ selectedTeams: newSelectedTeams });
  };

  const primaryTeam = selectedTeams[0];
  const otherTeams = selectedTeams.slice(1);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button
          onClick={handleBack}
          className="text-slate-400 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white font-semibold text-lg">Your Favorites</h1>
        <button
          onClick={handleNext}
          className="text-[#4a9eff] font-semibold text-sm"
          data-testid="button-next"
        >
          {selectedTeams.length > 0 ? "Next" : "Skip"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedTeams.length === 0 ? (
          <EmptyState onAddTeams={handleAddMore} />
        ) : (
          <>
            {/* Primary Team Section */}
            {primaryTeam && (
              <div className="mb-6">
                <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#C1153D]" />
                  Primary Team
                </h2>
                <div className="flex justify-center">
                  <div className="w-40">
                    <FavoriteCard team={primaryTeam} isPrimary />
                  </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Your primary team's content will be prioritized
                </p>
              </div>
            )}

            {/* Other Favorites */}
            {otherTeams.length > 0 && (
              <div>
                <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  Other Favorites ({otherTeams.length})
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {otherTeams.map((team) => (
                    <FavoriteCard 
                      key={team.id} 
                      team={team} 
                      onRemove={() => handleRemoveTeam(team.id)}
                    />
                  ))}
                  <AddMoreCard onClick={handleAddMore} />
                </div>
              </div>
            )}

            {/* Only primary team selected */}
            {otherTeams.length === 0 && (
              <div className="mt-4">
                <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  Add More Teams
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <AddMoreCard onClick={handleAddMore} />
                </div>
              </div>
            )}

            {/* Reorder Hint */}
            <p className="text-center text-xs text-slate-500 mt-6">
              Tap and hold to reorder your favorites
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      {selectedTeams.length > 0 && (
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleNext}
            className="w-full bg-[#C1153D] hover:bg-[#a01232] text-white py-3 rounded-full font-semibold transition-colors"
            data-testid="button-continue"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
