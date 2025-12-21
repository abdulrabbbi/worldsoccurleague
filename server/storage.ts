import { 
  type User, 
  type InsertUser,
  type UserPreferences,
  type InsertUserPreferences,
  users,
  userPreferences
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name,
    }).returning();
    return result[0];
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0];
  }

  async upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    if (existing) {
      const result = await db.update(userPreferences)
        .set({
          locationEnabled: prefs.locationEnabled ?? existing.locationEnabled,
          selectedContinent: prefs.selectedContinent ?? existing.selectedContinent,
          favoriteLeagues: prefs.favoriteLeagues ?? existing.favoriteLeagues,
          favoriteTeams: prefs.favoriteTeams ?? existing.favoriteTeams,
          notificationsEnabled: prefs.notificationsEnabled ?? existing.notificationsEnabled,
          scoreUpdatesEnabled: prefs.scoreUpdatesEnabled ?? existing.scoreUpdatesEnabled,
          communityPollsEnabled: prefs.communityPollsEnabled ?? existing.communityPollsEnabled,
          weeklyDigestEnabled: prefs.weeklyDigestEnabled ?? existing.weeklyDigestEnabled,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, prefs.userId))
        .returning();
      return result[0];
    }
    
    const result = await db.insert(userPreferences).values({
      userId: prefs.userId,
      locationEnabled: prefs.locationEnabled,
      selectedContinent: prefs.selectedContinent,
      favoriteLeagues: prefs.favoriteLeagues,
      favoriteTeams: prefs.favoriteTeams,
      notificationsEnabled: prefs.notificationsEnabled,
      scoreUpdatesEnabled: prefs.scoreUpdatesEnabled,
      communityPollsEnabled: prefs.communityPollsEnabled,
      weeklyDigestEnabled: prefs.weeklyDigestEnabled,
    }).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
