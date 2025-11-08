import express from "express";
import { registerRoutes } from "./routes";

const app = express();
registerRoutes(app);

// Vercel looks for a default export
export default app;
