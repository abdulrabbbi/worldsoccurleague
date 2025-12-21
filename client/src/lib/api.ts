import type { InsertUser, User, InsertUserPreferences, UserPreferences } from "@shared/schema";

const API_BASE = "/api";

export const api = {
  auth: {
    async signup(data: InsertUser): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Signup failed");
      }
      return res.json();
    },

    async login(email: string, password: string): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      return res.json();
    },
  },

  preferences: {
    async get(userId: string): Promise<{ preferences: UserPreferences | null }> {
      const res = await fetch(`${API_BASE}/preferences/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch preferences");
      return res.json();
    },

    async save(data: InsertUserPreferences): Promise<{ preferences: UserPreferences }> {
      const res = await fetch(`${API_BASE}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save preferences");
      return res.json();
    },
  },
};
