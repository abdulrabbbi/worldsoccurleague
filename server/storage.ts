import { 
  type User, 
  type InsertUser,
  type UserPreferences,
  type InsertUserPreferences 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private preferences: Map<string, UserPreferences>;

  constructor() {
    this.users = new Map();
    this.preferences = new Map();
    
    // Add test account for development
    const testUser: User = {
      id: "test-user-1",
      email: "test@test.com",
      password: "test123",
      name: "Test User",
      createdAt: new Date()
    };
    this.users.set(testUser.id, testUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.preferences.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    const updated: UserPreferences = {
      id: existing?.id || randomUUID(),
      userId: prefs.userId,
      locationEnabled: prefs.locationEnabled ?? null,
      selectedContinent: prefs.selectedContinent ?? null,
      favoriteLeagues: prefs.favoriteLeagues ?? null,
      favoriteTeams: prefs.favoriteTeams ?? null,
      notificationsEnabled: prefs.notificationsEnabled ?? null,
      scoreUpdatesEnabled: prefs.scoreUpdatesEnabled ?? null,
      communityPollsEnabled: prefs.communityPollsEnabled ?? null,
      weeklyDigestEnabled: prefs.weeklyDigestEnabled ?? null,
      updatedAt: new Date()
    };
    
    this.preferences.set(updated.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
