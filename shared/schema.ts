import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
});

export const hustles = pgTable("hustles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  averageScore: decimal("average_score", { precision: 3, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  hourlyRateMin: integer("hourly_rate_min"),
  hourlyRateMax: integer("hourly_rate_max"),
  timeCommitment: text("time_commitment"), // "flexible", "part-time", "full-time", "project-based"
  difficultyLevel: integer("difficulty_level"), // 1-5 scale
  tags: text("tags").array(),
  requirements: text("requirements").array(),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hustleId: varchar("hustle_id").references(() => hustles.id),
  username: text("username").notNull(), // kept for internal use, not displayed
  email: text("email"),
  sourcePlatform: text("source_platform").notNull(), // e.g., "Reddit", "Twitter", "Survey"
  sourceDate: text("source_date").notNull(), // e.g., "September 26, 2025"
  sourceVerified: integer("source_verified").default(0), // 1 if verified, 0 if not
  overallScore: decimal("overall_score", { precision: 2, scale: 1 }).notNull(),
  earningPotentialScore: decimal("earning_potential_score", { precision: 2, scale: 1 }),
  timeInvestmentScore: decimal("time_investment_score", { precision: 2, scale: 1 }),
  difficultyScore: decimal("difficulty_score", { precision: 2, scale: 1 }),
  legitimacyScore: decimal("legitimacy_score", { precision: 2, scale: 1 }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  pros: text("pros").array(),
  cons: text("cons").array(),
  monthlyEarnings: integer("monthly_earnings"),
  timeSpentHours: integer("time_spent_hours"),
  experienceMonths: integer("experience_months"),
  isVerified: integer("is_verified").default(0),
  isAnonymous: integer("is_anonymous").default(0),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertHustleSchema = createInsertSchema(hustles).omit({
  id: true,
  averageScore: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertHustle = z.infer<typeof insertHustleSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Category = typeof categories.$inferSelect;
export type Hustle = typeof hustles.$inferSelect;
export type Review = typeof reviews.$inferSelect;

// Extended types for API responses
export type HustleWithCategory = Hustle & { category?: Category | null };
export type HustleWithReviews = Hustle & { category?: Category | null; recentReviews?: Review[] };
