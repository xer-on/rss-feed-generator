import { IRouter, Request, Response, Router } from "express";
import { RssController } from "../controllers/rss.controllers";

const router: IRouter = Router();

// Simple root route
router.get("/", (req: Request, res: Response) => {
  res.send(`Available RSS feeds:
    /btb/entertainment
    /btb/sport
    /btb/national`);
});

// Generic feed route
// router.get("/:website/:category", RssController.getFeed);

// Specific routes
router.get("/btb/entertainment", RssController.getEntertainmentFeed);

export default router;
