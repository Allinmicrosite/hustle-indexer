import { type Category, type Hustle, type Review, type InsertCategory, type InsertHustle, type InsertReview, type HustleWithCategory } from "@shared/schema";
import { db } from "./db";
import { categories, hustles, reviews, Category, Hustle, Review } from "@shared/schema";
import { eq, desc, asc, sql, ilike, and } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Hustles
  getHustles(limit?: number, offset?: number): Promise<HustleWithCategory[]>;
  getHustleById(id: string): Promise<HustleWithCategory | undefined>;
  getTopRatedHustles(limit?: number): Promise<HustleWithCategory[]>;
  getRecentHustles(limit?: number): Promise<HustleWithCategory[]>;
  searchHustles(query: string, limit?: number): Promise<HustleWithCategory[]>;
  getHustlesByCategory(categoryId: string, limit?: number): Promise<HustleWithCategory[]>;
  createHustle(hustle: InsertHustle): Promise<Hustle>;
  updateHustleScores(hustleId: string): Promise<void>;

  // Reviews
  getReviewsByHustle(hustleId: string, limit?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Statistics
  getStatistics(): Promise<{
    totalHustles: number;
    totalReviews: number;
    averageScore: number;
    newThisWeek: number;
  }>;
  getCategoryAverages(): Promise<Array<{
    category: Category;
    averageScore: number;
    hustleCount: number;
  }>>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async getHustles(limit: number = 50, offset: number = 0): Promise<HustleWithCategory[]> {
    const results = await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
        requirements: hustles.requirements,
        isActive: hustles.isActive,
        createdAt: hustles.createdAt,
        updatedAt: hustles.updatedAt,
        categoryId_ref: categories.id,
        categoryName: categories.name,
        categoryDescription: categories.description,
        categorySlug: categories.slug,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(eq(hustles.isActive, 1))
      .orderBy(desc(hustles.averageScore))
      .limit(limit)
      .offset(offset);

    return results.map(row => ({
      ...row,
      category: row.categoryId_ref ? {
        id: row.categoryId_ref,
        name: row.categoryName!,
        description: row.categoryDescription,
        slug: row.categorySlug!,
      } : null,
      categoryId_ref: undefined,
      categoryName: undefined,
      categoryDescription: undefined,
      categorySlug: undefined,
    })) as HustleWithCategory[];
  }

  async getHustleById(id: string): Promise<HustleWithCategory | undefined> {
    const result = await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
		requirements: hustles.requirements ?? [],
		isActive: hustles.isActive ?? 1,
		createdAt: hustles.createdAt ?? new Date(),
		updatedAt: hustles.updatedAt ?? new Date(),
		category: categories && categories.id ? {
		  id: categories.id,
		  name: categories.name,
		  description: categories.description,
		  slug: categories.slug,
		} as Category : null,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(and(eq(hustles.id, id), eq(hustles.isActive, 1)))
      .limit(1);
    return result[0];
  }

  async getTopRatedHustles(limit: number = 10): Promise<HustleWithReviews[]> {
    const topHustles = await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
        requirements: hustles.requirements,
        isActive: hustles.isActive,
        createdAt: hustles.createdAt,
        updatedAt: hustles.updatedAt,
        category: categories.id ? {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        } : null,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(and(eq(hustles.isActive, 1), sql`${hustles.reviewCount} > 0`))
      .orderBy(desc(hustles.averageScore), desc(hustles.reviewCount))
      .limit(limit);

    // Get recent reviews for each hustle
    const hustlesWithReviews = await Promise.all(
      topHustles.map(async (hustle) => {
        const recentReviews = await db
          .select({
            id: reviews.id,
            username: reviews.username,
            sourcePlatform: reviews.sourcePlatform,
            sourceDate: reviews.sourceDate,
            sourceVerified: reviews.sourceVerified,
            content: reviews.content,
            overallScore: reviews.overallScore,
            isAnonymous: reviews.isAnonymous,
            createdAt: reviews.createdAt,
          })
          .from(reviews)
          .where(eq(reviews.hustleId, hustle.id))
          .orderBy(desc(reviews.createdAt))
          .limit(2);

        return {
          ...hustle,
          recentReviews: recentReviews || [],
        };
      })
    );

    return hustlesWithReviews;
  }

  async getRecentHustles(limit: number = 10): Promise<HustleWithCategory[]> {
    return await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
        requirements: hustles.requirements,
        isActive: hustles.isActive,
        createdAt: hustles.createdAt,
        updatedAt: hustles.updatedAt,
        category: categories.id ? {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        } : null,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(eq(hustles.isActive, 1))
      .orderBy(desc(hustles.createdAt))
      .limit(limit);
  }

  async searchHustles(query: string, limit: number = 20): Promise<HustleWithCategory[]> {
    return await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
        requirements: hustles.requirements,
        isActive: hustles.isActive,
        createdAt: hustles.createdAt,
        updatedAt: hustles.updatedAt,
        category: categories.id ? {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        } : null,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(
        and(
          eq(hustles.isActive, 1),
          sql`(${ilike(hustles.name, `%${query}%`)} OR ${ilike(hustles.description, `%${query}%`)})`
        )
      )
      .orderBy(desc(hustles.averageScore))
      .limit(limit);
  }

  async getHustlesByCategory(categoryId: string, limit: number = 20): Promise<HustleWithCategory[]> {
    return await db
      .select({
        id: hustles.id,
        name: hustles.name,
        description: hustles.description,
        categoryId: hustles.categoryId,
        averageScore: hustles.averageScore,
        reviewCount: hustles.reviewCount,
        hourlyRateMin: hustles.hourlyRateMin,
        hourlyRateMax: hustles.hourlyRateMax,
        timeCommitment: hustles.timeCommitment,
        difficultyLevel: hustles.difficultyLevel,
        tags: hustles.tags,
        requirements: hustles.requirements,
        isActive: hustles.isActive,
        createdAt: hustles.createdAt,
        updatedAt: hustles.updatedAt,
        category: categories.id ? {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        } : null,
      })
      .from(hustles)
      .leftJoin(categories, eq(hustles.categoryId, categories.id))
      .where(and(eq(hustles.categoryId, categoryId), eq(hustles.isActive, 1)))
      .orderBy(desc(hustles.averageScore))
      .limit(limit);
  }

  async createHustle(hustle: InsertHustle): Promise<Hustle> {
    const result = await db.insert(hustles).values(hustle).returning();
    return result[0];
  }

  async updateHustleScores(hustleId: string): Promise<void> {
    try {
      const reviewStats = await db
        .select({
          averageScore: sql<string>`ROUND(AVG(CAST(${reviews.overallScore} AS DECIMAL)), 1)`,
          reviewCount: sql<number>`COUNT(*)`,
        })
        .from(reviews)
        .where(eq(reviews.hustleId, hustleId));

      if (reviewStats[0] && reviewStats[0].reviewCount > 0) {
        const avgScore = reviewStats[0].averageScore || "0.0";
        const count = reviewStats[0].reviewCount || 0;
        
        await db
          .update(hustles)
          .set({
            averageScore: avgScore,
            reviewCount: count,
            updatedAt: new Date(),
          })
          .where(eq(hustles.id, hustleId));
      }
    } catch (error) {
      console.error(`[updateHustleScores] Error updating scores for hustle ${hustleId}:`, error);
      throw error;
    }
  }

  async getReviewsByHustle(hustleId: string, limit: number = 20): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.hustleId, hustleId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    
    // Update hustle scores after adding review
    if (review.hustleId) {
      await this.updateHustleScores(review.hustleId);
    }
    
    return result[0];
  }

  async getStatistics(): Promise<{
    totalHustles: number;
    totalReviews: number;
    averageScore: number;
    newThisWeek: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [hustleStats] = await db
      .select({
        totalHustles: sql<number>`COUNT(*)`,
        averageScore: sql<number>`AVG(CASE WHEN ${hustles.reviewCount} > 0 THEN ${hustles.averageScore} END)`,
      })
      .from(hustles)
      .where(eq(hustles.isActive, 1));

    const [reviewStats] = await db
      .select({
        totalReviews: sql<number>`COUNT(*)`,
      })
      .from(reviews);

    const [newHustles] = await db
      .select({
        newThisWeek: sql<number>`COUNT(*)`,
      })
      .from(hustles)
      .where(
        and(
          eq(hustles.isActive, 1),
          sql`${hustles.createdAt} >= ${oneWeekAgo}`
        )
      );

    return {
      totalHustles: hustleStats?.totalHustles || 0,
      totalReviews: reviewStats?.totalReviews || 0,
      averageScore: hustleStats?.averageScore || 0,
      newThisWeek: newHustles?.newThisWeek || 0,
    };
  }

  async getCategoryAverages(): Promise<Array<{
    category: Category;
    averageScore: number;
    hustleCount: number;
  }>> {
    return await db
      .select({
        category: categories.id ? {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        } : null,
        averageScore: sql<number>`AVG(CASE WHEN ${hustles.reviewCount} > 0 THEN ${hustles.averageScore} END)`,
        hustleCount: sql<number>`COUNT(${hustles.id})`,
      })
      .from(categories)
      .leftJoin(hustles, and(eq(categories.id, hustles.categoryId), eq(hustles.isActive, 1)))
      .groupBy(categories.id, categories.name, categories.description, categories.slug)
      .orderBy(desc(sql`AVG(CASE WHEN ${hustles.reviewCount} > 0 THEN ${hustles.averageScore} END)`));
  }
}

export const storage = new DatabaseStorage();
