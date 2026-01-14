import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface Sport {
  id: string;
  code: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface AdminSportContextType {
  sports: Sport[];
  selectedSport: Sport | null;
  selectedSportSlug: string;
  setSelectedSportSlug: (slug: string) => void;
  isLoading: boolean;
}

const AdminSportContext = createContext<AdminSportContextType | null>(null);

const STORAGE_KEY = "wsl_admin_sport";
const DEFAULT_SPORT = "soccer";

export function AdminSportProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportSlug, setSelectedSportSlugState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_SPORT;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const data = await response.json();
          setSports(data);
        }
      } catch (error) {
        console.error("Failed to load sports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSports();
  }, []);

  useEffect(() => {
    const adminMatch = location.match(/^\/admin\/([a-z]+)\//);
    if (adminMatch) {
      const sportFromPath = adminMatch[1];
      const validSport = sports.find(s => s.slug === sportFromPath);
      if (validSport && sportFromPath !== selectedSportSlug) {
        setSelectedSportSlugState(sportFromPath);
        localStorage.setItem(STORAGE_KEY, sportFromPath);
      }
    }
  }, [location, sports, selectedSportSlug]);

  const setSelectedSportSlug = (slug: string) => {
    setSelectedSportSlugState(slug);
    localStorage.setItem(STORAGE_KEY, slug);
    
    const adminMatch = location.match(/^\/admin\/[a-z]+\/(.+)$/);
    if (adminMatch) {
      const pagePath = adminMatch[1];
      setLocation(`/admin/${slug}/${pagePath}`);
    } else if (location.startsWith("/admin/") && !location.match(/^\/admin\/[a-z]+\//)) {
      const currentPage = location.replace("/admin/", "");
      if (currentPage && currentPage !== "") {
        setLocation(`/admin/${slug}/${currentPage}`);
      }
    }
  };

  const selectedSport = sports.find(s => s.slug === selectedSportSlug) || null;

  return (
    <AdminSportContext.Provider
      value={{
        sports,
        selectedSport,
        selectedSportSlug,
        setSelectedSportSlug,
        isLoading,
      }}
    >
      {children}
    </AdminSportContext.Provider>
  );
}

export function useAdminSport() {
  const context = useContext(AdminSportContext);
  if (!context) {
    throw new Error("useAdminSport must be used within AdminSportProvider");
  }
  return context;
}
