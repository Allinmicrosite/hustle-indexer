import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import http from "http";

const app = express();

// --- Health check route ---
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Hustle Indexer backend is alive!" });
});

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Register routes and Vite setup ---
registerRoutes(app);
setupVite(app);
serveStatic(app);

// --- Create and start the HTTP server ---
const port = parseInt(process.env.PORT || "5000", 10);
const server = http.createServer(app);

server.listen(
  {
    port,
    host: "0.0.0.0",
    reusePort: true,
  },
  () => {
    log(`serving on port ${port}`);
  }
);
