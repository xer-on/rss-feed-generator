import express, { NextFunction, Request, Response } from "express";
import rssRoutes from "./routes/rss.routes";

const app: express.Application = express();

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).send("Something broke!");
});

// Routes
app.use("/", rssRoutes);

export default app;
