import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHustleSchema, insertReviewSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Hustles
  app.get("/api/hustles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.categoryId as string;
      const search = req.query.search as string;

      let hustles;
      if (search) {
        hustles = await storage.searchHustles(search, limit);
      } else if (categoryId) {
        hustles = await storage.getHustlesByCategory(categoryId, limit);
      } else {
        hustles = await storage.getHustles(limit, offset);
      }

      res.json(hustles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hustles" });
    }
  });

  app.get("/api/hustles/top-rated", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const hustles = await storage.getTopRatedHustles(limit);
      res.json(hustles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top-rated hustles" });
    }
  });

  app.get("/api/hustles/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const hustles = await storage.getRecentHustles(limit);
      res.json(hustles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent hustles" });
    }
  });

  app.get("/api/hustles/:id", async (req, res) => {
    try {
      const hustle = await storage.getHustleById(req.params.id);
      if (!hustle) {
        return res.status(404).json({ message: "Hustle not found" });
      }
      res.json(hustle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hustle" });
    }
  });

  app.post("/api/hustles", async (req, res) => {
    try {
      const hustleData = insertHustleSchema.parse(req.body);
      const hustle = await storage.createHustle(hustleData);
      res.status(201).json(hustle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid hustle data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create hustle" });
      }
    }
  });

  // Reviews
  app.get("/api/hustles/:id/reviews", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const reviews = await storage.getReviewsByHustle(req.params.id, limit);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  // Statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/categories/averages", async (req, res) => {
    try {
      const averages = await storage.getCategoryAverages();
      res.json(averages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category averages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
