import React, { createContext, useContext, useState } from "react";

export type SetupStep = "location" | "continent" | "leagues" | "national-team" | "notifications";

interface ProfileSetupState {
  locationEnabled: boolean;
  selectedContinents: string[];
  selectedLeagues: string[];
  selectedTeams: string[];
  notificationPreferences: {
    matchesNearMe: boolean;
    scoreUpdates: boolean;
    communityPolls: boolean;
    weeklyDigest: boolean;
  };
}

interface ProfileSetupContextType {
  state: ProfileSetupState;
  updateState: (updates: Partial<ProfileSetupState>) => void;
  resetState: () => void;
}

const defaultState: ProfileSetupState = {
  locationEnabled: false,
  selectedContinents: [],
  selectedLeagues: [],
  selectedTeams: [],
  notificationPreferences: {
    matchesNearMe: true,
    scoreUpdates: true,
    communityPolls: true,
    weeklyDigest: true,
  },
};

const ProfileSetupContext = createContext<ProfileSetupContextType | undefined>(undefined);

export function ProfileSetupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileSetupState>(defaultState);

  const updateState = (updates: Partial<ProfileSetupState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
  };

  return (
    <ProfileSetupContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </ProfileSetupContext.Provider>
  );
}

export function useProfileSetup() {
  const context = useContext(ProfileSetupContext);
  if (!context) {
    throw new Error("useProfileSetup must be used within ProfileSetupProvider");
  }
  return context;
}
